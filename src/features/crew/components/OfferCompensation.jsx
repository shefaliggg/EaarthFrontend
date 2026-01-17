import { Card, CardContent } from "../../../shared/components/ui/card";
import { Input } from "../../../shared/components/ui/input";
import { Badge } from "../../../shared/components/ui/badge";

const formatCurrency = (amount) => {
  if (!amount) return "£0.00";
  return `£${parseFloat(amount).toLocaleString("en-GB", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

function TableRow({ item, rate, budgetCode, tag, tagColor, isEditing, onRateChange, onBudgetChange }) {
  const tagColors = {
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    green: 'bg-emerald-100 text-emerald-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/20">
      <td className="py-2 px-3 text-xs font-medium">{item}</td>
      <td className="py-2 px-3 text-right">
        {isEditing ? (
          <Input
            type="number"
            step="0.01"
            value={rate || ""}
            onChange={(e) => onRateChange?.(e.target.value)}
            className="h-7 text-xs text-right"
          />
        ) : (
          <span className="text-xs font-bold">{formatCurrency(rate)}</span>
        )}
      </td>
      <td className="py-2 px-3">
        {isEditing ? (
          <Input
            value={budgetCode || ""}
            onChange={(e) => onBudgetChange?.(e.target.value)}
            className="h-7 text-xs"
          />
        ) : (
          <span className="text-xs text-muted-foreground font-mono">{budgetCode}</span>
        )}
      </td>
      <td className="py-2 px-3">
        {tag && (
          <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 ${tagColors[tagColor]}`}>
            {tag}
          </Badge>
        )}
      </td>
    </tr>
  );
}

export default function OfferCompensation({ primaryRole, isEditing = false, onUpdate }) {
  const handleUpdate = (section, field, value) => {
    if (onUpdate) {
      if (section === 'role') {
        onUpdate({ [field]: value });
      } else if (section === 'overtime') {
        onUpdate({ 
          customOvertimeRates: { 
            ...primaryRole?.customOvertimeRates, 
            [field]: value 
          }
        });
      } else if (section === 'allowance') {
        onUpdate({ 
          allowances: { 
            ...primaryRole?.allowances, 
            [field]: value 
          }
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Salary Card */}
      <Card className="border shadow-sm">
        <div className="px-3 py-2 border-b bg-muted/20">
          <h3 className="text-xs font-bold uppercase tracking-wide">Salary</h3>
        </div>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="py-1.5 px-3 text-left text-[9px] font-bold uppercase text-muted-foreground">Item</th>
                <th className="py-1.5 px-3 text-right text-[9px] font-bold uppercase text-muted-foreground">Rate</th>
                <th className="py-1.5 px-3 text-left text-[9px] font-bold uppercase text-muted-foreground">Budget Code</th>
                <th className="py-1.5 px-3 text-left text-[9px] font-bold uppercase text-muted-foreground">Tag</th>
              </tr>
            </thead>
            <tbody>
              <TableRow
                item="Salary"
                rate={primaryRole?.contractRate}
                budgetCode={primaryRole?.budgetCode || "10-001"}
                tag="Labor Basic"
                tagColor="purple"
                isEditing={isEditing}
                onRateChange={(v) => handleUpdate('role', 'contractRate', v)}
                onBudgetChange={(v) => handleUpdate('role', 'budgetCode', v)}
              />
              {primaryRole?.customOvertimeRates?.sixthDayHourlyRate && (
                <TableRow
                  item="6th Day"
                  rate={primaryRole.customOvertimeRates.sixthDayHourlyRate}
                  budgetCode="10-002"
                  tag="Labor OT"
                  tagColor="purple"
                  isEditing={isEditing}
                  onRateChange={(v) => handleUpdate('overtime', 'sixthDayHourlyRate', v)}
                />
              )}
              {primaryRole?.customOvertimeRates?.seventhDayHourlyRate && (
                <TableRow
                  item="7th Day"
                  rate={primaryRole.customOvertimeRates.seventhDayHourlyRate}
                  budgetCode="10-003"
                  tag="Labor OT"
                  tagColor="purple"
                  isEditing={isEditing}
                  onRateChange={(v) => handleUpdate('overtime', 'seventhDayHourlyRate', v)}
                />
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Overtime Card */}
      <Card className="border shadow-sm">
        <div className="px-3 py-2 border-b bg-muted/20">
          <h3 className="text-xs font-bold uppercase tracking-wide">Overtime</h3>
        </div>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="py-1.5 px-3 text-left text-[9px] font-bold uppercase text-muted-foreground">Item</th>
                <th className="py-1.5 px-3 text-right text-[9px] font-bold uppercase text-muted-foreground">Rate</th>
                <th className="py-1.5 px-3 text-left text-[9px] font-bold uppercase text-muted-foreground">Budget Code</th>
                <th className="py-1.5 px-3 text-left text-[9px] font-bold uppercase text-muted-foreground">Tag</th>
              </tr>
            </thead>
            <tbody>
              {primaryRole?.customOvertimeRates?.sixthDayHourlyRate ? (
                <>
                  <TableRow
                    item="Add Hour"
                    rate="36.36"
                    budgetCode="15-002"
                    tag="Overtime"
                    tagColor="blue"
                    isEditing={isEditing}
                  />
                  <TableRow
                    item="Enhanced O/T"
                    rate={primaryRole.customOvertimeRates.sixthDayHourlyRate}
                    budgetCode="15-003"
                    tag="Overtime"
                    tagColor="blue"
                    isEditing={isEditing}
                    onRateChange={(v) => handleUpdate('overtime', 'sixthDayHourlyRate', v)}
                  />
                  <TableRow
                    item="Camera O/T"
                    rate="0.00"
                    budgetCode="15-004"
                    tag="Overtime"
                    tagColor="blue"
                    isEditing={isEditing}
                  />
                </>
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-xs text-muted-foreground">
                    No overtime rates configured
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Allowances Card */}
      <Card className="border shadow-sm">
        <div className="px-3 py-2 border-b bg-muted/20">
          <h3 className="text-xs font-bold uppercase tracking-wide">Allowances</h3>
        </div>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="py-1.5 px-3 text-left text-[9px] font-bold uppercase text-muted-foreground">Item</th>
                <th className="py-1.5 px-3 text-right text-[9px] font-bold uppercase text-muted-foreground">Rate</th>
                <th className="py-1.5 px-3 text-left text-[9px] font-bold uppercase text-muted-foreground">Budget Code</th>
                <th className="py-1.5 px-3 text-left text-[9px] font-bold uppercase text-muted-foreground">Tag</th>
              </tr>
            </thead>
            <tbody>
              {primaryRole?.allowances?.computerAllowance && (
                <TableRow
                  item="Computer"
                  rate={primaryRole.allowances.computerAllowanceFeePerWeek}
                  budgetCode={primaryRole.allowances.computerAllowanceBudgetCode || "30-003"}
                  tag="Rental"
                  tagColor="green"
                  isEditing={isEditing}
                  onRateChange={(v) => handleUpdate('allowance', 'computerAllowanceFeePerWeek', v)}
                  onBudgetChange={(v) => handleUpdate('allowance', 'computerAllowanceBudgetCode', v)}
                />
              )}
              {primaryRole?.allowances?.boxRental && (
                <TableRow
                  item="Box Rental"
                  rate={primaryRole.allowances.boxRentalFeePerWeek}
                  budgetCode={primaryRole.allowances.boxRentalBudgetCode || "30-001"}
                  tag="Rental"
                  tagColor="green"
                  isEditing={isEditing}
                  onRateChange={(v) => handleUpdate('allowance', 'boxRentalFeePerWeek', v)}
                  onBudgetChange={(v) => handleUpdate('allowance', 'boxRentalBudgetCode', v)}
                />
              )}
              {primaryRole?.allowances?.vehicleAllowance && (
                <TableRow
                  item="Vehicle"
                  rate={primaryRole.allowances.vehicleAllowanceFeePerWeek}
                  budgetCode={primaryRole.allowances.vehicleAllowanceBudgetCode || "30-007"}
                  tag="Rental"
                  tagColor="green"
                  isEditing={isEditing}
                  onRateChange={(v) => handleUpdate('allowance', 'vehicleAllowanceFeePerWeek', v)}
                  onBudgetChange={(v) => handleUpdate('allowance', 'vehicleAllowanceBudgetCode', v)}
                />
              )}
              {!primaryRole?.allowances?.computerAllowance && 
               !primaryRole?.allowances?.boxRental &&
               !primaryRole?.allowances?.vehicleAllowance && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-xs text-muted-foreground">
                    No allowances configured
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}