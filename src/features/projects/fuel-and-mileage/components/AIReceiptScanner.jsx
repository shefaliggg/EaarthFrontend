import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Loader,
    FileText,
    Calendar,
    DollarSign,
    Fuel,
    Sparkles,
    AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export function AIReceiptScanner({
    weekStartDate,
    weekEndDate,
    onReceiptsScanned,
}) {
    const [receipts, setReceipts] = useState([]);
    const [isScanning, setIsScanning] = useState(false);

    const simulateAIScan = async () => {
        await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000));

        const mockDates = [
            new Date(weekStartDate.getTime() + Math.random() * 6 * 86400000),
            new Date(weekStartDate.getTime() - Math.random() * 7 * 86400000),
            new Date(weekEndDate.getTime() + Math.random() * 7 * 86400000),
        ];

        const receiptDate =
            mockDates[Math.floor(Math.random() * mockDates.length)];
        const isVAT = Math.random() > 0.5;
        const gross = 30 + Math.random() * 70;
        const net = gross / 1.2;

        return {
            date: receiptDate,
            amount: isVAT ? net : gross,
            vatAmount: isVAT ? gross - net : null,
            isVATReceipt: isVAT,
            merchant: ["Shell", "BP", "Tesco", "Esso"][
                Math.floor(Math.random() * 4)
            ],
        };
    };

    const isWithinWeek = (date) =>
        date >= weekStartDate && date <= weekEndDate;

    const handleFileUpload = useCallback(
        async (files) => {
            if (!files?.length) return;

            const uploaded = [];
            setIsScanning(true);

            for (const file of Array.from(files)) {
                const id = crypto.randomUUID();
                const imageUrl = URL.createObjectURL(file);

                const base = {
                    id,
                    fileName: file.name,
                    imageUrl,
                    scanStatus: "scanning",
                    isWithinWeek: false,
                };

                uploaded.push(base);
                setReceipts((p) => [...p, base]);

                try {
                    const data = await simulateAIScan();
                    const valid = data.date && isWithinWeek(data.date);

                    const updated = {
                        ...base,
                        ...data,
                        isWithinWeek: valid,
                        scanStatus: !data.date
                            ? "error"
                            : valid
                                ? "success"
                                : "date-warning",
                        errorMessage:
                            !data.date
                                ? "Could not extract date"
                                : !valid
                                    ? `Outside claim week (${data.date.toLocaleDateString()})`
                                    : null,
                    };

                    setReceipts((p) =>
                        p.map((r) => (r.id === id ? updated : r))
                    );
                    uploaded[uploaded.findIndex((r) => r.id === id)] = updated;

                    updated.scanStatus === "success"
                        ? toast.success(`Scanned ${data.merchant}`)
                        : updated.scanStatus === "date-warning"
                            ? toast.warning(updated.errorMessage)
                            : null;
                } catch {
                    setReceipts((p) =>
                        p.map((r) =>
                            r.id === id
                                ? { ...r, scanStatus: "error" }
                                : r
                        )
                    );
                    toast.error(`Failed to scan ${file.name}`);
                }
            }

            setIsScanning(false);
            onReceiptsScanned(uploaded);
        },
        [weekStartDate, weekEndDate, onReceiptsScanned]
    );

    const removeReceipt = (id) => {
        setReceipts((p) => {
            const next = p.filter((r) => r.id !== id);
            onReceiptsScanned(next);
            return next;
        });
    };

    const formatDate = (d) =>
        d
            ? d.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            : "Unknown";

    const totalAmount = receipts.reduce(
        (s, r) => s + (r.amount || 0),
        0
    );

    return (
        <div className="rounded-xl border bg-white dark:bg-[#0f0e13] dark:border-[#2f2b3e] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-900 p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">
                            AI Receipt Scanner
                        </h3>
                        <p className="text-white/80 text-sm">
                            Upload fuel receipts for automatic extraction
                        </p>
                    </div>
                </div>
            </div>

            {/* Week banner */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 text-sm">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-medium">
                    <Calendar className="w-4 h-4" />
                    {formatDate(weekStartDate)} – {formatDate(weekEndDate)}
                </div>
            </div>

            {/* Upload */}
            <div className="p-4">
                <label
                    className={`flex flex-col items-center justify-center p-8 py-12 border-2 border-dashed rounded-xl cursor-pointer transition
            ${isScanning
                            ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-300 dark:border-gray-700 hover:border-purple-500"
                        }`}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        hidden
                        disabled={isScanning}
                        onChange={(e) => handleFileUpload(e.target.files)}
                    />

                    {isScanning ? (
                        <Loader className="w-8 h-8 animate-spin text-purple-600" />
                    ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                    )}

                    <p className="mt-3 font-semibold text-gray-900 dark:text-white">
                        {isScanning
                            ? "Scanning receipts..."
                            : "Click to upload or drag files"}
                    </p>
                </label>

                {/* Receipts */}
                <AnimatePresence>
                    {receipts.length > 0 && (
                        <motion.div className="space-y-2 mt-4">
                            {receipts.map((r) => (
                                <motion.div
                                    key={r.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="p-4 rounded-lg border bg-gray-50 dark:bg-[#16151d] dark:border-[#2f2b3e]"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border dark:border-gray-700">
                                            {r.imageUrl ? (
                                                <img
                                                    src={r.imageUrl}
                                                    alt={r.fileName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <FileText className="m-auto mt-5 text-gray-400" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                                    {r.fileName.slice(0,35) + "..."}
                                                </h4>
                                                <button
                                                    onClick={() => removeReceipt(r.id)}
                                                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                                                >
                                                    <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                                                </button>
                                            </div>

                                            {r.amount && (
                                                <div className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    £{r.amount.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Total */}
                {receipts.length > 0 && (
                    <div className="mt-4 p-4 rounded-lg border bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
                        <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                            Total extracted amount
                        </div>
                        <div className="text-2xl font-black text-purple-700 dark:text-purple-300">
                            £{totalAmount.toFixed(2)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
