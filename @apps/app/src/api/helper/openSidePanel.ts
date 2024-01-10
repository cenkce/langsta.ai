export const openSidePanel = async (tabId?: number, path: string = 'sidepanel.html') => {
  if (tabId) {
    await chrome.sidePanel.open({ tabId });
    await chrome.sidePanel.setOptions({
      tabId,
      path,
      enabled: true,
    });
  }
};
