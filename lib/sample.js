// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.
async function genericOnClick(info, tab) {
    let word = info.selectionText;

    let setResult = await chrome.storage.sync.get([word]);
    let frequency = 1;
    if (Object.keys(setResult).length != 0) {
        frequency = setResult[word].frequency + 1;
    }

    console.log(frequency);
    var vocab = { "frequency": frequency }
    await chrome.storage.sync.set({[word]: vocab});
    let getResult = await chrome.storage.sync.get([word]);
    console.log(getResult);

    chrome.runtime.sendMessage({
        name: 'define-word',
        data: { value: word }
      });
}

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(function () {
    let title = "Add to my vocabulary";
    chrome.contextMenus.create({
      title: title,
      contexts: ["selection"],
      id: "selection"
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
    }
  });