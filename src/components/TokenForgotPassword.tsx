/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { NavigationProp, ParamListBase} from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const TokenForgotPassword = ({route, navigation}: { navigation: NavigationProp<ParamListBase>, route: any }): JSX.Element => {
    const [token, setToken] = useState<number>();
    const [verifyingToken, setVerifyingToken] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const userEmailAddress: string = route.params?.email;

    useEffect(() => {
        if (userEmailAddress) {
            setEmail(userEmailAddress);
        }
    }, []);

    function setTimeoutToErrorMsg(): void {
        setTimeout(() => {
            setErrorMsg('');
        }, 5000);
    }

    const handleToken = async (): Promise<void> => {
        if (token === undefined) {
            setErrorMsg('Please enter a token');
            setTimeoutToErrorMsg();
            return;
        }
        if (token.toString().length !== 6) {
            setErrorMsg('Token must be 6 digits');
            setTimeoutToErrorMsg();
            return;
        }
        setVerifyingToken(true);
        const data: object = {
            email: email,
            token: token,
        };
        try {
            const response = await axios.post('http://10.0.2.2:8000/verifyToken', data);
            console.log(response.data.message);
            if (response.data.message === 'Authentication successful') {
                setToken(undefined);
                setVerifyingToken(false);
                navigation.navigate('ForgotPassword', {email: email});
            } else if (response.data.message === 'Invalid token') {
                setVerifyingToken(false);
                setErrorMsg('Invalid token');
                setTimeoutToErrorMsg();
            }
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    };

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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <View style={{flexDirection: 'row', paddingTop: 40, paddingLeft: 10}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={25} color="#636666" />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                {verifyingToken ? (
                        <View style={styles.activityIndicatorContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ) : (
                    <View style={styles.authenticatedFieldsContainer}>
                        <Text style={styles.text}>Enter the code sent to {email}</Text>
                        <View style={styles.inputView}>
                                <TextInput
                                style={styles.TextInput}
                                textContentType="oneTimeCode"
                                keyboardType="numeric"
                                autoCapitalize="none"
                                placeholder="Enter token"
                                placeholderTextColor="#003f5c"
                                onChangeText={(userAuthCode) => setToken(Number(userAuthCode))}
                                value={token?.toString()}
                                />
                        </View>
                        <TouchableOpacity style={styles.resend_button} onPress={resendToken}>
                            <Text style={styles.resend_text}>Resend code</Text>
                        </TouchableOpacity>
                        <Text style={{color: 'red'}}>{errorMsg}</Text>
                        <TouchableOpacity style={styles.submitButton} onPress={handleToken}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                </View>
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
    resend_button: {
        height: 20,
        marginBottom: 4,
        marginTop: 4,
        color: 'blue',
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    resend_text: {
        color: 'blue',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#252626',
    },
});

export default TokenForgotPassword;
