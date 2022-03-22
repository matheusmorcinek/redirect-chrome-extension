import React from 'react';
import ReactDOM from 'react-dom';
import RuleConditionModal from '../components/RuleConditionsModal/RuleConditionsModal';
import ExtensionContext from '../context/extensionContext';

const useRuleConditionModal = () => {

    const { updateRuleConditions } = React.useContext(ExtensionContext);

    const openRuleConditionModal = (rule) => {
        ReactDOM.render(
            ReactDOM.createPortal(
                <RuleConditionModal
                    rule={rule}
                    updateRuleConditions={updateRuleConditions}
                />,
                document.querySelector("#extension-app")),
            document.createElement('div')
        );
    };

    return { openRuleConditionModal };
};

export default useRuleConditionModal;
