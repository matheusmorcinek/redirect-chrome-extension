import React from "react";
import { makeStyles } from '@material-ui/styles';
import { Paper, Input, TableRow, TableHead, TableCell, TableBody, Table, TablePagination, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import UndoIcon from '@mui/icons-material/Undo';
import EditIcon from '@mui/icons-material/Edit';


const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto'
    },
    table: {
        width: 550
    },
    selectTableCell: {
        width: 60
    },
    tableCell: {
        width: 130,
        height: 40
    },
    input: {
        width: 130,
        height: 40
    }
});

const createData = (condition) => ({
    condition,
    isEditMode: false
});

const CustomTableCell = ({ row, onChange }) => {

    const classes = useStyles();
    const { isEditMode } = row;

    // return (
    //     <TableCell align="left" className={classes.tableCell}>
    //         {isEditMode ? (
    //             <Input
    //                 value={row[name]}
    //                 name={name}
    //                 onChange={e => onChange(e, row)}
    //                 className={classes.input}
    //             />
    //         ) : (
    //             row[name]
    //         )}
    //     </TableCell>
    // );
    return (
        <TableCell align="left" className={classes.tableCell}>
            {isEditMode ? (
                // <Input
                //     value={row[name]}
                //     name={name}
                //     onChange={e => onChange(e, row)}
                //     className={classes.input}
                // />
                <span>edit mode, row.condition.request.value</span>
            ) : (
                <span>text mode, row.condition.request.value</span>
            )}
        </TableCell>
    );
};

const mockConditions = [
    {
        id: 1,
        request: {
            value: 'google.com',
            search: 'EQUALS',
            redirect: 'something.com'
        }
    },
    {
        id: 2,
        request: {
            value: 'linkedin',
            search: 'CONTAINS',
            redirect: 'blocked.com'
        }
    }
];

const RuleConditionsTable = ({ conditions = mockConditions }) => {

    React.useEffect(() => {

        console.log(' ')
        console.log(' @ RuleConditionsTable did render')
        console.log(' conditions ', conditions)
        console.log(' rows ', rows)

        conditions.forEach(condition => console.log(createData(condition)));
    });

    const [rows, setRows] = React.useState(conditions.length > 0 ? conditions.map(condition => createData(condition)) : []);

    const [previous, setPrevious] = React.useState({});
    const classes = useStyles();

    const onToggleEditMode = id => {

        console.log("onToggleEditMode id", id)

        setRows(state => {
            return rows.map(row => {
                if (row.condition.id === id) {
                    return { ...row, isEditMode: !row.isEditMode };
                }
                return row;
            });
        });
    };

    const onChange = (e, row) => {

        console.log(' onChange row', row)

        // if (!previous[row.id]) {
        //     setPrevious(state => ({ ...state, [row.id]: row }));
        // }
        // const value = e.target.value;
        // const name = e.target.name;
        // const { id } = row.condition;
        // const newRows = rows.map(row => {
        //     if (row.condition.id === id) {
        //         return { ...row, [name]: value };
        //     }
        //     return row;
        // });
        // setRows(newRows);
    };

    const onRevert = id => {

        console.log(' onRevert id', id)

        // const newRows = rows.map(row => {
        //     if (row.id === id) {
        //         return previous[id] ? previous[id] : row;
        //     }
        //     return row;
        // });
        // setRows(newRows);
        // setPrevious(state => {
        //     delete state[id];
        //     return state;
        // });
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

    return (
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
                                                aria-label="done"
                                                onClick={() => onToggleEditMode(row.condition.id)}
                                            >
                                                <DoneIcon />
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
                                            onClick={() => onToggleEditMode(row.condition.id)}
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
    );
}

export default RuleConditionsTable;