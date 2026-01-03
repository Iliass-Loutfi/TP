import { createDrawerNavigator } from "@react-navigation/drawer";
import AppStack from "./AppStack";
import ProfileScreen from "../screens/ProfileScreen";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: "#007AFF",
        drawerInactiveTintColor: "#666",
        drawerStyle: {
          backgroundColor: "#f5f5f5",
        },
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen 
        name="Tâches" 
        component={AppStack}
        options={{
          drawerLabel: "📝 Mes Tâches",
        }}
      />
      <Drawer.Screen 
        name="Profil" 
        component={ProfileScreen}
        options={{
          drawerLabel: "👤 Mon Profil",
        }}
      />
    </Drawer.Navigator>
  );
}