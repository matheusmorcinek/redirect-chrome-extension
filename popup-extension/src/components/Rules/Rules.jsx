import React, { useContext, useEffect } from 'react';
import ExtensionContext from '../../context/extensionContext';
import Button from '../styled-mui-components/CustomButton/Button';
import RulesTable from '../styled-mui-components/RulesTable/RulesTable';
import styles from './Rules.module.css';
import useRuleModal from '../../hooks/useRuleModal'

const Rules = () => {

    const { rules } = useContext(ExtensionContext);

    const { openRuleModal } = useRuleModal();

    return (
        <div className={styles['rules-container']}>
            <div className={styles['rules-header']}>
                <h3>💻 HTTP Rules</h3>
                <Button variant="contained" onClick={() => openRuleModal()}>Add New Rule</Button>
            </div>
            <RulesTable rules={rules} />
        </div >
    )
}

export default Rules;


// return (
//     rules.length > 0 ? (
//         <div className={styles['rules-container']} >
//             <h3><DvrIcon /> HTTP Rules</h3>
//             <div className={styles['rules-inner-container']}>
//                 {rules.map(rule => (
//                     <div key={rule.id}>
//                         <h3>{rule.name}</h3>
//                         <div className={styles['conditions-container']}>
//                             <h4>Conditions</h4>
//                             {
//                                 rule.conditions.map(condition => (<Condition ruleId={rule.id} condition={condition} />))
//                             }
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     ) : null
// )