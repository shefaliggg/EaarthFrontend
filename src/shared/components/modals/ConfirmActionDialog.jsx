import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { AlertTriangle, CheckCircle2, XCircle, Loader2, Info } from "lucide-react";
import { cn } from "@/shared/config/utils";
import { SelectMenu } from "@/shared/components/menus/SelectMenu";
import { toast } from "sonner";

export default function ConfirmActionDialog({
    open,
    onOpenChange,
    loading = false,
    config,
    error,
    onConfirm,
}) {
    const {
        title,
        description,
        confirmText = "Confirm",
        cancelText = "Cancel",
        variant = "warning",
        reasons = [],
        requireReason = false,
        allowNote = false,
        notesPlaceholder = "Add internal notes for context or audit purposes...",
        successMessage
    } = config || {};

    const isDanger = variant === "danger";
    const isSuccess = variant === "success";
    const isWarning = variant === "warning";
    const isInfo = variant === "info";

    const [reason, setReason] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!open) {
            setReason("");
            setNote("");
        }
    }, [open]);

    const handleConfirm = async () => {
        if (requireReason && !reason) return toast.error("Please select a reason for this action.");
        console.log("Confirming action with reason:", reason, "and note:", note);
        
        try {
            await onConfirm({ reason, note });
            
            // Show success message if provided
            if (successMessage) {
                toast.success(successMessage);
            }
        } catch (err) {
            // Error handling - parent component should handle this
            console.error("Confirmation failed:", err);
        }
    };

    // Show success toast when action completes successfully
    useEffect(() => {
        if (!loading && !error && !open && (reason || note)) {
            // Only show toast after dialog closes and there was an action
            const successMessages = {
                danger: "Action completed successfully",
                warning: "Action completed successfully",
                success: "Action completed successfully",
                info: "Project creation initialized successfully"
            };
            
            const message = successMessages[variant] || "Action completed successfully";
            toast.success(message);
        }
    }, [loading, error, open, reason, note, variant]);

    const variantStyles = {
        danger: {
            iconBg: "bg-red-50",
            iconColor: "text-red-600",
            borderColor: "border-red-100",
            button: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-100",
            glow: "shadow-[0_0_40px_rgba(239,68,68,0.1)]"
        },
        warning: {
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
            borderColor: "border-amber-100",
            button: "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-100",
            glow: "shadow-[0_0_40px_rgba(245,158,11,0.1)]"
        },
        success: {
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            borderColor: "border-emerald-100",
            button: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-100",
            glow: "shadow-[0_0_40px_rgba(16,185,129,0.1)]"
        },
        info: {
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            borderColor: "border-blue-100",
            button: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-100",
            glow: "shadow-[0_0_40px_rgba(59,130,246,0.1)]"
        }
    };

    const currentVariant = variantStyles[variant] || variantStyles.warning;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "sm:max-w-lg rounded-2xl border-0 p-0 overflow-hidden gap-0",
                    currentVariant.glow
                )}
            >
                {/* Header Section with Icon */}
                <div className={cn(
                    "relative px-6 py-8  text-center",
                    currentVariant.iconBg,
                    currentVariant.borderColor,
                    "border-b"
                )}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" />

                    <div className="relative">
                        <div className={cn(
                            "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full",
                            "border-4 border-white shadow-lg backdrop-blur-sm",
                            currentVariant.iconBg,
                            currentVariant.iconColor
                        )}>
                            {isSuccess ? (
                                <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
                            ) : isInfo ? (
                                <Info className="h-7 w-7" strokeWidth={2} />
                            ) : (
                                <AlertTriangle className="h-7 w-7" strokeWidth={2} />
                            )}
                        </div>

                        <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
                            {title}
                        </DialogTitle>

                        {description && (
                            <DialogDescription className="mt-2.5 text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                                {description}
                            </DialogDescription>
                        )}
                    </div>
                </div>
                {(reasons.length > 0 || allowNote) && (
                    <div className="px-6 py-5 bg-background">
                        {/* Optional Inputs */}
                        {(reasons.length > 0 || allowNote) && (
                            <div className="space-y-5">
                                {reasons.length > 0 && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium text-gray-800">
                                                Reason for action
                                                {requireReason && (
                                                    <span className="ml-1 text-red-500">*</span>
                                                )}
                                            </Label>
                                            {requireReason ? (
                                                <span className="text-xs text-gray-500">Required</span>
                                            ) : (
                                                <span className="text-xs text-gray-500">Optional</span>
                                            )}
                                        </div>
                                        <SelectMenu
                                            label="Select a reason"
                                            items={reasons}
                                            selected={reason}
                                            onSelect={setReason}
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {allowNote && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium text-gray-800">
                                                Additional notes
                                            </Label>
                                            <span className="text-xs text-gray-500">Optional</span>
                                        </div>
                                        <div className="relative">
                                            <Textarea
                                                textCase="normal"
                                                placeholder={notesPlaceholder}
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                maxLength={500}
                                                className="min-h-[100px] resize-none"
                                            />
                                            <div className="mt-2 flex items-center justify-end text-xs text-gray-500">
                                                <span>{note.length}/500</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {/* Footer with Actions */}
                <div className="px-6 py-5  border-t">
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
                        <Button
                            size='lg'
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            {cancelText}
                        </Button>

                        <Button
                            size='lg'
                            variant={isDanger ? "destructive" : "default"}
                            className={cn(
                                currentVariant.button,
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                            onClick={handleConfirm}
                            disabled={loading || (requireReason && !reason)}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                confirmText
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}