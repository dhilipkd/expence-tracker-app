import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

type Props = {
    text: string;
    actionText: string;
    actionColor: string;
    onPress: () => void;
};

export default function TAuthFooter({
    text,
    actionText,
    actionColor,
    onPress,
}: Props) {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 15,
            }}
        >
            <Text>{text}</Text>

            <TouchableOpacity onPress={onPress}>
                <Text
                    style={{
                        marginLeft: 5,
                        color: actionColor,
                        fontWeight: '600',
                    }}
                >
                    {actionText}
                </Text>
            </TouchableOpacity>
        </View>
    );
}