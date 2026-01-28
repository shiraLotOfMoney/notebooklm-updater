let shouldStop = false;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendProgress(message) {
  chrome.runtime.sendMessage({ type: 'progress', message: message });
}

async function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve) => {
    // 既に存在する場合は即座に返す
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    // MutationObserverで要素の出現を監視
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // タイムアウト処理
    setTimeout(() => {
      observer.disconnect();
      resolve(null); // タイムアウト時はnullを返す
    }, timeout);
  });
}

function getSourceIdentifier(sourceElement) {
  // ソースの一意な識別子を取得
  // aria-description または source-title を使用
  const moreButton = sourceElement.querySelector('button[aria-description]');
  if (moreButton) {
    const ariaDesc = moreButton.getAttribute('aria-description');
    if (ariaDesc) return ariaDesc;
  }

  const titleElement = sourceElement.querySelector('.source-title');
  if (titleElement) {
    return titleElement.textContent.trim();
  }

  return null;
}

async function findAllSources() {
  // NotebookLMのソース一覧を探す
  const possibleSelectors = [
    '.single-source-container',
    '.source-item',
    '[class*="source-container"]'
  ];

  let sources = [];

  for (const selector of possibleSelectors) {
    sources = Array.from(document.querySelectorAll(selector));

    if (sources.length > 0) {
      console.log(`Found ${sources.length} sources with selector: ${selector}`);
      break;
    }
  }

  return sources;
}

async function openSource(sourceElement) {
  // ソースをクリックして開く
  // チェックボックス以外の部分をクリックする（タイトル部分が最適）
  const titleElement = sourceElement.querySelector('.source-title');
  if (titleElement) {
    titleElement.click();
  } else {
    sourceElement.click();
  }

  // 固定待機を削除し、ソース詳細画面の出現を監視
  // 閉じるボタンが表示されたらソースが開いたと判断
  await waitForElement('button[mattooltip="ソース表示を閉じる"]', 3000);
}

async function findAndClickUpdateButton() {
  // 短時間（500ms）だけ待って、更新ボタンを探す
  // 更新が必要なソースは早期に見つかり、不要なソースは素早くスキップできる
  await wait(500);

  let updateButton = null;

  // 方法1: 「クリックして Google ドライブと同期」のテキストを含む要素を探す
  const allElements = document.querySelectorAll('button, [role="button"], div[tabindex], span');
  for (const element of allElements) {
    const text = element.textContent || element.innerText || '';
    if (text.includes('クリックして Google ドライブと同期') ||
        text.includes('Google ドライブと同期') ||
        text.includes('同期')) {
      // クリック可能な親要素を探す
      let clickableElement = element;
      if (element.tagName === 'SPAN') {
        // spanの場合は親のbuttonを探す
        clickableElement = element.closest('button, [role="button"], div[tabindex]') || element;
      }
      updateButton = clickableElement;
      console.log('Found update button by text "Google ドライブと同期":', text.trim());
      break;
    }
  }

  // 方法2: aria-labelで探す
  if (!updateButton) {
    const possibleSelectors = [
      'button[aria-label*="同期"]',
      'button[aria-label*="更新"]',
      'button[aria-label*="Sync"]',
      'button[aria-label*="Update"]',
      '[aria-label*="Google ドライブ"]'
    ];

    for (const selector of possibleSelectors) {
      updateButton = document.querySelector(selector);
      if (updateButton) {
        console.log(`Found update button with selector: ${selector}`);
        break;
      }
    }
  }

  // 方法3: より広範なテキスト検索
  if (!updateButton) {
    const allButtons = document.querySelectorAll('button, [role="button"]');
    for (const button of allButtons) {
      const text = button.textContent || button.innerText || '';
      const ariaLabel = button.getAttribute('aria-label') || '';
      if (text.includes('更新') || text.includes('同期') || text.includes('Update') ||
          text.includes('Sync') || text.includes('Refresh') ||
          ariaLabel.includes('更新') || ariaLabel.includes('同期') ||
          ariaLabel.includes('Update') || ariaLabel.includes('Sync')) {
        updateButton = button;
        console.log('Found update button by general text:', text || ariaLabel);
        break;
      }
    }
  }

  if (updateButton) {
    console.log('Clicking update button...');
    updateButton.click();
    await wait(800); // クリック後の処理完了を待つ（若干短縮）
    return true;
  }

  // 更新ボタンが見つからない場合は即座にスキップ
  console.log('Update button not found - source may be up to date, skipping...');
  return false;
}

async function closeSource() {
  // ソースを閉じる（戻るボタン、閉じるボタン、ESCキーなど）

  let closeButton = null;

  // 方法1: mattooltip="ソース表示を閉じる" のボタンを探す（最も正確）
  closeButton = document.querySelector('button[mattooltip="ソース表示を閉じる"]');
  if (closeButton && closeButton.offsetParent !== null) {
    console.log('Found close button by mattooltip');
  } else {
    closeButton = null;
  }

  // 方法2: collapse_content アイコンを含むボタンを探す
  if (!closeButton) {
    const collapseIcons = document.querySelectorAll('mat-icon');
    for (const icon of collapseIcons) {
      if (icon.textContent.trim() === 'collapse_content') {
        const button = icon.closest('button');
        if (button && button.offsetParent !== null) {
          closeButton = button;
          console.log('Found close button by collapse_content icon');
          break;
        }
      }
    }
  }

  // 方法3: mattooltipに「閉じる」を含むボタン
  if (!closeButton) {
    const possibleSelectors = [
      'button[mattooltip*="閉じる"]',
      'button[mattooltip*="Close"]',
      'button[aria-label*="閉じる"]',
      'button[aria-label*="戻る"]',
      'button[aria-label*="Back"]',
      'button[aria-label*="Close"]'
    ];

    for (const selector of possibleSelectors) {
      const buttons = document.querySelectorAll(selector);
      for (const button of buttons) {
        if (button.offsetParent !== null) {
          closeButton = button;
          console.log(`Found close button with selector: ${selector}`);
          break;
        }
      }
      if (closeButton) break;
    }
  }

  // 方法4: mat-icon-buttonで左上のボタンを探す
  if (!closeButton) {
    const iconButtons = document.querySelectorAll('button[mat-icon-button]');
    for (const button of iconButtons) {
      if (button.offsetParent !== null) {
        const rect = button.getBoundingClientRect();
        // 画面の左上にあるボタンを探す
        if (rect.left < 200 && rect.top < 200) {
          closeButton = button;
          console.log('Found close button by position (top-left icon button)');
          break;
        }
      }
    }
  }

  // ボタンが見つかった場合
  if (closeButton) {
    console.log('Clicking close button...');
    closeButton.click();

    // 固定待機を削除し、ソース一覧の再表示を監視
    // ソースコンテナが表示されたら閉じる処理が完了したと判断
    await waitForElement('.single-source-container', 2000);
    return true;
  }

  // ボタンが見つからない場合は複数の方法を試す
  console.log('Close button not found, trying alternative methods...');

  // 方法5: ESCキーを送信
  document.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Escape',
    keyCode: 27,
    which: 27,
    bubbles: true,
    cancelable: true
  }));
  await wait(500);

  // 方法6: 背景をクリック（モーダルの場合）
  const backdrop = document.querySelector('.cdk-overlay-backdrop, .backdrop, [class*="backdrop"]');
  if (backdrop) {
    backdrop.click();
    await wait(500);
  }

  return false;
}

function filterSourcesByKeywords(sources, keywords) {
  return sources.filter(source => {
    const sourceId = getSourceIdentifier(source);
    if (!sourceId) return false;

    // 大文字小文字を区別しない
    const sourceName = sourceId.toLowerCase();

    // いずれかのキーワードにマッチすればOK（OR条件）
    return keywords.some(keyword => {
      const keywordLower = keyword.toLowerCase();
      return sourceName.includes(keywordLower);
    });
  });
}

async function searchSources(filterKeywords) {
  try {
    // 全ソースを取得
    let allSources = await findAllSources();

    if (allSources.length === 0) {
      return {
        success: false,
        message: 'ソースが見つかりませんでした。'
      };
    }

    // フィルタ適用（filterKeywordsが空の場合は全ソース）
    let targetSources;
    if (filterKeywords.length === 0) {
      targetSources = allSources;
    } else {
      targetSources = filterSourcesByKeywords(allSources, filterKeywords);
    }

    if (targetSources.length === 0) {
      return {
        success: false,
        message: `フィルタに一致するソースが見つかりませんでした（検索: ${filterKeywords.join(', ')}）`
      };
    }

    // ソース名リストを取得
    const sourceNames = targetSources.map(source => getSourceIdentifier(source));

    return {
      success: true,
      count: targetSources.length,
      total: allSources.length,
      sources: sourceNames
    };

  } catch (error) {
    return {
      success: false,
      message: `エラー: ${error.message}`
    };
  }
}

async function autoUpdateAllSources(options = {}) {
  shouldStop = false;

  const { mode = 'all', filterKeywords = [] } = options;
  const isPartialMode = mode === 'partial';

  // パフォーマンス計測開始
  const startTime = Date.now();

  try {
    sendProgress('ソースを検索中...');
    let allSources = await findAllSources();

    if (allSources.length === 0) {
      return {
        success: false,
        message: 'ソースが見つかりませんでした。NotebookLMのページ構造を確認してください。'
      };
    }

    // フィルタ適用
    let targetSources = allSources;
    if (isPartialMode && filterKeywords.length > 0) {
      targetSources = filterSourcesByKeywords(allSources, filterKeywords);

      if (targetSources.length === 0) {
        return {
          success: false,
          message: `フィルタに一致するソースが見つかりませんでした（検索: ${filterKeywords.join(', ')}）`
        };
      }

      console.log(`Filtered ${targetSources.length}/${allSources.length} sources`);
    }

    const totalSources = targetSources.length;
    console.log(`Found ${totalSources} sources to process`);

    let updatedCount = 0;
    let skippedCount = 0;

    // targetSources配列を直接使用してforループで処理
    for (let i = 0; i < targetSources.length; i++) {
      if (shouldStop) {
        return {
          success: true,
          message: `処理を停止しました（${updatedCount}/${totalSources}件更新済み）`
        };
      }

      sendProgress(`ソース ${i + 1}/${totalSources} を処理中...`);

      // ソースごとの処理時間を計測
      const sourceStartTime = Date.now();

      try {
        // 配列から直接ソース要素を取得（DOM検索不要）
        const currentSource = targetSources[i];
        const sourceId = getSourceIdentifier(currentSource);
        console.log(`Processing source ${i + 1}/${totalSources}: ${sourceId}`);

        // ソースを開く
        await openSource(currentSource);

        // 更新ボタンを探してクリック
        const updated = await findAndClickUpdateButton();

        if (updated) {
          updatedCount++;
          console.log(`Source "${sourceId}" updated`);
        } else {
          skippedCount++;
          console.log(`Source "${sourceId}" skipped (no update button found)`);
        }

        // ソースごとの処理時間を表示
        const sourceEndTime = Date.now();
        const sourceTime = ((sourceEndTime - sourceStartTime) / 1000).toFixed(2);
        console.log(`Source processed in ${sourceTime}s`);

      } catch (error) {
        console.error(`Error processing source ${i + 1}:`, error);
        skippedCount++;
      } finally {
        // エラーがあってもなくても、必ずソースを閉じる
        try {
          await closeSource();
          console.log(`Closed source ${i + 1}`);
        } catch (closeError) {
          console.error(`Failed to close source ${i + 1}:`, closeError);
          // 強制的にESCを複数回送信
          for (let j = 0; j < 3; j++) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'Escape',
              keyCode: 27,
              bubbles: true
            }));
            await wait(300);
          }
        }

        // 次のソースに進む前に少し待つ
        await wait(500);
      }
    }

    // パフォーマンス計測終了
    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);
    const avgTime = (totalTime / totalSources).toFixed(2);

    console.log(`Performance: Total ${totalTime}s, Average ${avgTime}s per source`);

    // 部分更新モードの場合、フィルタ情報を表示
    let message = `完了: ${updatedCount}件更新、${skippedCount}件スキップ（全${totalSources}件）\n処理時間: ${totalTime}秒（平均${avgTime}秒/ソース）`;

    if (isPartialMode) {
      message += `\nフィルタ: ${filterKeywords.join(', ')}`;
    }

    return {
      success: true,
      message: message
    };

  } catch (error) {
    return {
      success: false,
      message: `エラー: ${error.message}`
    };
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    // content scriptが読み込まれているか確認用
    sendResponse({ success: true });
  } else if (request.action === 'searchSources') {
    // 新規アクション：検索のみ実行
    searchSources(request.filterKeywords).then(sendResponse);
    return true; // 非同期レスポンスを示す
  } else if (request.action === 'autoUpdateAll') {
    // optionsを渡す
    const options = {
      mode: request.mode || 'all',
      filterKeywords: request.filterKeywords || []
    };
    autoUpdateAllSources(options).then(sendResponse);
    return true; // 非同期レスポンスを示す
  } else if (request.action === 'stop') {
    shouldStop = true;
    sendResponse({ success: true });
  }
});

console.log('NotebookLM Auto-Updater content script loaded');
