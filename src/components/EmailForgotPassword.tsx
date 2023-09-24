/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { NavigationProp, ParamListBase} from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const EmailForgotPassword = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
    const [Email, setEmail] = useState<string>('');
    const [SendingToken, setSendingToken] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    function setTimeoutToErrorMsg(): void {
        setTimeout(() => {
            setErrorMsg('');
        }, 5000);
    }

    const handleEmail = async (): Promise<void> => {
        if (Email === '') {
            setErrorMsg('Please enter an email address');
            setTimeoutToErrorMsg();
            return;
        }
        setSendingToken(true);
        const data: object = {
            email: Email,
        };
        try {
            const response = await axios.post('http://10.0.2.2:8000/checkEmail', data);
            console.log(response.data.message);
            if (response.data.message === 'User already exists') {
                try {
                    const response2 = await axios.post('http://10.0.2.2:8000/sendToken', data);
                    console.log(response2.data.message);
                    if (response2.data.message === 'Token sent') {
                        setSendingToken(false);
                        navigation.navigate('TokenForgotPassword', {email: Email});
                    }
                } catch (error) {
                    console.error('Error sending token:', error);
                }
            } else if (response.data.message === 'User does not exist') {
                setSendingToken(false);
                setErrorMsg('Email does not exist');
                setTimeoutToErrorMsg();
            }
        } catch (error) {
            console.error('Error checking email:', error);
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
                {SendingToken ? (
                        <View style={styles.activityIndicatorContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ) : (
                    <View style={styles.authenticatedFieldsContainer}>
                        <Text>Enter the email address associated with your account</Text>
                        <View style={styles.inputView}>
                                <TextInput
                                style={styles.TextInput}
                                textContentType="emailAddress"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="Enter your email address"
                                placeholderTextColor="#003f5c"
                                onChangeText={(userEmail) => setEmail(userEmail)}
                                value={Email}
                                />
                        </View>
                        <Text style={{color: 'red'}}>{errorMsg}</Text>
                        <TouchableOpacity style={styles.submitButton} onPress={handleEmail}>
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
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EmailForgotPassword;
