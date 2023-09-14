/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback} from 'react-native';
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

    const handleAlreadyExists = () => {
        navigation.navigate('Login');
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const storeFirstname = (): Promise<void> => {
        return AsyncStorage.setItem('Firstname', firstName);
    };
    const handleSignIn = async (): Promise<void> => {
        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setErrorMsg('Invalid email');
            return;
        }
        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters');
            return;
        }
        if (firstName.length < 2) {
            setErrorMsg('Username must be at least 2 characters');
            return;
        }
        try {
            const response = await axios.get(`http://127.0.0.1:8000/user?email=${email}`);
            if (response.data.length > 0) {
                setErrorMsg('Email already exists');
                return;
            }
        } catch (error) {
            console.error(error);
        }

        const user = {
            firstName,
            email,
            password,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/user', user);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
        storeFirstname();
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
                <View style={styles.inputView}>
                    <TextInput
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
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
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
    inputView: {
        flexDirection: 'row',
        backgroundColor: '#FFC0CB',
        borderRadius: 30,
        width: '70%',
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
    },
});

export default Signup;
