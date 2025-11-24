import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BadgeCheck, Edit3, Save, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import UrlBreadcrumbs from '../../../shared/components/UrlBasedBreadcrumb';

export default function ProfileSummary({ 
  profile, 
  isDarkMode, 
  isEditing, 
  setIsEditing, 
  handleSave, 
  handleCancel 
}) {
  const [showQRModal, setShowQRModal] = useState(false);
  const [isVerified] = useState(true);

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <UrlBreadcrumbs />

      {/* Header with Title and Buttons - Outside Card */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            MY PROFILE
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowQRModal(!showQRModal)}
            className="px-6 py-3 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium bg-card border-border text-foreground hover:bg-muted"
          >
            <QrCode className="w-4 h-4" />
            SHOW QR CODE
          </button>

          {isEditing ? (
            <>
              <button 
                onClick={handleSave} 
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground flex items-center gap-2 hover:opacity-90 transition-all text-sm font-medium"
              >
                <Save className="w-4 h-4" /> SAVE
              </button>
              <button 
                onClick={handleCancel} 
                className="px-6 py-3 rounded-lg transition-all text-sm font-medium bg-muted text-foreground hover:bg-muted/80"
              >
                CANCEL
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground flex items-center gap-2 hover:opacity-90 transition-all text-sm font-medium"
            >
              <Edit3 className="w-4 h-4" /> EDIT
            </button>
          )}
        </div>
      </div>

      {/* QR Code Modal - Outside Card */}
      {showQRModal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-6 bg-card border-border"
        >
          <div className="flex items-start gap-6">
            {/* Left: User Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg bg-primary">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  {profile.firstName.toUpperCase()} {profile.lastName.toUpperCase()}
                </h3>
                <p className="text-sm text-muted-foreground">
                  DIRECTOR OF PHOTOGRAPHY
                </p>
              </div>
            </div>

            {/* Center: QR Code */}
            <div className="bg-white p-4 rounded-lg border-4 border-primary">
              <QRCode
                value="https://eaarth.app/crew/js-2024-dop"
                size={180}
                level="H"
              />
              <div className="text-center mt-3">
                <div className="font-bold text-xs px-2 py-1 rounded-full border-2 text-primary bg-primary/10 border-primary">
                  ID: JS-2024-DOP
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1">
              <h4 className="font-bold mb-2 text-foreground">
                SCAN TO ACCESS MY PROFILE
              </h4>
              <p className="text-sm mb-3 text-muted-foreground">
                Use the <strong>Eaarth Phone App</strong> to scan this QR code for:
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">●</span>
                  <span><strong>Quick Login</strong> - Access your profile on mobile devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">●</span>
                  <span><strong>Digital Crew Pass</strong> - Show your credentials on set</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">●</span>
                  <span><strong>Contact Card</strong> - Share your professional info instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">●</span>
                  <span><strong>Schedule Sync</strong> - View your call times and bookings</span>
                </li>
              </ul>
              <div className="mt-3 p-2 rounded-lg text-xs bg-muted border border-border">
                <strong className="text-primary">Profile URL:</strong>
                <span className="ml-1 text-muted-foreground">
                  https://eaarth.app/crew/js-2024-dop
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border p-6 bg-card border-border"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg bg-primary">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              {isVerified && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow-lg">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Name & Details */}
            <div>
              <h2 className="text-lg font-bold mb-1 text-foreground">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-xs mb-2 text-muted-foreground">
                DIRECTOR OF PHOTOGRAPHY
              </p>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold">
                  <BadgeCheck className="w-3 h-3" /> EAARTH VERIFIED
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">
                12
              </div>
              <div className="text-xs text-muted-foreground">
                PROJECTS
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">
                36
              </div>
              <div className="text-xs text-muted-foreground">
                PENDING DOCS
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">
                100%
              </div>
              <div className="text-xs text-muted-foreground">
                COMPLETE
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



