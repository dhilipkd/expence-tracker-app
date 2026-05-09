import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
} from "firebase/firestore";

import { db, auth } from "../config/firebase";
import { Transaction } from "../types/transaction.types";

export const useTransactions = (type?: "expense" | "income") => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;
        let q;
        if (type) {
            q = query(
                collection(
                    db,
                    "users",
                    user.uid,
                    "transactions"
                ),
                where(
                    "type",
                    "==",
                    type
                ),
                orderBy(
                    "date",
                    "desc"
                )
            );
        } else {
            q = query(
                collection(
                    db,
                    "users",
                    user.uid,
                    "transactions"
                ),
                orderBy(
                    "date",
                    "desc"
                )
            );
        }

        const unsubscribe =
            onSnapshot(q, (snapshot) => {
                const list: Transaction[] = [];
                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        ...doc.data(),
                    } as Transaction);
                });

                setTransactions(list);
                setLoading(false);
            });
        return () => unsubscribe();
    }, [type]);

    return {
        transactions,
        loading,
    };
};