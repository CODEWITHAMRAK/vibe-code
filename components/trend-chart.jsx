"use client";

import { Card } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function TrendChart({ expenses }) {
    // Get last 30 days of data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split("T")[0];
    });

    const trendData = last30Days.map((date) => {
        const dayExpenses = expenses
            .filter((e) => e.date === date)
            .reduce((sum, e) => sum + e.amount, 0);
        return {
            date: new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            amount: dayExpenses,
        };
    });

    return (
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                30-Day Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        formatter={(value) => `₹${value.toFixed(2)}`}
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "none",
                            borderRadius: "8px",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}
