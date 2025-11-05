//@ts-nocheck
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
} from "@mui/material";
import React, { useEffect } from "react";

export default function CheckoutForm({
  ivr,
  practitioner,
  patient,
  logo,
  graphic,
  serviceDate,
  address,
  orderProducts,
  account,
  selectedProduct,
  productList,
  onSubmit,
  onBack,
  submitting,
  // Add these new props
  showShippingOptions = false,
  selectedShippingOption = "",
  thirdPartyCarrier = "",
  thirdPartyAccount = "",
}) {
  const fmtMoney = (n) => (n || n === 0 ? `$${Number(n).toFixed(2)}` : "");

  // Format date to US standard (MM/DD/YYYY)
  const formatDateUS = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Get the brand name and hex code from the selected product
  const brandName = selectedProduct?.Brand || "AmnioAMP-MP";
  const theme = selectedProduct?.HexCode || "009689";
  const themeColor = "#" + theme;

  useEffect(() => {
    console.log("Checkout Form Logging Data", selectedProduct);
  }, []);

  // Format the brand name for display (replace underscores with spaces, etc.)
  const displayBrandName = brandName.replace(/_/g, " ").replace(/ACA/g, "ACA");

  // Label component for consistency
  const FieldLabel = ({ children }) => (
    <Typography
      variant="body2"
      style={{
        fontSize: "13px",
        fontWeight: "500",
        marginBottom: "4px",
        color: "#374151",
      }}
    >
      {children}
    </Typography>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "180px",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        {/* Left side: Brand color with logo */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "60%",
            height: "100%",
            backgroundColor: themeColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            clipPath: "polygon(0px 0px, 40% 0%, 100% 100%, 0px 100%)",
            zIndex: 2,
          }}
        >
          {logo && (
            <img
              src={`data:image/png;base64,${logo}`}
              alt="Brand Logo"
              style={{
                maxHeight: "100px",
                maxWidth: "70%",
                objectFit: "contain",
                marginLeft: "50px",
              }}
            />
          )}
        </div>

        {/* Right side: Graphic */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "115%",
            height: "100%",
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
            zIndex: 1,
          }}
        >
          {graphic && (
            <img
              src={`data:image/png;base64,${graphic}`}
              alt="Product Graphic"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <Container
        maxWidth="md"
        style={{
          paddingLeft: "32px",
          paddingRight: "32px",
          paddingTop: "32px",
          paddingBottom: "32px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <Typography
            variant="h1"
            style={{ fontSize: "42px", lineHeight: "1.2", marginBottom: "8px" }}
          >
            {displayBrandName}™
          </Typography>
          <Typography
            variant="h2"
            style={{ fontSize: "28px", color: themeColor }}
          >
            Order Form
          </Typography>
        </div>

        {/* Form Fields - All Read Only with Labels */}
        <div style={{ marginBottom: "40px" }}>
          {/* Row 1 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <div>
              <FieldLabel>Requesting Provider</FieldLabel>
              <TextField
                value={practitioner?.NameFull || practitioner?.NameFirst + practitioner?.NameLast || ""}
                variant="filled"
                fullWidth
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
                  style: {
                    backgroundColor: "#EEF2F5",
                    height: "42px",
                    borderRadius: "0",
                  },
                }}
                inputProps={{ style: { padding: "12px" } }}
              />
            </div>

            <div>
              <FieldLabel>Provider Phone</FieldLabel>
              <TextField
                value={account?.Phone || account?.MainPhone || ""}
                variant="filled"
                fullWidth
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
                  style: {
                    backgroundColor: "#EEF2F5",
                    height: "42px",
                    borderRadius: "0",
                  },
                }}
                inputProps={{ style: { padding: "12px" } }}
              />
            </div>
          </div>
          {/* Row 2 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <div>
              <FieldLabel>Email</FieldLabel>
              <TextField
                value={practitioner?.Email || account?.Email || ""}
                variant="filled"
                fullWidth
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
                  style: {
                    backgroundColor: "#EEF2F5",
                    height: "42px",
                    borderRadius: "0",
                  },
                }}
                inputProps={{ style: { padding: "12px" } }}
              />
            </div>
            <div>
              <FieldLabel>Order Date</FieldLabel>
              <TextField
                value={formatDateUS(new Date().toISOString())}
                variant="filled"
                fullWidth
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
                  style: {
                    backgroundColor: "#EEF2F5",
                    height: "42px",
                    borderRadius: "0",
                  },
                }}
                inputProps={{ style: { padding: "12px" } }}
              />
            </div>
          </div>
          {/* Row 3 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <div>
              <FieldLabel>Patient Name</FieldLabel>
              <TextField
                value={patient?.Name || ivr?.Patient || ""}
                variant="filled"
                fullWidth
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
                  style: {
                    backgroundColor: "#EEF2F5",
                    height: "42px",
                    borderRadius: "0",
                  },
                }}
                inputProps={{ style: { padding: "12px" } }}
              />
            </div>

            <div>
              <FieldLabel>Date of Service</FieldLabel>
              <TextField
                value={formatDateUS(serviceDate || ivr?.Date)}
                variant="filled"
                fullWidth
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
                  style: {
                    backgroundColor: "#EEF2F5",
                    height: "42px",
                    borderRadius: "0",
                  },
                }}
                inputProps={{ style: { padding: "12px" } }}
              />
            </div>
          </div>
          {/* Row 4 - Full Width */}
          <div style={{ marginBottom: "12px" }}>
            <FieldLabel>Shipping Address</FieldLabel>
            <TextField
              value={
                address
                  ? `${address.AddressName ? address.AddressName + " — " : ""}${
                      address.AddressStreet || ""
                    }${
                      address.AddressStreet &&
                      (address.AddressCity || address.AddressState)
                        ? ", "
                        : ""
                    }${address.AddressCity || ""}${
                      address.AddressCity && address.AddressState ? ", " : ""
                    }${address.AddressState || ""} ${address.AddressZip || ""}`
                  : ""
              }
              variant="filled"
              fullWidth
              InputProps={{
                readOnly: true,
                disableUnderline: true,
                style: {
                  backgroundColor: "#EEF2F5",
                  height: "42px",
                  borderRadius: "0",
                },
              }}
              inputProps={{ style: { padding: "12px" } }}
            />
          </div>
          <div style={{ height: "42px" }}></div>
        </div>

        {/* Ordering Information Section */}
        <div style={{ marginBottom: "32px" }}>
          <Typography
            variant="h3"
            style={{ fontSize: "22px", marginBottom: "16px" }}
          >
            {displayBrandName} Ordering Information
          </Typography>

          {/* Table */}
          <TableContainer>
            <Table style={{ width: "100%", borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow style={{ backgroundColor: themeColor }}>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      padding: "12px 16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "none",
                    }}
                  >
                    Product Number
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      padding: "12px 16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "none",
                    }}
                  >
                    Description
                  </TableCell>
                  {!showShippingOptions && (
                    <TableCell
                      style={{
                        color: "#ffffff",
                        padding: "12px 16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "none",
                      }}
                    >
                      Invoice Price
                    </TableCell>
                  )}
                  <TableCell
                    style={{
                      color: "#ffffff",
                      padding: "12px 16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "none",
                    }}
                  >
                    Quantity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(orderProducts) && orderProducts.length > 0 ? (
                  orderProducts.map((item, idx) => {
                    const fullProduct = productList?.find(
                      (p) => p.___PRD === item.product
                    );
                    const productCode =
                      fullProduct?.Product || item.productCode || "";
                    const description =
                      fullProduct?.Description || item.description || "";

                    return (
                      <TableRow
                        key={`${item.product}-${idx}`}
                        style={{
                          backgroundColor:
                            idx % 2 === 1 ? "#EEF2F5" : "#ffffff",
                        }}
                      >
                        <TableCell
                          style={{
                            padding: "12px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {productCode}
                        </TableCell>
                        <TableCell
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {description}
                        </TableCell>
                        {!showShippingOptions && (
                          <TableCell
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            {fmtMoney(item.price)}
                          </TableCell>
                        )}
                        <TableCell
                          style={{
                            padding: "12px 16px",
                            backgroundColor: "#EEF2F5",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {item.qty ?? ""}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                      colSpan={showShippingOptions ? 3 : 4}
                    >
                      {/* Keep UI same: empty state is just an empty table; no extra messaging */}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Shipping Options - Only for ActiGraft (Read-only display) */}
        {showShippingOptions && selectedShippingOption && (
          <Box style={{ marginBottom: "24px" }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      selectedShippingOption ===
                      "Ground Freight (1-7 Days) $30/BX"
                    }
                    disabled
                  />
                }
                label="Ground Freight (1-7 Days) – $30 per 5-pack"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedShippingOption === "2-Day Air - $70/BX"}
                    disabled
                  />
                }
                label="2-Day Air – $70 per 5-pack"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedShippingOption === "Bill 3rd Party"}
                    disabled
                  />
                }
                label="Bill 3rd Party - submit carrier & account number"
              />
            </FormGroup>

            {/* Show third party details if selected */}
            {selectedShippingOption === "Bill 3rd Party" &&
              (thirdPartyCarrier || thirdPartyAccount) && (
                <Box
                  display="flex"
                  gap={2}
                  mt={2}
                  ml={4}
                  style={{
                    padding: "12px",
                    backgroundColor: "#EEF2F5",
                    borderRadius: "4px",
                  }}
                >
                  {thirdPartyCarrier && (
                    <Typography variant="body2">
                      <strong>Carrier:</strong> {thirdPartyCarrier}
                    </Typography>
                  )}
                  {thirdPartyAccount && (
                    <Typography variant="body2">
                      <strong>Account Number:</strong> {thirdPartyAccount}
                    </Typography>
                  )}
                </Box>
              )}
          </Box>
        )}

        {/* Email Instruction */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
            paddingTop: "24px",
          }}
        >
          <Typography style={{ fontSize: "15px" }}>
            <span>Email form to </span>
            <span style={{ fontWeight: "600" }}>
              CustomerService@LegacyMedicalConsultants.com
            </span>
          </Typography>
          
        </div>

        {/* Submit Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={onBack}
            style={{
              padding: "10px 24px",
              backgroundColor: "#D8EEDA",
              color: "#157069",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Back
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            style={{
              padding: "10px 24px",
              backgroundColor: themeColor,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {submitting ? "Submitting..." : "Submit Order"}
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: `2px solid ${themeColor}`,
            paddingTop: "16px",
            marginTop: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontSize: "11px", lineHeight: "1.5" }}>
              <p
                style={{
                  fontWeight: "600",
                  marginBottom: "4px",
                  margin: "0 0 4px 0",
                }}
              >
                Order & Customer Support Contact Details
              </p>
              <p style={{ margin: "0 0 2px 0" }}>
                Phone: {account?.Phone || "(817) 961-1288"} | Fax:{" "}
                {account?.Fax || "(866) 300-0431"}
              </p>
              <p style={{ margin: "0" }}>
                www.legacymedicalconsultants.com |
                customerservice@legacymedicalconsultants.com
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <svg
                width="80"
                height="40"
                viewBox="0 0 80 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="40"
                  y="15"
                  textAnchor="middle"
                  fontSize="14"
                  fill="#1E293B"
                  fontFamily="Arial, sans-serif"
                >
                  <tspan fontWeight="bold">LEGACY</tspan>
                </text>
                <text
                  x="40"
                  y="28"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#1E293B"
                  fontFamily="Arial, sans-serif"
                  letterSpacing="1"
                >
                  MEDICAL
                </text>
                <text
                  x="40"
                  y="36"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#1E293B"
                  fontFamily="Arial, sans-serif"
                  letterSpacing="1"
                >
                  CONSULTANTS
                </text>
                <path
                  d="M35 16 L37 20 L39 16 L41 20 L43 16"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}