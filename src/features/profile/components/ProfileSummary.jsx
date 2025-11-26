import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BadgeCheck, Edit3, Save, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import UrlBreadcrumbs from '../../../shared/components/UrlBasedBreadcrumb';
import MobileloginQR from './MobileloginQR';

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
      {/* Header with Title and Buttons - Outside Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#faf5ff] dark:bg-[#9333ea] flex items-center justify-center">
            <User className="w-5 h-5 text-[#7c3aed] dark:text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              MY PROFILE
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowQRModal(!showQRModal)}
            className="px-6 py-3 rounded-lg border shadow-md transition-all flex items-center gap-2 text-sm font-medium bg-card border-border text-foreground hover:bg-muted"
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

      {/* Breadcrumbs */}
      <div className="-mt-3 ml-[52px]">
        <UrlBreadcrumbs />
      </div>

      {/* QR Code Modal - Outside Card */}
      {showQRModal && (
        <MobileloginQR  />
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border shadow-md p-6 bg-card border-border"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl bg-primary">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              {isVerified && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
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







