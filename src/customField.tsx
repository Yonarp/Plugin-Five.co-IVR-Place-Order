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
} from "@mui/material";

import { CustomFieldProps } from "../../../common";
import Summary from "./Components/Summary";

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

  /* const discountPercentages = {
    Impax: 0.2,
    Orion: 0.4,
    Surgraft: 0.1,
    Zenith: 0.3,
  }; */

  const handleSubmit = async () => {
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
    };

    await five.executeFunction(
      "pushOrder",
      //@ts-ignore
      order,
      null,
      null,
      null,
      () => {}
    );
    handleDialogClose();
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
          console.log("Logging response to check order", response);
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
          setLoading(false);
        }
      );
    };
    fetchData();
  };

  const handleDialogClose = () => {
    setEmail(null);
    setLoading(false);
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

  /**
   * Checks if the given serviceDate (string) is in the next quarter or beyond
   * relative to "today".
   */
  function isDateInNextOrFutureQuarter(serviceDateStr) {
    if (!serviceDateStr) return false; // If no date chosen, treat as false

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

    // The service date's year/quarter
    const serviceYear = serviceDate.getFullYear();
    const serviceQuarter = getQuarter(serviceDate);

    // 1) If service date's year is greater than nextYear => definitely "next or future"
    // 2) If service date's year is less than nextYear => definitely NOT "next quarter or beyond"
    // 3) If same year as nextYear => check if quarter >= nextQuarter
    //    If serviceYear > currentYear but < nextYear, it means we're already into next year
    //    (which could be Q1 but might be beyond).

    // first check if serviceYear > currentYear
    if (serviceYear > currentYear) {
      // if serviceYear is bigger than nextYear, definitely beyond
      if (serviceYear > nextYear) return true;

      // if serviceYear == nextYear, check quarters
      if (serviceYear === nextYear) {
        return serviceQuarter >= nextQuarter;
      } else {
        // If the serviceYear is exactly currentYear + 1, that *is* nextYear
        // This case is covered above, just leaving it for clarity
        return true;
      }
    } else {
      // if serviceYear == currentYear, we have to see if the quarter is beyond the nextQuarter
      // (but that can only happen if the service date is in Q3 or Q4 and nextQuarter is Q2, for example).
      // It's simpler to compare if the service date is >= the start of "nextQuarter" in the current year
      // if the serviceYear is the same as currentYear, it cannot be *beyond* next quarter,
      // unless nextQuarter is Q4 and the user picks Q4 or something.

      // The numeric "rank" of the service quarter, e.g. Q4 = 4, Q2 = 2
      // If serviceQuarter >= nextQuarter, that means it's in the next or future quarter within the same year
      if (serviceYear === currentYear) {
        return serviceQuarter >= nextQuarter;
      }
    }
    // default
    return false;
  }

  const handleProductChange = (index, field, value) => {
    const selectedProduct = productList.find(
      (product) => product.___PRD === value
    );
    const newOrderProducts = [...orderProducts];

    if (field === "product" && selectedProduct) {
      const useFutureRate = isDateInNextOrFutureQuarter(serviceDate);

      let price = useFutureRate
        ? selectedProduct.FutureBillRate
        : selectedProduct.BillRate;

      if (price === null || price === undefined || price === "") {
        price = 0;
      }

      const brand = data?.product?.Brand || "Unknown";
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
      // If the user changes quantity or some other field
      newOrderProducts[index][field] = value;
      if (field === "qty") {
        const brand = data?.product?.Brand || "Unknown";
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

  // When Service Date goes to next quarter we use FutureBillRate as the field to update the price

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

      let price = isFuture
        ? matchedProduct.FutureBillRate
        : matchedProduct.BillRate;

      // Future Bill Rate might come undefined from the API
      if (price === null || price === undefined || price === "") {
        price = 0;
      }

      const brand = data?.product?.Brand || "Unknown";
      const discount = discountPercentages[brand] || 0;
      const newAmount = price * op.qty * (1 - discount);

      return {
        ...op,
        price,
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
            
            {/* <Button
              id="download-pdf-btn"
               onClick={() => summaryRef.current.downloadPdf()} 
              onClick={() => setPage(++page)}
              style={{ background: "none", color: "white" }}
            >
              View Patient Summary
            </Button> */}

            {/* Download as PDF &#8595; */}
          </Box>
        </DialogTitle>
        {page === 0 && (
          <DialogContent
            style={{ maxWidth: "100%", overflowX: "hidden", padding: "10px" }}
          >
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
                  {orders.length} orders have previously been submitted for this
                  IVR. Are you sure you would like to continue?
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
                  The approval date is greater than 12 weeks, Are you sure you
                  would like to continue?
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
                    <TableCell component="th" scope="row">
                      <strong>Patient: </strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                       {data?.ivr?.Patient}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography
                        component="p"
                        onClick={() => setPage(page + 1)}
                        sx={{
                          cursor: "pointer",
                          background: "#14706A",
                          padding: "10px",
                          color: 'white',
                          textAlign: 'center',
                          fontSize: "16px",
                          fontWeight: "bold",
                          borderRadius: '5px',
                          transition: "color 0.2s, text-decoration 0.2s",
                          "&:hover": {
                            background: "#0F5E50", // darker teal on hover
                          },
                        }}
                      >
                        View Patient Benefit Summary.
                      </Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                    </TableCell>

                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <strong>Products:</strong>
                    </TableCell>
                    <TableCell>
                      <Select
                        id="parent-product-select"
                        value={selectedParentProduct}
                        onChange={handleParentProductChange}
                        fullWidth
                      >
                        {data?.product && (
                          <MenuItem id="product1-option" value="product">
                            {data?.product?.Brand + "-" + data?.product?.QCode}
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
                    <TableCell component="th" scope="row">
                      <strong>Wound Size (CM²):</strong>
                    </TableCell>
                    <TableCell>{data?.ivr?.WoundSizeCalc}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <strong>Wound Type:</strong>
                    </TableCell>
                    <TableCell>{data?.ivr?.WoundType}</TableCell>
                    <TableCell component="th" scope="row">
                      <strong>Account:</strong>
                    </TableCell>
                    <TableCell>{data?.ivr?.Account}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <strong>Approval Date:</strong>
                    </TableCell>
                    <TableCell>{data?.ivr?.ApprovalDate}</TableCell>
                    <TableCell component="th" scope="row">
                      <strong>Date Of Service:</strong>
                    </TableCell>
                    <TableCell>
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
                    <TableCell component="th" scope="row">
                      <strong>Place Of Service:</strong>
                    </TableCell>
                    <TableCell>{data?.ivr?.PlaceofService}</TableCell>
                    <TableCell component="th" scope="row">
                      <strong>MAC:</strong>
                    </TableCell>
                    <TableCell>{mac}</TableCell>
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
                            {address.AddressStreet + " " + address.AddressCity}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell style={{ width: "50%", verticalAlign: "top" }}>
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
              Please Select The Desired Products For The Order
            </Typography>
            <Table id="products-table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderProducts.length == 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
                          handleProductChange(index, "product", e.target.value)
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
                    <TableCell>
                      <Typography variant="body1">
                        {"$" +
                          Number(orderProduct.price.toFixed(2)).toLocaleString(
                            "en-US"
                          )}
                      </Typography>
                    </TableCell>
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
                    <TableCell>
                      <Typography
                        variant="body1"
                        style={{ padding: "20px 5px", height: "inherit" }}
                      >
                        {(orderProduct.discount * 100).toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {"$" +
                          Number(orderProduct.amount.toFixed(2)).toLocaleString(
                            "en-US"
                          )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        id={`delete-product-${index}`}
                        onClick={() => handleDelete(index)}
                        style={{ color: "red" }}
                      >
                        <Typography variant="body2" style={{ color: "red" }}>
                          Delete
                        </Typography>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Total Amount
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      {"$" +
                        Number(totalAmount.toFixed(2)).toLocaleString("en-US")}
                    </Typography>
                  </TableCell>
                </TableRow>
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
                  By placing this order, the user acknowledges and agrees that
                  orders for products placed through this system are contingent
                  upon the patient's eligibility and authorization status as
                  determined by the original submission.{" "}
                  <strong>
                    It is the responsibility of the practitioner to verify that
                    no changes have occurred to the patient's eligibility or
                    authorization status
                  </strong>{" "}
                  that would impact their qualification for the products
                  ordered.
                  <br />
                  <br />
                  The portal does not automatically verify any change in
                  eligibility or authorization status. By placing an order, the
                  practitioner certifies that they have independently verified
                  the patient's current eligibility. Any orders placed under
                  incorrect eligibility assumptions remain the sole
                  responsibility of the facility, and Legacy Medical Consultants
                  shall not be liable for orders made under changed eligibility
                  circumstances.
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="disclaimer-checkbox"
                      checked={disclaimerChecked}
                      onChange={(e) => setDisclaimerChecked(e.target.checked)}
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
                  Disclaimer: Please note that all prices are estimates and may
                  vary based on final assessment or additional factors.
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
              <Button
                id="submit-order-btn"
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  background: "#14706A",
                  color: "white",
                  "&.Mui-disabled": {
                    background: "#ccc", // Disabled background color
                    color: "#666", // Disabled text color
                  },
                }}
                disabled={
                  /* data?.account?.FacilityType === "SNF" ||  */ orderLimit ===
                    true || warning === true
                }
              >
                Submit
              </Button>
            </Box>
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
