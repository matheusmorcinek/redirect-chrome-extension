import React, { createContext, useState } from "react";
import { getRulesSyncData, updateChromeStorageRules } from '../main';

const ExtensionContext = createContext();

const ExtensionContextProvider = ({ children }) => {

    const [rules, setRules] = useState([]);

    React.useEffect(() => {
        getRulesSyncData().then(rules => {
            console.log('chegou')
            console.log('rules', rules)
            setRules(rules);
        });
    }, []);

    const addRule = (name, description) => {

        const rule = {
            id: new Date().getTime(),
            name: name.trim(),
            description: description.trim(),
            active: false,
            enableNotifications: true,
            conditions: []
        };

        setRules([...rules, rule]);
        updateChromeStorageRules([...rules, rule]);
    };

    const updateRuleConditions = (ruleId, updatedConditions, roRemoveConditions = []) => {

        const updatedRules = rules.map(rule => {
            if (rule.id === ruleId) {

                let tempConditions;
                if (roRemoveConditions.length > 0) {

                    tempConditions = rule.conditions.filter(condition => !updatedConditions.some(updatedCondition => updatedCondition.id === condition.id) &&
                        !roRemoveConditions.some(toRemoveCondition => toRemoveCondition.id === condition.id)
                    );
                } else {

                    tempConditions = rule.conditions.filter(condition => !updatedConditions.some(updatedCondition => updatedCondition.id === condition.id));
                }

                const updatedRule = {
                    ...rule,
                    conditions: [...tempConditions, ...updatedConditions]
                }

                if (updatedRule.conditions.length === 0) {
                    updatedRule.active = false;
                }

                return updatedRule;
            }
            return rule;
        });


        setRules(updatedRules.sort((a, b) => (a.id > b.id) ? 1 : -1));
        updateChromeStorageRules(updatedRules);
    }

    const updateRuleStatus = (ruleId) => {

        const updatedRules = rules.map(rule => {
            if (rule.id === ruleId) {

                const updatedRule = {
                    ...rule,
                    active: !rule.active
                }

                return updatedRule;
            }
            return rule;
        });

        setRules(updatedRules.sort((a, b) => (a.id > b.id) ? 1 : -1));
        updateChromeStorageRules(updatedRules);
    }

    const removeRule = (ruleId) => {

        const updatedRules = rules.filter(rule => rule.id !== ruleId);
        setRules(updatedRules.sort((a, b) => (a.id > b.id) ? 1 : -1));
        updateChromeStorageRules(updatedRules);
    }

    return (
        <ExtensionContext.Provider
            value={{
                rules,
                setRules,
                addRule,
                updateRuleConditions,
                updateRuleStatus,
                removeRule
            }}
        >
            {children}
        </ExtensionContext.Provider>
    );
};
export { ExtensionContextProvider };
export default ExtensionContext;