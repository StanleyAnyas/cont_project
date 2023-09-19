/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import { NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const Login = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [retrieveData, setRetrieveData] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const storeEmail = (): Promise<void> => {
        return AsyncStorage.setItem('email', email);
    };
    const handleAlreadyExists = () => {
        setEmail('');
        setPassword('');
        navigation.navigate('Signup');
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
    const storeUsername = (username: string): Promise<void> => {
        return AsyncStorage.setItem('Firstname', username);
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
    const handleForgotPassword = () => {
        setEmail('');
        setPassword('');
        navigation.navigate('ForgotPassword');
    };
    const handleSignIn = async (): Promise<void> => {
        setRetrieveData(true);
        setErrorMsg('');
        removeStoredEmail();
        removeStoredFirstname();
        if (password === '' || email === '') {
            setRetrieveData(false);
            setErrorMsg('Please fill in all fields');
            setTimeout(() => {
                setErrorMsg('');
            }
            , 5000);
            return;
        }
        const credentials: object = {
            email: email,
            pwd: password,
        };
        try {
            const response = await axios.post('http://10.0.2.2:8000/loginUser', credentials);
            const responseMessage = response.data.message;
            console.log(responseMessage);
            if (responseMessage === 'Login successful') {
                const user = response.data.user;
                await storeUsername(user.firstname);
            } else if (responseMessage === 'User does not exist') {
                setRetrieveData(false);
                setErrorMsg('Invalid credentials');
                setTimeout(() => {
                    setErrorMsg('');
                }, 5000);
                return;
            }
        } catch (error) {
            setRetrieveData(false);
            console.error('Error signing in:', error);
            setErrorMsg('Error signing in');
            setTimeout(() => {
                setErrorMsg('');
            }, 5000);
            return;
        }
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
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Login</Text>
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
                        name={showPassword ? 'unlock-alt' : 'lock'}
                        size={20}
                        color="#003f5c"
                        style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={{color: 'red'}}>{errorMsg}</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={handleSignIn}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.forgot_button} onPress={handleForgotPassword}>
                    <Text style={{color: 'blue'}}>Forgot Password?</Text>
                </TouchableOpacity>
                <View style={{paddingTop: 2}}>
                    <TouchableOpacity onPress={handleAlreadyExists}><Text>Don't have an account Signup</Text></TouchableOpacity>
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
    forgot_button: {
        height: 20,
        marginBottom: 4,
        marginTop: 4,
        color: 'blue',
    },
    loginBtn: {
        width: '50%',
        borderRadius: 25,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF1494',
    },
    loginText: {
        color: 'white',
        fontWeight: 'bold',
    },
    eyeIcon: {
        marginLeft: 10,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    activityIndicatorContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
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
});

export default Login;
