import React, { createContext, useState } from "react";
import { searchType } from '../constants/search';
import { addNewRule, getRulesSyncData } from '../main';

const rulesMock = [{
    id: 1647457428206,
    name: 'project 1',
    description: 'mfe dev environment',
    active: true,
    conditions: [
        {
            id: 1,
            request: {
                value: 'google.com',
                search: 'EQUALS',
                redirect: 'something.com'
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
            id: 1,
            request: {
                value: 'facebook.com',
                search: 'REGEX',
                redirect: 'example.com'
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

    React.useEffect(() => {
        console.log('Extension Context Provider did mount!')
        getRulesSyncData().then(rules => {
            console.log('chegou')
            console.log('rules', rules)
            setRules(rules);
        });
    }, []);

    const addRule = (name, description) => {

        console.log(' ')
        console.log('inside app context')

        const rule = {
            id: new Date().getTime(),
            name: name.trim(),
            description: description.trim(),
            active: false,
            conditions: [
                {
                    id: 1,
                    request: {
                        value: 'facebook.com',
                        search: searchType.REGEX,
                        redirect: 'example.com'
                    }
                }
            ]
        };

        addNewRule(rule);
        setRules([...rules, rule]);
    };

    return (
        <ExtensionContext.Provider
            value={{
                rules,
                setRules,
                addRule
            }}
        >
            {children}
        </ExtensionContext.Provider>
    );
};
export { ExtensionContextProvider };
export default ExtensionContext;