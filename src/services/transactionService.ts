import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../config/firebase";
import { Transaction } from "../types/transaction.types";

export const createTransaction = async (
    payload: Transaction
): Promise<boolean> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        await addDoc(
            collection(db, "users", user.uid, "transactions"),
            {
                ...payload,
                userId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        return true;
    } catch (error) {
        console.log("Create Transaction Error:", error);
        return false;
    }
};

export const updateTransaction = async (
    id: string,
    payload: Partial<Transaction>
): Promise<boolean> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User not logged in");
        }
        const ref = doc(
            db,
            "users",
            user.uid,
            "transactions",
            id
        );
        await updateDoc(ref, {
            ...payload,
            updatedAt: serverTimestamp(),
        });
        return true;
    } catch (error) {
        console.log(
            "Update Transaction Error:",
            error
        );
        return false;
    }
};

/* DELETE */
export const deleteTransaction = async (
    id: string
): Promise<boolean> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User not logged in");
        }
        const ref = doc(
            db,
            "users",
            user.uid,
            "transactions",
            id
        );
        await deleteDoc(ref);
        return true;
    } catch (error) {
        console.log(
            "Delete Transaction Error:",
            error
        );
        return false;
    }
};