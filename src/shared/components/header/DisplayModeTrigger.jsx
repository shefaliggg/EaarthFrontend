import { cn } from "@/shared/config/utils";
import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { LayoutGrid, Columns, Grid, Type, LayoutPanelLeft } from "lucide-react";

function DisplayModeTrigger({ displayMode, setDisplayMode }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutPanelLeft className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Display Mode</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => setDisplayMode('text-icon')}
                    className={cn(displayMode === 'text-icon' && 'bg-accent text-white')}
                >
                    <Columns className={cn(
                        "w-4 h-4 mr-1",
                        displayMode === "text-icon" && "text-white"
                    )}
                    />
                    Text + Icon
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setDisplayMode('icon-only')}
                    className={cn(displayMode === 'icon-only' && 'bg-accent text-white')}
                >
                    <Grid className={cn(
                        "w-4 h-4 mr-1",
                        displayMode === "text-icon" && "text-white"
                    )}
                    />
                    Icon Only
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setDisplayMode('text-only')}
                    className={cn(displayMode === 'text-only' && 'bg-accent text-white')}
                >
                    <Type className={cn(
                        "w-4 h-4 mr-1",
                        displayMode === "text-icon" && "text-white"
                    )}
                    />
                    Text Only
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export default DisplayModeTrigger