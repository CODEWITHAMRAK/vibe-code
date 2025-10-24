"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    if (!mounted) return null;

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full border-slate-200 dark:border-slate-700 bg-transparent"
        >
            {isDark ? (
                <Sun className="w-4 h-4" />
            ) : (
                <Moon className="w-4 h-4" />
            )}
        </Button>
    );
}
