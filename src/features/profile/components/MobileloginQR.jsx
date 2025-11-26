import { motion } from 'framer-motion';
import { QrCode, RotateCcw, User } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useAuth } from '../../auth/context/AuthContext';
import { useQrLogin } from '../../auth/hooks/useQrLogin';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function MobileloginQR() {
    const { user } = useAuth();
    const { qrData, generateQr, loading, error } = useQrLogin({ type: "mobile" });
    const [secondsLeft, setSecondsLeft] = useState(300);

    useEffect(() => {
        generateQr();
    }, []);

    useEffect(() => {
        if (!qrData?.expiresAt) return;

        const end = new Date(qrData.expiresAt).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((end - now) / 1000));

            setSecondsLeft(diff);

            if (diff === 0) {
                toast.error("QR Code Expired", {
                    description: "The QR code is no longer valid. Please refresh to generate a new one.",
                });
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [qrData]);


    const isExpired = secondsLeft === 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border shadow-md p-6 bg-card border-border"
        >
            <div className="flex items-start gap-6">
                {/* Left: User Info */}
                {/* <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg bg-primary">
                        <User className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground">
                            {user.legalFirstName.toUpperCase()} {user.legalLastName.toUpperCase()}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            DIRECTOR OF PHOTOGRAPHY
                        </p>
                    </div>
                </div> */}

                {/* Right: Info */}
                <div className="flex-1 space-y-6">
                    <h4 className="font-bold text-xl mb-4 text-foreground ">
                        SCAN TO ACCESS MY PROFILE
                    </h4>
                    <p className="text-sm mb-4 text-muted-foreground">
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

                {/* Center: QR Code */}
                <div className="bg-white p-4 rounded-lg border-4 border-primary relative">
                    {isExpired && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl z-10">
                            <RotateCcw
                                className="w-10 h-10 text-purple-900 cursor-pointer mb-2"
                                onClick={() => {
                                    generateQr();
                                    setSecondsLeft(300);
                                }}
                            />
                            <p className="text-sm font-semibold text-purple-900">Refresh QR</p>
                        </div>
                    )}
                    {loading && <div className="flex flex-col p-8 items-center text-center justify-center gap-4 text-purple-900 text-sm font-medium animate-pulse">
                        <QrCode className="size-20 " /> Generating QR Code
                    </div>}
                    {error && <div className="flex flex-col p-8 items-center text-center justify-center gap-4 text-red-600 text-sm font-medium">
                        <QrCode className="size-20 " /> Error Generating QR Code
                    </div>}
                    {qrData && (
                        <QRCode
                            value={qrData.socketRoom}
                            size={180}
                            level="H"
                        />
                    )}
                    <div className="text-center mt-3">
                        <div className="font-bold text-xs px-2 py-1 rounded-full border-2 text-primary bg-primary/10 border-primary">
                            {isExpired ? (
                                <span className="text-red-600 font-semibold">QR Expired</span>
                            ) : (
                                <>Expires in: <span className="font-bold">{secondsLeft}s</span></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default MobileloginQR