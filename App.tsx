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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {useColorScheme} from 'react-native';

export const ThemeContext = createContext({toggleTheme: () => {}, isDarkTheme: true});
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
  const toggleTheme = (): void => {
    setIsDarkTheme(!isDarkTheme);
  };
  let scheme = useColorScheme();
  const theme = isDarkTheme ? 'dark' : 'light';
  scheme = theme;

  useEffect(() => {
    // Check AsyncStorage for the user's sign-in status when the app starts
    checkSignInStatus();
  }, []);

  const checkSignInStatus = async () => {
    try {
      const storedSignInStatus = await AsyncStorage.getItem('isSignedIn');
      if (storedSignInStatus !== null) {
        setIsSignedIn(JSON.parse(storedSignInStatus));
      }
    } catch (error) {
      console.error('Error reading sign-in status from AsyncStorage:', error);
    }
  };
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ThemeContext.Provider value={{toggleTheme, isDarkTheme}}>
        {isSignedIn ? (
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                return iconImage(route.name, {focused, color, size});
              },
            })}>
            <Tab.Screen name="Home" component={Home} options={{title: 'Home'}} />
            <Tab.Screen name="News" component={News} options={{title: 'News'}} />
            <Tab.Screen
              name="Profile"
              component={Profile}
              options={{title: 'Profile'}}
            />
            <Tab.Screen
              name="Setting"
              component={Setting}
              options={{title: 'Setting'}}
            />
          </Tab.Navigator>
        ) : (
        <Stack.Navigator
          initialRouteName="Signup"
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            transitionSpec: {
              open: {animation: 'timing', config: {duration: 0}},
              close: {animation: 'timing', config: {duration: 0}},
            },
          }}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Login'}}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{title: 'Signup'}}
          />
        </Stack.Navigator>
        )}
      </ThemeContext.Provider>
    </NavigationContainer>
  );
};

export default App;
