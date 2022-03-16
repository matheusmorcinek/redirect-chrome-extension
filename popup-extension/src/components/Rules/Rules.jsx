import React, { useContext } from 'react';
import Button from '../styled-mui-components/Button';
import { hello, saveRule } from '../../main';
import styles from './Rules.module.css';
import DvrIcon from '@mui/icons-material/Dvr';
import Condition from '../Condition/Condition';
import RulesTable from '../styled-mui-components/RulesTable/RulesTable';
import ExtensionContext from '../../context/extensionContext';
import { searchType } from '../../constants/search.js';

const Rules = () => {

    const { rules } = useContext(ExtensionContext);

    return (
        <div className={styles['rules-container']}>
            <div className={styles['rules-header']}>
                <h3><DvrIcon /> HTTP Rules</h3>
                <Button variant="contained" onClick={() => console.log('hello')}>Add New Rule</Button>
            </div>
            <RulesTable rules={rules} />
        </div>
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