import {
    collection,
    getDocs,
    writeBatch,
    doc,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

const DEFAULT_CATEGORIES = [
    {
        title: "Food & Dining",
        icon: "restaurant-outline",
        color: "#EF4444",
        type: "expense",
        isDefault: true,
    },
    {
        title: "Transport",
        icon: "car-outline",
        color: "#3B82F6",
        type: "expense",
        isDefault: true,
    },
    {
        title: "Shopping",
        icon: "bag-outline",
        color: "#8B5CF6",
        type: "expense",
        isDefault: true,
    },
    {
        title: "Bills & Utilities",
        icon: "document-text-outline",
        color: "#F59E0B",
        type: "expense",
        isDefault: true,
    },
    {
        title: "Entertainment",
        icon: "film-outline",
        color: "#22C55E",
        type: "expense",
        isDefault: true,
    },
    {
        title: "Health",
        icon: "heart-outline",
        color: "#EC4899",
        type: "expense",
        isDefault: true,
    },
    {
        title: "Other",
        icon: "apps-outline",
        color: "#9CA3AF",
        type: "expense",
        isDefault: true,
    },
    {
        title: "Salary",
        icon: "cash-outline",
        color: "#b5c319",
        type: "income",
        isDefault: true,
    },
    {
        title: "Freelance",
        icon: "laptop-outline",
        color: "#3B82F6",
        type: "income",
        isDefault: true,
    },
];

export const seedDefaultCategories = async () => {

    try {

        const currentUser = auth.currentUser;

        if (!currentUser) return;

        const categoriesRef = collection(
            db,
            "users",
            currentUser.uid,
            "categories"
        );

        const existingDocs = await getDocs(categoriesRef);

        if (!existingDocs.empty) {
            return;
        }

        const batch = writeBatch(db);

        DEFAULT_CATEGORIES.forEach((category) => {

            const newDocRef = doc(categoriesRef);

            batch.set(newDocRef, {
                ...category,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });

        await batch.commit();

        console.log("Default Categories Seeded");

    } catch (error) {
        console.log("Seed Categories Error:", error);
    }
};