document.addEventListener('DOMContentLoaded', function() {
  const autoUpdateBtn = document.getElementById('autoUpdateBtn');
  const stopBtn = document.getElementById('stopBtn');
  const progressDiv = document.getElementById('progress');
  const statusDiv = document.getElementById('status');
  const modeToggle = document.getElementById('modeToggle');
  const filterContainer = document.getElementById('filterContainer');
  const filterInput = document.getElementById('filterInput');
  const btnLabel = document.getElementById('btnLabel');
  const searchBtn = document.getElementById('searchBtn');
  const searchResults = document.getElementById('searchResults');
  const searchResultsText = document.getElementById('searchResultsText');
  const searchResultsList = document.getElementById('searchResultsList');

  let isRunning = false;
  let shouldStop = false;
  let searchResultsData = null;

  function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;

    if (type === 'success') {
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
      }, 5000);
    }
  }

  function showProgress(message) {
    progressDiv.textContent = message;
  }

  function clearProgress() {
    progressDiv.textContent = '';
  }

  function disableStartButton() {
    autoUpdateBtn.disabled = true;
    autoUpdateBtn.style.display = 'none';
    stopBtn.style.display = 'block';
  }

  function enableStartButton() {
    autoUpdateBtn.disabled = false;
    autoUpdateBtn.style.display = 'block';
    stopBtn.style.display = 'none';
  }

  function parseFilterString(filterStr) {
    if (!filterStr || filterStr.trim() === '') {
      return [];
    }

    // カンマまたはスペースで分割
    const keywords = filterStr
      .split(/[,\s]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);

    return keywords;
  }

  // 検索結果を表示
  function displaySearchResults(results) {
    const { count, sources } = results;

    searchResultsText.textContent = `${count}件のソースが見つかりました`;

    // ソース名リストを表示（最大10件）
    searchResultsList.innerHTML = '';
    const displayCount = Math.min(sources.length, 10);

    for (let i = 0; i < displayCount; i++) {
      const li = document.createElement('div');
      li.className = 'source-item';
      li.textContent = `• ${sources[i]}`;
      searchResultsList.appendChild(li);
    }

    if (sources.length > 10) {
      const more = document.createElement('div');
      more.className = 'source-item';
      more.textContent = `... 他${sources.length - 10}件`;
      searchResultsList.appendChild(more);
    }

    searchResults.style.display = 'block';
  }

  // 検索結果を非表示
  function hideSearchResults() {
    searchResults.style.display = 'none';
    searchResultsText.textContent = '';
    searchResultsList.innerHTML = '';
  }

  // トグル切り替え時の処理
  modeToggle.addEventListener('change', function() {
    const isPartialMode = modeToggle.checked;

    // フィルタコンテナの表示/非表示
    filterContainer.style.display = isPartialMode ? 'block' : 'none';

    // 検索ボタンの表示/非表示
    searchBtn.style.display = isPartialMode ? 'block' : 'none';

    // ボタンラベルの変更
    btnLabel.textContent = isPartialMode
      ? '指定ソースを自動更新'
      : '全ソースを自動更新';

    // モード切り替え時は検索結果をクリア
    hideSearchResults();
    searchResultsData = null;

    // 全ソースモード：更新ボタンを有効化
    // 指定ソースモード：更新ボタンを無効化（検索後に有効化）
    autoUpdateBtn.disabled = isPartialMode;

    // 部分更新モードの場合、フィルタ入力にフォーカス
    if (isPartialMode) {
      filterInput.focus();
    }
  });

  // フィルタ入力変更時に検索結果をクリア
  filterInput.addEventListener('input', () => {
    hideSearchResults();
    searchResultsData = null;
    if (modeToggle.checked) {
      autoUpdateBtn.disabled = true;
    }
  });

  async function ensureContentScriptLoaded(tabId) {
    // content scriptが読み込まれているか確認
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      return true;
    } catch (error) {
      // 読み込まれていない場合は注入
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
        // 注入後、少し待つ
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
      } catch (injectError) {
        console.error('Failed to inject content script:', injectError);
        return false;
      }
    }
  }

  async function startAutoUpdate() {
    // 指定ソースモードの場合、検索結果がない場合はエラー
    const isPartialMode = modeToggle.checked;

    if (isPartialMode && !searchResultsData) {
      showStatus('先に検索を実行してください', 'error');
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.url || !tab.url.includes('notebooklm.google.com')) {
        showStatus('NotebookLMのページで開いてください', 'error');
        return;
      }

      isRunning = true;
      shouldStop = false;
      disableStartButton();
      showStatus('', 'info');
      showProgress('準備中...');

      // content scriptが読み込まれているか確認・必要なら注入
      const loaded = await ensureContentScriptLoaded(tab.id);
      if (!loaded) {
        showStatus('拡張機能の読み込みに失敗しました。ページをリロードしてください。', 'error');
        clearProgress();
        enableStartButton();
        return;
      }

      // モードとフィルタを取得
      const filterKeywords = isPartialMode
        ? parseFilterString(filterInput.value)
        : [];

      // 指定ソースモードでフィルタが空の場合は警告
      if (isPartialMode && filterKeywords.length === 0) {
        showStatus('フィルタキーワードを入力してください', 'error');
        clearProgress();
        enableStartButton();
        isRunning = false;
        shouldStop = false;
        return;
      }

      showProgress('ソースを検索中...');

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'autoUpdateAll',
        mode: isPartialMode ? 'partial' : 'all',
        filterKeywords: filterKeywords
      });

      if (response.success) {
        showStatus(response.message, 'success');
        clearProgress();
      } else {
        showStatus(response.message, 'error');
        clearProgress();
      }
    } catch (error) {
      showStatus(`エラー: ${error.message}`, 'error');
      clearProgress();
    } finally {
      isRunning = false;
      shouldStop = false;
      enableStartButton();
    }
  }

  // 検索ボタンのイベントハンドラ
  searchBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.url || !tab.url.includes('notebooklm.google.com')) {
        showStatus('NotebookLMのページで開いてください', 'error');
        return;
      }

      // モードとフィルタキーワードを取得
      const isPartialMode = modeToggle.checked;
      const filterKeywords = isPartialMode
        ? parseFilterString(filterInput.value)
        : []; // 全ソースモードでは空配列

      // 指定ソースモードでフィルタが空の場合はエラー
      if (isPartialMode && filterKeywords.length === 0) {
        showStatus('フィルタキーワードを入力してください', 'error');
        return;
      }

      showProgress('ソースを検索中...');

      // content scriptが読み込まれているか確認・必要なら注入
      const loaded = await ensureContentScriptLoaded(tab.id);
      if (!loaded) {
        showStatus('拡張機能の読み込みに失敗しました。ページをリロードしてください。', 'error');
        clearProgress();
        return;
      }

      // content scriptにsearchSourcesアクションを送信
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'searchSources',
        filterKeywords: filterKeywords
      });

      clearProgress();

      if (response.success) {
        // 検索結果を表示
        searchResultsData = response;
        displaySearchResults(response);

        // 更新ボタンを有効化
        autoUpdateBtn.disabled = false;

        showStatus('検索完了', 'success');
      } else {
        showStatus(response.message, 'error');
        searchResultsData = null;
        hideSearchResults();
        autoUpdateBtn.disabled = true;
      }
    } catch (error) {
      showStatus(`エラー: ${error.message}`, 'error');
      clearProgress();
      searchResultsData = null;
      hideSearchResults();
      autoUpdateBtn.disabled = true;
    }
  });

  autoUpdateBtn.addEventListener('click', () => {
    startAutoUpdate();
  });

  stopBtn.addEventListener('click', () => {
    shouldStop = true;
    showStatus('停止中...', 'info');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' });
      }
    });
  });

  // メッセージを受信して進捗を更新
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'progress') {
      showProgress(request.message);
    }
  });

  // 初期チェック
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && !tabs[0].url.includes('notebooklm.google.com')) {
      showStatus('NotebookLMのページで開いてください', 'error');
      autoUpdateBtn.disabled = true;
      searchBtn.disabled = true;
    }
  });
});
