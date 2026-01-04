import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NativeFeaturesScreen from "../screens/NativeFeaturesScreen";
import CameraScreen from "../screens/CameraScreen";
import LocationScreen from "../screens/LocationScreen";
import ContactsScreen from "../screens/ContactsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";

const Stack = createNativeStackNavigator();

export default function NativeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="NativeFeatures"
        component={NativeFeaturesScreen}
        options={{ title: "Fonctionnalités Natives" }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: "Caméra" }}
      />
      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={{ title: "Localisation" }}
      />
      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ title: "Contacts" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
    </Stack.Navigator>
  );
}