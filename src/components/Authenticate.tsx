/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { AuthContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Authenticate = ({route}: {route: any}): JSX.Element => {
    const [authCode, setAuthCode] = useState<Number>();
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const userEmailAddress: string = route.params;

    useEffect(() => {
        if (userEmailAddress) {
            setEmail(userEmailAddress);
        } else {
            // If userEmailAddress is not available, try to get it from AsyncStorage
            getStoredEmail();
        }
    }, []);

    const { signUp } = React.useContext(AuthContext);

    const getStoredEmail = async (): Promise<string> => {
        try {
            const storedEmail = await AsyncStorage.getItem('email');
            if (storedEmail !== null) {
                setEmail(storedEmail);
                // return storedEmail;
            }
        } catch (error) {
            console.error('Error reading email from AsyncStorage:', error);
        }
        return '';
    };

    function setTimeoutToErrorMsg(): void {
        setTimeout(() => {
            setErrorMsg('');
        }, 5000);
    }

    const resendToken = async (): Promise<void> => {
        // getStoredEmail();
        const data: object = {
            email: email,
        };
        try {
            const response = await axios.post('http://10.0.2.2:8000/resendToken', data);
            console.log(response.data.message);
            if (response.data.message === 'Authentication successful') {
                setErrorMsg('Token resent');
                setTimeoutToErrorMsg();
            } else if (response.data.message === 'Invalid token') {
                setErrorMsg('Invalid token');
                setTimeoutToErrorMsg();
            }
        } catch (error) {
            console.error('Error resending token:', error);
        }
    };

    const handleAuth = async (): Promise<void> => {
        if (authCode === undefined || authCode === null || authCode === 0) {
            setErrorMsg('Please fill in all fields');
            return;
        }
        if (!authCode || authCode.toString().length !== 6) {
            setErrorMsg('Code must be 6 digits');
            return;
        }
        // getStoredEmail();
        // console.log('email:', email);
        const data: object = {
            email: email,
            authCode: authCode,
        };
        try {
            console.log(authCode);
            setAuthenticating(false);
            const response = await axios.post('http://10.0.2.2:8000/authUser', data);
            console.log(response.data.message);
            if (response.data.message === 'Authentication successful') {
                signUp();
            } else if (response.data.message === 'Invalid token') {
                setErrorMsg('Invalid token');
                setTimeoutToErrorMsg();
            }
            setAuthenticating(false);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
        {authenticating ? (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
            <View style={styles.authenticatedFieldsContainer}>
                <Text>Enter the code sent to your email</Text>
                <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        textContentType="oneTimeCode"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        placeholder="Enter token"
                        placeholderTextColor="#003f5c"
                        onChangeText={(userAuthCode) => setAuthCode(Number(userAuthCode))}
                        value={authCode?.toString()}
                        />
                </View>
                <Button onPress={resendToken}>
                    <Text>Resend code</Text>
                </Button>
                <Text style={{color: 'red'}}>{errorMsg}</Text>
                <TouchableOpacity style={styles.submitButton} onPress={handleAuth}>
                    <Text>Submit</Text>
                </TouchableOpacity>
            </View>
            )}
        </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      },
    authenticatedFieldsContainer: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        alignItems: 'center',
      },
    inputView: {
        flexDirection: 'row',
        backgroundColor: '#FFC0CB',
        borderRadius: 30,
        width: '85%',
        height: 45,
        marginTop: 20,
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },
    activityIndicatorContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
    submitButton: {
        width: '50%',
        borderRadius: 25,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF1494',
    },
    });

export default Authenticate;

