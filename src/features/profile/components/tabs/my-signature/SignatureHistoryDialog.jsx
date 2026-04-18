import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import {
  Calendar,
  Eye,
  Download,
  FileText,
  History,
  Shield,
  CheckCircle2,
  Award,
  CheckCircle,
  ShieldCheck,
  Info,
} from "lucide-react";
import { formatDate, convertToPrettyText } from "@/shared/config/utils";
import { fetchSignatureHistoryThunk } from "../../../../signature/store/signature.thunk";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Card } from "../../../../../shared/components/ui/card";
import { Separator } from "../../../../../shared/components/ui/separator";
import { Badge } from "../../../../../shared/components/ui/badge";
import HistorySignatureSkelton from "../../skeltons/HistorySignatureSkelton";
import { cn } from "../../../../../shared/config/utils";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../../shared/stores/useModalStore";

export default function SignatureHistoryDialog({
  open,
  onOpenChange,
  onDownload,
}) {
  const { history, isFetchingHistory } = useSelector(
    (state) => state.signature,
  );
  const { openModal } = useModalStore();

  const dispatch = useDispatch();
  // console.log("signature history:", history);

  useEffect(() => {
    if (open) {
      dispatch(fetchSignatureHistoryThunk());
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <History className="size-5 text-primary" />
            </div>

            <div>
              <DialogTitle className="text-lg font-semibold leading-tight">
                Signature Timeline
              </DialogTitle>

              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Track every version of your digital signature, including
                updates, verification status, and certificates.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {isFetchingHistory ? (
            <HistorySignatureSkelton />
          ) : history?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-muted/30 rounded-full mb-4">
                <History className="size-12 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No signature history found
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Your signature versions will appear here
              </p>
            </div>
          ) : (
            history?.map((item, index) => (
              <Card
                key={item._id}
                className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20 py-0"
              >
                <div className="p-5 space-y-4">
                  {/* Header Section */}
                  <div className="flex items-start justify-between">
                    {/* LEFT */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          Version {item.version}
                        </span>

                        {item.isCurrent && (
                          <StatusBadge
                            showIcon={false}
                            size="md"
                            label="Current"
                            status="highlight"
                          />
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <StatusBadge status={item.status?.toLowerCase()} />
                  </div>

                  {/* Signature Preview */}
                  <div className="relative flex justify-center items-center rounded-xl p-6 bg-primary/5 dark:bg-muted-foreground/50 border-2 border-dashed">
                    <img
                      src={item.signatureUrl}
                      className="max-h-28 min-h-28 object-contain relative z-10 transition-transform"
                    />
                  </div>

                  {/* Metadata Grid */}
                  <div className="space-y-2 text-xs text-muted-foreground px-2">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        Created
                      </span>
                      <span className="text-foreground font-medium">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Shield className="size-3" />
                        Verification Status
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          item.verificationStatus === "VERIFIED"
                            ? "text-green-600"
                            : "text-muted-foreground",
                        )}
                      >
                        {convertToPrettyText(item.verificationStatus)}
                      </span>
                    </div>
                  </div>

                  {/* Change Reason */}
                  {item.changeReasonType && (
                    <>
                      <Separator />
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">
                          Change Reason
                        </p>

                        <p className="text-sm text-primary">
                          {convertToPrettyText(item.changeReasonType)}
                          {item.changeReasonText && (
                            <span className="text-muted-foreground">
                              {" "}
                              — {item.changeReasonText}
                            </span>
                          )}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Certificate Info */}
                  {item.certificateId && (
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium">
                            Certificate ID
                          </span>
                        </div>

                        <code className="text-xs bg-background/50 px-2 py-1 rounded font-mono">
                          {item.certificateId}
                        </code>
                      </div>

                      {item.status === "REVOKED" && (
                        <div className="text-xs text-yellow-600 flex items-center gap-2">
                          <Info className="w-3 h-3" />
                          Certificate issued before this version was revoked
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2">
                    {item.certificateUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openModal(MODAL_TYPES.DOCUMENT_PREVIEW, {
                            fileUrl: item?.certificateUrl,
                            fileName: item?.certificateDocumentId?.originalName,
                            banner:
                              item?.status !== "ACTIVE"
                                ? {
                                    title: "Certificate Context Notice",
                                    icon: Info,
                                    variant: "warning",
                                    content: (
                                      <div>
                                        This certificate was issued before this
                                        signature version was revoked.
                                        <br />
                                        It remains valid as a historical record
                                        but is not tied to the active signature.
                                      </div>
                                    ),
                                  }
                                : null,
                          })
                        }
                      >
                        <FileText className="w-4 h-4" />
                        View Certificate
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onDownload({
                          type: "Signature",
                          fileUrl: item.signatureUrl,
                          fileName:
                            item?.signatureDocumentId?.originalName ||
                            `signature-v${item.version}.png`,
                        })
                      }
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
