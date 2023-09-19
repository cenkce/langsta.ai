export const sendMessagetoCurrentTab = async (message: any) => {
  const queryOptions = { active: true, currentWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);

  if (tabs?.[0]?.id)
    chrome.tabs.sendMessage(
      tabs[0].id,
      message,
      function (response) {
        console.log(response.status);
      }
    );
};
