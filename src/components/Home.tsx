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
const [Firstname, setFirstname] = React.useState<string>('');

const getFirstnames = async (): Promise<void> => {
  try {
    const storedFirstname = await AsyncStorage.getItem('Firstname');
    if (storedFirstname !== null) {
      setFirstname(storedFirstname);
    }
  } catch (error) {
    console.error('Error reading Firstname from AsyncStorage:', error);
  }
};

getFirstnames();

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <View style={{backgroundColor: colors.background}}>
            <Text style={{color: textColor}}>Homie</Text>
            <Text style={{color: textColor}}>Welcome {Firstname}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
