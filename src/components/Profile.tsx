/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, SafeAreaView, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase} from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';

const Profile = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
  // const navigation = useNavigation();
  const {colors} = useTheme();
  const textColor = colors.text;
  const backgroundColor = colors.background;

  const removeSignInStatus = async (): Promise<void> => {
    try {
      const storedSignInStatus = await AsyncStorage.getItem('isSignedIn');
      if (storedSignInStatus !== null) {
        await AsyncStorage.setItem('isSignedIn', '');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error removing sign-in status from AsyncStorage:', error);
    }
  };
  const handleLogout = (): void => {
    removeSignInStatus();
  };
  return (
    <SafeAreaView>
      <StatusBar />
        <ScrollView>
            <View style={{backgroundColor: backgroundColor}}>
                <Text style={{color: textColor}}>Profile</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={{color: textColor}}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
