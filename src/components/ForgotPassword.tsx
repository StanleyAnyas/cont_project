/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import { View, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

const ForgotPassword = ({route, navigation}: { navigation: NavigationProp<ParamListBase>, route: any }): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [changingPassword, setChangingPassword] = useState<boolean>(false);

    const userEmailAddress: string = route.params?.email;

    useEffect(() => {
        if (userEmailAddress) {
            setEmail(userEmailAddress);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const handleAlreadyExists = async (): Promise<void> => {
        setEmail('');
        setNewPassword('');
        setConfirmNewPassword('');
        navigation.navigate('Login');
    };
    function setTimeoutToErrorMsg(): void {
        setTimeout(() => {
            setErrorMsg('');
        }, 5000);
    }
    const handlePasswordReset = async () => {
        if (newPassword !== confirmNewPassword) {
            setErrorMsg('Passwords do not match');
            setTimeoutToErrorMsg();
            return;
        }
        if (newPassword.length < 8) {
            setErrorMsg('Password must be at least 8 characters');
            setTimeoutToErrorMsg();
            return;
        }
        setChangingPassword(true);
        const data: object = {
            email,
            newPassword,
        };
        try {
            const responce = await axios.post('http://10.0.2.2:8000/updateUser', data);
            console.log(responce.data.message);
            if (responce.data.message !== 'Password reset successful') {
                setChangingPassword(false);
                setErrorMsg('Password reset failed');
                setTimeoutToErrorMsg();
                return;
            }
            if (responce.status === 404) {
                setChangingPassword(false);
                setErrorMsg('Password reset failed');
                setTimeoutToErrorMsg();
                return;
            }
            if (responce.data.message === 'Password reset successful') {
                setEmail('');
                setNewPassword('');
                setConfirmNewPassword('');
                setChangingPassword(false);
                navigation.navigate('Successful');
            }
        } catch (error){
            console.log(error);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
            {changingPassword ? (
                    <View style={styles.activityIndicatorContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <View style={styles.loginFieldsContainer}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Forgot Password</Text>
                        <View style={styles.inputView}>
                            <TextInput
                            style={styles.TextInput}
                            placeholder="Enter new password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={!showPassword}
                            onChangeText={(userPassword) => setNewPassword(userPassword)}
                            value={newPassword}
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
                        <View style={styles.inputView}>
                            <TextInput
                            style={styles.TextInput}
                            placeholder="Confirm password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={!showConfirmPassword}
                            onChangeText={(userPassword) => setConfirmNewPassword(userPassword)}
                            value={confirmNewPassword}
                            />
                            <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                                <Icon
                                name={showConfirmPassword ? 'unlock-alt' : 'lock'}
                                size={20}
                                color="#003f5c"
                                style={styles.eyeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={{color: 'red'}}>{errorMsg}</Text>
                        <TouchableOpacity style={styles.loginBtn} onPress={handlePasswordReset}>
                            <Text style={styles.loginText}>NEXT</Text>
                        </TouchableOpacity>
                        <View style={{paddingTop: 2}}>
                            <TouchableOpacity onPress={handleAlreadyExists}><Text>Aready have an account Login</Text></TouchableOpacity>
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

export default ForgotPassword;
