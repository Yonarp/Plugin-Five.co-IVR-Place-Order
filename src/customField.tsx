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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";

import { CustomFieldProps } from "../../../common";
import Summary from "./Components/Summary";

FiveInitialize();

const CustomField = (props: CustomFieldProps) => {
  //@ts-ignore
  const { theme, value, onValueUpdated, variant, five, selectedRecord } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  //@ts-ignore
  const [productList, setProductList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderProducts, setOrderProducts] = useState([
    { product: "", price: 0, qty: 1, discount: 0, amount: 0 },
  ]);

  const [page, setPage] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState("");

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
      amount: totalAmount,
      products: orderProducts,
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
        (result) => {
          console.log("Logging Order");
          const response = JSON.parse(result.serverResponse.results);
          console.log(response);
          setData(response);
          setProductList(response.productList);
          const primaryAddress = response.address.find(
            (addr) => addr._isPrimary === 1
          );
          setSelectedAddress(primaryAddress?.___ADD || "");
          setLoading(false);
        }
      );
    };

    fetchData();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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
    setSelectedAddress(event.target.value);
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

  useEffect(() => {
    setTotalAmount(getTotalAmount());
  }, [orderProducts]);

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
        <DialogTitle style={{ backgroundColor: "#225D7A", color: "white" }}>
          Place Order
        </DialogTitle>
        {page === 0 && (
          <DialogContent
            style={{ maxWidth: "100%", overflowX: "hidden", padding: "10px" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              mb={2}
              padding="10px 0"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="body1" style={{}}>
                  Products:{" "}
                </Typography>
                <Typography variant="body1" style={{}}>
                  <strong>
                    &nbsp;
                    {"    " + data?.product?.Brand + "-" + data?.product?.QCode}
                  </strong>
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  Wound Size (CM²):{" "}
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  <strong>&nbsp;{data?.ivr?.WoundSize}</strong>
                </Typography>
              </Box>

              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  Wound Type:
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  <strong>&nbsp;{data?.ivr?.WoundType}</strong>
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              mb={2}
              padding="10px 0"
              flexDirection="column"
            >
              <Box display="flex" flexDirection="row">
                <Typography variant="subtitle1" style={{ width: "30%" }}>
                  Shipping Address
                </Typography>
                <Select
                  value={selectedAddress}
                  onChange={handleAddressChange}
                  displayEmpty
                  fullWidth
                  style={{ width: "30%", border: "none", outline: "none" }}
                  variant="standard"
                  disableUnderline
                >
                  {data?.address.map((address) => (
                    <MenuItem key={address.___ADD} value={address.___ADD}>
                      {address.AddressName}
                      <br />
                      {address.AddressStreet + " " + address.AddressCity}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box display="flex" flexDirection="row">
                <Typography variant="body1" style={{ width: "30%" }}>
                  MAC
                </Typography>
                <Typography variant="body1" style={{ width: "30%" }}>
                  <strong>{data?.account?.MacValue}</strong>
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              width="100%"
              style={{ textAlign: "center" }}
              justifyContent="center"
            >
              <Typography variant="body1" fullWidth>
                Legacy Medical Consultants
                <br />
                9800 Hillwood Parkway, Suite 320
                <br />
                Fort Worth, TX 76177
                <br />
                p. 817-961-1288 f. 866-300-0431
                <br />
                customerservice@legacymedicalconsultants.com
              </Typography>
            </Box>
            {/* -----------------------------------PRODUCT SECTION------------------------------------------ */}
            <Typography
              variant="body2"
              align="center"
              style={{ marginBottom: 20, marginTop: 30 }}
            >
              PLEASE SELECT THE DESIRED PRODUCTS FOR YOUR ORDER
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
                        <Delete />
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
              multiline
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
                onClick={handleNext}
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
            <Summary ivr={data?.ivr}  practitioner={data?.practitioner} handleNext={handleNext}/>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};

export default CustomField;
