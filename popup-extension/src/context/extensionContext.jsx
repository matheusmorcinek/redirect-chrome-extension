import React, { createContext, useState } from "react";
import { searchType } from '../constants/search';
import { addNewRule, getRulesSyncData, updateChromeStorageRules } from '../main';

const rulesMock = [{
    id: 1647457428206,
    name: 'project 1',
    description: 'mfe dev environment',
    active: true,
    conditions: [
        {
            id: 101,
            request: {
                value: 'google.com',
                search: 'REGEX',
                redirect: 'something.com'
            }
        },
        {
            id: 102,
            request: {
                value: 'facebook.com',
                search: 'EQUALS',
                redirect: 'ban.com'
            }
        },
        {
            id: 104,
            request: {
                value: 'linkedin',
                search: 'EQUALS',
                redirect: 'orkut.com'
            }
        }
    ]
}, {
    id: 16474574282016,
    name: 'project 2',
    description: 'mfe stage environment',
    active: false,
    conditions: [
        {
            id: 101,
            request: {
                value: 'google.com',
                search: 'EQUALS',
                redirect: 'something.com'
            }
        },
        {
            id: 102,
            request: {
                value: 'facebook.com',
                search: 'EQUALS',
                redirect: 'ban.com'
            }
        },
        {
            id: 104,
            request: {
                value: 'linkedin',
                search: 'EQUALS',
                redirect: 'orkut.com'
            }
        },
        {
            id: 107,
            request: {
                value: 'site',
                search: 'EQUALS',
                redirect: 'site.com'
            }
        },
        {
            id: 108,
            request: {
                value: 'something',
                search: 'EQUALS',
                redirect: 'somesite.com'
            }
        }
    ]
}];

//Valor default do contexto
const INITIAL_RULES_STATE = [...rulesMock];

//criando nosso contexto UserContext
const ExtensionContext = createContext();

/**
 * Função que irá conter o estado e função que irá alterar o estado 'setState'
 * quer irá prover o contexto para os componentes filhos da árvore
 */
const ExtensionContextProvider = ({ children }) => {

    //TODO criar uma browser action no background que monitora a lista de urls que foram redirecionadas,
    //se pelo menos uma estiver, trocar o icone para aviso visual da extensao
    //https://stackoverflow.com/questions/47310292/chrome-extension-dynamically-change-icon-without-clicking
    //ver codigo que monitora o google no background


    //https://sunnyzhou-1024.github.io/chrome-extension-docs/extensions/declarativeNetRequest.html#method-updateDynamicRules
    const [rules, setRules] = useState([]);
    // const [rules, setRules] = useState(INITIAL_RULES_STATE);

    React.useEffect(() => {
        console.log('Extension Context Provider did mount!')
        getRulesSyncData().then(rules => {
            console.log('chegou')
            console.log('rules', rules)
            setRules(rules);
        });
    }, []);

    // const rule = {
    //     id: new Date().getTime(),
    //     name: name.trim(),
    //     description: description.trim(),
    //     active: false,
    //     conditions: [
    //         {
    //             id: 101,
    //             request: {
    //                 value: 'google.com',
    //                 search: 'EQUALS',
    //                 redirect: 'something.com'
    //             }
    //         },
    //         {
    //             id: 102,
    //             request: {
    //                 value: 'facebook.com',
    //                 search: 'EQUALS',
    //                 redirect: 'ban.com'
    //             }
    //         },
    //         {
    //             id: 104,
    //             request: {
    //                 value: 'linkedin',
    //                 search: 'EQUALS',
    //                 redirect: 'orkut.com'
    //             }
    //         },
    //         {
    //             id: 107,
    //             request: {
    //                 value: 'site',
    //                 search: 'EQUALS',
    //                 redirect: 'site.com'
    //             }
    //         },
    //         {
    //             id: 108,
    //             request: {
    //                 value: 'something',
    //                 search: 'EQUALS',
    //                 redirect: 'somesite.com'
    //             }
    //         }
    //     ]
    // };

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