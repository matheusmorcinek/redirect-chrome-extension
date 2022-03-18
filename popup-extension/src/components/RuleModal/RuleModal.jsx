import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import React from 'react';
import Button from '../styled-mui-components/CustomButton/Button';
import styles from './RuleModal.module.css';

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

const RuleModal = ({ addRule }) => {

    const [ruleName, setRuleName] = React.useState('');
    const [ruleDescription, setRuleDescription] = React.useState('');

    const handleRuleNameTextChange = (event) => {
        setRuleName(event.target.value);
    };

    const handleRuleDescriptionTextChange = (event) => {
        setRuleDescription(event.target.value);
    };

    const handleSaveButtonClick = () => {
        addRule(ruleName, ruleDescription);
        setOpen(false);
    }

    const [open, setOpen] = React.useState(true);

    const handleClose = () => setOpen(false);

    return (
        open ?
            <Modal
                open={open}
                onClose={handleClose}
                disablePortal={true}
            >
                <>
                    <Box sx={style}>
                        <div className={styles['modal-header-container']}>
                            <h3>📜 Add New Rule </h3>
                            <div className={styles['modal-header-container-buttons']}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleSaveButtonClick()}
                                    disabled={!ruleName || !ruleDescription}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                        <div>
                            <span>Rule Name:</span>
                            <TextField
                                color="primary"
                                variant="outlined"
                                size="small"
                                value={ruleName}
                                onChange={handleRuleNameTextChange}
                            />
                        </div>
                        <div>
                            <span>Description:</span>
                            <TextField
                                color="primary"
                                variant="outlined"
                                size="small"
                                value={ruleDescription}
                                onChange={handleRuleDescriptionTextChange}
                            />
                        </div>
                        <div className={styles['modal-header-container-close-button']}>
                            <IconButton color="primary" size="small" aria-label="upload picture" component="span">
                                <CloseIcon color='action' />
                            </IconButton>
                        </div>
                    </Box>
                </>
            </Modal> : null
    );
};

export default RuleModal;
