//@ts-nocheck
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Container, Typography } from "@mui/material";
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
import { TableCell } from "@mui/material";
import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { svgData } from "../strings";



const svgBase64 = btoa(svgData);
const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;

const DarkBorderTableCell = styled(TableCell)(({ theme }) => ({
  orderBottom: "1px solid #000000", // Darker border color
  fontWeight: "bold",
}));

const DarkBorderTableRow = styled(TableRow)(({ theme }) => ({
  "& td, & th": {
    borderBottom: "1px solid #4d4d4d",
  },
}));



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

  const [base64Image, setBase64Image] = useState("");


  const pdfRef = useRef();

  useImperativeHandle(ref, () => ({
    downloadPdf,
  }));

  const downloadPdf = () => {
    const element = pdfRef.current;
    element.classList.add("pdf-mode");

    const options = {
      filename: "Patient_Benefit_Verification_Summary.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => {
        element.classList.remove("pdf-mode");
      });
  };

  console.log("Logging Patients from place order", patient)

  /*   const convertImageToBase64 = async () => {
    try {
      const response = await fetch(IVRBackground);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setBase64Image(reader.result); // Set the base64 string to state
      };
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };
 */
  useEffect(() => {
    const triggerLog = async () => {
      const logObject = {
        ORD: "",
        ivr: ivr,
        type: "IVR",
      };

      await five.executeFunction(
        "TriggerOpenIVRLog",
        logObject,
        null,
        null,
        null,
        (result) => {}
      );
    };

    triggerLog();
    //convertImageToBase64();
  }, []);


  return (
    <Container id="summary-container" style={{ width: "100%" }}>
      { ivr !== undefined && (
        <Box
          id="pdf-content"
          ref={pdfRef}
          style={{
            position: "relative",
            maxWidth: "100%",
          }}
        >
          <Global
            styles={css`
              .pdf-mode .MuiTableCell-root {
                font-size: 0.7rem; /* Adjust font size */
                margin: 10px; /* Add padding */
              }
            `}
          />
          <img
            id="banner-image"
            src={svgDataUrl}
            alt="Banner Image"
            width="320px"
            height="auto"
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              transform: "rotate(180deg)",
            }}
          />

          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "#4b4b4b", marginLeft: "20px" }}
          >
            Legacy Medical
          </Typography>

          <Typography
            variant="h6"
            style={{
              color: "#a9a900",
              marginBottom: "20px",
              marginLeft: "20px",
            }}
          >
            Patient Benefit Summary
          </Typography>

          <Box my={3} display="flex" flexDirection="row">
            <Typography
              variant="body1"
              style={{
                fontWeight: "bold",
                fontSize: "1.8em",
                marginLeft: "25px",
              }}
            >
              IVR
            </Typography>
            <Typography
              variant="body1"
              style={{
                fontWeight: "bold",
                fontSize: "1.8em",
                marginLeft: "80px",
                color: "#8DAC6E",
              }}
            >
              {ivr?.Status}
            </Typography>
          </Box>

          <TableContainer id="summary-table" style={{ marginTop: "20px" }}>
            <Table style={{ fontSize: "0.8rem" }} size="small">
              <DarkBorderTableRow>
                <DarkBorderTableCell colSpan={1}>
                  <strong>Date of Service</strong>
                </DarkBorderTableCell>
                <TableCell colSpan={7}>{ivr?.Date}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={1}>
                  <strong>IVR ID</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.IDShort}</TableCell>
                <TableCell colSpan={1}>
                  <strong>PDM Rep/Date</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.PBS_pdmRepDate}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={1}>
                  <strong>Facility Name</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.Account}</TableCell>
                <TableCell colSpan={1}>
                  <strong>Dr/Provider</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.Provider}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
              <TableCell colSpan={1}>
              <strong>Patient ID</strong>
                </TableCell>
                <TableCell colSpan={3}>{patient?.IDShort}</TableCell>
                <TableCell colSpan={1}>
                  <strong>Distributor</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.Distributor}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={1}>
                  <strong>Patient Name</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.Patient}</TableCell>
                <TableCell colSpan={1}>
                  <strong>Date of Birth</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.DateofBirthText}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={1}>
                  <strong>Primary Payer and ID</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.Payor1}</TableCell>
                <TableCell colSpan={1}>
                  <strong>Secondary Payer and ID</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.Payor2}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={1}>
                  <strong>Q Code</strong>
                </TableCell>
                <TableCell colSpan={1}>{ivr?.QCode}</TableCell>
                <TableCell colSpan={1}>
                  <strong>Q Code 2</strong>
                </TableCell>
                <TableCell colSpan={1}>{ivr?.QCode2}</TableCell>
                <TableCell colSpan={1}>
                  <strong>CPT Code 1</strong>
                </TableCell>
                <TableCell colSpan={1}>{ivr?.CPTCODE}</TableCell>
                <TableCell colSpan={1}>
                  <strong>CPT Code 2</strong>
                </TableCell>
                <TableCell colSpan={2}>{ivr?.CPTCODE2}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={1}>
                  <strong>L Code</strong>
                </TableCell>
                <TableCell colSpan={1}>{ivr?.ICD10_L}</TableCell>
                <TableCell colSpan={1}>
                  <strong>I Code</strong>
                </TableCell>
                <TableCell colSpan={1}>{ivr?.ICD10_I}</TableCell>
                <TableCell colSpan={1}>
                  <strong>E Code</strong>
                </TableCell>
                <TableCell colSpan={1}>
                  {ivr?.ICD10_E}
                </TableCell>
                <TableCell colSpan={1}>
                  <strong>CD Code</strong>
                </TableCell>
                <TableCell colSpan={2}>
                  {ivr?.ICD10_CD}
                </TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={2}>
                  <strong>Estimated Patient Responsibility</strong>
                </TableCell>
                <TableCell colSpan={6}>{ivr?.PBS_PatientResponsibility}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={2}>
                  <strong>Primary Coverage Effective Date</strong>
                </TableCell>
                <TableCell colSpan={6}>
                  {ivr?.PBS_PrimaryCoverageDate}
                </TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={1}>
                  <strong>Deductible</strong>
                </TableCell>
                <TableCell colSpan={1}>
                  {ivr?.PBS_Deductible1}
                </TableCell>
                <TableCell colSpan={1}>
                  <strong>Deductible Met</strong>
                </TableCell>
                <TableCell colSpan={1}>{ivr?.PBS_DeductibleMet1}</TableCell>
                <TableCell colSpan={1}>
                  <strong>Deductible Owed</strong>
                </TableCell>
                <TableCell colSpan={3}>
                  {ivr?.PBS_OutOfPocket1}
                </TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell>
                  <strong>Co-insurance</strong>
                </TableCell>
                <TableCell>{ivr?.PBS_Coinsurance1}</TableCell>
                <TableCell>
                  <strong>Copay</strong>
                </TableCell>
                <TableCell colSpan={5}>{ivr?.PBS_CoPay1}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={2}>
                  <strong>Secondary Coverage Effective Date</strong>
                </TableCell>
                <TableCell colSpan={6}>
                  {ivr?.PBS_secondaryConverageDate}
                </TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell colSpan={1}>
                  <strong>Deductible</strong>
                </TableCell>
                <TableCell colSpan={1}>{ivr?.PBS_Deductible2}</TableCell>
                <TableCell colSpan={1}>
                  <strong>Deductible Met</strong>
                </TableCell>
                <TableCell colSpan={1}>{ivr?.PBS_DeductibleMet2}</TableCell>
                <TableCell colSpan={1}>
                  <strong>Deductible Owed</strong>
                </TableCell>
                <TableCell colSpan={3}>
                  {ivr?.PBS_OutOfPocket2}
                </TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell>
                  <strong>Co-insurance</strong>
                </TableCell>
                <TableCell>{ivr?.PBS_Coinsurance2}</TableCell>
                <TableCell>
                  <strong>Copay</strong>
                </TableCell>
                <TableCell colSpan={5}>{ivr?.PBS_CoPay2}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell>
                  <strong>Plan Type and Benefits</strong>
                </TableCell>
                <TableCell colSpan={7}>{ivr?.PBS_PlanType}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell>
                  <strong> Reason</strong>
                </TableCell>
                <TableCell colSpan={7}>{ivr?.PBS_Reason}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell>
                  <strong>Notes</strong>
                </TableCell>
                <TableCell colSpan={7}>{ivr?.PBS_Comment}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell>
                  <strong>Representative Name</strong>
                </TableCell>
                <TableCell>{ivr?.PBS_RepName}</TableCell>
                <TableCell>
                  <strong>Reference Number</strong>
                </TableCell>
                <TableCell colSpan={5}>{ivr?.PBS_ReferenceNumber}</TableCell>
              </DarkBorderTableRow>
              <DarkBorderTableRow>
                <TableCell>
                  <strong>Representative Email</strong>
                </TableCell>
                <TableCell>{ivr?.PBS_RepEmail}</TableCell>
                <TableCell>
                  <strong>Representative Phone</strong>
                </TableCell>
                <TableCell colSpan={5}>{ivr?.PBS_RepPhone}</TableCell>
              </DarkBorderTableRow>
            </Table>
          </TableContainer>

          <Typography
            style={{
              marginTop: "30px",
              fontStyle: "italic",
              textAlign: "center",
              color: " black",
              fontSize: "1rem",
            }}
          >
            POS 32 OR 33 CANNOT BE A GUARANTEE THAT THE PATIENT IS NOT IN A PART
            A STAY & THE FINANCIAL RESPONSIBILITY WILL BE ON THE PROVIDER
          </Typography>
          <Box
            mt={5}
            py={2}
            borderTop="1px solid #cccccc"
            textAlign="center"
            style={{ color: "#555555", padding: "15px" }}
          >
            <Typography
              variant="caption"
              display="block"
              gutterBottom
              style={{ fontSize: "0.65rem" }}
            >
              Legal Disclaimer: This does not guarantee payment, nor does
              insurance verification or prior authorization guarantee payment.
              Coverage and payment rates are based on provider's contract. None
              of the content should be interpreted as billing or reimbursement
              advice or guidance. Documentation must support medical necessity.
              Please review medical policy for specific criteria.
            </Typography>
            <Typography
              variant="body2"
              display="block"
              gutterBottom
              style={{ fontSize: "0.7rem" }}
            >
              <strong>Order & Customer Support Contact Details</strong>
            </Typography>
            <Typography
              variant="body2"
              display="block"
              gutterBottom
              style={{ fontSize: "0.7rem" }}
            >
              Phone: (888) 585-0760 | Fax: (866) 300-0431
            </Typography>
            <Typography
              variant="body2"
              display="block"
              gutterBottom
              style={{ fontSize: "0.6rem" }}
            >
              <a
                id="website-link"
                href="http://www.legacymedicalconsultants.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#000000", textDecoration: "none" }}
              >
                www.legacymedicalconsultants.com
              </a>{" "}
              | info@legacymedicalconsultants.com
            </Typography>
          </Box>
        </Box>
      )}
      <Box
        id="action-buttons"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        mt={5}
      >
        <Button
          id="cancel-summary-btn"
          onClick={handleDialogClose}
          style={{
            width: "15vw",
            backgroundColor: "#D8EEDA",
            color: "#157069",
            marginRight: "10px",
          }}
        >
          Cancel
        </Button>
        <Button
          id="confirm-summary-btn"
          onClick={handleNext}
          style={{
            width: "15vw",
            backgroundColor: "#14706A",
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