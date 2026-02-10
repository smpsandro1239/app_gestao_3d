import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BookOpen, Database, Landmark, LayoutDashboard, ShoppingCart } from 'lucide-react-native';
import DashboardScreen from '../screens/admin/DashboardScreen';
import FinanceScreen from '../screens/admin/FinanceScreen';
import InventoryScreen from '../screens/admin/InventoryScreen';
import OrdersPage from '../screens/admin/OrdersPage';
import CatalogueScreen from '../screens/public/CatalogueScreen';
import { COLORS } from '../utils/theme';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.cardDark,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.slate400,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dash',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersPage}
        options={{
          tabBarLabel: 'Pedidos',
          tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{
          tabBarLabel: 'Finanças',
          tabBarIcon: ({ color, size }) => <Landmark color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarLabel: 'Stock',
          tabBarIcon: ({ color, size }) => <Database color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Catalogue"
        component={CatalogueScreen}
        options={{
          tabBarLabel: 'Catálogo',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
