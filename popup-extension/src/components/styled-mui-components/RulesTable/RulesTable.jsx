import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper, TableRow, TableHead, TableCell, TableBody, Table, Switch, IconButton, TablePagination } from '@mui/material';
import useRuleConditionModal from '../../../hooks/useRuleConditionModal';
import ExpandableTableRow from './ExpandableTableRow/ExpandableTableRow';
import RedirectType from '../../RedirectType/RedirectType';
import Button from '../CustomButton/Button';
import DeleteIcon from '@mui/icons-material/Delete';

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

    React.useEffect(() => {
        console.log(' ')
        console.log("@ RulesTable did render")
        console.log('rules ', rules)
    })

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
                                    key={rule.id}
                                    expandComponent={
                                        <TableCell colSpan="5">
                                            {rule.conditions.map(condition => (<span key={condition.id}>{condition.request.search} {condition.request.value} </span>))}
                                        </TableCell>}
                                >
                                    <TableCell component="th" scope="row">
                                        <div>
                                            <h3>{rule.name}</h3>
                                            <h4>{rule.description}</h4>
                                        </div>
                                    </TableCell>
                                    <TableCell align="right"><RedirectType /></TableCell>
                                    <TableCell align="right">
                                        <Switch checked={rule.active} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" size="small" onClick={() => openRuleConditionModal(rule)}>Add Condition</Button>
                                        <IconButton color="primary" aria-label="upload picture" component="span">
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