import { useEffect, useState } from "react";

import {
    createCategory,
    updateCategory,
    deleteCategory,
    subscribeCategories,
    getCategoriesOnce,
} from "../services/categoryService";

import {
    Category,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "../types/category.types";

export const useCategories = (type: "expense" | "income") => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /* ------------------------------- */
    /* REALTIME LISTENER */
    /* ------------------------------- */

    useEffect(() => {

        const unsubscribe = subscribeCategories((data) => {
            const filtered = data.filter((item) => item.type === type);
            setCategories(filtered);
            setLoading(false);
        });

        return () => unsubscribe();

    }, [type]);

    /* ------------------------------- */
    /* MANUAL REFRESH */
    /* ------------------------------- */

    const refreshCategories = async () => {

        try {
            setRefreshing(true);
            const data = await getCategoriesOnce();
            const filtered = data.filter((item) => item.type === type); // ✅ ADD
            setCategories(filtered);
        } catch (error) {
            console.log("Refresh Error:", error);
        } finally {
            setRefreshing(false);
        }
    };

    /* ------------------------------- */
    /* CREATE */
    /* ------------------------------- */

    const addCategory = async (payload: CreateCategoryPayload) => {
        return await createCategory(payload);
    };

    /* ------------------------------- */
    /* UPDATE */
    /* ------------------------------- */

    const editCategory = async (payload: UpdateCategoryPayload) => {
        return await updateCategory(payload);
    };

    /* ------------------------------- */
    /* DELETE */
    /* ------------------------------- */

    const removeCategory = async (categoryId: string) => {
        return await deleteCategory(categoryId);
    };

    return {
        categories,
        loading,
        refreshing,
        addCategory,
        editCategory,
        removeCategory,
        refreshCategories,
    };
};