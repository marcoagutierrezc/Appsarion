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
import ErrorBoundary from './utils/ErrorBoundary';
import { Alert, LogBox } from 'react-native';
import { FontScaleProvider } from './context/FontScaleContext';

export default function App() {
  // Global error capture to avoid full crashes and surface logs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ErrU: any = (global as any).ErrorUtils;
  const defaultHandler = ErrU && ErrU.getGlobalHandler ? ErrU.getGlobalHandler() : undefined;
  if (ErrU && ErrU.setGlobalHandler) {
    ErrU.setGlobalHandler((error: any, isFatal?: boolean) => {
      console.error('GlobalError:', error);
      if (isFatal) {
        try {
          Alert.alert(
            'Error inesperado',
            (error && error.message) || 'Se produjo un error en la aplicación.'
          );
        } catch {}
      }
      if (typeof defaultHandler === 'function') {
        try { defaultHandler(error, isFatal); } catch {}
      }
    });
  }

  // Unhandled promise rejections
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g: any = global as any;
  if (!g.__unhandledRejectionPatched) {
    g.__unhandledRejectionPatched = true;
    g.onunhandledrejection = (e: any) => {
      const reason = e?.reason || e;
      console.error('UnhandledPromiseRejection:', reason);
    };
  }

  // Ignore noisy warnings that are not actionable in prod
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'SafeAreaView has been deprecated',
  ]);

  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <FontScaleProvider>
            <ErrorBoundary>
              <Navigation />
            </ErrorBoundary>
          </FontScaleProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
}