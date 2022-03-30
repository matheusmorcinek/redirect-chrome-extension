import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import React from 'react';
import RuleConditionsTable from '../RuleConditionsTable/RuleConditionsTable';

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

export default function RuleConditionsModal({ rule, updateRuleConditions }) {

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
