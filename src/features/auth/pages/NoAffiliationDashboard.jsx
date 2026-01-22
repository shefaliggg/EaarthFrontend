import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Building2, Mail, ArrowRight } from "lucide-react";
import { getFullName } from "../../../shared/config/utils";
import { useSelector } from "react-redux";

export default function NoAffiliationDashboard() {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className="max-w-2xl mx-auto text-center">
            <img
                src="eaarth.webp"
                alt="Eaarth Logo"
                className="mx-auto w-34 h-24 object-contain drop-shadow-xl mt-6"
            />

            <h1 className="text-3xl font-semibold tracking-wide mb-4">
                Welcome to Eaarth <span className="text-primary">{getFullName(currentUser)}</span>
            </h1>

            <p className="text-muted-foreground leading-relaxed mb-12">
                It looks like your account is not yet affiliated with any
                organization. Once you’re connected, your production dashboard
                will appear here.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-card border rounded-xl p-8 flex flex-col items-center justify-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    <span className="text-sm text-muted-foreground">No Previous Affiliated Organisations</span>
                </div>
                <div className="bg-card border rounded-xl p-8 flex flex-col items-center justify-center gap-2">
                    <Mail className="w-6 h-6 text-primary" />
                    <span className="text-sm text-muted-foreground">No New Invites</span>
                </div>
            </div>

            <div className="pt-6 grid grid-cols-2 items-center justify-center w-full gap-3">
                <Button>
                    Contact Admin <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                >
                    Learn How It Works
                </Button>
            </div>

            <p className="text-center text-xs text-slate-500 mt-6">
                © {new Date().getFullYear()} Eaarth. All rights reserved.
            </p>
        </div >
    );
}