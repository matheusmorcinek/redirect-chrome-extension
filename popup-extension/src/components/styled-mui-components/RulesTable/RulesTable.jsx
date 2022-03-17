import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Button from '../../../components/styled-mui-components/Button';
import RedirectType from '../../RedirectType/RedirectType';
import useRuleConditionModal from '../../../hooks/useRuleConditionModal';

// const TableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//         color: theme.palette.common.white,
//         border: "solid 1px #fff"
//     },
//     [`&.${tableCellClasses.body}`]: {
//         fontSize: 14,
//     },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     backgroundColor: "#1c2128",
//     color: "#fff"
// }));

const RulesTable = ({ rules }) => {

    const { openRuleConditionModal } = useRuleConditionModal();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Rule details</TableCell>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rules.map((rule) => (
                        <TableRow key={rule.id}>
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
                                <Button variant="contained" onClick={() => openRuleConditionModal(rule)}>Add Condition</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RulesTable;


//switches https://mui.com/pt/components/switches/