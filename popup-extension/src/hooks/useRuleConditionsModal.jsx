import React from 'react';
import ReactDOM from 'react-dom';
import RuleConditionsModal from '../components/RuleConditionsModal/RuleConditionsModal';
import ExtensionContext from '../context/extensionContext';

const useRuleConditionsModal = () => {

    const { updateRuleConditions } = React.useContext(ExtensionContext);

    const openRuleConditionsModal = (rule) => {
        ReactDOM.render(
            ReactDOM.createPortal(
                <RuleConditionsModal
                    rule={rule}
                    updateRuleConditions={updateRuleConditions}
                />,
                document.querySelector("#extension-app")),
            document.createElement('div')
        );
    };

    return { openRuleConditionsModal };
};

export default useRuleConditionsModal;
