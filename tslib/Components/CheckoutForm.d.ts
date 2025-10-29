/// <reference types="react" />
export default function CheckoutForm({ ivr, practitioner, patient, logo, graphic, serviceDate, address, orderProducts, account, selectedProduct, // This should be passed from parent (either data.product or data.product2)
productList, // Pass the product list to get full product details
onSubmit, // Submit handler from parent
onBack, // Back navigation handler
submitting, }: {
    ivr: any;
    practitioner: any;
    patient: any;
    logo: any;
    graphic: any;
    serviceDate: any;
    address: any;
    orderProducts: any;
    account: any;
    selectedProduct: any;
    productList: any;
    onSubmit: any;
    onBack: any;
    submitting: any;
}): JSX.Element;
