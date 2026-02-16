import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border py-6 pr-6 md:pr-8 pl-6 md:pl-8 px-8 bg-background">
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