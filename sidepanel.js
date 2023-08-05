async function queryWord(message, sender) {
    console.log(message);
    if (message.name === 'define-word') {
        const word = message.data.value;
        const apiCall = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
        const response = await fetch(apiCall);
        const definition = await response.json();
        console.log(definition);

        // Hide instructions.
        document.body.querySelector('#select-a-word').style.display = 'none';
    
        document.body.querySelector('#definition-word').innerText = word;
        document.body.querySelector('#definition-text').innerText = JSON.stringify(definition);
    }
}

chrome.runtime.onMessage.addListener(queryWord);