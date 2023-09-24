/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Modal, StyleSheet, Pressable, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase} from '@react-navigation/native';
import { AuthContext } from '../../App';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import axios from 'axios';

const Profile = ({navigation}: { navigation: NavigationProp<ParamListBase> }): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [firstLetter, setFirstLetter] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [changeProfilePicture, setChangeProfilePicture] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>('');
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

  useEffect(() => {
    const getFirstLetter = (): void => {
      const userFirstLetter = firstname.charAt(0);
      userFirstLetter.toUpperCase();
      setFirstLetter(userFirstLetter);
    };
    getFirstLetter();
  }, [firstname]);


  useEffect(() => {
    getFirstnames();
  }, []);

  useEffect(() => {
    getEmail();
  }, []);

  const handleLogout = (): void => {
    signOut();
    removeSignInStatus();
  };

  useEffect(() => {
    getEmail();
  }, []);

  const openModal = (): void => {
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
  };

  const openProfilePictureModal = (): void => {
    setChangeProfilePicture(true);
  };
  const closeProfilePictureModal = (): void => {
    setChangeProfilePicture(false);
  };
  const showSuccessBanner = (message: string): void => {
    console.log(message);
  };

  const handleProfilePictureChange = async (imageUri: string | undefined): Promise<void> => {
    const data: object = {
      email,
      imageUri,
    };
    try {
      const responce = await axios.post('http://10.0.2.2:8000/addProfilePicture', data);
      if (responce.data.message !== 'Profile picture added') {
        showSuccessBanner('Profile picture not added');
        return;
      } else if (responce.data.message === 'Profile picture added') {
        showSuccessBanner('Profile picture added');
      }
    } catch (error) {
      showSuccessBanner('Profile picture not added');
    }
  };
  const isValidImageType = (fileType: string | undefined) => {
    // List of valid image MIME types (you can extend this list)
    if (fileType === undefined) {
      return false;
    }
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    return validImageTypes.includes(fileType);
  };
  const cameraOptions: CameraOptions = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
  };

  const imageLibraryOptions: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
  };

  const openImagePicker = () => {
    launchImageLibrary(imageLibraryOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode === 'camera_unavailable') {
        console.log('Image picker error: ', response.errorMessage);
      } else if (isValidImageType(response.assets?.[0]?.type)) {
        let imageUri = response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        handleProfilePictureChange(imageUri);
      } else {
        console.log('Invalid image type');
      }
    });
  };

  const handleCameraLaunch = () => {
    launchCamera(cameraOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode === 'camera_unavailable') {
        console.log('Camera Error: ', response.errorMessage);
      } else if (isValidImageType(response.assets?.[0]?.type)) {
        let imageUri = response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        handleProfilePictureChange(imageUri);
      } else {
        console.log('Invalid image type');
      }
    });
  };

  useEffect(() => {
  const getUserProfilePicture = async (): Promise<void> => {
    const data: object = {
      email,
    };
    try {
      const responce = await axios.post('http://10.0.2.2:8000/getProfilePicture', data);
      if (responce.data.message !== 'Profile picture found') {
        return;
      } else if (responce.data.message === 'Profile picture found') {
        console.log(responce.data.profilePicture);
        setSelectedImage(responce.data.profilePicture);
      }
    } catch (error) {
      console.log(error);
    }
  };
    getUserProfilePicture();
  }, [email]);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <View style={{ backgroundColor: backgroundColor }}>
          <Text style={{ color: textColor }}>Email: {email}</Text>
          <View style={{ flexDirection: 'column' }}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.profileImage} />
              ) : (
              <View style={[styles.emptyProfileImage, { backgroundColor: '#FF1494' }]}>
                <Text style={styles.emptyProfileImageText}>{firstLetter}</Text>
              </View>
            )}
            <TouchableOpacity onPress={openProfilePictureModal}>
              <Text style={{ color: textColor }}>Change Profile Picture</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={openModal}>
            <Text style={{ color: textColor }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={[styles.centeredView, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalView, { backgroundColor: backgroundColor }]}>
            <Text style={[styles.modalText, { color: textColor }]}>Are you sure you want to logout?</Text>
            <Pressable style={[styles.button, styles.buttonClose]} onPress={closeModal}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonClose]} onPress={() => { closeModal(); handleLogout(); }}>
              <Text style={[styles.textStyle]}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={changeProfilePicture}>
        <TouchableOpacity style={styles.overlay} activeOpacity={5} onPress={closeProfilePictureModal}>
          <View style={[styles.centeredView, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
            <View style={[styles.modalView, { backgroundColor: backgroundColor }]}>
            <Pressable style={styles.closeButton} onPress={closeProfilePictureModal}>
                <Icon name="close" size={30} color="#FF1494" />
              </Pressable>
              <Text style={[styles.modalText, { color: textColor }]}>Change Profile Picture</Text>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={ () => { closeProfilePictureModal(); openImagePicker; }}>
                <Text style={styles.textStyle}>Gallery</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={() => { closeProfilePictureModal(); handleCameraLaunch(); }}>
                <Text style={[styles.textStyle]}>Camera</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    backgroundColor: '#FF1494',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
  emptyProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 20,
    backgroundColor: '#FF1494',
  },
  emptyProfileImageText: {
    fontSize: 50,
    color: '#f2f0e6',
    textAlign: 'center',
    marginTop: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 2,
    right: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF1494',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default Profile;
