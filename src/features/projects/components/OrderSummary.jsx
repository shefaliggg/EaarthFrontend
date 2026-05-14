// src/features/projects/components/OrderSummary.jsx
import React, { useState } from 'react';
import { Check } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const PACKAGE_DETAILS = {
  indie: {
    name: 'Indie',
    subtitle: 'Independent Production',
    price: 15,
    tags: ['5 Core Apps', '25GB Storage', 'Up to 15 Crew'],
  },
  studio: {
    name: 'Studio',
    subtitle: 'Production Studio',
    price: 45,
    tags: ['All Apps', '500GB Storage', 'Unlimited Crew'],
  },
  blockbuster: {
    name: 'Blockbuster',
    subtitle: 'Major Production',
    price: 85,
    tags: ['White Label', 'Unlimited Storage', 'Dedicated Support'],
  },
};

const APP_PRICES = {
  calendar: 10, callsheets: 5, schedule: 8, asset: 12,
  costume: 15, catering: 20, accounts: 25, script: 8,
  market: 10, transport: 12, eplayer: 15, forms: 5,
  props: 18, animals: 22, vehicles: 15, locations: 12,
  cloud: 30, timesheets: 10, noticeboard: 5, breakdown: 8,
  reports: 12, casting: 20, budget: 15, eearth_sign: 18,
};

const BILLING_OPTIONS = [
  { value: 'weekly',  label: 'Weekly',  badge: null,       saveBadge: null },
  { value: 'monthly', label: 'Monthly', badge: 'Save 10%', saveBadge: null },
  { value: 'annual',  label: 'Annual',  badge: 'Save 20%', saveBadge: 'Best Value' },
];

const PROMO_CODES = [
  { code: 'SAVE20',    label: '🏷 SAVE20' },
  { code: 'WELCOME10', label: '🏷 WELCOME10' },
];

const MULTIPLIERS = { weekly: 1, monthly: 4, annual: 52 };

export const OrderSummary = ({ formData, updateField, onEdit, onComplete }) => {
  const [promoCode, setPromoCode] = useState(formData.promoCode ?? '');
  const [billing, setBilling]     = useState(formData.billingPeriod ?? 'weekly');

  const pkg        = PACKAGE_DETAILS[formData.packageTier] ?? PACKAGE_DETAILS.studio;
  const selectedApps = formData.selectedApplications ?? [];
  const appsTotal  = selectedApps.reduce((sum, id) => sum + (APP_PRICES[id] ?? 0), 0);
  const baseWeekly = pkg.price;
  const multiplier = MULTIPLIERS[billing] ?? 1;
  const subtotal   = (baseWeekly + appsTotal) * multiplier;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Review your selections and complete your subscription</p>

      {/* Two-column layout — equal height panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

        {/* ── Left: Your Package ──────────────────────────────────────── */}
        <div className="border border-gray-200 rounded-xl p-5 flex flex-col bg-white">

          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Your Package
          </p>

          {/* Package name + subtitle */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{pkg.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{pkg.subtitle}</p>
          </div>

          {/* Bullet tags */}
          <ul className="space-y-1.5 flex-1">
            {pkg.tags.map((tag) => (
              <li key={tag} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                {tag}
              </li>
            ))}
          </ul>

          {/* Pricing rows pinned to bottom */}
          <div className="border-t border-gray-100 mt-6 pt-4 space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Package base</span>
              <span className="font-medium text-gray-800">${baseWeekly}/week</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{selectedApps.length} apps selected</span>
              <span className="font-medium text-gray-800">${appsTotal}/mo</span>
            </div>
          </div>
        </div>

        {/* ── Right: Payment ──────────────────────────────────────────── */}
        <div className="border border-gray-200 rounded-xl p-5 flex flex-col gap-5 bg-white">

          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Payment
          </p>

          {/* Promo code */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Promo Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 h-10 px-3 rounded-lg text-sm border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
              />
              <button className="px-5 h-10 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition">
                Apply
              </button>
            </div>
            {/* Quick promo chips */}
            <div className="flex gap-2">
              {PROMO_CODES.map((p) => (
                <button
                  key={p.code}
                  onClick={() => setPromoCode(p.code)}
                  className={cn(
                    'text-xs px-3 py-1 rounded-full border transition',
                    promoCode === p.code
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-purple-200 text-purple-600 hover:bg-purple-50',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Billing toggle */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Billing</label>
            <div className="relative flex rounded-xl bg-gray-100 p-1 gap-1">
              {BILLING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setBilling(opt.value)}
                  className={cn(
                    'relative flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1',
                    billing === opt.value
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-gray-500 hover:text-gray-700',
                  )}
                >
                  {/* Best Value badge floating above Annual */}
                  {opt.saveBadge && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {opt.saveBadge}
                    </span>
                  )}
                  {opt.label}
                  {opt.badge && billing !== opt.value && (
                    <span className="text-[9px] text-green-600 font-bold">{opt.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Subtotal + Total */}
          <div className="flex-1 flex flex-col justify-end gap-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-500">Subtotal ({BILLING_OPTIONS.find(b => b.value === billing)?.label})</span>
                <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline px-4 py-3">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-purple-600">${subtotal.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">/{billing === 'weekly' ? 'wk' : billing === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>
            </div>

            {/* Complete Subscription — inside the card */}
            <button
              onClick={onComplete}
              className="w-full bg-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors shadow-md shadow-purple-100 flex items-center justify-center gap-2"
            >
              Complete Subscription
              <Check className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;