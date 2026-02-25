import { Input } from "../../../../../../shared/components/ui/input";
import { Package, Laptop, Code, Camera, Smartphone, Car, Coffee, Home } from "lucide-react";
import {
  AllowanceTableSection,
  FormField,
  SelectField,
  PayableInCheckboxes,
} from "./Ui";
import { getCurrencySymbol, CAP_TYPES, CURRENCIES } from "./Constants";

/**
 * AllowancesSection
 *
 * Renders all allowance toggles for a single role. Each allowance uses
 * AllowanceTableSection which shows a summary table (Item / Rate / Hol. /
 * Gross / Budget Code* / Tag*) where * = editable + hidden from print.
 *
 * Props:
 *   allowances          {object}    role.allowances
 *   currency            {string}    role.currency (for symbol)
 *   updateAllowances    {function}  (updates) => void  (partial update)
 */
export default function AllowancesSection({ allowances, currency, updateAllowances }) {
  const sym = getCurrencySymbol(currency);

  // Helper: inline currency input used inside detail grids
  const CurrencyInput = ({ field, label, currencyOverride }) => {
    const s = getCurrencySymbol(currencyOverride || currency);
    return (
      <FormField label={label}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">{s}</span>
          <Input
            type="number" step="0.01"
            value={allowances[field]}
            onChange={(e) => updateAllowances({ [field]: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </FormField>
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Enable allowances below.{" "}
        <strong>Budget Code</strong> and <strong>Tag</strong> are editable and
        hidden from print. All other financial data is read-only in the table.
      </p>

      {/* ── Box Rental ── */}
      <AllowanceTableSection
        title="Box Rental" icon={Package}
        isEnabled={allowances.boxRental}
        onToggle={(v) => updateAllowances({ boxRental: v })}
        tag={allowances.boxRentalTag}
        onTagChange={(v) => updateAllowances({ boxRentalTag: v })}
        budgetCode={allowances.boxRentalBudgetCode}
        onBudgetCodeChange={(v) => updateAllowances({ boxRentalBudgetCode: v })}
        rateValue={allowances.boxRentalFeePerWeek}
        grossValue={allowances.boxRentalFeePerWeek}
        currency={currency}
      >
        <FormField label="Description" className="lg:col-span-2">
          <Input
            value={allowances.boxRentalDescription}
            onChange={(e) => updateAllowances({ boxRentalDescription: e.target.value.toUpperCase() })}
            placeholder="DESCRIPTION OF BOX RENTAL ITEMS" className="uppercase"
          />
        </FormField>
        <CurrencyInput field="boxRentalFeePerWeek" label="Fee Per Week" />
        <FormField label="Cap Calculated As">
          <SelectField value={allowances.boxRentalCapCalculatedAs}
            onChange={(v) => updateAllowances({ boxRentalCapCalculatedAs: v })} options={CAP_TYPES} />
        </FormField>
        <FormField label="Terms">
          <Input value={allowances.boxRentalTerms}
            onChange={(e) => updateAllowances({ boxRentalTerms: e.target.value.toUpperCase() })}
            placeholder="TERMS" className="uppercase" />
        </FormField>
        <PayableInCheckboxes
          prep={allowances.boxRentalPayableInPrep}
          shoot={allowances.boxRentalPayableInShoot}
          wrap={allowances.boxRentalPayableInWrap}
          onPrepChange={(v) => updateAllowances({ boxRentalPayableInPrep: v })}
          onShootChange={(v) => updateAllowances({ boxRentalPayableInShoot: v })}
          onWrapChange={(v) => updateAllowances({ boxRentalPayableInWrap: v })}
        />
      </AllowanceTableSection>

      {/* ── Computer Allowance ── */}
      <AllowanceTableSection
        title="Computer Allowance" icon={Laptop}
        isEnabled={allowances.computerAllowance}
        onToggle={(v) => updateAllowances({ computerAllowance: v })}
        tag={allowances.computerAllowanceTag}
        onTagChange={(v) => updateAllowances({ computerAllowanceTag: v })}
        budgetCode={allowances.computerAllowanceBudgetCode}
        onBudgetCodeChange={(v) => updateAllowances({ computerAllowanceBudgetCode: v })}
        rateValue={allowances.computerAllowanceFeePerWeek}
        grossValue={allowances.computerAllowanceFeePerWeek}
        currency={currency}
      >
        <CurrencyInput field="computerAllowanceFeePerWeek" label="Fee Per Week" />
        <FormField label="Cap Calculated As">
          <SelectField value={allowances.computerAllowanceCapCalculatedAs}
            onChange={(v) => updateAllowances({ computerAllowanceCapCalculatedAs: v })} options={CAP_TYPES} />
        </FormField>
        <FormField label="Terms">
          <Input value={allowances.computerAllowanceTerms}
            onChange={(e) => updateAllowances({ computerAllowanceTerms: e.target.value.toUpperCase() })}
            placeholder="TERMS" className="uppercase" />
        </FormField>
        <PayableInCheckboxes
          prep={allowances.computerAllowancePayableInPrep}
          shoot={allowances.computerAllowancePayableInShoot}
          wrap={allowances.computerAllowancePayableInWrap}
          onPrepChange={(v) => updateAllowances({ computerAllowancePayableInPrep: v })}
          onShootChange={(v) => updateAllowances({ computerAllowancePayableInShoot: v })}
          onWrapChange={(v) => updateAllowances({ computerAllowancePayableInWrap: v })}
        />
      </AllowanceTableSection>

      {/* ── Software Allowance ── */}
      <AllowanceTableSection
        title="Software Allowance" icon={Code}
        isEnabled={allowances.softwareAllowance}
        onToggle={(v) => updateAllowances({ softwareAllowance: v })}
        tag={allowances.softwareAllowanceTag}
        onTagChange={(v) => updateAllowances({ softwareAllowanceTag: v })}
        budgetCode={allowances.softwareAllowanceBudgetCode}
        onBudgetCodeChange={(v) => updateAllowances({ softwareAllowanceBudgetCode: v })}
        rateValue={allowances.softwareAllowanceFeePerWeek}
        grossValue={allowances.softwareAllowanceFeePerWeek}
        currency={currency}
      >
        <FormField label="Software Description">
          <Input value={allowances.softwareAllowanceDescription}
            onChange={(e) => updateAllowances({ softwareAllowanceDescription: e.target.value.toUpperCase() })}
            placeholder="SOFTWARE DESCRIPTION" className="uppercase" />
        </FormField>
        <CurrencyInput field="softwareAllowanceFeePerWeek" label="Fee Per Week" />
        <FormField label="Terms">
          <Input value={allowances.softwareAllowanceTerms}
            onChange={(e) => updateAllowances({ softwareAllowanceTerms: e.target.value.toUpperCase() })}
            placeholder="TERMS" className="uppercase" />
        </FormField>
        <PayableInCheckboxes
          prep={allowances.softwareAllowancePayableInPrep}
          shoot={allowances.softwareAllowancePayableInShoot}
          wrap={allowances.softwareAllowancePayableInWrap}
          onPrepChange={(v) => updateAllowances({ softwareAllowancePayableInPrep: v })}
          onShootChange={(v) => updateAllowances({ softwareAllowancePayableInShoot: v })}
          onWrapChange={(v) => updateAllowances({ softwareAllowancePayableInWrap: v })}
        />
      </AllowanceTableSection>

      {/* ── Equipment Rental ── */}
      <AllowanceTableSection
        title="Equipment Rental" icon={Camera}
        isEnabled={allowances.equipmentRental}
        onToggle={(v) => updateAllowances({ equipmentRental: v })}
        tag={allowances.equipmentRentalTag}
        onTagChange={(v) => updateAllowances({ equipmentRentalTag: v })}
        budgetCode={allowances.equipmentRentalBudgetCode}
        onBudgetCodeChange={(v) => updateAllowances({ equipmentRentalBudgetCode: v })}
        rateValue={allowances.equipmentRentalFeePerWeek}
        grossValue={allowances.equipmentRentalFeePerWeek}
        currency={currency}
      >
        <FormField label="Equipment Description">
          <Input value={allowances.equipmentRentalDescription}
            onChange={(e) => updateAllowances({ equipmentRentalDescription: e.target.value.toUpperCase() })}
            placeholder="EQUIPMENT DESCRIPTION" className="uppercase" />
        </FormField>
        <CurrencyInput field="equipmentRentalFeePerWeek" label="Fee Per Week" />
        <FormField label="Terms">
          <Input value={allowances.equipmentRentalTerms}
            onChange={(e) => updateAllowances({ equipmentRentalTerms: e.target.value.toUpperCase() })}
            placeholder="TERMS" className="uppercase" />
        </FormField>
        <PayableInCheckboxes
          prep={allowances.equipmentRentalPayableInPrep}
          shoot={allowances.equipmentRentalPayableInShoot}
          wrap={allowances.equipmentRentalPayableInWrap}
          onPrepChange={(v) => updateAllowances({ equipmentRentalPayableInPrep: v })}
          onShootChange={(v) => updateAllowances({ equipmentRentalPayableInShoot: v })}
          onWrapChange={(v) => updateAllowances({ equipmentRentalPayableInWrap: v })}
        />
      </AllowanceTableSection>

      {/* ── Mobile Phone Allowance ── */}
      <AllowanceTableSection
        title="Mobile Phone Allowance" icon={Smartphone}
        isEnabled={allowances.mobilePhoneAllowance}
        onToggle={(v) => updateAllowances({ mobilePhoneAllowance: v })}
        tag={allowances.mobilePhoneAllowanceTag}
        onTagChange={(v) => updateAllowances({ mobilePhoneAllowanceTag: v })}
        budgetCode={allowances.mobilePhoneAllowanceBudgetCode}
        onBudgetCodeChange={(v) => updateAllowances({ mobilePhoneAllowanceBudgetCode: v })}
        rateValue={allowances.mobilePhoneAllowanceFeePerWeek}
        grossValue={allowances.mobilePhoneAllowanceFeePerWeek}
        currency={currency}
      >
        <CurrencyInput field="mobilePhoneAllowanceFeePerWeek" label="Fee Per Week" />
        <FormField label="Terms">
          <Input value={allowances.mobilePhoneAllowanceTerms}
            onChange={(e) => updateAllowances({ mobilePhoneAllowanceTerms: e.target.value.toUpperCase() })}
            placeholder="TERMS" className="uppercase" />
        </FormField>
        <PayableInCheckboxes
          prep={allowances.mobilePhoneAllowancePayableInPrep}
          shoot={allowances.mobilePhoneAllowancePayableInShoot}
          wrap={allowances.mobilePhoneAllowancePayableInWrap}
          onPrepChange={(v) => updateAllowances({ mobilePhoneAllowancePayableInPrep: v })}
          onShootChange={(v) => updateAllowances({ mobilePhoneAllowancePayableInShoot: v })}
          onWrapChange={(v) => updateAllowances({ mobilePhoneAllowancePayableInWrap: v })}
        />
      </AllowanceTableSection>

      {/* ── Vehicle Allowance ── */}
      <AllowanceTableSection
        title="Vehicle Allowance" icon={Car}
        isEnabled={allowances.vehicleAllowance}
        onToggle={(v) => updateAllowances({ vehicleAllowance: v })}
        tag={allowances.vehicleAllowanceTag}
        onTagChange={(v) => updateAllowances({ vehicleAllowanceTag: v })}
        budgetCode={allowances.vehicleAllowanceBudgetCode}
        onBudgetCodeChange={(v) => updateAllowances({ vehicleAllowanceBudgetCode: v })}
        rateValue={allowances.vehicleAllowanceFeePerWeek}
        grossValue={allowances.vehicleAllowanceFeePerWeek}
        currency={currency}
      >
        <CurrencyInput field="vehicleAllowanceFeePerWeek" label="Fee Per Week" />
        <FormField label="Terms">
          <Input value={allowances.vehicleAllowanceTerms}
            onChange={(e) => updateAllowances({ vehicleAllowanceTerms: e.target.value.toUpperCase() })}
            placeholder="TERMS" className="uppercase" />
        </FormField>
        <PayableInCheckboxes
          prep={allowances.vehicleAllowancePayableInPrep}
          shoot={allowances.vehicleAllowancePayableInShoot}
          wrap={allowances.vehicleAllowancePayableInWrap}
          onPrepChange={(v) => updateAllowances({ vehicleAllowancePayableInPrep: v })}
          onShootChange={(v) => updateAllowances({ vehicleAllowancePayableInShoot: v })}
          onWrapChange={(v) => updateAllowances({ vehicleAllowancePayableInWrap: v })}
        />
      </AllowanceTableSection>

      {/* ── Per Diem 1 ── */}
      <AllowanceTableSection
        title="Per Diem 1" icon={Coffee}
        isEnabled={allowances.perDiem1}
        onToggle={(v) => updateAllowances({ perDiem1: v })}
        tag={allowances.perDiem1Tag}
        onTagChange={(v) => updateAllowances({ perDiem1Tag: v })}
        budgetCode={allowances.perDiem1BudgetCode}
        onBudgetCodeChange={(v) => updateAllowances({ perDiem1BudgetCode: v })}
        rateValue={allowances.perDiem1ShootDayRate}
        grossValue={allowances.perDiem1ShootDayRate}
        currency={allowances.perDiem1Currency}
      >
        <FormField label="Currency">
          <SelectField value={allowances.perDiem1Currency}
            onChange={(v) => updateAllowances({ perDiem1Currency: v })} options={CURRENCIES} />
        </FormField>
        <CurrencyInput field="perDiem1ShootDayRate" label="Shoot Day Rate" currencyOverride={allowances.perDiem1Currency} />
        <CurrencyInput field="perDiem1NonShootDayRate" label="Non-Shoot Day Rate" currencyOverride={allowances.perDiem1Currency} />
        <FormField label="Terms">
          <Input value={allowances.perDiem1Terms}
            onChange={(e) => updateAllowances({ perDiem1Terms: e.target.value.toUpperCase() })}
            placeholder="TERMS" className="uppercase" />
        </FormField>
        <PayableInCheckboxes
          prep={allowances.perDiem1PayableInPrep}
          shoot={allowances.perDiem1PayableInShoot}
          wrap={allowances.perDiem1PayableInWrap}
          onPrepChange={(v) => updateAllowances({ perDiem1PayableInPrep: v })}
          onShootChange={(v) => updateAllowances({ perDiem1PayableInShoot: v })}
          onWrapChange={(v) => updateAllowances({ perDiem1PayableInWrap: v })}
        />
      </AllowanceTableSection>

      {/* ── Per Diem 2 ── */}
      <AllowanceTableSection
        title="Per Diem 2" icon={Coffee}
        isEnabled={allowances.perDiem2}
        onToggle={(v) => updateAllowances({ perDiem2: v })}
        tag={allowances.perDiem2Tag}
        onTagChange={(v) => updateAllowances({ perDiem2Tag: v })}
        budgetCode={allowances.perDiem2BudgetCode}
        onBudgetCodeChange={(v) => updateAllowances({ perDiem2BudgetCode: v })}
        rateValue={allowances.perDiem2ShootDayRate}
        grossValue={allowances.perDiem2ShootDayRate}
        currency={allowances.perDiem2Currency}
      >
        <FormField label="Currency">
          <SelectField value={allowances.perDiem2Currency}
            onChange={(v) => updateAllowances({ perDiem2Currency: v })} options={CURRENCIES} />
        </FormField>
        <CurrencyInput field="perDiem2ShootDayRate" label="Shoot Day Rate" currencyOverride={allowances.perDiem2Currency} />
        <CurrencyInput field="perDiem2NonShootDayRate" label="Non-Shoot Day Rate" currencyOverride={allowances.perDiem2Currency} />
        <FormField label="Terms">
          <Input value={allowances.perDiem2Terms}
            onChange={(e) => updateAllowances({ perDiem2Terms: e.target.value.toUpperCase() })}
            placeholder="TERMS" className="uppercase" />
        </FormField>
        <PayableInCheckboxes
          prep={allowances.perDiem2PayableInPrep}
          shoot={allowances.perDiem2PayableInShoot}
          wrap={allowances.perDiem2PayableInWrap}
          onPrepChange={(v) => updateAllowances({ perDiem2PayableInPrep: v })}
          onShootChange={(v) => updateAllowances({ perDiem2PayableInShoot: v })}
          onWrapChange={(v) => updateAllowances({ perDiem2PayableInWrap: v })}
        />
      </AllowanceTableSection>

      {/* ── Living Allowance ── */}
      <AllowanceTableSection
        title="Living Allowance" icon={Home}
        isEnabled={allowances.livingAllowance}
        onToggle={(v) => updateAllowances({ livingAllowance: v })}
        tag={allowances.livingAllowanceTag}
        onTagChange={(v) => updateAllowances({ livingAllowanceTag: v })}
        budgetCode={allowances.livingAllowanceBudgetCode}
        onBudgetCodeChange={(v) => updateAllowances({ livingAllowanceBudgetCode: v })}
        rateValue={allowances.livingAllowanceWeeklyRate}
        grossValue={allowances.livingAllowanceWeeklyRate}
        currency={allowances.livingAllowanceCurrency}
      >
        <FormField label="Currency">
          <SelectField value={allowances.livingAllowanceCurrency}
            onChange={(v) => updateAllowances({ livingAllowanceCurrency: v })} options={CURRENCIES} />
        </FormField>
        <CurrencyInput field="livingAllowanceWeeklyRate" label="Weekly Rate" currencyOverride={allowances.livingAllowanceCurrency} />
        <FormField label="Terms">
          <Input value={allowances.livingAllowanceTerms}
            onChange={(e) => updateAllowances({ livingAllowanceTerms: e.target.value.toUpperCase() })}
            placeholder="TERMS" className="uppercase" />
        </FormField>
        <PayableInCheckboxes
          prep={allowances.livingAllowancePayableInPrep}
          shoot={allowances.livingAllowancePayableInShoot}
          wrap={allowances.livingAllowancePayableInWrap}
          onPrepChange={(v) => updateAllowances({ livingAllowancePayableInPrep: v })}
          onShootChange={(v) => updateAllowances({ livingAllowancePayableInShoot: v })}
          onWrapChange={(v) => updateAllowances({ livingAllowancePayableInWrap: v })}
        />
      </AllowanceTableSection>
    </div>
  );
}