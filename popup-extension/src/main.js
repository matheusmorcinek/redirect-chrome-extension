/*global chrome*/

export const getRulesSyncData = () => {

    return new Promise((resolve, reject) => {

        chrome.storage.sync.get(["rules"], (data) => {

            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            const { rules } = data;

            if (!rules) {
                chrome.storage.sync.set({ "rules": [] }, () => {
                    console.log('rules storage has been created!');
                });
                resolve([]);
            }

            resolve(rules);
        });
    });
}

const notifyChromeBackgroundScript = () => {
    chrome.runtime.sendMessage({
        type: "rules-update-notification",
        // options: {
        //     type: "basic",
        //     // iconUrl: chrome.extension.getURL("icon128.png"),
        //     title: "Test",
        //     message: "Test"
        // }
    });
}

export const updateChromeStorageRules = (rules) => {

    chrome.storage.sync.set({ "rules": rules }, () => {
        console.log('Rules storage has been updated!');
    });

    notifyChromeBackgroundScript();
}

export const addNewRule = (rule) => {

    chrome.storage.sync.get(["rules"], (data) => {

        const { rules } = data;

        let value;
        if (rules) {
            value = [...rules, rule];
        } else {
            value = [rule];
        }

        chrome.storage.sync.set({ "rules": value }, () => {
            console.log('new rule has been saved!');
        });
    });
};

export const isRegexSupported = (regex) => {

    return new Promise((resolve, reject) => {

        chrome.declarativeNetRequest.isRegexSupported(
            {
                regex: regex
            },
            (result) => {

                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                resolve(result.isSupported);
            }
        )
    });
}

//resourceType https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#type-ResourceType


