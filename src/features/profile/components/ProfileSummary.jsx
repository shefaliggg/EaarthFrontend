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
import { convertToPrettyText, formatDate, getAvatarFallback } from "../../../shared/config/utils";
import { InfoTooltip } from "../../../shared/components/InfoTooltip";
import { CopyButton } from "../../../shared/components/buttons/CopyButton";
import { StatusBadge } from "../../../shared/components/badges/StatusBadge";

export default function ProfileSummary() {
  const [showQRModal, setShowQRModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { crewProfile, isFetching } = useSelector(
    (state) => state.crewProfile,
  );

  const verificationStatus = currentUser?.verification?.status
  return (
    <div className="space-y-4">
      <PageHeader
        initials={getAvatarFallback(currentUser.displayName)}
        title={
          <span className="flex items-center gap-2">
            {convertToPrettyText(currentUser.displayName)}{" "}
            {verificationStatus && (
              <StatusBadge status={verificationStatus} size="sm"/>
            )}
          </span>
        }
        subtitle={
          <span className="flex items-center gap-3 mt-1">
            {/* User Code */}
            <span className="flex items-center gap-1 px-2 pr-1 group py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <IdCard className="w-3 h-3" />
              {currentUser.userCode}
              <CopyButton
                text={currentUser.userCode}
                className="transition-colors text-muted-foreground hover:bg-transparent hover:text-primary p-0! w-4 h-4"
              />
            </span>
          </span>
        }
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
                  value={crewProfile?.profileCompletionPercent ?? 0}
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
    </div>
  );
}
