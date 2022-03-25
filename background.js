//background script is a code that runs when you lunch chrome, and is listening everything about the browser e.g open a new tab

//ler documentação chrome.webRequest https://developer.chrome.com/docs/extensions/reference/webRequest/

console.log('background js running!');

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

//INTERVAL
// setInterval(() => {


//     // console.log('testing regex')

//     // chrome.declarativeNetRequest.isRegexSupported(
//     //     {
//     //         regex: '^http://localhost:(.*)'
//     //     },
//     //     (result) => {
//     //         console.log('isRegexSupported resultado ', result)
//     //     }
//     // )

//     // {
//     //     "isSupported": true
//     // }


//     // chrome.storage.sync.get(null, function(items) {
//     //     var allKeys = Object.keys(items);
//     //     console.log(allKeys);
//     // });

//     chrome.storage.sync.get(/* String or Array */["rules"], function (items) {
//         //  items = [ { "yourBody": "myBody" } ]
//         console.log(' ')
//         console.log('getting storage rules on background, rules: ', items)
//     });


//     console.log('declarative net rules');
//     chrome.declarativeNetRequest.getDynamicRules(rules => {
//         console.log('chrome dynamic rules ', rules)
//     })

// }, 5000);


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

        chrome.storage.sync.get(["rules"], function (data) {
            const { rules } = data;

            console.log('rules @@@@@@ ', rules);

            prepareRuleNotifications(rules);

            const activeConditions = rules.reduce((activeConditions, rule) => {
                if (rule.active) {
                    return [...activeConditions, ...rule.conditions]
                }
                return activeConditions
            }, []);

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
    if (request.type == "rules-update-notification") {
        updateChromeDynamicRules();
    }
    sendResponse();
});



//notifications


// const pushNotification = () => {

//     chrome.notifications.create(
//         {
//             title: 'Redirect Request Chrome Extension',
//             message: 'LetXPath got an update!',
//             iconUrl: 'images/icon32.png',
//             type: 'basic'
//         }
//     )

//     setTimeout(() => {

//         // chrome.webNavigation.onCompleted.removeListener(pushNotification, webNavigationOnCompletedOptions)
//         chrome.webNavigation.onCompleted.removeListener(pushNotification)
//         // chrome.webNavigation.onCompleted.removeListener();
//     }, 2000);
// };

// const webNavigationOnCompletedOptions = { url: [{ urlMatches: 'https://www.google.com/' }] };

// chrome.webNavigation.onCompleted.addListener(pushNotification, webNavigationOnCompletedOptions);



//requests





// chrome.webRequest.onBeforeRequest.addListener((details) => {

//     chrome.action.setIcon({ path: "images/iconWorking.png" }, () => { console.log('changed icon!!!') });
//     setDefaultIcon();


//     console.log('chegou aqui !!!! ', details)

//     // {
//     //     "frameId": 0,
//     //     "initiator": "http://localhost:3000",
//     //     "method": "GET",
//     //     "parentFrameId": -1,
//     //     "requestId": "20610",
//     //     "tabId": 1171,
//     //     "timeStamp": 1648163965613.8142,
//     //     "type": "image",
//     //     "url": "http://localhost:3000/faviconRedirected.ico"
//     // }

// }, networkFilters);

const setDefaultIcon = () => {

    chrome.storage.sync.get(["timeoutId"], function (items) {

        const { timeoutId } = items;

        if (timeoutId) {

            clearTimeout(timeoutId);
            chrome.storage.sync.set({ "timeoutId": null }, function () {
                console.log('clearTimeout')
            });
        }

        const timeoutIdentification = setTimeout(() => {
            chrome.action.setIcon({ path: "images/icon32.png" }, () => { console.log('changed to default icon!!!') });
        }, 5000);

        chrome.storage.sync.set({ "timeoutId": timeoutIdentification }, function () {
            console.log('saved new timeoutid')
        });
    });
}


// TODO doing notification logic

const onBeforeCallback = (details) => {

    console.log('@@@@@ onBeforeCallback ', details)

    //verificar se nao precisa chegar se o redirect é da extansao, ou se triga em qualquer redirect
    chrome.action.setIcon({ path: "images/iconWorking.png" }, () => { console.log('changed icon!!!') });
    setDefaultIcon();

    chrome.storage.sync.get(["networkUrlFilters"], function (items) {

        console.log('@ inner get onBeforeCallback networkUrlFilters ', items);

        const { networkUrlFilters } = items;

        if (networkUrlFilters[details.redirectUrl]) {
            pushNotification(networkUrlFilters[details.redirectUrl])
        }
    });

};


const pushNotification = (rules) => {

    console.log('pushNotification')

    const organizeRulesText = () => rules.reduce((msg, rule, index) => {
        if (index === 0) {
            return rule
        }
        return `${msg}, ${rule}`
    }, '');

    const message = `${rules.length > 0 ?
        `Redirection working for the following active rules: ${organizeRulesText()}` :
        `Redirection working for rule ${rules[0]}`}`

    chrome.notifications.create(
        {
            title: 'Redirect Request Chrome Extension',
            message: message,
            iconUrl: 'images/icon32.png',
            type: 'basic'
        }
    )

    // setTimeout(() => {

    //     // chrome.webNavigation.onCompleted.removeListener(pushNotification, webNavigationOnCompletedOptions)
    //     chrome.webNavigation.onCompleted.removeListener(pushNotification)
    //     // chrome.webNavigation.onCompleted.removeListener();
    // }, 2000);
};


const removeRuleNotificationListeners = () => {
    chrome.webRequest.onBeforeRedirect.removeListener(onBeforeCallback)
}

const prepareRuleNotifications = (rules) => {

    console.log('prepareNotificationListeners v2', rules)
    removeRuleNotificationListeners();

    chrome.storage.sync.set({ "ruleUrlOccurrences": null });

    let filterUrls = [];

    const ruleUrlOccurrences = rules.reduce((urls, rule) => {

        if (rule.enableNotifications) {

            rule.conditions.forEach(condition => {

                filterUrls.push(condition.request.redirect);
                
                if (urls[condition.request.redirect]) {

                    urls[condition.request.redirect].push(rule.name)
                    return;
                }
                urls[condition.request.redirect] = [rule.name];
            });
        }

        return urls;
    }, {});

    console.log('@@@@ ruleUrlOccurrences', ruleUrlOccurrences)
    console.log('@@@@ urls', filterUrls)

    chrome.storage.sync.set({ "ruleUrlOccurrences": ruleUrlOccurrences });

    //  todo FAILING WITH HTTPS
    const networkFilters = {
        urls: ['http://localhost:3000/favicon.ico']
    };

    chrome.webRequest.onBeforeRedirect.addListener(onBeforeCallback, networkFilters);
}


(() => {
    console.log('setup script')

    removeRuleNotificationListeners();
    chrome.storage.sync.get(["rules"], function (data) {
        const { rules } = data;
        prepareRuleNotifications(rules);
    });
})();


