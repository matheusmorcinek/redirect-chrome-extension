//background script is a code that runs when you lunch chrome, and is listening everything about the browser e.g open a new tab

//ler documentação chrome.webRequest https://developer.chrome.com/docs/extensions/reference/webRequest/

console.log('background js running!');

chrome.webNavigation.onCompleted.addListener(function () {
    console.log("This is my favorite website!");
}, { url: [{ urlMatches: 'https://www.google.com/' }] });


// chrome.webRequest.onBeforeRedirect.addListener(function () {
//     console.log("This is the new icon!!!");
// }, { url: [{ urlMatches: 'http://localhost:3000/faviconRedirected.ico' }] });

// chrome.webRequest.onBeforeRedirect.addListener(
//     function () {
//         console.log("This a request is the new icon!!!");
//     },
//     { urls: ['http://localhost:3000/faviconRedirected.ico'] }
// )

const networkFilters = {
    urls: [
        "http://localhost:3000/faviconRedirected.ico",
        "https://www.google.com/"
    ]
};

chrome.webRequest.onBeforeRequest.addListener((details) => {
    // const { tabId, requestId } = details;
    // if (!tabStorage.hasOwnProperty(tabId)) {
    //     return;
    // }

    // tabStorage[tabId].requests[requestId] = {
    //     requestId: requestId,
    //     url: details.url,
    //     startTime: details.timeStamp,
    //     status: 'pending'
    // };
    // console.log(tabStorage[tabId].requests[requestId]);

    console.log('chegou aqui !!!! ', details)

    // {
    //     "frameId": 0,
    //     "initiator": "http://localhost:3000",
    //     "method": "GET",
    //     "parentFrameId": -1,
    //     "requestId": "20610",
    //     "tabId": 1171,
    //     "timeStamp": 1648163965613.8142,
    //     "type": "image",
    //     "url": "http://localhost:3000/faviconRedirected.ico"
    // }

}, networkFilters);


//TODO https://gilfink.medium.com/adding-web-interception-abilities-to-your-chrome-extension-fb42366df425
//https://developer.chrome.com/docs/extensions/reference/webRequest/#event-onBeforeRedirect

const extensionButtonClicked = (tab) => {
    console.log('Redirect Network Chrome Extension - button clicked');

    console.log('tab ', tab)
    let message = {
        text: 'hello'
    };
    chrome.tabs.sendMessage(tab.id, message);
};

chrome.action.onClicked.addListener(tab => extensionButtonClicked(tab));


// chrome.storage.sync.set({ "yourBody": "myBody" }, function(){
//    console.log('yes saved')
// });

// chrome.storage.sync.get(/* String or Array */["yourBody"], function(items){
//     //  items = [ { "yourBody": "myBody" } ]
//     console.log('the items ', items)
// });

// chrome.storage.sync.get(/* String or Array */["rule"], function(items){
//     //  items = [ { "yourBody": "myBody" } ]
//     console.log('get rule on background, rule: ', items)
// });

// ADDICIONAR URL COM declarativeNetRequest
// blockUrls.forEach((domain, index) => {
//     let id = index + 1;

//     chrome.declarativeNetRequest.updateDynamicRules(
//        {addRules:[{
//           "id": id,
//           "priority": 1,
//           "action": { "type": "block" },
//           "condition": {"urlFilter": domain, "resourceTypes": ["main_frame"] }}
//          ],
//          removeRuleIds: [id]
//        },
//     )
// })

setInterval(() => {


    // console.log('testing regex')

    // chrome.declarativeNetRequest.isRegexSupported(
    //     {
    //         regex: '^http://localhost:(.*)'
    //     },
    //     (result) => {
    //         console.log('isRegexSupported resultado ', result)
    //     }
    // )

    // {
    //     "isSupported": true
    // }


    // chrome.storage.sync.get(null, function(items) {
    //     var allKeys = Object.keys(items);
    //     console.log(allKeys);
    // });

    chrome.storage.sync.get(/* String or Array */["rules"], function (items) {
        //  items = [ { "yourBody": "myBody" } ]
        console.log(' ')
        console.log('getting storage rules on background, rules: ', items)
    });


    console.log('declarative net rules');
    chrome.declarativeNetRequest.getDynamicRules(rules => {
        console.log('chrome dynamic rules ', rules)
    })

}, 5000);

// setInterval(() => {

//     console.log(' ')
//     chrome.storage.sync.get(/* String or Array */["rule"], function(items){
//         //  items = [ { "yourBody": "myBody" } ]
//         console.log('get rule on background, rule: ', items)
//     });

// }, 2000);

// chrome.storage.sync.get(null, function(items) {
//     var allKeys = Object.keys(items);
//     console.log(allKeys);
// });

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

// (function() {
//     const tabStorage = {};
//     const networkFilters = {
//         urls: [
//             "*://developer.mozilla.org/*"
//         ]
//     };

//     chrome.webRequest.onBeforeRequest.addListener((details) => {
//         const { tabId, requestId } = details;
//         if (!tabStorage.hasOwnProperty(tabId)) {
//             return;
//         }

//         tabStorage[tabId].requests[requestId] = {
//             requestId: requestId,
//             url: details.url,
//             startTime: details.timeStamp,
//             status: 'pending'
//         };
//         console.log(tabStorage[tabId].requests[requestId]);
//     }, networkFilters);

//     chrome.webRequest.onCompleted.addListener((details) => {
//         const { tabId, requestId } = details;
//         if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
//             return;
//         }

//         const request = tabStorage[tabId].requests[requestId];

//         Object.assign(request, {
//             endTime: details.timeStamp,
//             requestDuration: details.timeStamp - request.startTime,
//             status: 'complete'
//         });
//         console.log(tabStorage[tabId].requests[details.requestId]);
//     }, networkFilters);

//     chrome.webRequest.onErrorOccurred.addListener((details)=> {
//         const { tabId, requestId } = details;
//         if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
//             return;
//         }

//         const request = tabStorage[tabId].requests[requestId];
//         Object.assign(request, {
//             endTime: details.timeStamp,           
//             status: 'error',
//         });
//         console.log(tabStorage[tabId].requests[requestId]);
//     }, networkFilters);

//     chrome.tabs.onActivated.addListener((tab) => {
//         const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
//         if (!tabStorage.hasOwnProperty(tabId)) {
//             tabStorage[tabId] = {
//                 id: tabId,
//                 requests: {},
//                 registerTime: new Date().getTime()
//             };
//         }
//     });
//     chrome.tabs.onRemoved.addListener((tab) => {
//         const tabId = tab.tabId;
//         if (!tabStorage.hasOwnProperty(tabId)) {
//             return;
//         }
//         tabStorage[tabId] = null;
//     });
// }());

const removeAllDynamicRules = () => {

    return new Promise((resolve, reject) => {

        chrome.declarativeNetRequest.getDynamicRules(rules => {

            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }

            const ids = rules.map(rule => rule.id);

            chrome.declarativeNetRequest.updateDynamicRules(
                {
                    addRules: [],
                    removeRuleIds: ids
                },
                () => {
                    console.log('chrome dynamic rules has been removed')
                    resolve();
                }
            );
        });
    });
}

const resourceTypes = [
    "main_frame",
    "sub_frame",
    "stylesheet",
    "script",
    "image",
    "font",
    "object",
    "xmlhttprequest",
    "ping",
    "csp_report",
    "media",
    "websocket",
    "webtransport",
    "webbundle"
];

const updateChromeDynamicRules = () => {

    removeAllDynamicRules().then(() => {
        console.log('removeAllDynamicRules completed!')

        chrome.storage.sync.get(["rules"], function (data) {
            const { rules } = data;

            const activeConditions = rules.reduce((activeConditions, rule) => {
                if (rule.active) {
                    return [...activeConditions, ...rule.conditions]
                }
                return activeConditions
            }, []);

            console.log('active conditions ', activeConditions);

            const dynamicRules = activeConditions.map((condition, index) => {

                const id = index + 1;

                const dynamicRule = {
                    id: id,
                    priority: 1,
                    action: {
                        type: "redirect",
                        redirect: {
                            url: condition.request.redirect
                        }
                    }
                };

                if (condition.request.search === 'EQUALS' || condition.request.search === 'CONTAINS') {

                    dynamicRule.condition = {
                        urlFilter: condition.request.value,
                        resourceTypes: resourceTypes
                    }
                } else {

                    dynamicRule.condition = {
                        regexFilter: condition.request.value,
                        resourceTypes: resourceTypes
                    }
                }

                return dynamicRule;
            });

            chrome.declarativeNetRequest.updateDynamicRules(
                {
                    addRules: dynamicRules,
                    removeRuleIds: []
                },
                () => {
                    console.log('chrome dynamic rules has been updated!')
                }
            );
        });
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "notification") {
        console.log('[background] received notification! ', request.options);
        updateChromeDynamicRules();
        // chrome.notifications.create('worktimer-notification', request.options, function () { });
    }

    sendResponse();
});

