import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";

import { lightTheme } from "../themes/lightTheme";
import { darkTheme } from "../themes/darkTheme";

const THEME_KEY = "APP_THEME";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
    theme: any;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    mode: "system",
    setMode: () => { },
});

export const ThemeProvider = ({ children }: any) => {

    const [mode, setModeState] = useState<ThemeMode>("system");

    const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
        Appearance.getColorScheme()
    );

    const getTheme = (
        selectedMode: ThemeMode,
        currentSystemTheme: ColorSchemeName
    ) => {

        if (selectedMode === "light") {
            return lightTheme;
        }

        if (selectedMode === "dark") {
            return darkTheme;
        }

        return currentSystemTheme === "dark"
            ? darkTheme
            : lightTheme;
    };

    const [theme, setTheme] = useState(
        getTheme("system", systemTheme)
    );

    // load saved theme
    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem(THEME_KEY);

            const selectedMode = (savedTheme as ThemeMode) || "system";

            setModeState(selectedMode);
            setTheme(getTheme(selectedMode, systemTheme));
        };

        loadTheme();
    }, []);

    // listen system theme change
    useEffect(() => {
        const listener = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemTheme(colorScheme);
        });

        return () => listener.remove();
    }, []);

    // update theme whenever mode/system changes
    useEffect(() => {
        setTheme(getTheme(mode, systemTheme));
    }, [mode, systemTheme]);

    const setMode = async (newMode: ThemeMode) => {
        setModeState(newMode);
        await AsyncStorage.setItem(THEME_KEY, newMode);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                mode,
                setMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);