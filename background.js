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
                    priority: 1
                };

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

};

const prepareNotifications = (rules) => {

    chrome.storage.sync.get(["notificationTimeoutId"], function (items) {

        const { notificationTimeoutId } = items;

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
            title: 'Redirect Helper Chrome Extension',
            message: message,
            iconUrl: 'images/128.png',
            type: 'basic'
        }
    )
};

const removeRuleNotificationListeners = () => {
    chrome.webRequest.onBeforeRedirect.removeListener(onBeforeCallback)
}

const prepareRuleNotifications = (rules) => {

    if (!rules) {
        return;
    }

    removeRuleNotificationListeners();

    const networkFilters = {
        urls: ['<all_urls>']
    };

    chrome.webRequest.onBeforeRedirect.addListener(onBeforeCallback, networkFilters);
}

(() => {
    removeRuleNotificationListeners();
    chrome.storage.sync.get(["rules"], function (data) {
        const { rules } = data;
        prepareRuleNotifications(rules);
    });
})();