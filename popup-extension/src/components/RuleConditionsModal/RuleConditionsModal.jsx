import React from 'react';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import RuleConditionsTable from '../RuleConditionsTable/RuleConditionsTable';
// import Condition from '../Condition/Condition';
import Button from '../styled-mui-components/CustomButton/Button';
import styles from './RuleConditionsModal.module.css';
// import { IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: '#fff',
    border: '1px solid #191414',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
};




export default function RuleConditionModal({ rule, updateRuleConditions }) {

    React.useEffect(() => {
        console.log('RuleConditionModal did render')
        console.log('rule ', rule)
    })

    const [open, setOpen] = React.useState(true);

    const handleClose = () => setOpen(false);

    const onSave = () => {
        setOpen(false)
    };

    return (
        open ?
            <Modal
                open={open}
                onClose={handleClose}
            >
                <>
                    <Box sx={style}>
                        <RuleConditionsTable
                            rule={rule}
                            updateRuleConditions={updateRuleConditions}
                            onSaveConditions={onSave}
                        />
                    </Box>
                </>
            </Modal> : null
    );
}
