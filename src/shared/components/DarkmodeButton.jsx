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
        console.log(value)
        setCurrentTheme(value)

        if (value === "dark") {
            document.body.classList.add("dark")
        } else if (value === "light") {
            document.body.classList.remove("dark")
        } else {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.body.classList.add("dark")
            } else {
                document.body.classList.remove("dark")
            }
        }
        localStorage.setItem("theme", value);
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={`relative p-2 rounded-lg transition-all dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700`}>
                    {currentTheme === "dark" || (currentTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
                        ? <Sun className="h-5 w-5" />
                        : <Moon className="h-5 w-5" />
                    }
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-45 space-y-1 absolute -right-5 top-1">
                <DropdownMenuRadioGroup value={currentTheme} onValueChange={(value) => handleDarkMode(value)}>
                    <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default DarkmodeButton



