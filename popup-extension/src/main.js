/*global chrome*/

export const hello = () => {
    alert('Hello from main script inside react app')
}

// export const saveRule = () => {
//     const key = 'rule';
//     const value = { value: 'some redirect value' };

//     chrome.storage.sync.set({ "rule": value }, () => {
//         alert('Stored name: ' + value.value);
//     });
// }

// chrome.storage.sync.remove("rules", () => {
//     console.log('rules has been removed');
// })

// export const getRules = () => {
//     return chrome.storage.sync.get(["rules"], (data) => {

//         console.log('get rules')

//         const { rules } = data;
//         return rules;
//     });
// }

export const getRulesSyncData = () => {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(["rules"], (data) => {
            // Pass any observed errors down the promise chain.
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

            // Pass the data retrieved from storage down the promise chain.
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

    console.log(' ')
    console.log('inside main script 2')

    chrome.storage.sync.get(["rules"], (data) => {

        console.log('get rules on the main, rules: ', data)

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

    // chrome.declarativeNetRequest.updateDynamicRules(
    //     {
    //         addRules: [{
    //             "id": 1,
    //             "priority": 1,
    //             "action": { "type": "block" },
    //             "condition": { "urlFilter": "googletest.com", "resourceTypes": ["main_frame"] }
    //         }
    //         ]
    //     },
    // )
    // chrome.declarativeNetRequest.updateDynamicRules(
    //     {
    //         addRules: [{
    //             "id": 1,
    //             "priority": 1,
    //             "action": { "type": "block" },
    //             "condition": { "urlFilter": "googletest.com", "resourceTypes": ["main_frame"] }
    //         }
    //         ]
    //     },
    // )

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


