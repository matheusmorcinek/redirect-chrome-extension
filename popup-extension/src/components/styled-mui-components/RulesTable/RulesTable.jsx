import { makeStyles } from '@material-ui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Paper, Switch, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useContext } from 'react';
import ExtensionContext from '../../../context/extensionContext';
import useRuleConditionsModal from '../../../hooks/useRuleConditionsModal';
import RedirectType from '../../RedirectType/RedirectType';
import Button from '../CustomButton/Button';
import ExpandableTableRow from './ExpandableTableRow/ExpandableTableRow';
import styles from './RulesTable.module.css';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
        marginBottom: '0.5rem'
    },
    table: {
        minWidth: 650
    }
});

const RulesTable = ({ rules }) => {

    const { updateRuleStatus, removeRule, updateRuleNotifications } = useContext(ExtensionContext)

    const { openRuleConditionsModal } = useRuleConditionsModal();

    const classes = useStyles();

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onChangeRuleStatus = (ruleId) => {
        updateRuleStatus(ruleId)
    }

    const onChangeRuleNotifications = (ruleId) => {
        updateRuleNotifications(ruleId)
    }

    const onRemoveRule = (ruleId) => {
        removeRule(ruleId)
    }

    return (
        rules.length > 0 ? <Paper className={classes.root}>
            <Table size={'small'} className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox" />
                        <TableCell>Rule details</TableCell>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((rule) => (
                                <ExpandableTableRow
                                    showExpandButton={rule.conditions.length > 0}
                                    className={'expandable-row'}
                                    key={rule.id}
                                    expandComponent={
                                        <div className={`${styles['conditions']} ${styles['scrollbar']}`} >
                                            {rule.conditions.sort((a, b) => (a.id > b.id) ? 1 : -1).map(condition => (<span key={condition.id}>If request URL <span className={styles['highlight']}>{condition.request.search}</span> <span className={styles['condition-value']}>{condition.request.value}</span> Redirect to <span className={styles['condition-value']}>{condition.request.redirect}</span></span>))}
                                        </div>
                                    }
                                >
                                    <TableCell component="th" scope="row">
                                        <div>
                                            <h3>{rule.name}</h3>
                                            <h4>{rule.description}</h4>
                                        </div>
                                    </TableCell>
                                    <TableCell align="right"><RedirectType /></TableCell>
                                    <TableCell align="right">
                                        <Switch checked={rule.active} onChange={() => onChangeRuleStatus(rule.id)} disabled={rule.conditions.length === 0} />
                                    </TableCell>
                                    <TableCell align="right" className={styles['rule-actions-cell']}>
                                        <div className={styles['rule-actions-cell-container']}>
                                            <Button variant="contained" size="small" onClick={() => openRuleConditionsModal(rule)}>{rule.conditions.length > 0 ? 'Edit Conditions' : 'Add Condition'}</Button>
                                            <div className={styles['rule-actions-cell-switch-notifications-container']}>
                                                <Switch size="small" checked={rule.enableNotifications} onChange={() => onChangeRuleNotifications(rule.id)} disabled={rule.conditions.length === 0} />
                                                <span>Notifications</span>
                                            </div>
                                            <IconButton onClick={() => onRemoveRule(rule.id)} color="primary" aria-label="upload picture" component="span">
                                                <DeleteIcon color='action' />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </ExpandableTableRow>
                            ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[1, 3, 5]}
                component="div"
                count={rules.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper> : <h3>Add a new rule to start using the extension.</h3>
    );
}

export default RulesTable;
