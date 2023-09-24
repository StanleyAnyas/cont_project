/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

const LandingPage = ({ navigation }: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleSignup = () => {
        navigation.navigate('Signup');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
                        <Text style={styles.signupText}>Go to Signup</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                        <Text style={styles.loginText}>Go to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c7a1be',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
        flex: 2,
        justifyContent: 'flex-end',
        width: '100%',
    },
    loginButton: {
        backgroundColor: '#fcfafc',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 15,
        color: '#0d0c0d',
    },
    signupButton: {
        backgroundColor: '#868087',
        color: '#fff',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 15,
    },
    signupText: {
        color: '#fcfafc',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        color: '#434747',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LandingPage;
