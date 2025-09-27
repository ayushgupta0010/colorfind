const select = document.getElementById("type");
const applyBtn = document.getElementById("apply");

// restore saved type
chrome.storage.sync.get({ cbType: "none" }, (items) => {
  select.value = items.cbType || "none";
});

applyBtn.addEventListener("click", async () => {
  const type = select.value;
  // save preference
  chrome.storage.sync.set({ cbType: type });

  // send message to the active tab's content script to apply immediately
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: "applyType", type });
  }
});
