/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, SafeAreaView, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import { NavigationProp, ParamListBase} from '@react-navigation/native';

const Login = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
    return (
        <SafeAreaView>
        <StatusBar />
            <ScrollView>
                <View>
                    <Text>Login</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text>Go to Signup</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;
