/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Modal, StyleSheet, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase} from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../App';

const Profile = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {colors} = useTheme();
  const textColor = colors.text;
  const backgroundColor = colors.background;

  const { signOut } = React.useContext(AuthContext);

  const removeSignInStatus = async (): Promise<void> => {
    try {
      const storedSignInStatus = await AsyncStorage.getItem('isSignedIn');
      if (storedSignInStatus !== null) {
        await AsyncStorage.removeItem('isSignedIn');
        signOut();
      }
    } catch (error) {
      console.error('Error removing sign-in status from AsyncStorage:', error);
    }
  };
  const getEmail = async (): Promise<void> => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail !== null) {
        setEmail(storedEmail);
      }
    } catch (error) {
      console.error('Error reading email from AsyncStorage:', error);
    }
  };
  useEffect(() => {
    getEmail();
  }, []);

  const handleLogout = (): void => {
    signOut();
    removeSignInStatus();
  };

  const logoutModal = () => {
    console.log('Entering logoutModal');
    console.log('modalVisible:', modalVisible);
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, {backgroundColor: backgroundColor}]}>
              <Text style={[styles.modalText, {color: textColor}]}>Are you sure you want to logout?</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(false);
                  handleLogout();
                }}>
                <Text style={[styles.textStyle, {color: textColor}]}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => {setModalVisible(true); handleLogout();}}>
          <Text style={{color: textColor}}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <StatusBar />
        <ScrollView>
          <View style={{backgroundColor: backgroundColor}}>
              <Text style={{color: textColor}}>Profile</Text>
              <Text style={{color: textColor}}>Email: {email}</Text>
              <TouchableOpacity onPress={handleLogout}>
                  <Text style={{color: textColor}}>Logout</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    zIndex: 1000,
    // alignItems: 'center',
    shadowColor: '#f2f0e6',
    shadowOffset: {
      width: 0,
      height: 2,
      },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
  },

  buttonOpen: {
    backgroundColor: '#94ffeb',
  },

  buttonClose: {
    backgroundColor: '#f3c921',
  },

  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Profile;
