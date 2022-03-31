console.log('background js running!');

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

            //TODO SOMENTE DAS ATIVAS
            prepareRuleNotifications(rules);

            const activeConditions = rules.reduce((activeConditions, rule) => {
                if (rule.active) {
                    return [...activeConditions, ...rule.conditions]
                }
                return activeConditions
            }, []);

            console.log('[updateChromeDynamicRules] activeConditions', activeConditions);

            const dynamicRules = activeConditions.map((condition, index) => {

                const id = index + 1;

                const dynamicRule = {
                    id: id,
                    priority: 1
                };

                //TODO regex nao funcionando 
                //nem quando redireciona com parametro

                //ler exemplos https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/
                //https://stackoverflow.com/questions/66810459/chrome-extension-insert-a-user-input-string-into-multiple-declarativenetrequest

                if (condition.request.search === 'EQUALS' || condition.request.search === 'CONTAINS') {

                    dynamicRule.action = {
                        type: "redirect",
                        redirect: {
                            url: condition.request.redirect,
                        }
                    }

                    dynamicRule.condition = {
                        urlFilter: condition.request.value,
                        resourceTypes: resourceTypes
                    }
                } else {

                    dynamicRule.action = {
                        type: "redirect",
                        redirect: {
                            regexSubstitution: String.raw`${condition.request.redirect}`.replace('$', '\\'),
                        }
                    }

                    dynamicRule.condition = {
                        regexFilter: condition.request.value,
                        resourceTypes: resourceTypes
                    }
                }

                return dynamicRule;
            });

            console.log('[updateChromeDynamicRules] dynamicRules', dynamicRules);

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
        }, 10000);

        chrome.storage.sync.set({ "timeoutId": timeoutIdentification }, function () {
            console.log('saved new timeoutid')
        });
    });
}


const onBeforeCallback = (details) => {

    console.log('[onBeforeCallback] details ', details)

    chrome.storage.sync.get(["rules"], function (data) {

        const { rules } = data;

        const callbackDetailMatchRuleCondition = (condition) => {

            switch (condition.request.search) {
                case 'REGEX':

                    const regexPattern = new RegExp(condition.request.value);
                    return regexPattern.test(details.url)
                case 'EQUALS':

                    //TODO test url without last slash
                    // const redirectUrl = details.redirectUrl.charAt(details.redirectUrl.length - 1) === '/' ?
                    //     details.redirectUrl.slice(0, details.redirectUrl.length - 1) :
                    //     details.redirectUrl;

                    return condition.request.value === details.url;
                case 'CONTAINS':

                    return details.url.includes(condition.request.value);
                default:
                    return false;
            }
        };

        const activatedRules = rules.filter(rule => rule.active && rule.conditions.some(condition => callbackDetailMatchRuleCondition(condition)));

        if (activatedRules.length > 0) {

            chrome.action.setIcon({ path: "images/iconWorking.png" }, () => { console.log('changed icon!!!') });
            setDefaultIcon();

            const rulesForNotification = activatedRules.filter(rule => rule.enableNotifications);
            prepareNotifications(rulesForNotification)
        }
    });

    // //OLD
    // chrome.storage.sync.get(["ruleUrlOccurrences"], function (items) {

    //     const { ruleUrlOccurrences } = items;

    //     const redirectUrl = details.redirectUrl.charAt(details.redirectUrl.length - 1) === '/' ?
    //         details.redirectUrl.slice(0, details.redirectUrl.length - 1) :
    //         details.redirectUrl;

    //     if (ruleUrlOccurrences[redirectUrl]) {

    //         chrome.action.setIcon({ path: "images/iconWorking.png" }, () => { console.log('changed icon!!!') });
    //         setDefaultIcon();

    //         pushNotification(ruleUrlOccurrences[redirectUrl])
    //     }
    // });
};

const prepareNotifications = (rules) => {

    chrome.storage.sync.get(["notificationTimeoutId"], function (items) {

        const { notificationTimeoutId } = items;

        console.log('[prepareNotifications] notificationTimeoutId', notificationTimeoutId)

        if (notificationTimeoutId) {

            clearTimeout(notificationTimeoutId);
            chrome.storage.sync.set({ "notificationTimeoutId": null }, function () {
                console.log('clearTimeout')
            });
        }

        const timeoutIdentification = setTimeout(() => {

            pushNotification(rules);
        }, 5000);

        chrome.storage.sync.set({ "notificationTimeoutId": timeoutIdentification }, function () {
            console.log('saved new notificationTimeoutId')
        });
    });

}

const pushNotification = (rules) => {

    if (rules.length === 0) {
        return;
    }

    const rulesNameList = () => rules.reduce((msg, rule, index) => {
        if (index === 0) {
            return rule.name
        }
        return `${msg}, ${rule.name}`
    }, '');

    const message = rules.length > 1 ?
        `Redirection working for the following active rules: ${rulesNameList()}` :
        `Redirection working for rule ${rules[0].name}`;

    chrome.notifications.create(
        {
            title: 'Redirect Request Chrome Extension',
            message: message,
            iconUrl: 'images/icon32.png',
            type: 'basic'
        }
    )
};

const removeRuleNotificationListeners = () => {
    chrome.webRequest.onBeforeRedirect.removeListener(onBeforeCallback)
}


//TODO renomear para um nome que faça sentido
const prepareRuleNotifications = (rules) => {

    console.log(' ')
    console.log('[prepareRuleNotifications] ')

    if (!rules) {
        return;
    }

    removeRuleNotificationListeners();

    // chrome.storage.sync.set({ "ruleUrlOccurrences": null });

    // const ruleUrlOccurrences = rules.reduce((urls, rule) => {

    //     if (rule.active) {

    //         rule.conditions.forEach(condition => {

    //             if (!condition.request.redirect) {
    //                 return;
    //             }

    //             const url = condition.request.redirect.charAt(condition.request.redirect.length - 1) === '/' ?
    //                 condition.request.redirect.slice(0, condition.request.redirect.length - 1) :
    //                 condition.request.redirect;

    //             if (urls[url]) {

    //                 urls[url].push(rule.name);
    //                 return;
    //             }
    //             urls[url] = [rule.name];
    //         });
    //     }

    //     return urls;
    // }, {});

    // console.log('[prepareRuleNotifications] ruleUrlOccurrences', ruleUrlOccurrences)

    // chrome.storage.sync.set({ "ruleUrlOccurrences": ruleUrlOccurrences });

    //https://developer.chrome.com/docs/extensions/mv3/match_patterns/
    const networkFilters = {
        urls: ['<all_urls>']
    };

    chrome.webRequest.onBeforeRedirect.addListener(onBeforeCallback, networkFilters);
}

(() => {
    console.log('background setup v2')

    removeRuleNotificationListeners();
    chrome.storage.sync.get(["rules"], function (data) {
        const { rules } = data;
        prepareRuleNotifications(rules);
    });
})();

//Unchecked runtime.lastError: Rule with id 2 does not provide a valid URL for action.redirect.url key.
//adicionar lib e validação no form


//TODO bug angular.io corsAccess to fetch at 'https://reactjs.org/' (redirected from 'https://www.google-analytics.com/j/collect?v=1&_v=j96&a=1678469577&t=pageview&_s=1&dl=https%3A%2F%2Fangular.io%2F&dp=%2F&ul=en-us&de=UTF-8&dt=Angular&sd=24-bit&sr=1') from origin 'https://angular.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.