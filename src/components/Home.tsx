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

function Home(): JSX.Element {

const {colors} = useTheme();
const textColor = colors.text;

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <View style={{backgroundColor: colors.background}}>
            <Text style={{color: textColor}}>Homie</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
