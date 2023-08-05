// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.
function genericOnClick(info, tab) {
    let word = info.selectionText;

    const apiCall = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
    fetch(apiCall)
    .then(response => response.json())
    .then(data => {
        console.log(word);
        chrome.storage.sync.get([word])
        .then((result) => {
            let frequency = 1;
            if (Object.keys(result).length != 0) {
                frequency = result[word].frequency + 1;
            }

            console.log(frequency);
            var vocab = { "frequency": frequency }

            chrome.storage.sync.set({[word]: vocab})
            .then(() => {
                chrome.storage.sync.get([word])
                .then((result) => {console.log(result);})
                .catch((error) => { console.log(error);})
            });
        });
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