import React from 'react';
import { IconButton, TableRow, TableCell } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import styles from './ExpandableTableRow.module.css';

const ExpandableTableRow = ({ children, expandComponent, ...otherProps }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <>
            <TableRow {...otherProps}>
                <TableCell padding="checkbox">
                    <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {children}
            </TableRow>
            {isExpanded && (
                <TableRow className={styles['expanded-content-row']}>
                    <TableCell padding="checkbox" />
                    <TableCell className={styles['expanded-content-cell']} colSpan="4">
                        {expandComponent}
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default ExpandableTableRow;