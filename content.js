//content script is a code that executes after a page loads in the browser, and manipulates the content of the webpage

console.log('Redirect Network Chrome Extension');

// let paragraphs = document.getElementsByTagName('p');

// for (element of paragraphs) {
//     element.style['background-color'] = '#FF00FF';
// }


// const gotMessage = (message, sender, sendResponse) => {
//     console.log('message ', message.text)
// };

// chrome.runtime.onMessage.addListener(gotMessage);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message ', message.text)
    sendResponse();
});