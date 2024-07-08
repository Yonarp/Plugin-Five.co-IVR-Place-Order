import { Container, TableBody } from '@mui/material'
import React from 'react'
import { Paper, Table, TableCell, TableContainer, TableRow } from '../FivePluginApi'


const Summary = () => {
   
    return(
        <Container>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow style={{border: '1px solid black'}}>
                            <TableCell component="th" scope="row">ACCOUNT:</TableCell>
                            <TableCell> Test information should </TableCell>
                            <TableCell component="th" scope="row">DATE:</TableCell>
                            <TableCell>Hardcoded Date</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )

}




export default Summary