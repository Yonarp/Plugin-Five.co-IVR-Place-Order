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


import React from 'react'

export default function CheckoutForm() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Banner Section */}
      <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden' }}>
        <img  
          alt="AmnioAMP-MP Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Main Content */}
      <Container maxWidth="md" style={{ paddingLeft: '32px', paddingRight: '32px', paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Typography variant="h1" style={{ fontSize: '42px', lineHeight: '1.2', marginBottom: '8px' }}>
            AmnioAMP-MP™
          </Typography>
          <Typography variant="h2" style={{ fontSize: '28px', color: '#1BA3C6' }}>
            Order Form
          </Typography>
        </div>

        {/* Form Fields */}
        <div style={{ marginBottom: '40px' }}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <TextField 
              placeholder="Requesting Provider" 
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{
                style: { padding: '12px' }
              }}
            />
            <TextField 
              placeholder="Provider Phone" 
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{
                style: { padding: '12px' }
              }}
            />
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <TextField 
              placeholder="Email" 
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{
                style: { padding: '12px' }
              }}
            />
            <TextField 
              placeholder="Order Date" 
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{
                style: { padding: '12px' }
              }}
            />
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <TextField 
              placeholder="Patient Name" 
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{
                style: { padding: '12px' }
              }}
            />
            <TextField 
              placeholder="Date of Service" 
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: { 
                  backgroundColor: '#EEF2F5', 
                  height: '42px',
                  borderRadius: '0'
                }
              }}
              inputProps={{
                style: { padding: '12px' }
              }}
            />
          </div>

          {/* Row 4 - Full Width */}
          <div style={{ marginBottom: '12px' }}>
            <TextField 
              placeholder="Shipping Address" 
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
              inputProps={{
                style: { padding: '12px' }
              }}
            />
          </div>
          <div style={{ height: '42px' }}></div> {/* Empty space for second line */}
        </div>

        {/* Ordering Information Section */}
        <div style={{ marginBottom: '32px' }}>
          <Typography variant="h3" style={{ fontSize: '22px', marginBottom: '16px' }}>
            AmnioAMP-MP Ordering Information
          </Typography>
          
          {/* Table */}
          <TableContainer>
            <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow style={{ backgroundColor: '#1BA3C6' }}>
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
                <TableRow style={{ backgroundColor: '#ffffff' }}>
                  <TableCell style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                    CG1102
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    AmnioAMP-MP 2x2cm (Q4250)
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', backgroundColor: '#EEF2F5', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#EEF2F5' }}>
                  <TableCell style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                    CG1100
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    AmnioAMP-MP 2x3cm (Q4250)
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', backgroundColor: '#EEF2F5', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#ffffff' }}>
                  <TableCell style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                    CG1104
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    AmnioAMP-MP 4x4cm (Q4250)
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', backgroundColor: '#EEF2F5', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#EEF2F5' }}>
                  <TableCell style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                    CG1105
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    AmnioAMP-MP 4x6cm (Q4250)
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', backgroundColor: '#EEF2F5', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#ffffff' }}>
                  <TableCell style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                    CG1106
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    AmnioAMP-MP 4x8cm (Q4250)
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px', backgroundColor: '#EEF2F5', borderBottom: '1px solid #e5e7eb' }}>
                  </TableCell>
                </TableRow>
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

        {/* Footer */}
        <div style={{ borderTop: '2px solid #1BA3C6', paddingTop: '16px', marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
              <p style={{ fontWeight: '600', marginBottom: '4px', margin: '0 0 4px 0' }}>
                Order & Customer Support Contact Details
              </p>
              <p style={{ margin: '0 0 2px 0' }}>
                Phone: (817) 961-1288  |  Fax: (866) 300-0431
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
