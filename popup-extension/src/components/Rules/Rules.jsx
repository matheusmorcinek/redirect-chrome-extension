import React from 'react';
import Button from '../styled-mui-components/Button';
import { hello, saveRule } from '../../main';
import styles from './Rules.module.css';
import DvrIcon from '@mui/icons-material/Dvr';
import Condition from '../Condition/Condition';
import RulesTable from '../styled-mui-components/RulesTable/RulesTable';
import ExtensionContext from '../../context/extensionContext';

export const searchType = Object.freeze({
    EQUALS: 'Equals',
    CONTAINS: 'Contains',
    REGEX: 'Matches (RegEx)'
});

const rules = [{
    id: 1647457428206,
    name: 'project 1',
    description: 'mfe dev environment',
    active: true,
    conditions: [
        {
            id: 1,
            request: {
                value: '',
                search: searchType.REGEX
            }
        }
    ]
}];

// new Date().getTime();

const Rules = () => {

    

    const [rules, setRules] = React.useState([{
        id: 1647457428206,
        name: 'project 1',
        description: 'mfe dev environment',
        active: true,
        conditions: [
            {
                id: 1,
                request: {
                    value: 'google.com',
                    search: searchType.EQUALS,
                    redirect: 'something.com'
                }
            }
        ]
    }, {
        id: 1647457428206,
        name: 'project 2',
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
    }]);


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