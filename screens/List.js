import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import axios from "axios";
import { screenHeight, screenWidth } from "../utils/scale";

export default function List() {
	const [listSurat, setListSurat] = useState([]);

	useEffect(() => {
		axios
			.get("http://api.alquran.cloud/v1/surah")
			.then((response) => {
				setListSurat(response.data.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const renderItem = ({ item, index }) => (
		<View style={styles.itemContainer}>
			<Text style={styles.itemNumber}>{index + 1}</Text>
			<View style={styles.itemContent}>
				<Text style={styles.itemTitle}>{item.englishName}</Text>
				<Text style={styles.itemSubtitle}>
					{item.revelationType} - {item.numberOfAyahs} ayat
				</Text>
			</View>
		</View>
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
