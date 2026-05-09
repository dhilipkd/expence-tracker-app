import { StyleSheet } from "react-native";

const onboardingStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        resizeMode: 'contain',
    },
    title: {
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        lineHeight: 22,
        marginVertical: 10,
    },
});

export default onboardingStyles;