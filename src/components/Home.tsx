/* eslint-disable prettier/prettier */
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home(): JSX.Element {

const {colors} = useTheme();
const textColor = colors.text;
const [email, setEmail] = React.useState<string>('');

const getEmails = async (): Promise<void> => {
  try {
    const storedEmail = await AsyncStorage.getItem('email');
    if (storedEmail !== null) {
      setEmail(storedEmail);
    }
  } catch (error) {
    console.error('Error reading email from AsyncStorage:', error);
  }
};

getEmails();

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <View style={{backgroundColor: colors.background}}>
            <Text style={{color: textColor}}>Homie</Text>
            <Text style={{color: textColor}}>Welcome {email}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
