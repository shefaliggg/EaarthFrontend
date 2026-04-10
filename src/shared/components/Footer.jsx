import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border h-12 px-6 md:px-8 bg-background flex items-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">EAARTH</span>
                    <span>© {new Date().getFullYear()}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span>Made with</span>
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <span>by the Support Team</span>
                </div>
            </div>
        </footer>
    );
}