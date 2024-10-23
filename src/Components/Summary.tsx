//@ts-nocheck
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Container, TableBody, Typography } from "@mui/material";
import {
  Box,
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
} from "../FivePluginApi";
import html2pdf from "html2pdf.js";

const Summary = forwardRef((props, ref) => {
  const {
    ivr,
    practitioner,
    handleNext,
    handleDialogClose,
    payors,
    patient,
    five,
  } = props;

  const pdfRef = useRef();

  useImperativeHandle(ref, () => ({
    downloadPdf,
  }));

  const downloadPdf = () => {
    const element = pdfRef.current; // Get the element to print
 

    const options = {
      margin: 0.5,
      filename: "Patient_Benefit_Verification_Summary.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Generate the PDF
    html2pdf().from(element).set(options).save();
  };

  useEffect(() => {
    const triggerLog = async () => {
      const logObject = {
        ORD: "",
        ivr: ivr,
        type: "IVR",
      };

      await five.executeFunction(
        "TriggerOpenIVRLog",
        //@ts-ignore
        logObject,
        null,
        null,
        null,
        //@ts-ignore
        (result) => {}
      );
    };

    triggerLog();
  }, []);

  return (
    <Container>

      {ivr !== undefined && (
        <Box style={{ position: "relative" }} ref={pdfRef}>
          <Typography
            variant="h5"
            textAlign="center"
            textTransform="capitalize"
            style={{ fontWeight: "bold" }}
          >
            Patient Benefit Verification Summary
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: "40px" }}>
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
                    <strong>PATIENT:</strong>
                  </TableCell>
                  <TableCell> {ivr?.Patient} </TableCell>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell> </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>IVR ID:</strong>
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
                    <strong> PRIMARY INSURANCE: </strong> &nbsp;{" "}
                    {payors[0]?.CompanyName}
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bolder", width: "350px" }}
                  >
                    {" "}
                    <strong> MEMBER NUMBER:</strong> &nbsp;{" "}
                    {patient?.Pay1MemberNumber}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell scope="row" component="th">
                  Deductible
                </TableCell>
                <TableCell>{ivr?.BenerfitDeductible1}</TableCell>
                <TableCell>Deductible Met</TableCell>
                <TableCell>{ivr?.BenerfitDeductibleMet1}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row" component="th">
                  Coinsurance
                </TableCell>
                <TableCell>{ivr?.BenefitCoinsurance1}</TableCell>
                <TableCell>Co-Pay</TableCell>
                <TableCell>{ivr?.BenefitCoPay1}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row" component="th">
                  Out Of Pocket
                </TableCell>
                <TableCell>{ivr?.BenerfitOutOfPocket1}</TableCell>
                <TableCell>Out Of Pocket Met</TableCell>
                <TableCell>{ivr?.BenerfitOutOfPocketMet1}</TableCell>
              </TableRow>
              <TableRow
                style={{
                  borderTop: "3px solid black",
                  marginTop: "20px",
                  padding: 20,
                }}
              >
                <TableCell scope="row" component="th">
                  NOTES
                </TableCell>
                <TableCell>{ivr?.BenefitNotes1}</TableCell>
                <TableCell component="th" scope="row"></TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <TableContainer style={{ marginTop: "25px" }} component={Paper}>
            <Table>
              <TableBody style={{ border: "1px solid black" }}>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong> SECONDARY INSURANCE:</strong> &nbsp;{" "}
                    {payors[1]?.CompanyName}
                  </TableCell>
                  <TableCell style={{ width: "350px" }}>
                    {" "}
                    <strong> MEMBER NUMBER:</strong> &nbsp;
                    {patient?.Pay2MemberNumber}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell scope="row" component="th">
                  Deductible
                </TableCell>
                <TableCell>{ivr?.BenerfitDeductible2}</TableCell>
                <TableCell>Deductible Met</TableCell>
                <TableCell>{ivr?.BenerfitDeductibleMet2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row" component="th">
                  Coinsurance
                </TableCell>
                <TableCell>{ivr?.BenefitCoinsurance2}</TableCell>
                <TableCell>Co-Pay</TableCell>
                <TableCell>{ivr?.BenefitCoPay2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row" component="th">
                  Out Of Pocket
                </TableCell>
                <TableCell>{ivr?.BenerfitOutOfPocket2}</TableCell>
                <TableCell>Out Of Pocket Met</TableCell>
                <TableCell>{ivr?.BenerfitOutOfPocketMet2}</TableCell>
              </TableRow>
              <TableRow
                style={{ borderTop: "3px solid black", padding: 20 }}
              >
                <TableCell scope="row" component="th">
                  NOTES
                </TableCell>
                <TableCell>{ivr?.BenefitNotes2}</TableCell>
                <TableCell component="th" scope="row"></TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography
            variant="h6"
            textAlign="center"
            textTransform="capitalize"
            mt={10}
          >
            Overall Summary And Notes
          </Typography>
          <Typography
            variant="body1"
            style={{
              whiteSpace: "pre-line",
              padding: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              minHeight: "300px",
            }}
          >
            {ivr?.Reason}
          </Typography>
        </Box>
      )}
      <Box display="flex" justifyContent="center" width="100%">
        <Button
          onClick={handleDialogClose}
          style={{
            width: "15vw",
            backgroundColor: "#780000",
            color: "white",
            marginRight: "10px",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleNext}
          style={{
            width: "15vw",
            backgroundColor: "#1d343d",
            color: "white",
            marginLeft: "10px",
          }}
        >
          Confirm
        </Button>
      </Box>
    </Container>
  );
});

export default Summary;
