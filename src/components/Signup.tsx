/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    const handleAlreadyExists = () => {
        navigation.navigate('Login');
    };

    const handleSignIn = async (): Promise<void> => {
        setIsSignedIn(true);
        try {
            await AsyncStorage.setItem('isSignedIn', JSON.stringify(true));
          } catch (error) {
            console.error('Error storing sign-in status in AsyncStorage:', error);
          }
    };
    useEffect(() => {
        checkSignInStatus();
      }, []);

      const checkSignInStatus = async () => {
        try {
          const storedSignInStatus = await AsyncStorage.getItem('isSignedIn');
          if (storedSignInStatus !== null) {
            setIsSignedIn(JSON.parse(storedSignInStatus));
          }
        } catch (error) {
          console.error('Error reading sign-in status from AsyncStorage:', error);
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
                    secureTextEntry={true}
                    onChangeText={(userPassword) => setPassword(userPassword)}
                    value={password}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                    style={styles.TextInput}
                    placeholder="Confirm Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(userConfirmPassword) => setConfirmPassword(userConfirmPassword)}
                    value={confirmPassword}
                    />
                </View>
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
        backgroundColor: '#FFC0CB',
        borderRadius: 30,
        width: '70%',
        height: 45,
        marginBottom: 20,
        alignItems: 'center',
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
