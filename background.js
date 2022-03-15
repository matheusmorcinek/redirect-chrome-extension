//background script is a code that runs when you lunch chrome, and is listening everything about the browser e.g open a new tab

//ler documentação chrome.webRequest https://developer.chrome.com/docs/extensions/reference/webRequest/

console.log('background js running!');

chrome.webNavigation.onCompleted.addListener(function () {
    console.log("This is my favorite website!");
}, { url: [{ urlMatches: 'https://www.google.com/' }] });


const extensionButtonClicked = (tab) => {
    console.log('Redirect Network Chrome Extension - button clicked');

    console.log('tab ', tab)
    let message = {
        text: 'hello'
    };
    chrome.tabs.sendMessage(tab.id, message);
};

chrome.action.onClicked.addListener(tab => extensionButtonClicked(tab));


// chrome.webRequest.onBeforeRequest.addListener(
//     function (details) {
//         console.log('details ', details)
//     },
//     { urls: ["<all_urls>"] },
//     ["requestBody"]
// );

// var callback = function (details) {
//     console.log("details ", details);
// };
// var filter = {urls: ["<all_urls>"]};
// var opt_extraInfoSpec = [];

// chrome.webRequest.onBeforeRequest.addListener(
//     callback, filter, opt_extraInfoSpec);

(function () {
    const tabStorage = {};
    const networkFilters = {
        urls: [
            "*://developer.mozilla.org/*"
        ]
    };

    chrome.webRequest.onBeforeRequest.addListener((details) => {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }

        tabStorage[tabId].requests[requestId] = {
            requestId: requestId,
            url: details.url,
            startTime: details.timeStamp,
            status: 'pending'
        };
        console.log(tabStorage[tabId].requests[requestId]);
    }, networkFilters);

    chrome.webRequest.onCompleted.addListener((details) => {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }

        const request = tabStorage[tabId].requests[requestId];

        Object.assign(request, {
            endTime: details.timeStamp,
            requestDuration: details.timeStamp - request.startTime,
            status: 'complete'
        });
        console.log(tabStorage[tabId].requests[details.requestId]);
    }, networkFilters);

    chrome.webRequest.onErrorOccurred.addListener((details) => {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }

        const request = tabStorage[tabId].requests[requestId];
        Object.assign(request, {
            endTime: details.timeStamp,
            status: 'error',
        });
        console.log(tabStorage[tabId].requests[requestId]);
    }, networkFilters);

    chrome.tabs.onActivated.addListener((tab) => {
        const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
        if (!tabStorage.hasOwnProperty(tabId)) {
            tabStorage[tabId] = {
                id: tabId,
                requests: {},
                registerTime: new Date().getTime()
            };
        }
    });
    chrome.tabs.onRemoved.addListener((tab) => {
        const tabId = tab.tabId;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }
        tabStorage[tabId] = null;
    });
}());