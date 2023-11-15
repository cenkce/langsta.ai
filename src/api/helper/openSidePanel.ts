export const openSidePanel = async (tabId?: number) => {
  // @ts-ignore
  await chrome.sidePanel.open({ tabId });
  await chrome.sidePanel.setOptions({
    tabId,
    path: "sidepanel.html",
    enabled: true,
  });
}