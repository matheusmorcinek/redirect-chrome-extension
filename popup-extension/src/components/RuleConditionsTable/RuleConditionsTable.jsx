import React from "react";
import { makeStyles } from '@material-ui/styles';
import { Paper, Input, TableRow, TableHead, TableCell, TableBody, Table, TablePagination, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import UndoIcon from '@mui/icons-material/Undo';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Condition from "../Condition/Condition";
import Button from '../styled-mui-components/CustomButton/Button';
import styles from './RuleConditionsTable.module.css';


const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto'
    },
    table: {
        width: 550
    },
    selectTableCell: {
        width: 80
    }
});

const createData = (condition, isEditMode = false) => ({
    condition,
    isEditMode: isEditMode
});

const CustomTableCell = ({ row, onChange }) => {

    const { isEditMode, condition } = row;

    return (
        <TableCell>
            <Condition
                condition={condition}
                isEditMode={isEditMode}
                onChange={onChange}
            />
        </TableCell>
    );
};

const RuleConditionsTable = ({ rule, updateRuleConditions, onSaveConditions }) => {

    const { conditions } = rule;

    const [updatedConditions, setUpdatedConditions] = React.useState([]);
    const [editCount, setEditCount] = React.useState(0);

    const [rows, setRows] = React.useState(conditions.length > 0 ? conditions.map(condition => createData(condition)) : []);

    const classes = useStyles();

    const onToggleEditMode = id => {

        setRows(state => {
            return rows.map(row => {
                if (row.condition.id === id) {

                    return { ...row, isEditMode: !row.isEditMode };
                }
                return row;
            });
        });
    };

    const onChange = (updatedCondition) => {

        const tempConditions = updatedConditions.filter(condition => condition.id != updatedCondition.id);
        tempConditions.push(updatedCondition);
        setUpdatedConditions(tempConditions);
    };

    const onSave = () => {
        updateRuleConditions(rule.id, updatedConditions)
        onSaveConditions();
    };

    const onDelete = id => {
        setEditCount(editCount - 1);
        onToggleEditMode(id);
    };

    const onEdit = id => {
        setEditCount(editCount + 1);
        onToggleEditMode(id);
    };

    const onRevert = id => {
        setEditCount(editCount - 1);

        const row = rows.filter(row => row.condition.id === id)[0];

        const tempConditions = updatedConditions.filter(condition => condition.id != id);
        setUpdatedConditions(tempConditions);

        if (row.condition.request.value === '' && row.condition.request.redirect === '') {
            const updatedRows = rows.filter(row => row.condition.id != id);
            setRows(updatedRows);

            return;
        }

        onToggleEditMode(id);
    };

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAddNewCondition = () => {

        const newCondition = {
            id: new Date().getTime(),
            request: {
                value: '',
                search: 'EQUALS',
                redirect: ''
            }
        };

        setEditCount(editCount + 1);
        setUpdatedConditions([...updatedConditions, newCondition]);
        setRows([...rows, createData(newCondition, true)]);
    }

    return (
        <>
            <div className={styles['modal-header-container']}>
                <h3>📝 Rule Conditions</h3>
                <div className={styles['modal-header-container-buttons']}>
                    <Button variant="text" size="small" onClick={() => handleAddNewCondition()}>➕ Add Condition</Button>
                    <Button variant="contained" size="small" onClick={() => onSave()} disabled={editCount === 0}>Save All</Button>
                </div>
            </div>

            <Paper className={classes.root}>
                <Table size={'small'} className={classes.table} aria-label="caption table">
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(row => (
                                <TableRow key={row.condition.id}>
                                    <TableCell className={classes.selectTableCell}>
                                        {row.isEditMode ? (
                                            <>
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => onDelete(row.condition.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="revert"
                                                    onClick={() => onRevert(row.condition.id)}
                                                >
                                                    <UndoIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => onEdit(row.condition.id)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <CustomTableCell {...{ row, onChange }} />
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Paper>
        </>

    );
}

export default RuleConditionsTable;