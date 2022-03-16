/*global chrome*/

export const hello = () => {
    alert('Hello from main script inside react app')
}

export const saveRule = () => {
    const key = 'rule';
    const value = { value: 'some redirect value' };

    chrome.storage.sync.set({ "rule": value }, () => {
        alert('Stored name: ' + value.value);
    });
}