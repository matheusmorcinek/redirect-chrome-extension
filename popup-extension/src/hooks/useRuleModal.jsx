import React from 'react';
import ReactDOM from 'react-dom';
import RuleModal from '../components/RuleModal/RuleModal';
import ExtensionContext from '../context/extensionContext';

const useRuleModal = () => {

    const { addRule } = React.useContext(ExtensionContext);

    const openRuleModal = () => {
        ReactDOM.render(
            ReactDOM.createPortal(
                <RuleModal addRule={addRule} />,
                document.querySelector("#extension-app")),
            document.createElement('div')
        );
    };

    return { openRuleModal };
};

export default useRuleModal;
