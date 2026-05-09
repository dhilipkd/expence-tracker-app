import { StyleSheet } from "react-native";

const SettingsStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    container: {
        paddingHorizontal: 20,
        paddingTop: 15,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
    },

    sectionTitle: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 12,
        marginTop: 20,
    },

    menuCard: {
        borderRadius: 24,
        overflow: "hidden",
        borderWidth: 1,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 5,
        borderBottomWidth: 1,
    },

    rowTitle: {
        fontSize: 16,
        fontWeight: "500",
    },

    rightSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    menuRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 20,
    },

    menuLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },

    menuRight: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default SettingsStyles;