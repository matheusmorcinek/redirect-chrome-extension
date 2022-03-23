import React from 'react';
import styles from './Condition.module.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { searchType } from '../../constants/search.js'

const Condition = ({ condition, isEditMode, onChange, removed }) => {

    const [tempCondition, setTempCondition] = React.useState(condition);

    const handleSearchTypeChange = (event) => {

        const searchType = event.target.value;

        const updatedTempCondition = {
            ...tempCondition,
            request: {
                ...tempCondition.request,
                search: searchType
            }
        };

        setTempCondition(updatedTempCondition);
        onChange(updatedTempCondition);
    };

    const handleSearchValueChange = (event) => {

        const value = event.target.value;

        const updatedTempCondition = {
            ...tempCondition,
            request: {
                ...tempCondition.request,
                value: value
            }
        };

        setTempCondition(updatedTempCondition);
        onChange(updatedTempCondition);
    };

    const handleSearchRedirectChange = (event) => {

        const redirect = event.target.value;

        const updatedTempCondition = {
            ...tempCondition,
            request: {
                ...tempCondition.request,
                redirect: redirect
            }
        };

        setTempCondition(updatedTempCondition);
        onChange(updatedTempCondition);
    };

    return (
        isEditMode ?
            <div className={styles['condition-container']}>
                <div className={styles['condition-container-row-one']}>
                    <span>If request URL</span>
                    <Select
                        variant='standard'
                        value={tempCondition.request.search}
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
                    <TextField
                        color="primary"
                        variant="outlined"
                        size="small"
                        value={tempCondition.request.value}
                        onChange={(event) => handleSearchValueChange(event)}
                    />
                </div>
                <div className={styles['condition-container-row-two']}>
                    <span>Redirect to</span>
                    <TextField
                        color="primary"
                        variant="outlined"
                        size="small"
                        value={tempCondition.request.redirect}
                        onChange={(event) => handleSearchRedirectChange(event)}
                    />
                </div>
            </div>
            :
            <div className={styles['condition-container']}>
                <span className={removed ? styles['removed'] : ''}><strong>If request URL</strong> <span className={styles['highlight']}>{condition.request.search}</span> {condition.request.value} <strong>Redirect to</strong> {condition.request.redirect}</span>
            </div >
    )
}

export default Condition;