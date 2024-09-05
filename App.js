import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import List from "./screens/List";
import Quran from "./screens/Quran";
import InputApi from "./screens/InputApi";
import { useFonts } from "expo-font";
import SplashScreen from "expo-splash-screen";
import { useCallback } from "react";


const Stack = createNativeStackNavigator();

export default function App() {
	const [loaded] = useFonts({
		Arab: require("./assets/font/LPMQ IsepMisbah.ttf"),
	  });
	
	const onLayoutRootView = useCallback(async () => {
		if (loaded) {
		  await SplashScreen.hideAsync();
		}
	  }, [loaded]);
	
	  if (!loaded) {
		return null;
	  }
	return (
		<NavigationContainer onLayout={onLayoutRootView}>
			<Stack.Navigator>
				<Stack.Screen
					options={{ headerShown: false }}
					name="InputApi"
					component={InputApi}
				/>
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
