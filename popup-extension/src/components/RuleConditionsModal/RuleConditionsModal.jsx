import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Condition from '../Condition/Condition';
import Button from '../styled-mui-components/CustomButton/Button';
import styles from './RuleConditionsModal.module.css';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

export default function RuleConditionModal({ rule }) {

    const [open, setOpen] = React.useState(true);

    const handleClose = () => setOpen(false);

    return (
        open ?
            <Modal
                open={open}
                onClose={handleClose}
            >
                <>
                    <Box sx={style}>
                        <div className={styles['modal-header-container']}>
                            <h3>📝 Rule Conditions</h3>
                            <div className={styles['modal-header-container-buttons']}>
                                <Button variant="text" size="small" onClick={() => console.log('hello')}>➕ Add Condition</Button>
                                <Button variant="contained" size="small" onClick={() => console.log('hello')}>Save</Button>
                            </div>
                        </div>
                        {
                            rule.conditions.map(condition => (
                                <Condition>id {condition.id}</Condition>
                            ))
                        }
                        <div className={styles['modal-header-container-close-button']}>
                            <IconButton color="primary" size="small" aria-label="upload picture" component="span">
                                <CloseIcon color='action' />
                            </IconButton>
                        </div>
                    </Box>
                </>
            </Modal> : null
    );
}
