import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, BadgeCheck, Edit3, Save, QrCode, Edit2 } from "lucide-react";
import QRCode from "react-qr-code";
import UrlBreadcrumbs from "../../../shared/components/UrlBasedBreadcrumb";
import MobileloginQR from "./MobileloginQR";
import { Button } from "../../../shared/components/ui/button";
import { PageHeader } from "../../../shared/components/PageHeader";

export default function ProfileSummary({
  profile,
  isDarkMode,
  isEditing,
  setIsEditing,
  handleSave,
  handleCancel,
}) {
  const [showQRModal, setShowQRModal] = useState(false);
  const [isVerified] = useState(true);

  return (
    <div className="space-y-4">
      {/* Header with Title and Buttons - Outside Card */}
      <PageHeader
        icon="User"
        title="My Profile"
        extraActions={
          <>
            <Button
              onClick={() => setShowQRModal(!showQRModal)}
              variant={"outline"}
              size={"lg"}
            >
              <QrCode />
              Show Qr Code
            </Button>
            {isEditing ? (
              <>
                <Button onClick={handleCancel} variant={"outline"} size={"lg"}>
                  Cancel
                </Button>
                <Button onClick={handleSave} size={"lg"}>
                  <Save /> Save
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size={"lg"}>
                <Edit2 /> Edit
              </Button>
            )}
          </>
        }
      />

      {/* QR Code Modal - Outside Card */}
      {showQRModal && <MobileloginQR />}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border shadow-md p-6 bg-card border-border"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl bg-primary">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </div>
              {isVerified && (
                <div className="absolute top-0 right-0 bg-green-600 rounded-full p-0.5">
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
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600 text-white text-xs font-bold">
                  <BadgeCheck className="w-3 h-3" /> EAARTH VERIFIED
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground">PROJECTS</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">36</div>
              <div className="text-xs text-muted-foreground">PENDING DOCS</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground">COMPLETE</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
