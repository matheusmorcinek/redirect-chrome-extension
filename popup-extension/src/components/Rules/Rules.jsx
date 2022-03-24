import React, { useContext } from 'react';
import ExtensionContext from '../../context/extensionContext';
import useRuleModal from '../../hooks/useRuleModal';
import Button from '../styled-mui-components/CustomButton/Button';
import RulesTable from '../styled-mui-components/RulesTable/RulesTable';
import styles from './Rules.module.css';

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
