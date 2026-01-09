import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/admin/DashboardScreen';
import CatalogueScreen from '../screens/public/CatalogueScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const isAdmin = true; // Simular estado de login para demonstração

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAdmin ? (
          <Stack.Screen name="AdminDashboard" component={DashboardScreen} />
        ) : (
          <Stack.Screen name="PublicCatalogue" component={CatalogueScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
