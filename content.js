chrome.storage.local.get(['studyModeOn', 'blockedSites', 'studyEndTime'], (data) => {
  const { studyModeOn, blockedSites, studyEndTime } = data;

  if (!studyModeOn || Date.now() > studyEndTime) return;

  const currentHost = window.location.hostname.replace(/^www\./, '');
  const matchedSite = (blockedSites || []).find(site => currentHost.includes(site));

  if (matchedSite) {
    try {
      // Try to inject styles and HTML
      document.head.innerHTML = generateSTYLES();
      document.body.innerHTML = generateHTML(matchedSite.toUpperCase());
    } catch (err) {
      // Fallback: Redirect to block.html if injection fails
      window.location.href = chrome.runtime.getURL(`block.html?site=${encodeURIComponent(matchedSite)}`);
    }
  }
});

// Listen for real-time updates from popup.js
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
      @import url('https://fonts.googleapis.com/css?family=Open+Sans:500');
      body {
        background: #33cc99;
        color: #fff;
        font-family: "Open Sans", sans-serif;
        max-height: 700px;
        overflow: hidden;
      }
      .c {
        text-align: center;
        display: block;
        position: relative;
        width: 80%;
        margin: 100px auto;
      }
      ._404 {
        font-size: 220px;
        position: relative;
        display: inline-block;
        z-index: 2;
        height: 250px;
        letter-spacing: 15px;
      }
      ._1 {
        text-align: center;
        display: block;
        position: relative;
        letter-spacing: 12px;
        font-size: 4em;
        line-height: 80%;
      }
      ._2 {
        text-align: center;
        display: block;
        position: relative;
        font-size: 20px;
      }
      .text {
        font-size: 70px;
        text-align: center;
        position: relative;
        display: inline-block;
        margin: 19px 0px 0px 0px;
        z-index: 3;
        width: 100%;
        line-height: 1.2em;
        display: inline-block;
      }
      .right {
        float: right;
        width: 60%;
      }
      hr {
        padding: 0;
        border: none;
        border-top: 5px solid #fff;
        color: #fff;
        text-align: center;
        margin: 0px auto;
        width: 420px;
        height: 10px;
        z-index: -10;
      }
      .cloud {
        width: 350px;
        height: 120px;
        background: #fff;
        border-radius: 100px;
        position: absolute;
        margin: 120px auto 20px;
        z-index: -1;
        transition: ease 1s;
      }
      .cloud:after, .cloud:before {
        content: "";
        position: absolute;
        background: #fff;
        z-index: -1;
      }
      .cloud:after {
        width: 100px;
        height: 100px;
        top: -50px;
        left: 50px;
        border-radius: 100px;
      }
      .cloud:before {
        width: 180px;
        height: 180px;
        top: -90px;
        right: 50px;
        border-radius: 200px;
      }
      .x1 { top: -50px; left: 100px; transform: scale(0.3); opacity: 0.9; animation: moveclouds 15s linear infinite; }
      .x1_5 { top: -80px; left: 250px; transform: scale(0.3); animation: moveclouds 17s linear infinite; }
      .x2 { left: 250px; top: 30px; transform: scale(0.6); opacity: 0.6; animation: moveclouds 25s linear infinite; }
      .x3 { left: 250px; bottom: -70px; transform: scale(0.6); opacity: 0.8; animation: moveclouds 25s linear infinite; }
      .x4 { left: 470px; bottom: 20px; transform: scale(0.75); opacity: 0.75; animation: moveclouds 18s linear infinite; }
      .x5 { left: 200px; top: 300px; transform: scale(0.5); opacity: 0.8; animation: moveclouds 20s linear infinite; }

      @keyframes moveclouds {
        0% { margin-left: 1000px; }
        100% { margin-left: -1000px; }
      }
    </style>
  `;
};

const generateHTML = (pageName) => {
  return `
    <div id="clouds">
      <div class="cloud x1"></div>
      <div class="cloud x1_5"></div>
      <div class="cloud x2"></div>
      <div class="cloud x3"></div>
      <div class="cloud x4"></div>
      <div class="cloud x5"></div>
    </div>
    <div class='c'>
      <div class='_404'>404</div>
      <hr>
      <div class='_1'>GET BACK TO WORK</div>
      <div class='_2'>STUDYING > ${pageName}</div>
    </div>
  `;
};
