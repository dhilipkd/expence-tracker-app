import {

    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    onSnapshot,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";
import {
    Category,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "../types/category.types";

/* ------------------------------- */
/* COLLECTION */
/* ------------------------------- */

const getCategoryCollection = () => {

    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error("User not authenticated");
    }

    return collection(
        db,
        "users",
        currentUser.uid,
        "categories"
    );
};

/* ------------------------------- */
/* REALTIME SUBSCRIBE */
/* ------------------------------- */

export const subscribeCategories = (callback: (data: Category[]) => void) => {

    const currentUser = auth.currentUser;

    if (!currentUser) return () => { };

    const categoriesRef = getCategoryCollection();

    const q = query(categoriesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {

        const data: Category[] = snapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...(docItem.data() as Omit<Category, "id">),
        }));

        callback(data);
    });

    return unsubscribe;
};

/* ------------------------------- */
/* CREATE */
/* ------------------------------- */

export const createCategory = async (
    payload: CreateCategoryPayload
): Promise<boolean> => {

    try {

        const categoriesRef = getCategoryCollection();

        await addDoc(categoriesRef, {
            title: payload.title.trim(),
            icon: payload.icon,
            color: payload.color,
            type: payload.type,
            isDefault: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return true;

    } catch (error) {
        console.log("Create Category Error:", error);
        return false;
    }
};

/* ------------------------------- */
/* UPDATE */
/* ------------------------------- */

export const updateCategory = async (
    payload: UpdateCategoryPayload
): Promise<boolean> => {

    try {

        const currentUser = auth.currentUser;

        if (!currentUser) return false;

        const docRef = doc(
            db,
            "users",
            currentUser.uid,
            "categories",
            payload.id
        );

        await updateDoc(docRef, {
            title: payload.title.trim(),
            icon: payload.icon,
            color: payload.color,
            updatedAt: serverTimestamp(),
        });

        return true;

    } catch (error) {
        console.log("Update Category Error:", error);
        return false;
    }
};

/* ------------------------------- */
/* GET */
/* ------------------------------- */
export const getCategoriesOnce = async (): Promise<Category[]> => {

    try {
        const categoriesRef = getCategoryCollection();

        const q = query(categoriesRef, orderBy("createdAt", "asc"));

        const snapshot = await getDocs(q);

        return snapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...(docItem.data() as Omit<Category, "id">),
        }));

    } catch (error) {
        console.log("Manual Refresh Error:", error);
        return [];
    }
};

/* ------------------------------- */
/* DELETE */
/* ------------------------------- */

export const deleteCategory = async (
    categoryId: string
): Promise<boolean> => {

    try {

        const currentUser = auth.currentUser;

        if (!currentUser) return false;

        const docRef = doc(
            db,
            "users",
            currentUser.uid,
            "categories",
            categoryId
        );

        await deleteDoc(docRef);

        return true;

    } catch (error) {
        console.log("Delete Category Error:", error);
        return false;
    }
};