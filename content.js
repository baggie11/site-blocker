chrome.storage.local.get(['studyModeOn', 'blockedSites', 'studyEndTime'], (data) => {
  const { studyModeOn, blockedSites, studyEndTime } = data;

  if (!studyModeOn || Date.now() > studyEndTime) return;

  const currentHost = window.location.hostname.replace(/^www\./, '');
  const matchedSite = (blockedSites || []).find(site => currentHost.includes(site));

  if (matchedSite) {
    try {
      document.head.innerHTML = generateSTYLES();
      document.body.innerHTML = generateHTML(matchedSite.toUpperCase());
    } catch (err) {
      window.location.href = chrome.runtime.getURL(`block.html?site=${encodeURIComponent(matchedSite)}`);
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setBlockedSites' && message.sites) {
    const currentHost = window.location.hostname.replace(/^www\./, '');
    const matchedSite = message.sites.find(site => currentHost.includes(site));

    if (matchedSite) {
      try {
        document.head.innerHTML = generateSTYLES();
        document.body.innerHTML = generateHTML(matchedSite.toUpperCase());
      } catch (err) {
        window.location.href = chrome.runtime.getURL(`block.html?site=${encodeURIComponent(matchedSite)}`);
      }
    }
  }
});

const generateSTYLES = () => {
  return `
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #121212;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #ffffff;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .container {
        text-align: center;
        padding: 30px;
      }

      .block-box {
        background: #1e1e1e;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
        max-width: 600px;
        margin: 0 auto;
        animation: fadeIn 1s ease-in-out;
      }

      .title {
        font-size: 2.5em;
        color: #f44336;
        margin-bottom: 10px;
        animation: pulse 2s infinite;
      }

      .subtitle {
        font-size: 1.2em;
        margin-bottom: 20px;
        color: #dddddd;
      }

      .quote {
        font-style: italic;
        color: #aaaaaa;
        font-size: 1em;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
      }
    </style>
  `;
};

const generateHTML = (pageName) => {
  return `
    <div class="container">
      <div class="block-box">
        <h1 class="title">STUDY MODE ACTIVE</h1>
        <p class="subtitle">Access to <strong>${pageName}</strong> is blocked during study hours.</p>
        <p class="quote">"Discipline is choosing between what you want now and what you want most."</p>
      </div>
    </div>
  `;
};
