import React from 'react';
import styles from './Condition.module.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { searchType } from '../../constants/search.js'
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Condition = ({ ruleId, condition }) => {

    const [searchTypeValue, setSearchValueType] = React.useState(condition ? condition.request.search : 'EQUALS');

    const handleSearchTypeChange = (event) => {
        setSearchValueType(event.target.value);
    };

    return (
        <div className={styles['condition-container']}>
            <div className={styles['condition-container-row-one']}>
                <span>If request URL</span>
                <Select
                    variant='standard'
                    value={searchTypeValue}
                    onChange={handleSearchTypeChange}
                    label="Age"
                    className={styles['custom-select']}
                >
                    {
                        Object.getOwnPropertyNames(searchType).map(type =>
                            (<MenuItem key={type} value={type}>{searchType[type]}</MenuItem>)
                        )

                    }
                </Select>
                <TextField color="primary" variant="outlined" size="small" />
            </div>
            <div className={styles['condition-container-row-two']}>
                <span>Redirect to</span>
                <TextField color="primary" variant="outlined" size="small"  />
            </div>
            <div className={styles['condition-container-delete-button']}>
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <DeleteIcon color='action' />
                </IconButton>
            </div>
        </div>
    )
}

export default Condition;