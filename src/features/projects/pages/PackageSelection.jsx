// src/features/projects/components/PackageSelection.jsx
import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Columns2, Phone } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const PACKAGES = [
  {
    id: 'indie',
    title: 'Indie',
    subtitle: 'Independent Production',
    description: 'Everything you need to launch your indie project on a lean budget.',
    price: '$15',
    period: '/week base',
    highlight: false,
    badge: null,
    tags: ['5 Core Apps', '25GB Storage', 'Up to 15 Crew'],
    features: [
      'EARTH Branding',
      'Single Project Only',
      '5 Core App Access',
      '25GB Cloud Storage',
      'Up to 15 Crew Members',
      '2 Admin Seats',
      'Call Sheets & Scheduling',
      'Basic Call Sheet Templates',
      'Basic Script Tools',
      'Email Notifications',
      'Standard Export (PDF)',
      'Community Support',
    ],
    selectLabel: 'Select Indie',
    contactSales: false,
  },
  {
    id: 'studio',
    title: 'Studio',
    subtitle: 'Production Studio',
    description: 'Full-scale production tools for established studios and agencies.',
    price: '$45',
    period: '/week base',
    highlight: true,
    badge: 'Most Popular',
    tags: ['All Apps', '500GB Storage', 'Unlimited Crew'],
    features: [
      'Custom Project Branding',
      'Up to 10 Projects',
      'All App Access',
      '500GB Cloud Storage',
      'Unlimited Crew Members',
      '10 Admin Seats',
      'Role-Based Permissions',
      'Advanced Budgeting & Reports',
      'Automated Daily Production Reports',
      'Real-Time Collaboration',
      'Custom Templates',
      'Multi-Project Dashboard',
      'Custom Export (PDF, CSV, Excel)',
      'API Integrations',
      'Priority Support',
    ],
    selectLabel: 'Select Studio',
    contactSales: false,
  },
  {
    id: 'blockbuster',
    title: 'Blockbuster',
    subtitle: 'Major Production',
    description: 'Enterprise-grade infrastructure for large-scale productions.',
    price: '$85',
    period: '/week base',
    highlight: false,
    badge: null,
    tags: ['White Label', 'Unlimited Storage', 'Dedicated Support'],
    features: [
      'Complete White Label',
      'Your Studio Branding',
      'Unlimited Projects',
      'Unlimited Cloud Storage',
      'All Apps + Early Access',
      'Unlimited Admin Seats',
      'Multi-Studio Organisation',
      'Custom Role Builder',
      'Audit Logs & Compliance',
      'Full API & Webhook Access',
      'Offline Mode & On-Set Sync',
      'Custom Domain & SSO',
      'Dedicated Account Manager',
      'On-Set Technical Support',
      'Priority Data Migration',
      'Custom Onboarding & Training',
      'Advanced Analytics & BI',
      'SLA Guarantee',
    ],
    selectLabel: 'Select Blockbuster',
    contactSales: true,
  },
];

const PackageCard = ({ pkg, selected, onSelect, showFeatures }) => {
  const isSelected = selected === pkg.id;

  return (
    <div
      className={cn(
        'relative flex flex-col h-full rounded-2xl border-2 transition-all duration-200 bg-white overflow-visible',
        isSelected
          ? 'border-purple-500 shadow-xl shadow-purple-100'
          : 'border-gray-200 shadow-sm hover:border-gray-300',
      )}
    >
      {/* Most Popular badge */}
      {pkg.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-purple-600 text-white text-[11px] font-semibold px-4 py-1 rounded-full shadow">
            {pkg.badge}
          </span>
        </div>
      )}

      {/* Selected checkmark — top right */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center z-10">
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </div>
      )}

      {/* ── Top section: header + description + price + tags ── */}
      <div className="p-5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-500 text-xs font-bold">{pkg.title[0]}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{pkg.title}</h3>
            <p className="text-xs text-gray-400">{pkg.subtitle}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed">{pkg.description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
          <span className="text-xs text-gray-400">{pkg.period}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {pkg.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'text-[10px] font-medium px-2.5 py-0.5 rounded-full border',
                isSelected
                  ? 'border-purple-200 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-gray-50 text-gray-500',
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Middle section: features — flex-1 pushes CTA to bottom ── */}
      {showFeatures ? (
        <div className="px-5 pb-4 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2.5">
            Includes
          </p>
          <ul className="space-y-1.5">
            {pkg.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                <Check
                  className={cn(
                    'w-3.5 h-3.5 mt-0.5 flex-shrink-0',
                    isSelected ? 'text-purple-500' : 'text-gray-300',
                  )}
                  strokeWidth={2.5}
                />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* ── Bottom section: CTA always pinned ── */}
      <div className="px-5 pb-5 pt-3 flex flex-col gap-2 mt-auto">
        <button
          onClick={() => onSelect(pkg.id)}
          className={cn(
            'w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            isSelected
              ? 'bg-purple-600 text-white shadow-md shadow-purple-200 hover:bg-purple-700'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600',
          )}
        >
          {isSelected ? 'Selected' : pkg.selectLabel}
        </button>

        {pkg.contactSales && (
          <button className="w-full flex items-center justify-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors">
            <Phone className="w-3 h-3" />
            Contact Sales
          </button>
        )}
      </div>
    </div>
  );
};

export const PackageSelection = ({ selectedPackage = 'studio', onChange }) => {
  const [showFeatures, setShowFeatures] = useState(true);

  return (
    <div className="space-y-6">
      {/* items-stretch = all cards same height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {PACKAGES.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            selected={selectedPackage}
            onSelect={onChange}
            showFeatures={showFeatures}
          />
        ))}
      </div>

      {/* Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowFeatures((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all shadow-sm"
        >
          <Columns2 className="w-3.5 h-3.5" />
          {showFeatures ? 'Compare' : 'Compare'} Features Side-by-Side
          {showFeatures ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

export default PackageSelection;