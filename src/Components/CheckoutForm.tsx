import { 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Container
} from '@mui/material';
import React from 'react';

export default function CheckoutForm({
  ivr,
  practitioner,
  patient,
  serviceDate,
  address,
  orderProducts,
  account,
  selectedProduct, // This should be passed from parent (either data.product or data.product2)
  productList, // Pass the product list to get full product details
  onSubmit, // Submit handler from parent
  onBack, // Back navigation handler
  submitting // Loading state for submit
}) {
  const fmtMoney = (n) => (n || n === 0) ? `$${Number(n).toFixed(2)}` : '';
  
  // Get the brand name and hex code from the selected product
  const brandName = selectedProduct?.Brand || 'AmnioAMP-MP';
  const themeColor = selectedProduct?.HexCode || '#1BA3C6';
  
  // Format the brand name for display (replace underscores with spaces, etc.)
  const displayBrandName = brandName.replace(/_/g, ' ').replace(/ACA/g, 'ACA');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Banner Section */}
      {/* Main Content */}
      <Container maxWidth="md" style={{ paddingLeft: '32px', paddingRight: '32px', paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Typography variant="h1" style={{ fontSize: '42px', lineHeight: '1.2', marginBottom: '8px' }}>
            {displayBrandName}™
          </Typography>
          <Typography variant="h2" style={{ fontSize: '28px', color: themeColor }}>
            Order Form
          </Typography>
        </div>

        {/* Form Fields */}
        <div style={{ marginBottom: '40px' }}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            
            <TextField 
              placeholder="Requesting Provider" 
              value={practitioner?.Name || practitioner?.FullName || ''}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{ style: { padding: '12px' } }}
            />

            <TextField 
              placeholder="Provider Phone" 
              value={account?.Phone || account?.MainPhone || ''}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{ style: { padding: '12px' } }}
            />
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <TextField 
              placeholder="Email" 
              value={practitioner?.Email || account?.Email || ''}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{ style: { padding: '12px' } }}
            />
            <TextField 
              placeholder="Order Date" 
              value={new Date().toLocaleDateString()}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{ style: { padding: '12px' } }}
            />
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <TextField 
              placeholder="Patient Name" 
              value={patient?.Name || ivr?.Patient || ''}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{ style: { padding: '12px' } }}
            />
            <TextField 
              placeholder="Date of Service" 
              value={serviceDate || ivr?.Date || ''}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{ style: { padding: '12px' } }}
            />
          </div>

          {/* Row 4 - Full Width */}
          <div style={{ marginBottom: '12px' }}>
            <TextField 
              placeholder="Shipping Address" 
              value={
                address
                  ? `${address.AddressName ? address.AddressName + ' — ' : ''}${address.AddressStreet || ''}${address.AddressStreet && (address.AddressCity || address.AddressState) ? ', ' : ''}${address.AddressCity || ''}${address.AddressCity && address.AddressState ? ', ' : ''}${address.AddressState || ''} ${address.AddressZip || ''}`
                  : ''
              }
              variant="filled"
              fullWidth
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{ style: { padding: '12px' } }}
            />
          </div>
          <div style={{ height: '42px' }}></div> {/* Empty space for second line */}
        </div>

        {/* Ordering Information Section */}
        <div style={{ marginBottom: '32px' }}>
          <Typography variant="h3" style={{ fontSize: '22px', marginBottom: '16px' }}>
            {displayBrandName} Ordering Information
          </Typography>
          
          {/* Table */}
          <TableContainer>
            <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow style={{ backgroundColor: themeColor }}>
                  <TableCell 
                    style={{ 
                      color: '#ffffff', 
                      padding: '12px 16px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      borderBottom: 'none'
                    }}
                  >
                    Product Number
                  </TableCell>
                  <TableCell 
                    style={{ 
                      color: '#ffffff', 
                      padding: '12px 16px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      borderBottom: 'none'
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell 
                    style={{ 
                      color: '#ffffff', 
                      padding: '12px 16px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      borderBottom: 'none'
                    }}
                  >
                    Invoice Price
                  </TableCell>
                  <TableCell 
                    style={{ 
                      color: '#ffffff', 
                      padding: '12px 16px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      borderBottom: 'none'
                    }}
                  >
                    Quantity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(orderProducts) && orderProducts.length > 0 ? (
                  orderProducts.map((item, idx) => {
                    // Find the full product details from productList if available
                    const fullProduct = productList?.find(p => p.___PRD === item.product);
                    const productCode = fullProduct?.Product || item.productCode || '';
                    const description = fullProduct?.Description || item.description || '';
                    
                    return (
                      <TableRow key={`${item.product}-${idx}`} style={{ backgroundColor: idx % 2 === 1 ? '#EEF2F5' : '#ffffff' }}>
                        <TableCell style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                          {productCode}
                        </TableCell>
                        <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                          {description}
                        </TableCell>
                        <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                          {fmtMoney(item.price)}
                        </TableCell>
                        <TableCell style={{ padding: '12px 16px', backgroundColor: '#EEF2F5', borderBottom: '1px solid #e5e7eb' }}>
                          {item.qty ?? ''}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }} colSpan={4}>
                      {/* Keep UI same: empty state is just an empty table; no extra messaging */}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Email Instruction */}
        <div style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '24px' }}>
          <Typography style={{ fontSize: '15px' }}>
            <span>Email form to </span>
            <span style={{ fontWeight: '600' }}>CustomerService@LegacyMedicalConsultants.com</span>
          </Typography>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '10px 24px',
              backgroundColor: '#D8EEDA',
              color: '#157069',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Back
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            style={{
              padding: '10px 24px',
              backgroundColor: submitting ? '#ccc' : themeColor,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `2px solid ${themeColor}`, paddingTop: '16px', marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
              <p style={{ fontWeight: '600', marginBottom: '4px', margin: '0 0 4px 0' }}>
                Order & Customer Support Contact Details
              </p>
              <p style={{ margin: '0 0 2px 0' }}>
                Phone: {(account?.Phone || '(817) 961-1288')}  |  Fax: {(account?.Fax || '(866) 300-0431')}
              </p>
              <p style={{ margin: '0' }}>
                www.legacymedicalconsultants.com  |  customerservice@legacymedicalconsultants.com
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="40" y="15" textAnchor="middle" fontSize="14" fill="#1E293B" fontFamily="Arial, sans-serif">
                  <tspan fontWeight="bold">LEGACY</tspan>
                </text>
                <text x="40" y="28" textAnchor="middle" fontSize="8" fill="#1E293B" fontFamily="Arial, sans-serif" letterSpacing="1">
                  MEDICAL
                </text>
                <text x="40" y="36" textAnchor="middle" fontSize="8" fill="#1E293B" fontFamily="Arial, sans-serif" letterSpacing="1">
                  CONSULTANTS
                </text>
                <path d="M35 16 L37 20 L39 16 L41 20 L43 16" stroke="#1E293B" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}