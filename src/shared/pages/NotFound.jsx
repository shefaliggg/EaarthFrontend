import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center"
      >
        <div className="p-10 space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-500/10">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
          </div>

          <h1 className="text-7xl font-extrabold tracking-tight">
            404
          </h1>

          <p className="text-xl">
            Page not found
          </p>

          <p className="text-sm text-muted-foreground break-all">
            {location.pathname}
          </p>

          <div className="pt-6 grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Lost in the system • Eaarth
        </p>
      </motion.div>
    </div>
  );
}