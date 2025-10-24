"use client";
import { useState, useEffect } from "react";

export default function useLocalStorageCRUD(key, initialValue = []) {
    const [data, setData] = useState(() => {
        if (typeof window === "undefined") return initialValue;
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        } catch (error) {
            console.error("Error reading localStorage", error);
            return initialValue;
        }
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }, [key, data]);

    const addItem = (item) => {
        const newItem = { id: Date.now(), ...item };
        setData((prev) => [...prev, newItem]);
    };

    const updateItem = (id, updatedFields) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, ...updatedFields } : item
            )
        );
    };

    const deleteItem = (id) => {
        setData((prev) => prev.filter((item) => item.id !== id));
    };

    const clearAll = () => {
        setData([]);
    };

    return { data, addItem, updateItem, deleteItem, clearAll };
}
