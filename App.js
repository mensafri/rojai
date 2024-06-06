import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import List from "./screens/List";
import Quran from "./screens/Quran";

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					options={{ headerShown: false }}
					name="Home"
					component={Home}
				/>
				<Stack.Screen
					options={{ headerShown: false }}
					name="List"
					component={List}
				/>
				<Stack.Screen
					options={{ headerShown: false }}
					name="Quran"
					component={Quran}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
