import React from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

export function PDFFormTemplate({
  crewInfo,
  weekEnding,
  data,
  dailyTrips,
  dates,
  totalBusinessMiles,
  calcCommutingTotal,
  grandTotalMiles,
  businessPercentage,
  fuelReimbursementNet,
  fuelReimbursementGross,
  businessMileageCost,
  serialNumber,
  getDailyTotal
}) {
  const claimType = (data.fuelReceiptsNet > 0 || data.fuelReceiptsGross > 0) ? 'fuel' : 'mileage';
  const totalDue = claimType === 'fuel' 
    ? (data.vatRegistered ? fuelReimbursementNet : fuelReimbursementGross)
    : businessMileageCost;

  return (
    <div 
      style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '794px',
        height: '1122px',
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
              {claimType === 'fuel' ? 'FUEL CLAIM' : 'MILEAGE CLAIM'}
            </span>
          </div>
          <div style={{ fontSize: '10px', marginBottom: '4px' }}>
            <span style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.purple600, fontSize: '8px', display: 'block' }}>
              Week Ending
            </span>
            <span style={{ fontWeight: '900', color: colors.purple900, fontSize: '14px' }}>{weekEnding}</span>
          </div>
          <div style={{ fontSize: '8px', color: colors.gray500 }}>Serial: {serialNumber}</div>
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
          ⚠️ REIMBURSEMENT POLICY
        </div>
        <div style={{ color: colors.gray700, fontSize: '8px', lineHeight: '1.5' }}>
          • <strong>Business mileage/fuel only</strong> - No commuting costs will be reimbursed • 
          <strong>Mileage:</strong> £0.45/mile for crew without car allowance • 
          <strong>Fuel:</strong> Business percentage applied for crew with car allowance • 
          Submit claims weekly with receipts retained for 6 months (HMRC requirement)
        </div>
      </div>

      {/* COMMUTE INFO */}
      <div style={{ 
        borderRadius: '6px', 
        padding: '12px',
        marginBottom: '16px',
        backgroundColor: colors.blue50, 
        border: `2px solid ${colors.blue100}` 
      }}>
        <div style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px', color: colors.blue600, fontSize: '10px' }}>
          COMMUTE DEDUCTION
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: colors.white }}>
            <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray400, fontSize: '7px', marginBottom: '4px' }}>
              Home
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: '700', color: colors.gray900, fontSize: '10px' }}>
              {data.homePostcode || '-'}
            </div>
          </div>
          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: colors.white }}>
            <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray400, fontSize: '7px', marginBottom: '4px' }}>
              Studio
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: '700', color: colors.gray900, fontSize: '10px' }}>
              {data.studioPostcode}
            </div>
          </div>
          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: colors.white }}>
            <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray400, fontSize: '7px', marginBottom: '4px' }}>
              One-Way
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: '700', color: colors.gray900, fontSize: '10px' }}>
              {data.commuteMiles} mi
            </div>
          </div>
          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: colors.white }}>
            <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray400, fontSize: '7px', marginBottom: '4px' }}>
              Trips/Week
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: '700', color: colors.gray900, fontSize: '10px' }}>
              {data.tripsInWeek}
            </div>
          </div>
          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: colors.white }}>
            <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray400, fontSize: '7px', marginBottom: '4px' }}>
              Weekend
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: '700', color: colors.gray900, fontSize: '10px' }}>
              {data.weekendMiles} mi
            </div>
          </div>
          <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: colors.amber100 }}>
            <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.amber600, fontSize: '7px', marginBottom: '4px' }}>
              Total Deduct
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: '900', color: colors.amber600, fontSize: '11px' }}>
              {(calcCommutingTotal + data.weekendMiles).toFixed(1)} mi
            </div>
          </div>
        </div>
      </div>

      {/* TRIP LOG TABLE */}
      <div style={{ 
        borderRadius: '6px', 
        overflow: 'hidden',
        marginBottom: '16px',
        border: `2px solid ${colors.purple200}` 
      }}>
        {/* Table Header */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '70px 70px 1fr 1fr 1.2fr 70px 80px',
          alignItems: 'center',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          backgroundColor: colors.purple50,
          borderBottom: `1px solid ${colors.purple200}`,
          color: colors.purple800,
          padding: '8px 12px',
          fontSize: '8px',
          height: '32px'
        }}>
          <div style={{ paddingRight: '8px', borderRight: `1px solid ${colors.purple100}` }}>Day</div>
          <div style={{ paddingLeft: '8px', paddingRight: '8px', borderRight: `1px solid ${colors.purple100}` }}>Date</div>
          <div style={{ paddingLeft: '8px', paddingRight: '8px', borderRight: `1px solid ${colors.purple100}` }}>From</div>
          <div style={{ paddingLeft: '8px', paddingRight: '8px', borderRight: `1px solid ${colors.purple100}` }}>To</div>
          <div style={{ paddingLeft: '8px', paddingRight: '8px', borderRight: `1px solid ${colors.purple100}` }}>Purpose</div>
          <div style={{ paddingLeft: '8px', paddingRight: '8px', textAlign: 'right', borderRight: `1px solid ${colors.purple100}` }}>Miles</div>
          <div style={{ paddingLeft: '8px', textAlign: 'right' }}>Daily Total</div>
        </div>

        {/* Table Body */}
        <div>
          {DAYS.map((dayName, idx) => {
            const dateStr = dates[idx]?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) || '-';
            const dayData = dailyTrips[idx];
            const dayTotal = getDailyTotal(idx);

            return (
              <div key={dayName} style={{ borderBottom: idx < DAYS.length - 1 ? `1px solid ${colors.gray100}` : 'none' }}>
                {dayData.trips.map((trip, tripIdx) => (
                  <div 
                    key={trip.id}
                    style={{ 
                      display: 'grid',
                      gridTemplateColumns: '70px 70px 1fr 1fr 1.2fr 70px 80px',
                      alignItems: 'center',
                      padding: '6px 12px',
                      minHeight: '32px',
                      borderBottom: tripIdx < dayData.trips.length - 1 ? `1px dashed ${colors.gray50}` : 'none'
                    }}
                  >
                    {/* Day */}
                    {tripIdx === 0 ? (
                      <div style={{ fontWeight: '700', color: colors.purple700, fontSize: '10px', paddingRight: '8px', borderRight: `1px solid ${colors.purple100}` }}>
                        {dayName.substring(0, 3).toUpperCase()}
                      </div>
                    ) : <div style={{ borderRight: `1px solid ${colors.purple100}` }}></div>}
                    
                    {/* Date */}
                    {tripIdx === 0 ? (
                      <div style={{ fontFamily: 'monospace', color: colors.gray600, fontSize: '9px', paddingLeft: '8px', paddingRight: '8px', borderRight: `1px solid ${colors.purple100}` }}>
                        {dateStr}
                      </div>
                    ) : <div style={{ borderRight: `1px solid ${colors.purple100}` }}></div>}
                    
                    {/* From */}
                    <div style={{ color: colors.gray700, fontSize: '9px', textTransform: 'uppercase', paddingLeft: '8px', paddingRight: '8px', borderRight: `1px solid ${colors.purple100}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {trip.from || '-'}
                    </div>
                    
                    {/* To */}
                    <div style={{ color: colors.gray700, fontSize: '9px', textTransform: 'uppercase', paddingLeft: '8px', paddingRight: '8px', borderRight: `1px solid ${colors.purple100}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {trip.to || '-'}
                    </div>
                    
                    {/* Purpose */}
                    <div style={{ color: colors.gray500, fontSize: '8px', textTransform: 'uppercase', paddingLeft: '8px', paddingRight: '8px', borderRight: `1px solid ${colors.purple100}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {trip.reason || '-'}
                    </div>
                    
                    {/* Miles */}
                    <div style={{ 
                      textAlign: 'right', 
                      fontFamily: 'monospace', 
                      fontWeight: '700',
                      color: colors.purple900, 
                      fontSize: '10px',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      borderRight: `1px solid ${colors.purple100}`
                    }}>
                      {trip.miles > 0 ? trip.miles.toFixed(1) : '-'}
                    </div>
                    
                    {/* Daily Total */}
                    {tripIdx === 0 ? (
                      <div style={{ 
                        textAlign: 'right', 
                        fontFamily: 'monospace', 
                        fontWeight: '900',
                        color: dayTotal > 0 ? colors.purple900 : colors.gray400,
                        fontSize: '11px',
                        paddingLeft: '8px',
                        backgroundColor: dayTotal > 0 ? colors.purple50 : 'transparent',
                        borderRadius: '0 4px 4px 0'
                      }}>
                        {dayTotal > 0 ? dayTotal.toFixed(1) : '-'}
                      </div>
                    ) : <div></div>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* SUMMARY SECTION - TWO COLUMNS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        
        {/* Mileage Summary */}
        <div style={{ borderRadius: '6px', padding: '12px', backgroundColor: colors.green50, border: `2px solid ${colors.green100}` }}>
          <div style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px', color: colors.green600, fontSize: '9px' }}>
            MILEAGE SUMMARY
          </div>
          <div style={{ fontSize: '9px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', paddingBottom: '6px', borderBottom: `1px dashed ${colors.green100}` }}>
              <span style={{ fontWeight: '700', color: colors.gray600 }}>Business Miles</span>
              <span style={{ fontFamily: 'monospace', fontWeight: '900', color: colors.green600, fontSize: '11px' }}>
                {totalBusinessMiles.toFixed(1)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', paddingBottom: '6px', borderBottom: `1px dashed ${colors.green100}` }}>
              <span style={{ fontWeight: '700', color: colors.gray600 }}>Commute/Weekend</span>
              <span style={{ fontFamily: 'monospace', fontWeight: '700', color: colors.gray600 }}>
                {(calcCommutingTotal + data.weekendMiles).toFixed(1)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span style={{ fontWeight: '900', color: colors.gray800, fontSize: '9px' }}>TOTAL MILEAGE</span>
              <span style={{ fontFamily: 'monospace', fontWeight: '900', color: colors.gray900, fontSize: '13px' }}>
                {grandTotalMiles.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Business Usage % */}
        <div style={{ borderRadius: '6px', padding: '12px', textAlign: 'center', backgroundColor: colors.purple50, border: `2px solid ${colors.purple100}` }}>
          <div style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px', color: colors.purple600, fontSize: '9px' }}>
            BUSINESS USAGE
          </div>
          <div style={{ fontWeight: '900', color: colors.purple900, fontSize: '36px', lineHeight: '1', marginBottom: '4px' }}>
            {businessPercentage.toFixed(0)}%
          </div>
          <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.purple400, fontSize: '7px' }}>
            of total mileage
          </div>
        </div>

        {/* Calculation Result */}
        <div style={{ 
          borderRadius: '6px', 
          overflow: 'hidden',
          border: `3px solid ${claimType === 'fuel' ? colors.purple600 : colors.green600}` 
        }}>
          <div style={{ 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            textAlign: 'center', 
            padding: '8px',
            backgroundColor: claimType === 'fuel' ? colors.purple600 : colors.green600,
            color: colors.white,
            fontSize: '9px'
          }}>
            {claimType === 'fuel' ? 'FUEL CLAIM' : 'MILEAGE CLAIM'}
          </div>
          <div style={{ padding: '12px', backgroundColor: colors.white }}>
            {claimType === 'fuel' ? (
              <div style={{ fontSize: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', paddingBottom: '6px', borderBottom: `1px dashed ${colors.gray200}` }}>
                  <div>
                    <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray500, fontSize: '7px' }}>VAT (Net)</div>
                    <div style={{ fontFamily: 'monospace', color: colors.gray700, fontSize: '8px' }}>£{data.fuelReceiptsNet.toFixed(2)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', textTransform: 'uppercase', color: data.vatRegistered ? colors.green600 : colors.gray400, fontSize: '7px' }}>
                      {data.vatRegistered ? 'PAID' : '-'}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontWeight: '700', color: data.vatRegistered ? colors.green600 : colors.gray400, fontSize: '9px' }}>
                      £{fuelReimbursementNet.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '6px', borderBottom: `1px dashed ${colors.gray200}` }}>
                  <div>
                    <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray500, fontSize: '7px' }}>Non-VAT (Gross)</div>
                    <div style={{ fontFamily: 'monospace', color: colors.gray700, fontSize: '8px' }}>£{data.fuelReceiptsGross.toFixed(2)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', textTransform: 'uppercase', color: !data.vatRegistered ? colors.green600 : colors.gray400, fontSize: '7px' }}>
                      {!data.vatRegistered ? 'PAID' : '-'}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontWeight: '700', color: !data.vatRegistered ? colors.green600 : colors.gray400, fontSize: '9px' }}>
                      £{fuelReimbursementGross.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <span style={{ fontWeight: '900', textTransform: 'uppercase', color: colors.purple900, fontSize: '9px' }}>TOTAL DUE</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '900', color: colors.purple900, fontSize: '16px' }}>
                    £{totalDue.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '9px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', color: colors.gray600 }}>Business Miles</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '700', color: colors.gray700 }}>
                    {totalBusinessMiles.toFixed(1)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: `1px dashed ${colors.green200}` }}>
                  <span style={{ fontWeight: '700', color: colors.gray600 }}>Rate per Mile</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '700', color: colors.gray700 }}>£0.45</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <span style={{ fontWeight: '900', textTransform: 'uppercase', color: colors.green600, fontSize: '9px' }}>TOTAL DUE</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '900', color: colors.green600, fontSize: '16px' }}>
                    £{businessMileageCost.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIGNATURES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        {['Audited', 'HOD', 'UPM', 'Accountant'].map((role) => (
          <div key={role} style={{ 
            borderRadius: '4px', 
            padding: '10px',
            backgroundColor: colors.gray50, 
            border: `1px solid ${colors.gray200}`, 
            height: '50px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.gray400, fontSize: '7px' }}>
              {role}
            </div>
            <div style={{ borderTop: `1px solid ${colors.gray300}`, marginTop: '20px' }}></div>
          </div>
        ))}
      </div>

      {/* FOOTER WARNING */}
      <div style={{ 
        textAlign: 'center', 
        borderRadius: '4px', 
        padding: '8px',
        backgroundColor: colors.amber50, 
        border: `1px solid ${colors.amber100}` 
      }}>
        <span style={{ fontWeight: '700', textTransform: 'uppercase', color: colors.amber600, fontSize: '8px' }}>
          ⚠️ The production does not insure personal vehicles for third-party liability, injury, property damage, or physical vehicle damage
        </span>
      </div>
    </div>
  );
}