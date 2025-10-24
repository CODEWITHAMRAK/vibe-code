"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

const CATEGORIES = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Health",
    "Education",
    "Other",
];

export default function ExpenseForm({ onAddExpense }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [description, setDescription] = useState("");
    const [suggestingCategory, setSuggestingCategory] = useState(false);

    const suggestCategory = async () => {
        if (!name.trim()) return;

        setSuggestingCategory(true);
        try {
            const response = await fetch("/api/categorize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });

            const data = await response.json();
            if (data.category) {
                setCategory(data.category);
            }
        } catch (error) {
            console.error("Error suggesting category:", error);
        } finally {
            setSuggestingCategory(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !amount) return;

        onAddExpense({
            name,
            amount: parseFloat(amount),
            category,
            date,
            description,
        });

        // Reset form
        setName("");
        setAmount("");
        setCategory("Food");
        setDate(new Date().toISOString().split("T")[0]);
        setDescription("");
    };

    return (
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Add Expense
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Item Name
                    </label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Coffee, Uber ride"
                        className="w-full transition-colors duration-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Amount
                    </label>
                    <Input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full transition-colors duration-200"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Category
                        </label>
                        <button
                            type="button"
                            onClick={suggestCategory}
                            disabled={!name.trim() || suggestingCategory}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors duration-200"
                        >
                            <Sparkles className="w-3 h-3" />
                            {suggestingCategory
                                ? "Suggesting..."
                                : "AI Suggest"}
                        </button>
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Date
                    </label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description (Optional)
                    </label>
                    <Input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add notes..."
                        className="w-full"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 hover:shadow-lg"
                >
                    Add Expense
                </Button>
            </form>
        </Card>
    );
}
