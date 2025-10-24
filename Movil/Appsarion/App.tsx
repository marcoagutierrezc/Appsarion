// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import {StyleSheet, Text, View } from 'react-native';
// import Navigation from './navigation';
// import {Provider as ReduxProvider} from 'react-redux';
// import {store} from './store/index';
// import { registerRootComponent } from 'expo';

// const App =() =>{
//   return (
//     <ReduxProvider store={store}>
//         <Navigation/>
//         <StatusBar style='auto'/>
//       </ReduxProvider>
//     );
// };

// registerRootComponent(App);

// export default App;

import Navigation from './navigation';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
}