/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, SafeAreaView, StatusBar, ScrollView} from 'react-native';
import {useTheme} from '@react-navigation/native';

const Profile = (): JSX.Element => {

  const {colors} = useTheme();
  const textColor = colors.text;
  const backgroundColor = colors.background;
  return (
    <SafeAreaView>
      <StatusBar />
        <ScrollView>
            <View style={{backgroundColor: backgroundColor}}>
                <Text style={{color: textColor}}>Profile</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
