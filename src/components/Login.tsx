/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const Signup = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const storeEmail = (): Promise<void> => {
        return AsyncStorage.setItem('email', email);
    };
    const handleAlreadyExists = () => {
        navigation.navigate('Signup');
    };
    const storeUsername = (username: string): Promise<void> => {
        return AsyncStorage.setItem('username', username);
    };

    const handleSignIn = async (): Promise<void> => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/user?email=${email}`);
            if (response.data.length === 0) {
                setErrorMsg('Email does not exist');
                return;
            }
            if (response.data[0].password !== password) {
                setErrorMsg('Incorrect password');
                return;
            }
            await storeUsername(response.data[0].username);
        } catch (error) {
            console.error(error);
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
                <Text style={{color: 'red'}}>{errorMsg}</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={handleSignIn}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>
                <View style={{paddingTop: 7}}>
                    <TouchableOpacity onPress={handleAlreadyExists}><Text>Don't have an account Signup</Text></TouchableOpacity>
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
        backgroundColor: '#FF1494',
    },
    loginText: {
        color: 'white',
    },
    eyeIcon: {
        marginLeft: 10,
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default Signup;
