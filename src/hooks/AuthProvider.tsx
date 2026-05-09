import React, {
    createContext,
    useEffect,
    useState,
    ReactNode,
    useContext,
} from "react";

import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { seedDefaultCategories } from "../services/seedCategories";

import TLoader from "../components/common/TLoader";

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

type Props = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            async (currentUser) => {

                try {

                    setLoading(true);

                    if (currentUser) {
                        setUser(currentUser);

                        // Default categories seed
                        await seedDefaultCategories();
                    } else {
                        setUser(null);
                    }

                } catch (error) {
                    console.log("Auth Provider Error:", error);
                } finally {
                    setLoading(false);
                }
            }
        );

        return () => unsubscribe();

    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>

            {children}

            {/* GLOBAL LOADER */}
            <TLoader
                visible={loading}
                color="#22C55E"
            />

        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};