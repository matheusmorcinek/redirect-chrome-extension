import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper, TableRow, TableHead, TableCell, TableBody, Table, Switch, IconButton, TablePagination } from '@mui/material';
import useRuleConditionModal from '../../../hooks/useRuleConditionModal';
import ExpandableTableRow from './ExpandableTableRow/ExpandableTableRow';
import RedirectType from '../../RedirectType/RedirectType';
import Button from '../CustomButton/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './RulesTable.module.css';
import ExtensionContext from '../../../context/extensionContext';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto'
    },
    table: {
        minWidth: 650
    }
});

const RulesTable = ({ rules }) => {

    const { updateRuleStatus, removeRule } = useContext(ExtensionContext)

    const { openRuleConditionModal } = useRuleConditionModal();

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
                                        <Switch checked={rule.active} onChange={() => onChangeRuleStatus(rule.id)} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" size="small" onClick={() => openRuleConditionModal(rule)}>{rule.conditions.length > 0 ? 'Edit Conditions' : 'Add Condition'}</Button>
                                        <IconButton onClick={() => onRemoveRule(rule.id)} color="primary" aria-label="upload picture" component="span">
                                            <DeleteIcon color='action' />
                                        </IconButton>
                                    </TableCell>
                                </ExpandableTableRow>
                            ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[1, 2, 5]}
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


//switches https://mui.com/pt/components/switches/