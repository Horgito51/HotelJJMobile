import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppApolloProvider } from './providers/ApolloProvider';
import { AuthProvider } from './providers/AuthProvider';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppApolloProvider>
        <AuthProvider>
          <RootNavigator />
          <StatusBar style="light" />
        </AuthProvider>
      </AppApolloProvider>
    </SafeAreaProvider>
  );
}
