import { Container, TableBody, Typography } from "@mui/material";
import React from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
} from "../FivePluginApi";

const Summary = ({ ivr, practitioner,  handleNext, handleDialogClose }) => {
  console.log("IVR from  order summary", ivr);
  return (
    <Container>
      {ivr !== undefined && (
        <Box>
          <Typography variant="h5" textAlign='center' textTransform='capitalize' style={{fontWeight:'bold'}}>
            Patient Benefit Verification Summary
          </Typography>
          <TableContainer component={Paper} style={{marginTop: '40px'}}>
            <Table>
              <TableBody style={{ border: "1px solid black" }}>
                <TableRow>
                  <TableCell component="th" scope="row">
                  <strong> ACCOUNT:</strong>
                  </TableCell>
                  <TableCell> {ivr?.Account} </TableCell>
                  <TableCell component="th" scope="row">
                  <strong> DATE:</strong>
                  </TableCell>
                  <TableCell>{ivr?.Date}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                  <strong>ATTENTION:</strong>
                  </TableCell>
                  <TableCell>{ivr?.Contact}</TableCell>
                  <TableCell component="th" scope="row">
                  <strong> FAX:</strong>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                  <strong>PHYSICIAN:</strong>
                  </TableCell>
                  <TableCell> {practitioner.NameFull} </TableCell>
                  <TableCell component="th" scope="row">
                  <strong> FROM:</strong>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
               
                  <TableCell component="th" scope="row">
                  <strong>PATIENT NAME:</strong>
                  </TableCell>
                  <TableCell> {ivr?.Patient} </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                  <strong>CASE ID:</strong>
                  </TableCell>
                  <TableCell> {ivr?.IDShort} </TableCell>
                  <TableCell component="th" scope="row">
                  <strong> DOB:</strong>
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
                  <strong> PRIMARY INSURANCE:</strong>
                  </TableCell>
                  <TableCell>-</TableCell>
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
                <TableRow style={{borderTop: '3px solid black', marginTop: '20px', padding: 20}}>
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
                  <strong> SECONDARY INSURANCE:</strong>
                  </TableCell>
                  <TableCell>-</TableCell>
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
                <TableRow style={{borderTop: '3px solid black', padding: 20}}>
                    <TableCell scope='row' component='th'>
                    NOTES
                    </TableCell>
                    <TableCell>
                    {ivr?.BenefitNotes2}
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
          <Typography variant="h6" textAlign='center' textTransform='capitalize' mt={10}>
            Overall Summary And Notes
          </Typography>
          <Typography variant="body1" style={{ whiteSpace: 'pre-line', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '300px' }}>
            {ivr?.Reason}
          </Typography>
          <Box display='flex' justifyContent='center' width="100%">
          <Button onClick={handleDialogClose} style={{width: '15vw',  backgroundColor: '#780000', color:'white',  marginRight: '10px'}}>
            Cancel
          </Button>
          <Button onClick={handleNext} style={{width: '15vw',  backgroundColor: '#1d343d', color:'white', marginLeft: '10px'}}>
            Confirm
          </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Summary;
