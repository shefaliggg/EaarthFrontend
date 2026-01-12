import React from 'react';

// Safe Hex Colors for html2canvas
const colors = {
  white: '#ffffff',
  purple50: '#faf5ff',
  purple100: '#f3e8ff',
  purple200: '#e9d5ff',
  purple400: '#c084fc',
  purple600: '#9333ea',
  purple700: '#7e22ce',
  purple800: '#6b21a8',
  purple900: '#581c87',
  purple950: '#3b0764',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue600: '#2563eb',
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green200: '#bbf7d0',
  green600: '#16a34a',
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber600: '#d97706',
};

export function PettyCashPDFTemplate({ crewInfo, weekEnding, data }) {
  // Ensure we have at least 15 rows to fill the page
  const displayRows = [...data.entries];
  while (displayRows.length < 15) {
    displayRows.push({ 
      id: Math.random().toString(), 
      date: '', 
      payee: '', 
      description: '', 
      category: '', 
      net: 0, 
      vat: 0, 
      total: 0,
      code: '',
      set: '',
      categoryCode: '',
      ff2: '',
      ff3: ''
    });
  }

  const totalNet = displayRows.reduce((sum, r) => sum + (r.net || 0), 0);
  const totalVAT = displayRows.reduce((sum, r) => sum + (r.vat || 0), 0);
  const totalGrand = displayRows.reduce((sum, r) => sum + (r.total || 0), 0);

  // Group by Account Code
  const summaryByCode = {};
  
  data.entries.forEach((entry) => {
    // Skip empty entries if any (though usually data.entries are real data)
    if (!entry.total) return;

    // Determine the key: use code if available, otherwise 'UNCATEGORIZED'
    const codeKey = entry.code && entry.code.trim() !== '' ? entry.code : 'UNCATEGORIZED';
    
    if (!summaryByCode[codeKey]) {
      summaryByCode[codeKey] = { net: 0, vat: 0, total: 0 };
    }
    
    summaryByCode[codeKey].net += (entry.net || 0);
    summaryByCode[codeKey].vat += (entry.vat || 0);
    summaryByCode[codeKey].total += (entry.total || 0);
  });

  const summaryCodes = Object.keys(summaryByCode).sort();
  // Ensure we have at least 5 rows for the summary box to look good
  while (summaryCodes.length < 5) {
     summaryCodes.push(`EMPTY_${summaryCodes.length}`); 
  }

  return (
    <div 
      style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '1122px', // A4 Landscape width (approx 297mm)
        height: '794px', // A4 Landscape height (approx 210mm)
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        margin: '0 auto',
        backgroundColor: colors.white, 
        color: colors.gray900, 
        boxSizing: 'border-box',
        padding: '24px',
        fontSize: '10px',
        lineHeight: '1.4'
      }}
    >
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '16px', 
        paddingBottom: '12px',
        borderBottom: `3px solid ${colors.purple600}` 
      }}>
        {/* Left: Company Info */}
        <div>
          <h1 style={{ 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            color: colors.purple900, 
            fontSize: '24px',
            margin: '0 0 4px 0'
          }}>WERWULF</h1>
          <div style={{ fontSize: '11px', color: colors.gray700, fontWeight: '700', marginBottom: '2px' }}>
            MIRAGE PICTURES LIMITED
          </div>
          <div style={{ fontSize: '8px', color: colors.gray500 }}>
            1 Central St. Giles, St. Giles High Street, London, England, WC2H 8NU
          </div>
        </div>

        {/* Right: Form Info */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '8px 16px', 
            borderRadius: '6px',
            backgroundColor: colors.purple100,
            marginBottom: '8px'
          }}>
            <span style={{ 
              fontWeight: '900', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              color: colors.purple900, 
              fontSize: '14px' 
            }}>
              PETTY CASH VOUCHER
            </span>
          </div>
          <div style={{ fontSize: '10px', marginBottom: '4px' }}>
            <span style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.purple600, fontSize: '8px', display: 'block' }}>
              Week Ending
            </span>
            <span style={{ fontWeight: '900', color: colors.purple900, fontSize: '14px' }}>{weekEnding}</span>
          </div>
          <div style={{ fontSize: '8px', color: colors.gray500 }}>Currency: {data.currency}</div>
        </div>
      </div>

      {/* CREW INFO BAR */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ padding: '10px 12px', borderRadius: '6px', backgroundColor: colors.purple50 }}>
          <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.purple400, fontSize: '8px', marginBottom: '4px' }}>
            Name
          </div>
          <div style={{ fontWeight: '900', textTransform: 'uppercase', color: colors.purple950, fontSize: '12px' }}>
            {crewInfo.firstName} {crewInfo.lastName}
          </div>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: '6px', backgroundColor: colors.gray50 }}>
          <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray400, fontSize: '8px', marginBottom: '4px' }}>
            Department
          </div>
          <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray800, fontSize: '11px' }}>
            {crewInfo.department}
          </div>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: '6px', backgroundColor: colors.gray50 }}>
          <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray400, fontSize: '8px', marginBottom: '4px' }}>
            Position
          </div>
          <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray800, fontSize: '11px' }}>
            {crewInfo.role}
          </div>
        </div>
      </div>

      {/* POLICY BANNER */}
      <div style={{ 
        borderRadius: '6px', 
        padding: '12px',
        marginBottom: '16px',
        backgroundColor: colors.amber50, 
        border: `2px solid ${colors.amber100}` 
      }}>
        <div style={{ fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px', color: colors.amber600, fontSize: '9px' }}>
          ⚠️ PETTY CASH POLICY
        </div>
        <div style={{ color: colors.gray700, fontSize: '8px', lineHeight: '1.5' }}>
          • Ensure you have an <strong>original</strong> receipt for each item claimed. Credit card receipts alone are not acceptable. • 
          Fuel receipts must have Car reg, Make, Model, Colour and your name written on them. • 
          Only one type of currency per form please. • 
          Attach receipts to the back of the printed form or scan them alongside.
        </div>
      </div>

      {/* PETTY CASH TABLE */}
      <div style={{ 
        borderRadius: '6px', 
        overflow: 'hidden',
        marginBottom: '16px',
        border: `2px solid ${colors.purple200}`,
        flex: 1
      }}>
        {/* Table Header */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '30px 70px 120px 1fr 80px 60px 40px 40px 40px 40px 60px 50px 60px',
          alignItems: 'center',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          backgroundColor: colors.purple50,
          borderBottom: `1px solid ${colors.purple200}`,
          color: colors.purple800,
          padding: '8px 4px',
          fontSize: '8px',
          height: '32px'
        }}>
          <div style={{ paddingRight: '4px', textAlign: 'center', borderRight: `1px solid ${colors.purple100}` }}>#</div>
          <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple100}` }}>Date</div>
          <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple100}` }}>Payee</div>
          <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple100}` }}>Description</div>
          <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple100}` }}>Category</div>
          
          {/* Accounts Header Group */}
          <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple100}`, textAlign: 'center', color: colors.gray500 }}>Code</div>
          <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple100}`, textAlign: 'center', color: colors.gray500 }}>Tag</div>
          <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple100}`, textAlign: 'center', color: colors.gray500 }}>Cat</div>
          <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple100}`, textAlign: 'center', color: colors.gray500 }}>FF2</div>
          <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple100}`, textAlign: 'center', color: colors.gray500 }}>VAT</div>

          <div style={{ paddingLeft: '4px', paddingRight: '4px', textAlign: 'right', borderRight: `1px solid ${colors.purple100}` }}>Net</div>
          <div style={{ paddingLeft: '4px', paddingRight: '4px', textAlign: 'right', borderRight: `1px solid ${colors.purple100}` }}>VAT</div>
          <div style={{ paddingLeft: '4px', textAlign: 'right' }}>Total</div>
        </div>

        {/* Table Body */}
        <div>
          {displayRows.map((row, idx) => (
            <div 
              key={idx}
              style={{ 
                display: 'grid',
                gridTemplateColumns: '30px 70px 120px 1fr 80px 60px 40px 40px 40px 40px 60px 50px 60px',
                alignItems: 'center',
                padding: '6px 4px',
                minHeight: '24px',
                borderBottom: idx < displayRows.length - 1 ? `1px dashed ${colors.gray100}` : 'none',
                fontSize: '9px'
              }}
            >
              <div style={{ textAlign: 'center', color: colors.gray400, borderRight: `1px solid ${colors.purple50}` }}>{idx + 1}</div>
              <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple50}` }}>{row.date}</div>
              <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple50}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.payee}</div>
              <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple50}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.description}</div>
              <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple50}`, color: colors.purple600 }}>{row.category}</div>
              
              {/* Accounts Data */}
              <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple50}`, textAlign: 'center', color: colors.gray400, fontFamily: 'monospace' }}>{row.code}</div>
              <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple50}`, textAlign: 'center', color: colors.gray400, fontFamily: 'monospace' }}>{row.set}</div>
              <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple50}`, textAlign: 'center', color: colors.gray400, fontFamily: 'monospace' }}>{row.categoryCode}</div>
              <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple50}`, textAlign: 'center', color: colors.gray400, fontFamily: 'monospace' }}>{row.ff2}</div>
              <div style={{ paddingLeft: '4px', paddingRight: '4px', borderRight: `1px solid ${colors.purple50}`, textAlign: 'center', color: colors.gray400, fontFamily: 'monospace' }}>{row.ff3}</div>

              <div style={{ paddingLeft: '4px', paddingRight: '4px', textAlign: 'right', borderRight: `1px solid ${colors.purple50}`, fontFamily: 'monospace' }}>{row.net ? row.net.toFixed(2) : '-'}</div>
              <div style={{ paddingLeft: '4px', paddingRight: '4px', textAlign: 'right', borderRight: `1px solid ${colors.purple50}`, fontFamily: 'monospace' }}>{row.vat ? row.vat.toFixed(2) : '-'}</div>
              <div style={{ paddingLeft: '4px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold', color: row.total ? colors.gray900 : colors.gray300 }}>{row.total ? row.total.toFixed(2) : '-'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY & SIGNATURES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>
        
        {/* Left: Signatures */}
        <div>
          {/* Totals Row (Visual separator before signatures) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '16px' }}>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '8px', color: colors.gray500, fontWeight: '700', textTransform: 'uppercase' }}>Total Net</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '12px' }}>{totalNet.toFixed(2)}</div>
             </div>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '8px', color: colors.gray500, fontWeight: '700', textTransform: 'uppercase' }}>Total VAT</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '12px' }}>{totalVAT.toFixed(2)}</div>
             </div>
             <div style={{ textAlign: 'right', paddingLeft: '16px', borderLeft: `2px solid ${colors.purple200}` }}>
                <div style={{ fontSize: '8px', color: colors.purple600, fontWeight: '900', textTransform: 'uppercase' }}>Total Due</div>
                <div style={{ fontFamily: 'monospace', fontWeight: '900', fontSize: '16px', color: colors.purple900 }}>{totalGrand.toFixed(2)}</div>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {['Received By', 'HOD', 'Accounts', 'Studio Exec'].map((role) => (
              <div key={role} style={{ 
                borderRadius: '4px', 
                padding: '8px',
                backgroundColor: colors.gray50, 
                border: `1px solid ${colors.gray200}`, 
                height: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray400, fontSize: '6px' }}>
                  {role}
                </div>
                <div style={{ borderTop: `1px solid ${colors.gray300}`, marginTop: '15px' }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Coding Summary Box (Implemented) */}
        <div style={{ 
          border: `1px solid ${colors.gray200}`, 
          borderRadius: '6px', 
          overflow: 'hidden',
          fontSize: '8px'
        }}>
          {/* Accounts Header Group */}
          <div style={{ 
            backgroundColor: colors.gray50, 
            padding: '6px', 
            fontWeight: '700', 
            borderBottom: `1px solid ${colors.gray200}`,
            textAlign: 'center',
            color: colors.gray600,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            fontSize: '6px',
            textTransform: 'uppercase'
          }}>
             <div style={{ borderRight: `1px solid ${colors.gray200}` }}>Account Name</div>
             <div style={{ borderRight: `1px solid ${colors.gray200}` }}>Account Number</div>
             <div style={{ borderRight: `1px solid ${colors.gray200}` }}>Sort Code</div>
             <div>Bank Name</div>
          </div>
          
          {/* Column Headers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 50px 50px 50px', 
            borderBottom: `1px solid ${colors.gray100}`,
            backgroundColor: colors.purple50,
            color: colors.purple900,
            fontWeight: 'bold',
            fontSize: '7px'
          }}>
             <div style={{ padding: '4px', borderRight: `1px solid ${colors.purple100}` }}>Code</div>
             <div style={{ padding: '4px', textAlign: 'right', borderRight: `1px solid ${colors.purple100}` }}>Net</div>
             <div style={{ padding: '4px', textAlign: 'right', borderRight: `1px solid ${colors.purple100}` }}>VAT</div>
             <div style={{ padding: '4px', textAlign: 'right' }}>Total</div>
          </div>
          
          {/* Data Rows */}
          {summaryCodes.map((codeKey, i) => {
             const isReal = !codeKey.startsWith('EMPTY_');
             const data = isReal ? summaryByCode[codeKey] : null;
             
             return (
               <div key={i} style={{ 
                 display: 'grid', 
                 gridTemplateColumns: '1fr 50px 50px 50px', 
                 borderBottom: i < summaryCodes.length - 1 ? `1px dashed ${colors.gray50}` : 'none',
                 color: isReal ? colors.gray900 : colors.gray300
               }}>
                  <div style={{ padding: '4px', borderRight: `1px solid ${colors.gray100}`, fontFamily: 'monospace' }}>
                    {isReal ? codeKey : '-'}
                  </div>
                  <div style={{ padding: '4px', textAlign: 'right', borderRight: `1px solid ${colors.gray100}`, fontFamily: 'monospace' }}>
                    {isReal ? data?.net.toFixed(2) : '-'}
                  </div>
                  <div style={{ padding: '4px', textAlign: 'right', borderRight: `1px solid ${colors.gray100}`, fontFamily: 'monospace' }}>
                    {isReal ? data?.vat.toFixed(2) : '-'}
                  </div>
                  <div style={{ padding: '4px', textAlign: 'right', fontFamily: 'monospace', fontWeight: isReal ? 'bold' : 'normal' }}>
                    {isReal ? data?.total.toFixed(2) : '-'}
                  </div>
               </div>
             );
          })}
          
          {/* Grand Total Row */}
           <div style={{ 
             display: 'grid', 
             gridTemplateColumns: '1fr 50px 50px 50px', 
             borderTop: `2px solid ${colors.gray200}`,
             backgroundColor: colors.gray50,
             fontWeight: 'bold',
             color: colors.gray900
           }}>
              <div style={{ padding: '4px', borderRight: `1px solid ${colors.gray200}`, textAlign: 'right' }}>TOTAL</div>
              <div style={{ padding: '4px', textAlign: 'right', borderRight: `1px solid ${colors.gray200}`, fontFamily: 'monospace' }}>{totalNet.toFixed(2)}</div>
              <div style={{ padding: '4px', textAlign: 'right', borderRight: `1px solid ${colors.gray200}`, fontFamily: 'monospace' }}>{totalVAT.toFixed(2)}</div>
              <div style={{ padding: '4px', textAlign: 'right', fontFamily: 'monospace' }}>{totalGrand.toFixed(2)}</div>
           </div>
        </div>

      </div>
    </div>
  );
}