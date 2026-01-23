import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";


function DarkmodeButton() {
    const [currentTheme, setCurrentTheme] = useState("")

    useEffect(() => {
        if (localStorage.getItem('theme') === "dark") {
            document.body.classList.add("dark");
            setCurrentTheme('dark')
        } else if (localStorage.getItem('theme') === "light") {
            document.body.classList.remove("dark");
            setCurrentTheme('light')
        } else {
            setCurrentTheme('system')
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.body.classList.add("dark")
            } else {
                document.body.classList.remove("dark")
            }
        }
    }, [])

    function handleDarkMode(value) {
        console.log(value);
        setCurrentTheme(value);

        localStorage.setItem("theme", value);

        if (value === "dark") {
            document.body.classList.add("dark");
        } else if (value === "light") {
            document.body.classList.remove("dark");
        } else {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.body.classList.add("dark");
            } else {
                document.body.classList.remove("dark");
            }
        }

        setTimeout(() => {
            window.dispatchEvent(new Event("theme-change"));
        }, 0);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    className="relative transition-all gap-0"
                >
                    {currentTheme === "dark" || (currentTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
                        ? <Sun className="h-5 w-5" />
                        : <Moon className="h-5 w-5" />
                    }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent  align="end" className="w-45">
                <DropdownMenuLabel>Platform Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={currentTheme} onValueChange={(value) => handleDarkMode(value)}>
                    <DropdownMenuRadioItem value="system">System Based</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">Dark Mode</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">Light Mode</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default DarkmodeButton











