import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Condition from '../Condition/Condition';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: '#191414',
    color: '#fff',
    border: '1px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
};

export default function RuleConditionModal({ rule }) {

    const [open, setOpen] = React.useState(true);

    const handleClose = () => setOpen(false);

    return (
        open ?
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <h3>📝 Rule Conditions</h3>
                    {
                        rule.conditions.map(condition => (
                            <Condition>id {condition.id}</Condition>
                        ))
                    }
                </Box>
            </Modal> : null
    );
}
