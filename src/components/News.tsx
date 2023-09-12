/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {useTheme} from '@react-navigation/native';

const News = (): JSX.Element => {
    const {colors} = useTheme();
    const textColor = colors.text;
    const backgroundColor = colors.background;
  return (
    <SafeAreaView>
        <StatusBar />
        <ScrollView>
            <View style={{backgroundColor: backgroundColor}}>
                <Text style={{color: textColor}}>News</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default News;
