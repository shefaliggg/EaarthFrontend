import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  BadgeCheck,
  Edit3,
  Save,
  QrCode,
  Edit2,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import QRCode from "react-qr-code";
import UrlBreadcrumbs from "../../../shared/components/UrlBasedBreadcrumb";
import MobileloginQR from "./MobileloginQR";
import { Button } from "../../../shared/components/ui/button";
import { PageHeader } from "../../../shared/components/PageHeader";
import { useSelector } from "react-redux";
import { CircularProgress } from "../../../shared/components/ui/circular-progress";
import { formatDate, getAvatarFallback } from "../../../shared/config/utils";
import { InfoTooltip } from "../../../shared/components/InfoTooltip";
import { CopyButton } from "../../../shared/components/buttons/CopyButton";

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
  const { currentUser } = useSelector((state) => state.user);

  console.log("current user:", currentUser);

  return (
    <div className="space-y-4">
      <PageHeader
        initials={getAvatarFallback(currentUser.displayName)}
        title={
          <span className="flex items-center gap-2">
            {currentUser.displayName}{" "}
            {isVerified && (
              <span className="inline-flex items-center gap-1 px-0.5 py-0.5 rounded-full bg-green-600 text-white text-xs font-bold">
                <div className="bg-green-600 rounded-full p-0.5">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                {/* Verified */}
              </span>
            )}
          </span>
        }
        subtitle={<div className="flex items-center gap-3 mt-1">
            {/* User Code */}
            <div className="flex items-center gap-1 px-2 pr-1 group py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <IdCard className="w-3 h-3" />
              {currentUser.userCode}
              <CopyButton text={currentUser.userCode} className="transition-colors text-muted-foreground hover:bg-transparent hover:text-primary p-0! w-4 h-4" />
            </div>
          </div>}

        extraActions={
          <>
            <div className="flex items-center gap-6">
              <InfoTooltip content={"Show Qr code for mobile Login"}>
                <Button
                  onClick={() => setShowQRModal(!showQRModal)}
                  variant={showQRModal ? "default" : "outline"}
                  size={"lg"}
                  className={"size-12!"}
                >
                  <QrCode className="size-6" />
                </Button>
              </InfoTooltip>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Member Since
                </div>
                <div className="text-lg  font-bold text-foreground">
                  {formatDate(currentUser?.createdAt)}
                </div>
              </div>
              <div className="text-center">
                <CircularProgress
                  size={72}
                  strokeWidth={8}
                  value={80}
                  labelClass="text-sm font-medium"
                />
              </div>
            </div>
          </>
        }
      />

      <AnimatePresence mode="wait">
        {showQRModal && <MobileloginQR />}
      </AnimatePresence>

      {/* Profile Card */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl py-6 "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">

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

        </div>
      </motion.div> */}
    </div>
  );
}
