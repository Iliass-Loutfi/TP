import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TodoListScreen from "../screens/TodoListScreen";
import TodoDetailsScreen from "../screens/TodoDetailsScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Liste" 
        component={TodoListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Détails" 
        component={TodoDetailsScreen}
        options={{
          title: "Détails de la tâche",
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack.Navigator>
  );
}