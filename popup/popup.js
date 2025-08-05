document.getElementById("startButton").addEventListener("click", async () => {
  const studyTimeInput = document.getElementById("studyTime");
  const blockedSitesInput = document.getElementById("blockedSites");
  const status = document.getElementById("status");

  const studyTime = parseInt(studyTimeInput.value);
  if (isNaN(studyTime) || studyTime <= 0) {
    status.textContent = "⛔ Enter a valid study time (in minutes)";
    status.style.color = "red";
    return;
  }

  const sites = blockedSitesInput.value
    .split('\n')
    .map(site => site.trim())
    .filter(site => site.length > 0);

  if (sites.length === 0) {
    status.textContent = "⛔ Enter at least one site to block.";
    status.style.color = "red";
    return;
  }

  const endTime = Date.now() + studyTime * 60 * 1000;

  // Save to local storage
  await chrome.storage.local.set({
    studyModeOn: true,
    blockedSites: sites,
    studyEndTime: endTime
  });

  // Notify background script
  // Notify background script
chrome.runtime.sendMessage({ action: 'updateRules' });

// Send blocked sites to content script
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]?.id) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'setBlockedSites',
      sites: sites
    });
  }
});


  status.textContent = `✅ Study mode ON for ${studyTime} minutes.\nBlocked ${sites.length} site(s).`;
  status.style.color = "green";
});
