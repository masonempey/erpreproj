import ParentNav from './src/routing/parentNav';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/firebase/firebase-context';
export default function App() {
  
  // Move NavigationContainer to the root of the app for authentication process and prevent potential issues
  return (
    <>
      <StatusBar barStyle="dark-content" hidden={true} />
      <AuthProvider>
        <NavigationContainer>
          <ParentNav />
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}

