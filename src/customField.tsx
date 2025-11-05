//@ts-nocheck
import React, { useEffect, useState, useRef } from "react";

import {
  Box,
  CircularProgress,
  FiveInitialize,
  IconButton,
} from "./FivePluginApi";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Checkbox,
  TextField,
  TableContainer,
  FormControlLabel,
  Alert,
  Paper,
  Grid, // Added Grid for layout
  FormGroup, // Added for checkbox group
} from "@mui/material";

import { CustomFieldProps } from "../../../common";
import Summary from "./Components/Summary";
import CheckoutForm from "./Components/CheckoutForm";

FiveInitialize();

const CustomField = (props: CustomFieldProps) => {
  const { five, selectedRecord } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orders, setOrders] = useState();
  const [orderLimit, setOrderLimit] = useState<boolean>(false);
  const [warning, setWarning] = useState(false); // we give a warning to the user if the IVR approval date is older than 12 weeks
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [productList, setProductList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedParentProduct, setSelectedParentProduct] = useState("");
  const [productLogo, setProductLogo] = useState(null);
  const [productGraphic, setProductGraphic] = useState(null);
  const [orderProducts, setOrderProducts] = useState([
    { product: "", price: 0, qty: 0, discount: 0, amount: 0 },
  ]);

  const [page, setPage] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressName, setAddressName] = useState(null);
  const [fullAddress, setFullAddress] = useState(null);
  const [payors, setPayors] = useState([]);
  const [discountPercentages, setDiscountPercentages] = useState({});
  const [mac, setMac] = useState("");

  const summaryRef = useRef();

  // New state variable for the disclaimer checkbox
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [orderDialog, setOrderDialog] = useState(false);

  // --- START: New State for Shipping Options ---
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [selectedShippingOption, setSelectedShippingOption] = useState(""); // Can be 'ground', 'air', 'thirdParty'
  const [thirdPartyCarrier, setThirdPartyCarrier] = useState("");
  const [thirdPartyAccount, setThirdPartyAccount] = useState("");
  const [invoicingEmail, setInvoicingEmail] = useState("");
  const [hidePricing, setHidePricing] = useState(false);
  // --- END: New State for Shipping Options ---

  const [submitting, setSubmitting] = useState(false);

  const ACTIGRAFT_PRODUCT_KEYS = [
    "8E2F864C-B5E2-43BA-A374-F2D8DC0585D1",
    "A2769BB8-5680-4E24-AE3A-E98BB13AA713",
  ];

  // --- START: New useEffect to control shipping options visibility ---
  useEffect(() => {
    let isActigraft = false;
    if (data && selectedParentProduct) {
      const currentProduct =
        selectedParentProduct === "product" ? data.product : data.product2;
      if (
        currentProduct &&
        ACTIGRAFT_PRODUCT_KEYS.includes(currentProduct.___PRD) &&
        data?.product?.Brand === "ActiGraft"
      ) {
        isActigraft = true;
      }
    }
    setShowShippingOptions(isActigraft);
    setHidePricing(isActigraft);
    // Reset shipping state if the product is changed to a non-actigraft one
    if (!isActigraft) {
      setSelectedShippingOption("");
      setThirdPartyCarrier("");
      setThirdPartyAccount("");
      setInvoicingEmail("");
    }
  }, [data, selectedParentProduct]);

  const validateBeforeNext = () => {
    const servicedate = new Date(serviceDate || data?.ivr?.Date);
    const today = new Date();

    if (servicedate <= today) {
      five.message(
        "Date of Service cannot be earlier than or equal to today's date."
      );
      return;
    }

    if (
      orderProducts.length === 0 ||
      orderProducts.some((item) => !item.product || item.product.trim() === "")
    ) {
      five.message("Please add a product before placing an order.");
      return;
    }

    if (orderProducts.some((item) => item.qty <= 0)) {
      five.message("Item quantity cannot be 0.");
      return;
    }

    return true;
  };

  // --- END: New useEffect ---
  const handleSubmit = async () => {
    /*
    const servicedate = new Date(serviceDate || data?.ivr?.Date);
    const today = new Date();

    if (servicedate <= today) {
      five.message(
        "Date of Service cannot be earlier than or equal to today's date."
      );
      return;
    }

    if (
      orderProducts.length === 0 ||
      orderProducts.some((item) => !item.product || item.product.trim() === "")
    ) {
      five.message("Please add a product before placing an order.");
      return;
    }

    if (orderProducts.some((item) => item.qty <= 0)) {
      five.message("Item quantity cannot be 0.");
      return;
    }
    */

    const order = {
      ACT: data.account.___ACT,
      USR: data.practitioner.___USR,
      IVR: data.ivr.___IVR,
      ADD: selectedAddress,
      PAT: data?.patient?.___PAT,
      AddressName: addressName,
      amount: totalAmount,
      products: orderProducts,
      comment: comment,
      fullAddress: fullAddress,
      DateService: serviceDate,
      // Add shipping info to the order object
      ShippingOption: selectedShippingOption,
      Carrier: thirdPartyCarrier,
      ShippingAccount: thirdPartyAccount,
    };

    setSubmitting(true);
    await five.executeFunction(
      "pushOrder",
      //@ts-ignore
      order,
      null,
      null,
      null,
      () => {
        setSubmitting(false);
        handleDialogClose();
      }
    );
  };

  const handleSendEmail = async () => {
    const emailObject = {
      link: selectedRecord.data.editLink,
      email: email,
    };

    await five.executeFunction(
      "triggerEmailPDF",
      //@ts-ignore
      emailObject,
      null,
      null,
      null,
      () => {}
    );

    handleEmailDialogClose();
    five.message("Request Sent");
  };

  const filterProductList = (list) => {
    const newList = list.filter((item) => item._isActive !== null);

    return newList;
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setLoading(true);

    const fetchData = async () => {
      const orderObj = {
        IVRKey: selectedRecord.data.IVR,
      };
      // We get orders to check if the order limit exceeds the amount of 10 then we give the user a warning
      await five.executeFunction(
        "getOrders",
        //@ts-ignore
        orderObj,
        null,
        null,
        null,
        (result) => {
          const response = JSON.parse(result?.serverResponse?.results);
          const orders = response.response.value;
          setOrders(orders);

          if (orders.length > 10) {
            setOrderLimit(true);
          }
        }
      );

      await five.executeFunction(
        "getIVRDetails",
        //@ts-ignore
        selectedRecord.data,
        null,
        null,
        null,
        async (result) => {
          const response = JSON.parse(result.serverResponse.results);
       
          if (response.product) {
            setSelectedParentProduct("product");
            setProductList(filterProductList(response.productList));
          } else if (response.product2) {
            setSelectedParentProduct("product2");
            setProductList(filterProductList(response.productList2));
          }

          setData(response);
          if (response?.ivr?.ApprovalDate) {
            const approvalDate = new Date(response.ivr.ApprovalDate);
            const now = new Date();

            // “12 weeks ago” in milliseconds:
            const twelveWeeksInMs = 12 * 7 * 24 * 60 * 60 * 1000; // ~84 days
            const twelveWeeksAgo = new Date(now.getTime() - twelveWeeksInMs);

            if (approvalDate < twelveWeeksAgo) {
              setWarning(true);
            } else {
              setWarning(false);
            }
          }
          setProductList(filterProductList(response.productList));
          const primaryAddress = response.address.find(
            (addr) => addr._isPrimary === 1
          );
          setSelectedAddress(primaryAddress?.___ADD || "");
          setAddressName(primaryAddress?.AddressName);
          setFullAddress(primaryAddress);
          setDiscountPercentages({
            Impax: response.account?.DiscountPercentageImpax,
            Orion: response.account?.DiscountPercentageOrion,
            Surgraft: response.account?.DiscountPercentageSurgraft,
            Zenith: response.account?.DiscountPercentageZenith,
            Biovance: response.account?.DiscountPercentageBiovance,
            Biovance_3L: response.account?.DiscountPercentageBiovance3L,
            Rebound: response.account?.DiscountPercentageRebound,
            Complete_ACA: response.account?.DiscountPercentageACA,
            "Reeva FT": response.account?.DiscountPercentageReeva,
            "Amnio AMP-MP": response.account?.DiscountPercentageAmnio,
          });

          const payorKeys = [
            response?.patient?.__PAY1,
            response?.patient?.__PAY2,
          ].filter(Boolean);

          const payorPromises = payorKeys.map((payorKey) => {
            const payorMap = new Map<string, any>();
            payorMap.set("PayKey", payorKey);
            return new Promise((resolve) => {
              five.executeFunction(
                "getPatientInsurance",
                payorMap,
                null,
                null,
                null,
                (result) => {
                  const payorData = JSON.parse(result.serverResponse.results);
                  resolve(payorData.response.value[0]);
                }
              );
            });
          });

          const payorArray = await Promise.all(payorPromises);
          setPayors(payorArray);

          const currentProductKey = response.product ? response.product.___PRD
          : response.product2?.___PRD;

          if(currentProductKey) {
            const productKeyObj = {
              ProductKey: currentProductKey
            }
          

          await five.executeFunction("getProductLogo", productKeyObj, null, null, null, (logoResult) => {
            try {
                const logoResponse = JSON.parse(logoResult.serverResponse.results);
             
                // 4. Set the new state
                const logo = logoResponse.logo?.response
                const graphic = logoResponse.graphic?.response
                setProductLogo(logo)
                setProductGraphic(graphic)


              } catch (e) {
                console.error("Failed to parse logo response:", e);
              }
          })
        }
          setLoading(false);
        }
      );
    };
    fetchData();
  };

  const handleDialogClose = () => {
    setEmail(null);
    setLoading(false);
    setProductLogo(null)
    setComment("");
    setServiceDate("");
    setProductList([]);
    setTotalAmount(0);
    setSelectedParentProduct("");
    setOrderProducts([
      { product: "", price: 0, qty: 1, discount: 0, amount: 0 },
    ]);
    setPage(0);
    setSelectedAddress("");
    setAddressName(null);
    setFullAddress(null);
    setPayors([]);
    setDiscountPercentages({});
    // Reset new shipping states
    setShowShippingOptions(false);
    setSelectedShippingOption("");
    setThirdPartyCarrier("");
    setThirdPartyAccount("");
    setInvoicingEmail("");
    setDialogOpen(false);
  };

  const handleEmailDialogOpen = () => {
    setEmailDialogOpen(true);
  };

  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false);
  };

  const handleAddProductRow = () => {
    setOrderProducts([
      ...orderProducts,
      { product: "", price: 0, qty: 1, discount: 0, amount: 0 },
    ]);
  };

  // --- START: New Handler for Shipping Option Change ---
  const handleShippingChange = (option) => {
    // This logic makes the checkboxes behave like radio buttons
    setSelectedShippingOption((prev) => (prev === option ? "" : option));
  };
  // --- END: New Handler ---

  const handleParentProductChange = (event) => {
    const selectedProduct = event.target.value;

    // Update the selected parent product
    setSelectedParentProduct(selectedProduct);

    // Clear selected order products and update productList with the sub-products of the selected parent product
    setOrderProducts([]);
    if (selectedProduct === "product") {
      setProductList(filterProductList(data.productList));
    } else if (selectedProduct === "product2") {
      setProductList(filterProductList(data.productList2));
    }
  };

  function getQuarter(date) {
    const month = date.getMonth() + 1; // 1–12
    if (month >= 1 && month <= 3) return 1;
    if (month >= 4 && month <= 6) return 2;
    if (month >= 7 && month <= 9) return 3;
    return 4;
  }

  function isDateInNextOrFutureQuarter(serviceDateStr) {
    if (!serviceDateStr) return false;

    const today = new Date();
    const serviceDate = new Date(serviceDateStr);

    const currentYear = today.getFullYear();
    const currentQuarter = getQuarter(today);

    let nextQuarter = currentQuarter + 1;
    let nextYear = currentYear;
    if (nextQuarter > 4) {
      nextQuarter = 1;
      nextYear += 1;
    }

    const serviceYear = serviceDate.getFullYear();
    const serviceQuarter = getQuarter(serviceDate);

    if (serviceYear > nextYear) return true;
    if (serviceYear === nextYear) {
      return serviceQuarter >= nextQuarter;
    }
    if (serviceYear > currentYear && serviceYear < nextYear) return true;
    if (serviceYear === currentYear) {
      return serviceQuarter >= nextQuarter;
    }
    return false;
  }

  const handleProductChange = (index, field, value) => {
    const selectedProduct = productList.find(
      (product) => product.___PRD === value
    );
    const newOrderProducts = [...orderProducts];

    if (field === "product" && selectedProduct) {
      const useFutureRate = isDateInNextOrFutureQuarter(serviceDate);

    let price =
  useFutureRate && selectedProduct.FutureBillRate
    ? selectedProduct.FutureBillRate
    : selectedProduct.BillRate;

      if (
        useFutureRate &&
        (price === null || price === undefined || price === "")
      ) {
        price = selectedProduct.BillRate;
      }

      if (price === null || price === undefined || price === "") {
        price = newOrderProducts[index].price || 0;
      }

      const currentMainProduct =
        selectedParentProduct === "product" ? data.product : data.product2;
      const brand = currentMainProduct?.Brand || "Unknown";
      const discount = discountPercentages[brand] || 0;

      const qty = newOrderProducts[index].qty || 1;
      const amount = price * qty * (1 - discount);

      newOrderProducts[index] = {
        product: selectedProduct.___PRD,
        price,
        qty,
        discount,
        amount,
      };
    } else {
      newOrderProducts[index][field] = value;
      if (field === "qty") {
        const currentMainProduct =
          selectedParentProduct === "product" ? data.product : data.product2;
        const brand = currentMainProduct?.Brand || "Unknown";
        const discount = discountPercentages[brand] || 0;
        newOrderProducts[index].amount =
          newOrderProducts[index].price * value * (1 - discount);
      }
    }

    setOrderProducts(newOrderProducts);
  };

  const handleAddressChange = (event) => {
    const address = JSON.parse(event.target.value);
    setSelectedAddress(address.ADD);
    setAddressName(address.Name);
    setFullAddress(address.address);
    setMac(getMacValue(address.address?.AddressState));
  };

  const handleDelete = (index) => {
    const newOrderProducts = orderProducts.filter((_, i) => i !== index);
    setOrderProducts(newOrderProducts);
  };

  const handleOrderDialogClose = () => {
    setOrderDialog(false);
  };

  const handleOrderDialog = () => {
    setOrderLimit(false);
    handleOrderDialogClose();
  };

  const handleNext = () => {
    setPage(--page);
  };

  const getTotalAmount = () => {
    return orderProducts.reduce((total, product) => total + product.amount, 0);
  };

  const handleComment = (event) => {
    setComment(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setServiceDate(newDate);

    const isFuture = isDateInNextOrFutureQuarter(newDate);

    const updatedProducts = orderProducts.map((op) => {
      if (!op.product) {
        return op;
      }

      const matchedProduct = productList.find((p) => {
        return p.___PRD === op.product;
      });

      if (!matchedProduct) return op;

    let price =
  isFuture && matchedProduct.FutureBillRate
    ? matchedProduct.FutureBillRate
    : matchedProduct.BillRate;

      if (
        useFutureRate &&
        (price === null || price === undefined || price === "")
      ) {
        price = matchedProduct.BillRate;
      }

      if (price === null || price === undefined || price === "") {
        price = op.price;
      }

      const currentMainProduct =
        selectedParentProduct === "product" ? data.product : data.product2;
      const brand = currentMainProduct?.Brand || "Unknown";
      const discount = discountPercentages[brand] || 0;

      // FIX: Use op.qty with a fallback to prevent undefined multiplication
      const qty = op.qty || 0;
      const newAmount = price * qty * (1 - discount);

      return {
        ...op,
        price,
        discount, // ADD THIS LINE - preserve discount in the updated product
        amount: newAmount,
      };
    });

    setOrderProducts(updatedProducts);

  };

  const getMacValue = (state) => {
    const macMapping = {
      Noridian: [
        "AK",
        "WA",
        "OR",
        "ID",
        "MT",
        "WY",
        "ND",
        "SD",
        "UT",
        "AZ",
        "CA",
        "NV",
        "HI",
      ],
      Novitas: [
        "CO",
        "NM",
        "TX",
        "OK",
        "AR",
        "LA",
        "MS",
        "NJ",
        "PA",
        "DE",
        "MD",
        "DC",
      ],
      WPS: ["NE", "KS", "IA", "MO", "MI", "IN"],
      NGS: ["MN", "WI", "IL", "ME", "VT", "NH", "MA", "CT", "RI", "NY"],
      CGS: ["OH", "KY"],
      Palmetto: ["WV", "VA", "NC", "SC", "TN", "AL", "GA"],
      FCSO: ["FL"],
    };

    for (const [mac, states] of Object.entries(macMapping)) {
      if (states.includes(state)) {
        return mac;
      }
    }

    return "Unknown";
  };

  useEffect(() => {
    setTotalAmount(getTotalAmount());
    setMac(getMacValue(fullAddress?.AddressState));
  }, [orderProducts, fullAddress, orderLimit]);

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box>
      <Button
        id="place-order-btn"
        fullWidth
        onClick={handleDialogOpen}
        style={{
          background: "#8DAC6E",
          color: "white",
        }}
      >
        Place Order
      </Button>
      <Dialog
        id="order-dialog"
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            width: "90%",
            height: "90%",
          },
        }}
      >
        <DialogTitle style={{ backgroundColor: "#15706A", color: "white" }}>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography>Place Order</Typography>
          </Box>
        </DialogTitle>
        {page === 0 && (
          <DialogContent
            style={{ maxWidth: "100%", overflowX: "hidden", padding: "10px" }}
          >
            {submitting ? (
              <Container
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px",
                  minHeight: "300px",
                }}
              >
                <CircularProgress size={60} />
                <Typography variant="h6" mt={3} style={{ color: "#14706A" }}>
                  Placing your order...
                </Typography>
              </Container>
            ) : (
              <>
                {orderLimit && (
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Alert
                      severity="warning"
                      sx={{ mt: 2, fontWeight: "bold", flex: 2 }}
                    >
                      {orders.length} orders have previously been submitted for
                      this IVR. Are you sure you would like to continue?
                    </Alert>
                    <Button
                      sx={{
                        background: "#14706A",
                        color: "white",
                        marginTop: "10px",
                        marginLeft: "5px",
                      }}
                      onClick={handleOrderDialog}
                    >
                      Yes
                    </Button>
                  </Box>
                )}

                {warning && (
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Alert
                      severity="warning"
                      sx={{ mt: 2, fontWeight: "bold", flex: 2 }}
                    >
                      The approval date is greater than 12 weeks, Are you sure
                      you would like to continue?
                    </Alert>
                    <Button
                      sx={{
                        background: "#14706A",
                        color: "white",
                        marginTop: "10px",
                        marginLeft: "5px",
                      }}
                      onClick={() => setWarning(false)}
                    >
                      Yes
                    </Button>
                  </Box>
                )}

                <Typography variant="h6" mt={5}>
                  Details:{" "}
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody style={{ border: "1px solid black" }}>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <strong>Patient: </strong>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          {data?.ivr?.Patient}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <Typography
                            component="th"
                            onClick={() => setPage(page + 1)}
                            sx={{
                              cursor: "pointer",
                              background: "#14706A",
                              padding: "10px",
                              color: "white",
                              textAlign: "center",
                              fontSize: "16px",
                              fontWeight: "bold",
                              borderRadius: "5px",
                              transition: "color 0.2s, text-decoration 0.2s",
                              "&:hover": {
                                background: "#0F5E50", // darker teal on hover
                              },
                            }}
                          >
                            View Patient Benefit Summary
                          </Typography>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        ></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <strong>Products:</strong>
                        </TableCell>
                        <TableCell style={{ width: "25%" }}>
                          <Select
                            id="parent-product-select"
                            value={selectedParentProduct}
                            onChange={handleParentProductChange}
                            fullWidth
                          >
                            {data?.product && (
                              <MenuItem id="product1-option" value="product">
                                {data?.product?.Brand +
                                  "-" +
                                  data?.product?.QCode}
                              </MenuItem>
                            )}
                            {data?.product2 && (
                              <MenuItem id="product2-option" value="product2">
                                {data?.product2?.Brand +
                                  "-" +
                                  data?.product2?.QCode}
                              </MenuItem>
                            )}
                          </Select>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <strong>Wound Size (CM²):</strong>
                        </TableCell>
                        <TableCell style={{ width: "25%" }}>
                          {data?.ivr?.WoundSizeCalc}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <strong>Wound Type:</strong>
                        </TableCell>
                        <TableCell style={{ width: "25%" }}>
                          {data?.ivr?.WoundType}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <strong>Account:</strong>
                        </TableCell>
                        <TableCell style={{ width: "25%" }}>
                          {data?.ivr?.Account}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <strong>Approval Date:</strong>
                        </TableCell>
                        <TableCell style={{ width: "25%" }}>
                          {data?.ivr?.ApprovalDate}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <strong>Date Of Service:</strong>
                        </TableCell>
                        <TableCell style={{ width: "25%" }}>
                          <TextField
                            id="service-date-input"
                            type="date"
                            defaultValue={data?.ivr?.Date}
                            onChange={(e) => handleDateChange(e.target.value)}
                            InputProps={{
                              style: { fontSize: "0.875rem" },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <strong>Place Of Service:</strong>
                        </TableCell>
                        <TableCell style={{ width: "25%" }}>
                          {data?.ivr?.PlaceofService}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "25%" }}
                        >
                          <strong>MAC:</strong>
                        </TableCell>
                        <TableCell style={{ width: "25%" }}>{mac}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="h6" mt={5}>
                  Address:{" "}
                </Typography>
                <TableContainer style={{ marginTop: "20px" }} component={Paper}>
                  <Table>
                    <TableBody style={{ border: "1px solid black" }}>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "50%", verticalAlign: "top" }}
                        >
                          <strong>Shipping Address:</strong>
                          <Select
                            id="shipping-address-select"
                            value={JSON.stringify({
                              address: fullAddress,
                              ADD: selectedAddress,
                              Name: addressName,
                            })}
                            onChange={handleAddressChange}
                            displayEmpty
                            fullWidth
                            style={{ marginTop: "8px" }}
                          >
                            {data?.address.map((address, index) => (
                              <MenuItem
                                id={`address-option-${index}`}
                                key={address.___ADD}
                                value={JSON.stringify({
                                  address: address,
                                  ADD: address.___ADD,
                                  Name: address.AddressName,
                                })}
                              >
                                {address.AddressName}
                                <br />
                                {address.AddressStreet +
                                  " " +
                                  address.AddressCity}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell
                          style={{ width: "50%", verticalAlign: "top" }}
                        >
                          <strong>Address:</strong>
                          <br />
                          Legacy Medical Consultants
                          <br />
                          9800 Hillwood Parkway, Suite 320
                          <br />
                          Fort Worth, TX 76177
                          <br />
                          p. 817-961-1288 f. 866-300-0431
                          <br />
                          customerservice@legacymedicalconsultants.com
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="h6" mt={5}>
                  Please Select the Desired Products for the Order
                </Typography>
                <Table id="products-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      {!hidePricing && <TableCell>Price</TableCell>}
                      <TableCell>Qty</TableCell>
                      {!hidePricing && <TableCell>Discount</TableCell>}
                      {!hidePricing && <TableCell>Amount</TableCell>}
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderProducts.length == 0 ? (
                      <TableRow>
                        <TableCell colSpan={hidePricing ? 3 : 6} align="center">
                          <Typography color="error" sx={{ flex: 1 }}>
                            No record found! Click the '+' button to add a new
                            record.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {orderProducts.map((orderProduct, index) => (
                      <TableRow id={`product-row-${index}`} key={index}>
                        <TableCell>
                          <Select
                            id={`product-select-${index}`}
                            value={orderProduct.product}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "product",
                                e.target.value
                              )
                            }
                            displayEmpty
                            fullWidth
                          >
                            <MenuItem value="">Select Product</MenuItem>
                            {productList.map((product, prodIndex) => (
                              <MenuItem
                                id={`product-option-${index}-${prodIndex}`}
                                key={product.___PRD}
                                value={product.___PRD}
                              >
                                {product.Product} - {product.Description}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        {!hidePricing && (
                          <TableCell>
                            <Typography variant="body1">
                              {"$" +
                                Number(
                                  orderProduct.price.toFixed(2)
                                ).toLocaleString("en-US")}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell>
                          <input
                            id={`quantity-input-${index}`}
                            type="number"
                            value={orderProduct.qty}
                            onChange={(e) =>
                              handleProductChange(index, "qty", e.target.value)
                            }
                            min="1"
                            style={{ width: "60px" }}
                          />
                        </TableCell>
                        {!hidePricing && (
                          <TableCell>
                            <Typography
                              variant="body1"
                              style={{ padding: "20px 5px", height: "inherit" }}
                            >
                              {(orderProduct.discount * 100).toFixed(2)}%
                            </Typography>
                          </TableCell>
                        )}
                        {!hidePricing && (
                          <TableCell>
                            <Typography variant="body1">
                              {"$" +
                                Number(
                                  orderProduct.amount.toFixed(2)
                                ).toLocaleString("en-US")}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell>
                          <IconButton
                            id={`delete-product-${index}`}
                            onClick={() => handleDelete(index)}
                            style={{ color: "red" }}
                          >
                            <Typography
                              variant="body2"
                              style={{ color: "red" }}
                            >
                              Delete
                            </Typography>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!hidePricing && (
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <Typography
                            variant="body1"
                            style={{ fontWeight: "bold" }}
                          >
                            Total Amount
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            style={{ fontWeight: "bold" }}
                          >
                            {"$" +
                              Number(totalAmount.toFixed(2)).toLocaleString(
                                "en-US"
                              )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    id="add-product-btn"
                    onClick={handleAddProductRow}
                    style={{
                      background: "#D8EEDA",
                      color: "#157069",
                      borderRadius: "50px",
                    }}
                  >
                    +
                  </Button>
                </Box>

                {/* --- START: New Shipping Options Section --- */}
                {showShippingOptions && (
                  <Box mt={5} p={2} component={Paper} variant="outlined">
                    <Grid container spacing={4} alignItems="flex-start">
                      {/* Left Side: Shipping Options */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                          Shipping Options
                        </Typography>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  selectedShippingOption ===
                                  "Ground Freight (1-7 Days) $30/BX"
                                }
                                onChange={() =>
                                  handleShippingChange(
                                    "Ground Freight (1-7 Days) $30/BX"
                                  )
                                }
                              />
                            }
                            label="Ground Freight (1-7 Days) $30/BX"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  selectedShippingOption ===
                                  "2-Day Air - $70/BX"
                                }
                                onChange={() =>
                                  handleShippingChange("2-Day Air - $70/BX")
                                }
                              />
                            }
                            label="2-Day Air - $70/BX"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  selectedShippingOption === "Bill 3rd Party"
                                }
                                onChange={() =>
                                  handleShippingChange("Bill 3rd Party")
                                }
                              />
                            }
                            label="Bill 3rd Party - submit carrier & account number"
                          />
                        </FormGroup>
                        {selectedShippingOption === "Bill 3rd Party" && (
                          <Box display="flex" gap={2} mt={2} ml={0}>
                            <TextField
                              label="Carrier"
                              variant="outlined"
                              size="small"
                              value={thirdPartyCarrier}
                              onChange={(e) =>
                                setThirdPartyCarrier(e.target.value)
                              }
                            />
                            <TextField
                              label="Account Number"
                              variant="outlined"
                              size="small"
                              value={thirdPartyAccount}
                              onChange={(e) =>
                                setThirdPartyAccount(e.target.value)
                              }
                            />
                          </Box>
                        )}
                      </Grid>
                      {/* Right Side: Invoicing Email */}
                    </Grid>
                  </Box>
                )}
                {/* --- END: New Shipping Options Section --- */}

                <Typography variant="body1" sx={{ mb: 1 }} mt={5}>
                  Write your comments here
                </Typography>
                <TextField
                  id="comments-input"
                  fullWidth
                  value={comment}
                  multiline
                  onChange={handleComment}
                  rows={4}
                  variant="outlined"
                  placeholder="Comments..."
                />
                {data?.account?.FacilityType === "SNF" ? (
                  <Box mt={5}>
                    <Typography
                      variant="body1"
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "600",
                        fontStyle: "bold",
                      }}
                    >
                      Disclaimer
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        fontSize: "1rem",
                        fontWeight: "500",
                      }}
                    >
                      By placing this order, the user acknowledges and agrees
                      that orders for products placed through this system are
                      contingent upon the patient's eligibility and
                      authorization status as determined by the original
                      submission.{" "}
                      <strong>
                        It is the responsibility of the practitioner to verify
                        that no changes have occurred to the patient's
                        eligibility or authorization status
                      </strong>{" "}
                      that would impact their qualification for the products
                      ordered.
                      <br />
                      <br />
                      The portal does not automatically verify any change in
                      eligibility or authorization status. By placing an order,
                      the practitioner certifies that they have independently
                      verified the patient's current eligibility. Any orders
                      placed under incorrect eligibility assumptions remain the
                      sole responsibility of the facility, and Legacy Medical
                      Consultants shall not be liable for orders made under
                      changed eligibility circumstances.
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="disclaimer-checkbox"
                          checked={disclaimerChecked}
                          onChange={(e) =>
                            setDisclaimerChecked(e.target.checked)
                          }
                        />
                      }
                      label="I agree to the disclaimer"
                    />
                  </Box>
                ) : (
                  <Box mt={1}>
                    <Typography
                      variant="caption"
                      display="block"
                      gutterBottom
                      style={{ fontSize: "0.65rem" }}
                    >
                      Disclaimer: Please note that all prices are estimates and
                      may vary based on final assessment or additional factors.
                    </Typography>
                  </Box>
                )}

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    id="cancel-order-btn"
                    variant="contained"
                    onClick={handleDialogClose}
                    style={{ background: "#D8EEDA", color: "#157069" }}
                  >
                    Cancel
                  </Button>
              {/*     <Button
                    id="submit-order-btn"
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      background: "#14706A",
                      color: "white",
                      "&.Mui-disabled": {
                        background: "#ccc",
                        color: "#666",
                      },
                    }}
                    disabled={orderLimit === true || warning === true}
                  >
                    Submit
                  </Button> */}
                  <Button
                      id="next-to-checkout-btn"
                      variant="contained"
                      // onClick={() => setPage(2)}
                      onClick={() => { if (validateBeforeNext()) setPage(2); }}
                      sx={{
                        background: "#14706A",
                        color: "white",
                        "&:hover": { background: "#0F5E50" },
                      }}
                    >
                      Next
                    </Button>
                </Box>
              </>
            )}
          </DialogContent>
        )}
        {page === 1 && (
          <DialogContent
            style={{ maxWidth: "100%", overflowX: "hidden", padding: "10px" }}
          >
            <Summary
              ivr={data?.ivr}
              ref={summaryRef}
              practitioner={data?.practitioner}
              handleNext={handleNext}
              handleDialogClose={handleDialogClose}
              payors={payors}
              five={five}
              patient={data?.patient}
            />
          </DialogContent>
        )}

        {page === 2 && (
  <DialogContent
    style={{ maxWidth: "100%", overflowX: "hidden", padding: "10px" }}
  >
    <CheckoutForm
      ivr={data?.ivr}
      practitioner={data?.practitioner}
      patient={data?.patient}
      serviceDate={serviceDate || data?.ivr?.Date}
      logo={productLogo}
      graphic={productGraphic}
      address={fullAddress}
      orderProducts={orderProducts}
      account={data?.account}
      selectedProduct={
        selectedParentProduct === "product"
          ? data?.product
          : data?.product2
      }
      productList={productList}
      onSubmit={handleSubmit}
      onBack={() => setPage(0)}
      submitting={submitting}
      showShippingOptions={showShippingOptions}
      selectedShippingOption={selectedShippingOption}
      onShippingChange={handleShippingChange}
      thirdPartyCarrier={thirdPartyCarrier}
      onThirdPartyCarrierChange={setThirdPartyCarrier}
      thirdPartyAccount={thirdPartyAccount}
      onThirdPartyAccountChange={setThirdPartyAccount}
    />
  </DialogContent>
)}
        <Dialog
          id="email-dialog"
          open={emailDialogOpen}
          onClose={handleEmailDialogClose}
        >
          <DialogTitle>Send PDF</DialogTitle>
          <DialogContent style={{ width: "400px" }}>
            <Typography variant="body1" mb={5}>
              Please provide your email address, and you will receive a PDF of
              the patient beneficiary summary.
            </Typography>
            <Typography variant="body2" style={{ color: "red" }}>
              <span style={{ fontWeight: "bold", color: "black" }}>NOTE:</span>{" "}
              it can take up to 5 minutes for you to receive the email.
            </Typography>
            <TextField
              id="email-input"
              fullWidth
              margin="normal"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Box
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Button
                id="send-email-btn"
                style={{
                  width: "15vw",
                  backgroundColor: "#1d343d",
                  color: "white",
                }}
                onClick={handleSendEmail}
              >
                Send
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Dialog>
    </Box>
  );
};

export default CustomField;
