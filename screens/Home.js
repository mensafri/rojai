import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import rojai from "../assets/rojai.png";
import { screenWidth, screenHeight } from "../utils/scale";
import { useNavigation, useRoute } from "@react-navigation/native";

const imageRojai = Image.resolveAssetSource(rojai).uri;

export default function Home() {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<Image
				source={{ uri: imageRojai }}
				style={styles.imageRojai}
			/>
			<TouchableOpacity
				style={styles.buttonMulaiContainer}
				onPress={() => navigation.navigate("List")}>
				<Text style={{ color: "white", fontSize: screenWidth / 30 }}>
					Mulai
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	imageRojai: {
		height: screenWidth / 3.5,
		width: screenWidth / 2,
		objectFit: "fill",
		marginBottom: screenHeight / 5,
	},
	buttonMulaiContainer: {
		backgroundColor: "green",
		width: screenWidth / 4,
		height: screenHeight / 20,
		borderRadius: screenWidth / 50,
		justifyContent: "center",
		alignItems: "center",
	},
});
