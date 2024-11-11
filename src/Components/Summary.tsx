//@ts-nocheck

import React, {
  useEffect,
  useRef,
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

  console.log("Logging IVR For the current Order -----------------------------------------")
  console.log(ivr)

  const pdfRef = useRef();

  useImperativeHandle(ref, () => ({
    downloadPdf,
  }));

  const downloadPdf = () => {
    const element = pdfRef.current;

    const options = {
      margin: 0.5,
      filename: "Patient_Benefit_Verification_Summary.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

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
        logObject,
        null,
        null,
        null,
        (result) => {}
      );
    };

    triggerLog();
  }, []);

  return (
    <Container>
      {ivr !== undefined && (
        <Box
          ref={pdfRef}
          style={{
            position: "relative",
            padding: "20px",
            maxWidth: "800px",
            margin: "auto",
          }}
        >
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "#4b4b4b" }}
          >
            Legacy Medical
          </Typography>
          <Typography
            variant="h6"
            style={{ color: "#a9a900", marginBottom: "20px" }}
          >
            Patient Benefit Summary
          </Typography>

          <Box my={3} display="flex" flexDirection="row"  >
            <Typography
              variant="body1"
              style={{ fontWeight: "bold", fontSize: "1.8em" }}
            >
              IVR
            </Typography >
            <Typography
            variant="body1"
            style={{ fontWeight: "bold", fontSize: "1.8em", marginLeft: "80px", color:'#8DAC6E' }}>
              {ivr?.Status} 
            </Typography>
          </Box>

          <TableContainer>
            <Table style={{fontSize: "0.8rem"}}>
              <TableRow>
                <TableCell>
                  <strong>Date of Service</strong>
                </TableCell>
                <TableCell colSpan={7}>{ivr?.Date}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>
                  <strong>Inquiry ID</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.IDShort}</TableCell>
                <TableCell>
                  <strong>PDM Rep/Date</strong>
                </TableCell>
                <TableCell colSpan={3}> 14/10/24</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Facility Name</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.FacilityName}</TableCell>
                <TableCell>
                  <strong>Dr/Provider</strong>
                </TableCell>
                <TableCell colSpan={3}>{practitioner?.NameFull}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>
                  <strong>Distributor</strong>
                </TableCell>
                <TableCell colSpan={7}>Some Distributor Name</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Patient Name</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.Patient}</TableCell>
                <TableCell>
                  <strong>Date of Birth</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.Date}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>
                  <strong>Primary Payer and ID</strong>
                </TableCell>
                <TableCell colSpan={3}>{payors[0]?.CompanyName}</TableCell>
                <TableCell>
                  <strong>Secondary Payer and ID</strong>
                </TableCell>
                <TableCell colSpan={3}>{payors[1]?.CompanyName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Q Code</strong>
                </TableCell>
                <TableCell colSpan={2}>{ivr?.QCode}</TableCell>
                <TableCell>
                  <strong>CPT Codes</strong>
                </TableCell>
                <TableCell colSpan={2}>{ivr?.CPTCodes}</TableCell>
                <TableCell>
                  <strong>Product Size</strong>
                </TableCell>
                <TableCell colSpan={2}>12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Primary DX</strong>
                </TableCell>
                <TableCell colSpan={2}>{ivr?.PrimaryDX}</TableCell>
                <TableCell>
                  <strong>Secondary DX</strong>
                </TableCell>
                <TableCell colSpan={2}>{ivr?.SecondaryDX}</TableCell>
                <TableCell>
                  <strong>Additional DXs</strong>
                </TableCell>
                <TableCell colSpan={2}>{ivr?.AdditionalDXs}</TableCell>
              </TableRow>
            </Table>
          </TableContainer>

         
          <TableContainer>
            <Table>
            <TableRow>
                <TableCell>
                  <strong>Estimated Patient Responsibility</strong>
                </TableCell>
                <TableCell colSpan={7}> - </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Primary Coverage Effective Date</strong>
                </TableCell>
                <TableCell colSpan={7}>{ivr?.PrimaryCoverageEffectiveDate}</TableCell>
                </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Deductible</strong>
                </TableCell>
                <TableCell>{ivr?.BenerfitDeductible1}</TableCell>
                <TableCell>
                  <strong>Deductible Met</strong>
                </TableCell>
                <TableCell>{ivr?.BenerfitDeductibleMet1}</TableCell>

                <TableCell>
                  <strong>Deductible Owed</strong>
                </TableCell>
                <TableCell>{ivr?.BenerfitDeductibleOwed1}</TableCell>
                <TableCell>
                  <strong>Co-insurance</strong>
                </TableCell>
                <TableCell>{ivr?.BenefitCoinsurance1}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>
                  <strong>Secondary Coverage Effective Date</strong>
                </TableCell>
                <TableCell colSpan={7}>{ivr?.SecondaryCoverageEffectiveDate}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>
                  <strong>Deductible</strong>
                </TableCell>
                <TableCell>{ivr?.BenerfitDeductible2}</TableCell>
                <TableCell colSpan={2}>
                  <strong>Deductible Met</strong>
                </TableCell>
                <TableCell colSpan={2}>{ivr?.BenerfitDeductibleMet2}</TableCell>
                <TableCell>
                  <strong>Deductible Owed</strong>
                </TableCell>
                <TableCell>{ivr?.BenerfitDeductibleOwed2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Co-insurance</strong>
                </TableCell>
                <TableCell>{ivr?.BenefitCoinsurance2}</TableCell>
                <TableCell>
                  <strong>Copay</strong>
                </TableCell>
                <TableCell>{ivr?.BenefitCoPay2}</TableCell>
              </TableRow>
              {/* --------------------------------------------- */}
              <TableRow>
                <TableCell>
                  <strong>Plan Type and Benefits</strong>
                </TableCell>
                <TableCell colSpan={7}>{ivr?.PlanType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Denial Reason</strong>
                </TableCell>
                <TableCell colSpan={7}>{ivr?.DenialReason}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Notes</strong>
                </TableCell>
                <TableCell colSpan={7}>{ivr?.Notes}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Representative Name</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.RepresentativeName}</TableCell>
                <TableCell>
                  <strong>Reference Number</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.ReferenceNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Representative Email</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.RepresentativeEmail}</TableCell>
                <TableCell>
                  <strong>Representative Phone</strong>
                </TableCell>
                <TableCell colSpan={3}>{ivr?.RepresentativePhone}</TableCell>
              </TableRow>
            </Table>
          </TableContainer>


          <Typography
            variant="h6"
            style={{ marginTop: "20px", fontStyle: "italic", textAlign: 'center', color:' black' }}
          >
            POS 32 OR 33 CANNOT BE A GUARANTEE THAT THE PATIENT IS NOT IN A PART
            A STAY & THE FINANCIAL RESPONSIBILITY WILL BE ON THE PROVIDER
          </Typography>
          <Box
            mt={5}
            py={2}
            borderTop="1px solid #cccccc"
            textAlign="center"
            style={{ color: "#555555" }}
          >
            <Typography variant="caption" display="block" gutterBottom>
              Legal Disclaimer: This does not guarantee payment, nor does insurance verification or prior authorization guarantee payment. Coverage and payment rates are based on provider’s contract. None of the content should be interpreted as billing or reimbursement advice or guidance. Documentation must support medical necessity. Please review medical policy for specific criteria.
            </Typography>
            <Typography variant="body2" display="block" gutterBottom>
              <strong>Order & Customer Support Contact Details</strong>
            </Typography>
            <Typography variant="body2" display="block" gutterBottom>
              Phone: (888) 585-0760 | Fax: (866) 300-0431
            </Typography>
            <Typography variant="body2" display="block" gutterBottom>
              <a href="http://www.legacymedicalconsultants.com" target="_blank" rel="noopener noreferrer" style={{ color: "#000000", textDecoration: "none" }}>
                www.legacymedicalconsultants.com
              </a>{" "}
              | info@legacymedicalconsultants.com
            </Typography>
          </Box>
        </Box>
      )}
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={5}>
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
