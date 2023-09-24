/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { errorPage } from '../styling/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
    message: string;
    isConnected: boolean;
};

const ShowError = ({ message, isConnected }: Props): JSX.Element => {
    const { container } = errorPage;

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {!isConnected ?
            <View style={container}>
                <Icon name="signal" size={32} color="rgba(0, 0, 0, 0.6)" style={{ alignItems: 'center', marginBottom: 7 }} />
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    {message}
                </Text>
            </View>
        :
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Something went wrong, please try again</Text>
        </View>
        }
    </SafeAreaView>
  );
};

export default ShowError;
