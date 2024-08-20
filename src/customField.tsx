//@ts-nocheck
import React, { useEffect, useState } from "react";

//@ts-ignore
import { Box, Card, CircularProgress, FiveInitialize } from "./FivePluginApi";
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
  IconButton,
  TextField,
  TableContainer,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { CustomFieldProps } from "../../../common";
import Summary from "./Components/Summary";
import { Email } from "@mui/icons-material";

FiveInitialize();

const CustomField = (props: CustomFieldProps) => {
  //@ts-ignore
  const { theme, value, onValueUpdated, variant, five, selectedRecord } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  //@ts-ignore
  const [productList, setProductList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [orderProducts, setOrderProducts] = useState([
    { product: "", price: 0, qty: 1, discount: 0, amount: 0 },
  ]);

  const [page, setPage] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressName, setAddressName] = useState(null);
  const [fullAddress, setFullAddress] = useState(null);
  const [payors, setPayors] = useState([]);

  const discountPercentages = {
    Impax: 0.2,
    Orion: 0.4,
    Surgraft: 0.1,
    Zenith: 0.3,
  };

  const handleSubmit = async () => {
    const order = {
      ACT: data.account.___ACT,
      USR: data.practitioner.___USR,
      IVR: data.ivr.___IVR,
      ADD: selectedAddress,
      AddressName: addressName,
      amount: totalAmount,
      products: orderProducts,
      comment: comment,
    };

    console.log("Printing Orders", order);

    await five.executeFunction(
      "pushOrder",
      //@ts-ignore
      order,
      null,
      null,
      null,
      (result) => {}
    );
    handleDialogClose();
  };

  const handleSendEmail = async () => {


    const emailObject = {
      link: selectedRecord.data.editLink,
      email: email,
    }

    await five.executeFunction(
      "triggerEmailPDF",
      //@ts-ignore
      emailObject,
      null,
      null,
      null,
      (result) => {
        
      }
    );
    
    handleEmailDialogClose()
    five.message("Request Sent")
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setLoading(true);

    const fetchData = async () => {
      await five.executeFunction(
        "getIVRDetails",
        //@ts-ignore
        selectedRecord.data,
        null,
        null,
        null,
        async (result) => {
          console.log("Logging Order");
          const response = JSON.parse(result.serverResponse.results);
          console.log(response);
          setData(response);
          setProductList(response.productList);
          const primaryAddress = response.address.find(
            (addr) => addr._isPrimary === 1
          );
          setSelectedAddress(primaryAddress?.___ADD || "");
          setAddressName(primaryAddress?.AddressName);
          setFullAddress(primaryAddress);

          const payorKeys = [
            response?.patient?.__PAY1,
            response?.patient?.__PAY2,
          ].filter(Boolean);

          const payorPromises = payorKeys.map((payorKey) => {
            const payorObject = { PayKey: payorKey };
            return new Promise((resolve) => {
              five.executeFunction(
                "getPatientInsurance",
                payorObject,
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

  const handleProductChange = (index, field, value) => {
    const selectedProduct = productList.find(
      (product) => product.___PRD === value
    );
    const newOrderProducts = [...orderProducts];
    if (field === "product" && selectedProduct) {
      const brand = data?.product?.Brand || "Unknown";
      const discount = discountPercentages[brand] || 0;
      const price = selectedProduct.BillRate;
      const qty = newOrderProducts[index].qty;
      const amount = price * qty * (1 - discount);

      newOrderProducts[index] = {
        product: selectedProduct.___PRD,
        price: price,
        qty: qty,
        discount: discount,
        amount: amount,
      };
    } else {
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
    console.log("Logging address", address);
    setSelectedAddress(address.ADD);
    setAddressName(address.Name);
    setFullAddress(address.address);
  };

  const handleDelete = (index) => {
    const newOrderProducts = orderProducts.filter((_, i) => i !== index);
    setOrderProducts(newOrderProducts);
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
  };

  useEffect(() => {
    setTotalAmount(getTotalAmount());
  }, [orderProducts]);

  console.log("Printing payors", payors);

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
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            width: "90%",
            height: "90%",
            padding: "20px",
          },
        }}
      >
        <DialogTitle style={{ backgroundColor: "#246382", color: "white" }}>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography>Place Order</Typography>
            <IconButton
              style={{
                width: 'auto',
                height:'auto',
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleEmailDialogOpen}
            >
              <Email   style={{
                  fill: "#FFF",
                  color: "#FFF",
                  cursor: "pointer",
                  marginRight: "5px",
                }} />
              <Typography
                variant="body1"
                style={{
                  fill: "#FFF",
                  color: "#FFF",
                  cursor: "pointer",
                }}
              >
                Get Email
              </Typography>
            </IconButton>
          </Box>
        </DialogTitle>
        {page === 0 && (
          <DialogContent
            style={{ maxWidth: "100%", overflowX: "hidden", padding: "10px" }}
          >
            <Typography variant="h6" mt={5}>
              Details:{" "}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableBody style={{ border: "1px solid black" }}>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <strong>Products:</strong>
                    </TableCell>
                    <TableCell>
                      {data?.product?.Brand + "-" + data?.product?.QCode}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <strong>Wound Size (CM²):</strong>
                    </TableCell>
                    <TableCell>{data?.ivr?.WoundSize}</TableCell>
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
                        type="date"
                        defaultValue={data?.ivr?.Date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        InputProps={{
                          style: { fontSize: "0.875rem" }, // Adjust font size to match other cells
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
                    <TableCell>{data?.account?.MacValue}</TableCell>
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
                        {data?.address.map((address) => (
                          <MenuItem
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
            <Table>
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
                {orderProducts.map((orderProduct, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={orderProduct.product}
                        onChange={(e) =>
                          handleProductChange(index, "product", e.target.value)
                        }
                        displayEmpty
                        fullWidth
                      >
                        <MenuItem value="">Select Product</MenuItem>
                        {productList.map((product) => (
                          <MenuItem key={product.___PRD} value={product.___PRD}>
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
                        onClick={() => handleDelete(index)}
                        style={{ color: "red" }}
                      >
                        <DeleteIcon />
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
              <IconButton
                onClick={handleAddProductRow}
                style={{ background: "#225D7A", color: "white" }}
              >
                <AddIcon style={{ fill: "white", color: "white" }} />
              </IconButton>
            </Box>
            <Typography variant="body1" sx={{ mb: 1 }} mt={5}>
              Write your comments here
            </Typography>
            <TextField
              fullWidth
              value={comment}
              multiline
              onChange={handleComment}
              rows={4}
              variant="outlined"
              placeholder="Comments..."
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                onClick={handleDialogClose}
                style={{ background: "#225D7A", color: "white" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                style={{ background: "#1d343d", color: "white" }}
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
              practitioner={data?.practitioner}
              handleNext={handleNext}
              handleDialogClose={handleDialogClose}
              payors={payors}
              patient={data?.patient}
            />
          </DialogContent>
        )}
        <Dialog open={emailDialogOpen} onClose={handleEmailDialogClose}>
          <DialogTitle>Send PDF</DialogTitle>
          <DialogContent style={{ width: "400px" }}>
            <Typography variant="body1" mb={5}>
              Please provide your email address, and you will receive a PDF of
              the patient beneficiary summary.
            </Typography>
            <Typography variant="body2" style={{ color: "red" }} >
              <span style={{ fontWeight: "bold", color: "black" }}>NOTE:</span>{" "}
              it can take up to 5 minutes for you to receive the email.
            </Typography>
            <TextField
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
                marginTop: '20px'
              }}
            >
            <Button
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
