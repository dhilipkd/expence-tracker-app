import { StyleSheet } from "react-native";

const CustomCategoriesStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
    },

    buttonView: {
        alignItems: "center",
        justifyContent: "center",
    },
});

export default CustomCategoriesStyles;