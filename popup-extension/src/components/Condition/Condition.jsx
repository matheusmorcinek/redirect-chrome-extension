import React from 'react';
import styles from './Condition.module.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { searchType } from '../../constants/search.js'

const Condition = ({ ruleId, condition }) => {

    const [searchTypeValue, setSearchValueType] = React.useState(condition ? condition.request.search : 'EQUALS');

    const handleSearchTypeChange = (event) => {
        setSearchValueType(event.target.value);
    };

    console.log('Condition ', Object.getOwnPropertyNames(searchType))

    return (
        <div className={styles['condition-container']}>
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
            <TextField color="secondary" variant="outlined" />
            <span>Redirect to</span>
            <TextField color="secondary" variant="outlined" />
        </div>
    )
}

export default Condition;