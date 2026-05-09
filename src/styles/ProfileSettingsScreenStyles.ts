import { StyleSheet } from "react-native";

const ProfileSettingsStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    profileCard: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        marginBottom: 24,
    },

    profileRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    profileImage: {
        width: 76,
        height: 76,
        borderRadius: 38,
        marginRight: 16,
    },

    userName: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
    },

    userEmail: {
        fontSize: 14,
    },

    menuCard: {
        borderRadius: 24,
        overflow: "hidden",
        borderWidth: 1,
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

    logoutButton: {
        marginTop: 30,
        borderRadius: 18,
        paddingVertical: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },

    logoutText: {
        color: "#ef4444",
        fontWeight: "700",
        fontSize: 18,
    },
});

export default ProfileSettingsStyles;