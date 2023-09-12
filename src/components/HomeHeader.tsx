/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../App';


const HomeHeader = () => {
    const {isDarkTheme, toggleTheme} = useContext(ThemeContext);
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity onPress={toggleTheme}>
        {isDarkTheme ? (
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                <Text style={{color: 'white', paddingRight: 5}}>Light</Text>
                <Ionicons name="sunny" size={20} color="white" />
            </View>
        ) : (
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                <Text style={{color: 'black', paddingRight: 5}}>Dark</Text>
                <Ionicons name="moon" size={20} color="black" />
            </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;
