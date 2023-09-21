/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, createContext, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from './src/components/Profile';
import News from './src/components/News';
import Home from './src/components/Home';
import Login from './src/components/Login';
import Signup from './src/components/Signup';
import Setting from './src/components/Setting';
import Successful from './src/components/Successful';
import ForgotPassword from './src/components/ForgotPassword';
import Authenticate from './src/components/Authenticate';
import EmailForgotPassword from './src/components/EmailForgotPassword';
import TokenForgotPassword from './src/components/TokenForgotPassword';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StatusBar, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, DarkTheme, NavigationContainer} from '@react-navigation/native';
import {useColorScheme} from 'react-native';

export const ThemeContext = createContext({toggleTheme: () => {}, isDarkTheme: true});
export const AuthContext = createContext({signIn: () => {}, signOut: () => {}, signUp: () => {}});
const Tab = createBottomTabNavigator();

const CustomIcon = ({name, size, color}: { name: string; size: number; color: string;}): JSX.Element => {
  return <Ionicons name={name} size={size} color={color} />;
};

const iconImage = (route: string, {focused, color, size}: {focused: boolean; color: string; size: number},): JSX.Element => {
  let iconName: string = '';

  switch (route) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    case 'News':
      iconName = focused ? 'newspaper' : 'newspaper-outline';
      break;
    case 'Setting':
      iconName = focused ? 'settings' : 'settings-outline';
      break;
    default:
      iconName = 'home';
      break;
  }

  return <CustomIcon name={iconName} size={size} color={color} />;
};

const Stack = createStackNavigator();

const App = (): JSX.Element => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  let scheme = useColorScheme();
  const theme = isDarkTheme ? 'dark' : 'light';
  scheme = theme;

  useEffect(() => {
    const checkSignInStatus = async () => {
      setChecked(false);
      try {
        const storedSignInStatus = await AsyncStorage.getItem('isSignedIn');
        if (storedSignInStatus !== null) {
          setIsSignedIn(JSON.parse(storedSignInStatus));
        }
      } catch (error) {
        console.error('Error reading sign-in status from AsyncStorage:', error);
      } finally {
        setChecked(true);
      }
    };

    const getUserThemePreference = async () => {
      try {
        const storedUserThemePreference = await AsyncStorage.getItem('userThemePreference');
        if (storedUserThemePreference !== null) {
          setIsDarkTheme(JSON.parse(storedUserThemePreference));
        }
      } catch (error) {
        console.error('Error reading user theme preference from AsyncStorage:', error);
      }
    };

    checkSignInStatus();
    getUserThemePreference();
  }, []);

  const toggleTheme = (): void => {
    setIsDarkTheme(!isDarkTheme);
  };

  const signIn = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('isSignedIn', JSON.stringify(true));
      setIsSignedIn(true);
    } catch (error) {
      console.error('Error storing sign-in status in AsyncStorage:', error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('isSignedIn');
      setIsSignedIn(false);
    } catch (error) {
      console.error('Error removing sign-in status from AsyncStorage:', error);
    }
  };

  const signUp = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('isSignedIn', JSON.stringify(true));
      setIsSignedIn(true);
    } catch (error) {
      console.error('Error storing sign-in status in AsyncStorage:', error);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const storeUserThemePreference = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('userThemePreference', JSON.stringify(isDarkTheme));
    } catch (error) {
      console.error('Error storing user theme preference in AsyncStorage:', error);
    }
  };

  useEffect(() => {
    storeUserThemePreference();
  }, [isDarkTheme, storeUserThemePreference]);

  return (
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthContext.Provider value={{signIn, signOut, signUp}}>
        <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
            {checked ? (
              isSignedIn ? (
                <ThemeContext.Provider value={{toggleTheme, isDarkTheme}}>
                <Tab.Navigator screenOptions={({route}) => ({ tabBarIcon: ({focused, color, size}) => {
                      return iconImage(route.name, {focused, color, size});
                    },
                  })}>
                  <Tab.Screen name="Home" component={Home} options={{title: 'Home'}} />
                  <Tab.Screen name="News" component={News} options={{title: 'News'}} />
                  <Tab.Screen name="Profile" component={Profile} options={{title: 'Profile'}} />
                  <Tab.Screen name="Setting" component={Setting} options={{title: 'Setting'}} />
                </Tab.Navigator>
                </ThemeContext.Provider>
                )
                : (
                  <Stack.Navigator
                    initialRouteName="Login"
                    initialRouteParams={{isSignedIn: isSignedIn}}
                    screenOptions={{
                      headerShown: false,
                      animationEnabled: true,
                      transitionSpec: {
                        open: {animation: 'timing', config: {duration: 0}},
                        close: {animation: 'timing', config: {duration: 0}},
                      },
                    }}>
                    <Stack.Screen name="Login" component={Login} options={{title: 'Login'}} />
                    <Stack.Screen name="Signup" component={Signup} options={{title: 'Signup'}} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{title: 'ForgotPassword'}} />
                    <Stack.Screen name="Authenticate" component={Authenticate} options={{title: 'Authenticate'}} />
                    <Stack.Screen name="EmailForgotPassword" component={EmailForgotPassword} options={{title: 'EmailForgotPassword'}} />
                    <Stack.Screen name="TokenForgotPassword" component={TokenForgotPassword} options={{title: 'TokenForgotPassword'}} />
                    <Stack.Screen name="Successful" component={Successful} options={{title: 'Successful'}} />
                  </Stack.Navigator>
                )
              ) : (
                <ActivityIndicator style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 80}} size="large" />
              )}
        </AuthContext.Provider>
      </NavigationContainer>
  );
};

export default App;
