/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import { NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const Signup = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
    const [firstName, setFirstName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [retrieveData, setRetrieveData] = useState<boolean>(false);

    const handleAlreadyExists = () => {
        setFirstName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigation.navigate('Login');
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const removeStoredFirstname = async (): Promise<void> => {
        try {
            const storedFirstname = await AsyncStorage.getItem('Firstname');
            if (storedFirstname !== null) {
                await AsyncStorage.removeItem('Firstname');
            }
        } catch (error) {
            console.error('Error removing Firstname from AsyncStorage:', error);
        }
    };
    const storeFirstname = (): Promise<void> => {
        return AsyncStorage.setItem('Firstname', firstName);
    };
    const removeStoredEmail = async (): Promise<void> => {
        try {
            const storedEmail = await AsyncStorage.getItem('email');
            if (storedEmail !== null) {
                await AsyncStorage.removeItem('email');
            }
        } catch (error) {
            console.error('Error removing email from AsyncStorage:', error);
        }
    };
    const storeEmail = (): Promise<void> => {
        return AsyncStorage.setItem('email', email);
    };
    function setTimeoutToErrorMsg(): void {
        setTimeout(() => {
            setErrorMsg('');
        }, 5000);
    }
    const handleSignIn = async (): Promise<void> => {
        setRetrieveData(true);
        removeStoredFirstname();
        removeStoredEmail();
        if (password === '' || email === '' || firstName === '' || confirmPassword === '') {
            setRetrieveData(false);
            setErrorMsg('Please fill in all fields');
            setTimeoutToErrorMsg();
            return;
        }
        if (password !== confirmPassword) {
            setRetrieveData(false);
            setErrorMsg('Passwords do not match');
            setTimeoutToErrorMsg();
            return;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setRetrieveData(false);
            setErrorMsg('Invalid email');
            setTimeoutToErrorMsg();
            return;
        }
        if (password.length < 8) {
            setRetrieveData(false);
            setErrorMsg('Password must be at least 8 characters');
            setTimeoutToErrorMsg();
            return;
        }
        if (firstName.length < 2) {
            setRetrieveData(false);
            setErrorMsg('Username must be at least 2 characters');
            setTimeoutToErrorMsg();
            return;
        }
        const userEmail: object = {
            email: email,
        };
        try {
            const response = await axios.get('http://10.0.2.2:8000/checkEmail', userEmail);
            if (response.data.message === 'User already exists') {
                setRetrieveData(false);
                setErrorMsg('Email already exists');
                setTimeoutToErrorMsg();
                return;
            }
            console.log(response.data.message);
        } catch (error) {
            setRetrieveData(false);
            console.error(error);
            setErrorMsg('Error signing up');
            setTimeoutToErrorMsg();
            return;
        }

        const user = {
            firstname: firstName,
            email: email,
            pwd: password,
        };
        try {
            const response = await axios.post('http://10.0.2.2:8000/addUser', user);
            if (response.status === 200) {
                setRetrieveData(false);
            }
        } catch (error) {
            setRetrieveData(false);
            console.error(error);
            setErrorMsg('Error signing up');
            setTimeoutToErrorMsg();
            return;
        }
        storeFirstname();
        storeEmail();
        try {
            await AsyncStorage.setItem('isSignedIn', JSON.stringify(true));
            navigation.navigate('Home');
          } catch (error) {
            console.error('Error storing sign-in status in AsyncStorage:', error);
          }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {retrieveData ? (
                    <View style={styles.activityIndicatorContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                <View style={styles.loginFieldsContainer}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Create Account</Text>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder="Username"
                        placeholderTextColor="#003f5c"
                        onChangeText={(username) => setFirstName(username)}
                        value={firstName}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="Email"
                        placeholderTextColor="#003f5c"
                        onChangeText={(userEmail) => setEmail(userEmail)}
                        value={email}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder="Password"
                        placeholderTextColor="#003f5c"
                        secureTextEntry={!showPassword}
                        onChangeText={(userPassword) => setPassword(userPassword)}
                        value={password}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <Icon
                            name={showPassword ? 'eye-slash' : 'eye'}
                            size={20}
                            color="#003f5c"
                            style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder="Confirm Password"
                        placeholderTextColor="#003f5c"
                        secureTextEntry={!showConfirmPassword}
                        onChangeText={(userConfirmPassword) => setConfirmPassword(userConfirmPassword)}
                        value={confirmPassword}
                        />
                        <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                            <Icon
                            name={showConfirmPassword ? 'eye-slash' : 'eye'}
                            size={20}
                            color="#003f5c"
                            style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={{color: 'red'}}>{errorMsg}</Text>
                    <TouchableOpacity style={styles.loginBtn} onPress={handleSignIn}>
                        <Text style={styles.loginText}>SIGNUP</Text>
                    </TouchableOpacity>
                    <View style={{paddingTop: 7}}>
                        <TouchableOpacity onPress={handleAlreadyExists}><Text>Already have an account? Login</Text></TouchableOpacity>
                    </View>
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
    activityIndicatorContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginFieldsContainer: {
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
    eyeIcon: {
        marginLeft: 10,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },
    forgot_button: {
        height: 30,
        marginBottom: 10,
    },
    loginBtn: {
        width: '50%',
        borderRadius: 25,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        backgroundColor: '#FF1494',
    },
    loginText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Signup;
