/* eslint-disable prettier/prettier */
import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import HomeHeader from './HomeHeader';

const Setting = (): JSX.Element => {
    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <HomeHeader />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


export default Setting;
