import { Container, TableBody, Typography } from "@mui/material";
import React from "react";
import {
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
} from "../FivePluginApi";

const Summary = ({ ivr, practitioner }) => {
  console.log("IVR from  order summary", ivr);
  return (
    <Container>
      {ivr !== undefined && (
        <Box>
          <Typography variant="h5">
            PATIENT BENEFIT VERIFICATION SUMMARY
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody style={{ border: "1px solid black" }}>
                <TableRow>
                  <TableCell component="th" scope="row">
                    ACCOUNT:
                  </TableCell>
                  <TableCell> {ivr?.Account} </TableCell>
                  <TableCell component="th" scope="row">
                    DATE:
                  </TableCell>
                  <TableCell>{ivr?.Date}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    ATTENTION:
                  </TableCell>
                  <TableCell>{ivr?.Contact}</TableCell>
                  <TableCell component="th" scope="row">
                    FAX:
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    PHYSICIAN:
                  </TableCell>
                  <TableCell> {practitioner.NameFull} </TableCell>
                  <TableCell component="th" scope="row">
                    FROM:
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    PATIENT NAME:
                  </TableCell>
                  <TableCell> {ivr?.Patient} </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    CASE ID:
                  </TableCell>
                  <TableCell> {ivr?.IDShort} </TableCell>
                  <TableCell component="th" scope="row">
                    DOB:
                  </TableCell>
                  <TableCell>{ivr?.Date}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer style={{ marginTop: "10px" }} component={Paper}>
            <Table>
              <TableBody style={{ border: "1px solid black" }}>
                <TableRow>
                  <TableCell component="th" scope="row">
                    PRIMARY INSURANCE:
                  </TableCell>
                  <TableCell>123456</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Table>
            <TableBody>
                <TableRow>
                    <TableCell scope="row" component='th'>Deductible</TableCell>
                    <TableCell>{ivr?.BenerfitDeductible1}</TableCell>
                    <TableCell>Deductible Met</TableCell>
                    <TableCell>{ivr?.BenerfitDeductibleMet1}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row" component='th'>Coinsurance</TableCell>
                    <TableCell>{ivr?.BenefitCoinsurance1}</TableCell>
                    <TableCell>Co-Pay</TableCell>
                    <TableCell>{ivr?.BenefitCoPay1}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row" component='th'>Deductible</TableCell>
                    <TableCell>{ivr?.BenerfitOutOfPocket1}</TableCell>
                    <TableCell>Deductible Met</TableCell>
                    <TableCell>{ivr?.BenerfitOutOfPocketMet1}</TableCell>
                </TableRow>
                <TableRow style={{borderTop: '3px solid black', marginTop: '20px', padding: 10}}>
                    <TableCell scope='row' component='th'>
                    NOTES
                    </TableCell>
                    <TableCell>
                    {ivr?.BenefitNotes1}
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
          <TableContainer style={{ marginTop: "25px" }} component={Paper}>
            <Table>
              <TableBody style={{ border: "1px solid black" }}>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Secondary INSURANCE:
                  </TableCell>
                  <TableCell>78910</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Table>
            <TableBody>
                <TableRow>
                    <TableCell scope="row" component='th'>Deductible</TableCell>
                    <TableCell>{ivr?.BenerfitDeductible2}</TableCell>
                    <TableCell>Deductible Met</TableCell>
                    <TableCell>{ivr?.BenerfitDeductibleMet2}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row" component='th'>Coinsurance</TableCell>
                    <TableCell>{ivr?.BenefitCoinsurance2}</TableCell>
                    <TableCell>Co-Pay</TableCell>
                    <TableCell>{ivr?.BenefitCoPay2}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row" component='th'>Deductible</TableCell>
                    <TableCell>{ivr?.BenerfitOutOfPocket2}</TableCell>
                    <TableCell>Deductible Met</TableCell>
                    <TableCell>{ivr?.BenerfitOutOfPocketMet2}</TableCell>
                </TableRow>
                <TableRow style={{borderTop: '3px solid black'}}>
                    <TableCell scope='row' component='th'>
                    NOTES
                    </TableCell>
                    <TableCell>
                    {ivr?.BenefitNotes2}
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
          
        </Box>
      )}
    </Container>
  );
};

export default Summary;
