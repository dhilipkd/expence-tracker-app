import React from 'react';
import {
    View,
    Text,
    Image,
    useColorScheme,
    useWindowDimensions,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import onboardingStyles from '../styles/OnboardingScreenStyles';
import TPrimaryButton from '../components/common/TPrimaryButton';
import { RootStackParamList } from '../types/navigation.types';
import { useTheme } from "../hooks/ThemeContext";


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();

    return (
        <View style={[onboardingStyles.container, { backgroundColor: theme.background }]}>
            <Image source={require('../../assets/onboarding.png')}
                style={[onboardingStyles.image, { width: width * 0.8, height: height * 0.8, maxWidth: 380, maxHeight: 380 },]}
            />
            <Text style={[onboardingStyles.title, { color: theme.text, fontSize: width * 0.07 }]}>Track Your Expenses</Text>
            <Text style={[onboardingStyles.title, { color: theme.text, fontSize: width * 0.07 }]}>Manage your Life</Text>
            <Text style={[onboardingStyles.subtitle, { color: theme.subText, fontSize: width * 0.05 }]}>Keep track of your income and expenses and achieve your financial goals.</Text>
            <TPrimaryButton
                title="Get Started"
                onPress={() => navigation.navigate('Login')}
                theme={theme}
                style={{ width: width * 0.8, }}
            />
        </View>
    )
}
