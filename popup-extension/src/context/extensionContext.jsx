import React, { createContext, useState } from "react";

//Valor default do contexto
const DEFAULT_VALUE = {
    state: {
        name: "",
        lastName: "",
        email: "",
    },
    setState: () => { }, //função de inicialização
};

//criando nosso contexto UserContext
const ExtensionContext = createContext(DEFAULT_VALUE);

/**
 * Função que irá conter o estado e função que irá alterar o estado 'setState'
 * quer irá prover o contexto para os componentes filhos da árvore
 */
const ExtensionContextProvider = ({ children }) => {

    const [state, setState] = useState(DEFAULT_VALUE.state);

    return (
        <ExtensionContext.Provider
            value={{
                state,
                setState,
            }}
        >
            {children}
        </ExtensionContext.Provider>
    );
};
export { ExtensionContextProvider };
export default ExtensionContext;