export const openSidePanel = async (
  tabId?: number,
  path: string = "sidepanel.html",
) => {
  if (!tabId) {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        if (tabs[0]?.id) {
          await chrome.sidePanel.open({ tabId: tabs[0]?.id });
          await chrome.sidePanel.setOptions({
            tabId,
            path,
            enabled: true,
          });
        }
      },
    );
  } else if (tabId) {
    await chrome.sidePanel.open({ tabId });
    await chrome.sidePanel.setOptions({
      tabId,
      path,
      enabled: true,
    });
  }
};
