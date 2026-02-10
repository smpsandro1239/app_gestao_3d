import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddFilamentScreen from '../screens/admin/AddFilamentScreen';
import AddProductScreen from '../screens/admin/AddProductScreen';
import CreateOrderScreen from '../screens/admin/CreateOrderScreen';
import OrderDetailsScreen from '../screens/admin/OrderDetailsScreen';
import ProductDetailsScreen from '../screens/admin/ProductDetailsScreen';
import TabNavigator from './TabNavigator';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { SettingsProvider } from '../context/SettingsContext';
import ClientsPage from '../screens/admin/ClientsPage';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createStackNavigator();

const Routes = () => {
  const { signed } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        <>
          <Stack.Screen name="AdminMain" component={TabNavigator} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
          <Stack.Screen name="AddFilament" component={AddFilamentScreen} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
          <Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
          <Stack.Screen name="Clients" component={ClientsPage} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default AppNavigator;
