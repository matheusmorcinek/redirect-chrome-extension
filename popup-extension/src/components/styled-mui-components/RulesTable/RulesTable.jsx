import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper, TableRow, TableHead, TableCell, TableBody, Table, Switch, IconButton } from '@mui/material';
import useRuleConditionModal from '../../../hooks/useRuleConditionModal';
import ExpandableTableRow from './ExpandableTableRow/ExpandableTableRow';
import RedirectType from '../../RedirectType/RedirectType';
import Button from '../CustomButton/Button';
import DeleteIcon from '@mui/icons-material/Delete';
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

function createData(name, calories, fat, carbs, protein, detail) {
    return { name, calories, fat, carbs, protein, detail };
}

const rows = [
    createData(
        'Frozen yoghurt',
        159,
        6.0,
        24,
        4.0,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    ),
    createData(
        'Ice cream sandwich',
        237,
        9.0,
        37,
        4.3,
        'Maecenas rutrum urna vel lacus viverra, id ultrices dui rutrum'
    ),
    createData(
        'Eclair',
        262,
        16.0,
        24,
        6.0,
        'Morbi congue gravida nunc, eu cursus felis vulputate id'
    ),
    createData(
        'Cupcake',
        305,
        3.7,
        67,
        4.3,
        'Vestibulum efficitur, ipsum consectetur finibus maximus, ligula dolor vehicula ex, sed viverra nulla mauris id purus'
    ),
    createData(
        'Gingerbread',
        356,
        16.0,
        49,
        3.9,
        ' Suspendisse vehicula eu libero eget viverra'
    )
];

const RulesTable = ({ rules }) => {

    const { openRuleConditionModal } = useRuleConditionModal();

    const { addRule } = React.useContext(ExtensionContext);

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
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
                    {rules.map((rule) => (
                        <ExpandableTableRow
                            key={rule.id}
                            expandComponent={<TableCell colSpan="5">//CONDITIONS LIST</TableCell>}
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
                                <Button variant="contained" size="small" onClick={() => addRule('test', 'desc')}>Add Condition</Button>
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <DeleteIcon color='action' />
                                </IconButton>
                            </TableCell>
                        </ExpandableTableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default RulesTable;


//switches https://mui.com/pt/components/switches/