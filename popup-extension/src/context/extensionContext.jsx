import React, { createContext, useState } from "react";
import { searchType } from '../constants/search';

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
}, {
    id: 164745742822062,
    name: 'project 3',
    description: 'mfe stage environment',
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

    const [rules, setRules] = useState(INITIAL_RULES_STATE);

    return (
        <ExtensionContext.Provider
            value={{
                rules,
                setRules,
            }}
        >
            {children}
        </ExtensionContext.Provider>
    );
};
export { ExtensionContextProvider };
export default ExtensionContext;