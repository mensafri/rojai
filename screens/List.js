import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { screenHeight, screenWidth } from "../utils/scale";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function List() {
	const route = useRoute();
	const { api_url } = route.params;
	const navigation = useNavigation();
	const [listSurat, setListSurat] = useState([]);

	useEffect(() => {
		axios
			.get("https://api.alquran.cloud/v1/surah")
			.then((response) => {
				setListSurat(response.data.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const renderItem = ({ item, index }) => (
		<TouchableOpacity onPress={() => navigation.navigate("Quran", { surat: item , api_url: api_url})}>
		<View style={styles.itemContainer}>
			<Text style={styles.itemNumber}>{index + 1}</Text>
			<View style={styles.itemContent}>
				<Text style={styles.itemTitle}>{item.englishName}</Text>
				<Text style={styles.itemSubtitle}>
					{item.revelationType} - {item.numberOfAyahs} ayat
				</Text>
			</View>
		</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={listSurat}
				renderItem={renderItem}
				keyExtractor={(item) => item.number.toString()}
				contentContainerStyle={{
					paddingHorizontal: screenWidth / 10,
					marginTop: screenHeight / 20,
					gap: screenHeight / 50,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingTop: 20,
	},
	itemContainer: {
		flexDirection: "row",
		padding: 15,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: screenWidth / 30,
		shadowColor: "#000",
		shadowOpacity: 2,
		shadowRadius: 4,
	},
	itemNumber: {
		fontSize: 18,
		fontWeight: "bold",
		marginRight: 15,
	},
	itemContent: {
		flex: 1,
	},
	itemTitle: {
		fontSize: 16,
		fontWeight: "bold",
	},
	itemSubtitle: {
		fontSize: 14,
		color: "#555",
	},
});
