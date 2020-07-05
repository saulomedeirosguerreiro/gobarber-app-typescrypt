import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {  View, StatusBar} from 'react-native';
import Routes from './routes/index';
import {AuthProvider} from './context/authContext';
const App : React.FC = () => {
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor='#312e38'/> 
            <AuthProvider>
                <View style={{flex:1, backgroundColor: '#312e38'}}>
                    <Routes/>
                </View>
            </AuthProvider>
        </NavigationContainer>    
    );
};

export default App;