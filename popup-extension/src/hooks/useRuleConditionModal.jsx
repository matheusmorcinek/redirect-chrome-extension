import React from 'react';
import ReactDOM from 'react-dom';
import RuleConditionModal from '../components/RuleConditionsModal/RuleConditionsModal';

const useRuleConditionModal = () => {

    const openRuleConditionModal = (rule) => {
        ReactDOM.render(
            ReactDOM.createPortal(
                <RuleConditionModal rule={rule} />,
                document.querySelector("#extension-app")),
            document.createElement('div')
        );
    };

    return { openRuleConditionModal };
};

export default useRuleConditionModal;
