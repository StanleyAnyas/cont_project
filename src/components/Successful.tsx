/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

const Successful = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
  const opacityValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the opacity and scale
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHomePress = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
          <View>
            <Animated.View
            style={{
                opacity: opacityValue,
                transform: [{ scale: scaleValue }],
            }}
            >
            <FontAwesomeIcon icon={faCheck} size={100} color="green" />
            </Animated.View>
            <Text style={{ marginTop: 20, fontSize: 20 }}>Successful</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <View>
                <TouchableOpacity onPress={handleHomePress} style={[styles.button, { backgroundColor: '#ccc' }]}>
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>
            </View>
          </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  // centeredContent: {
  //     alignItems: 'center',
  //     marginTop: 100,
  // },
  buttonsContainer: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      paddingVertical: 20,
      paddingBottom: 20,
      position: 'absolute',
      bottom: 0,
      width: '90%',
  },
  button: {
      padding: 10,
      borderRadius: 5,
      // width: 350,
      alignItems: 'center',
  },
  text: {
      fontSize: 20,
  },
});
export default Successful;
