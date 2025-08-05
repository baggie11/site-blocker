async function applyBlockRules() {
    const { blockedSites, studyModeOn, studyEndTime } = await chrome.storage.local.get([
        "blockedSites",
        "studyModeOn",
        "studyEndTime"
    ]);

    const now = Date.now();
    const shouldBlock = studyModeOn && studyEndTime && now < studyEndTime;

    const ruleIds = blockedSites?.map((_, i) => i + 1) || [];

    // Clear existing rules first
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
    });

    if (shouldBlock && blockedSites?.length > 0) {
        const rules = blockedSites.map((site, i) => ({
            id: i + 1,
            priority: 1,
            action: { type: "block" },
            condition: {
                urlFilter: `*://${site}/*`,
                resourceTypes: ["main_frame"]
            }
        }));

        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: rules
        });
    } else {
        await chrome.storage.local.set({ studyModeOn: false });
    }
}

// Run every 1 min
setInterval(applyBlockRules, 60000);

// Also on startup or message
chrome.runtime.onStartup.addListener(applyBlockRules);
chrome.runtime.onInstalled.addListener(applyBlockRules);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "updateRules") {
        applyBlockRules();
    }
});
