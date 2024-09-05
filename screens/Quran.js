import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Image,
	TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { Colors } from "../utils/color";
import { screenWidth, screenHeight } from "../utils/scale";
import mic from "../assets/mic.png";
import { Audio } from "expo-av";

const imageMic = Image.resolveAssetSource(mic).uri;
let recording = new Audio.Recording();

export default function Quran() {
	const route = useRoute();
	const { surat } = route.params;
	const [listAyat, setListAyat] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [checked, setChecked] = useState(1);

	const api_url = `${route.params.api_url}/api/v1`;

	useEffect(() => {
		axios
			.get(`${api_url}/surat/${surat.number}`)
			.then((response) => {
				setListAyat(response.data.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const startRecording = async () => {
		try {
			console.log("Requesting permissions..");
			await Audio.requestPermissionsAsync();
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});
			console.log("Starting recording..");
			await recording.prepareToRecordAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
			);
			await recording.startAsync();
			console.log("Recording started");
			setIsRecording(true);
		} catch (err) {
			console.error("Failed to start recording", err);
		}
	};

	const stopRecording = async () => {
		try {
			setIsRecording(false);
			await recording.stopAndUnloadAsync();
			const uri = recording.getURI();
			console.log("Recording stopped");

			// Send the recording to the API
			const formData = new FormData();
			formData.append("blob_data", {
				uri,
				type: "audio/wav",
				name: "recording.wav",
			});

			console.log(
				"Sending recording... to the API " + api_url + "/prediksi-benar-lagi",
			);
			const apiResponse = await axios.post(
				`${api_url}/prediksi-benar-lagi/${surat.number}/${checked}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			console.log(apiResponse.data);

			if (apiResponse.status === 200 && apiResponse.data.code === 200) {
				console.log(apiResponse.data);
				apiResponse.data.data.forEach((response) => {
					listAyat.forEach((surat) => {
						surat.forEach((ayat) => {
							ayat.forEach((ayat_per_kata) => {
								if (ayat_per_kata.id === response[0].id) {
									ayat_per_kata.type = response[0].type;
								}
							});
						});
					});
				});
				setChecked((prev) => prev + 1);
				setListAyat([...listAyat]);
				console.log("Recording sent successfully");
			} else {
				console.error("Failed to send recording", apiResponse.statusText);
			}
		} catch (error) {
			console.error("Failed to stop recording", error);
		} finally {
			recording = new Audio.Recording();
		}
	};

	const getStyleForType = (type) => {
		switch (type) {
			case 1:
				return { backgroundColor: Colors.secondary };
			case 2:
				return { backgroundColor: Colors.error };
			default:
				return {};
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>{surat.englishName}</Text>
			</View>
			<View style={styles.bodyContainer}>
				<ScrollView>
					{listAyat.map((surat, suratIndex) => (
						<View key={suratIndex}>
							{surat.map((ayat, ayatIndex) => (
								<View
									key={ayatIndex}
									style={styles.ayatContainer}>
									<Text style={[styles.ayat, {backgroundColor:ayatIndex == checked-1 ? "#f7f7f7": "#fff"}]} >
										{ayat.map((ayat_per_kata, index) => (
											<Text
												key={index}
												style={getStyleForType(ayat_per_kata.type)}>
												{ayat_per_kata.text}
											</Text>
										))}
										{ayat[0].ayat_ke.toLocaleString("ar")}
									</Text>
								</View>
							))}
						</View>
					))}
				</ScrollView>
			</View>
			<View style={styles.footerContainer}>
				{!isRecording && (
					<Text>
						Ketuk dan tahan untuk merekam
					</Text>
				)}
				<TouchableOpacity
					onLongPress={startRecording}
					onPressOut={stopRecording}>
					<Image
						source={{ uri: imageMic }}
						style={[
							styles.microphone,
							{
								opacity: isRecording ? 0.5 : 1,
							},
						]}
					/>
				</TouchableOpacity>
			</View>

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
	headerContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 23,
		flex: 1,
	},
	title: {
		fontSize: 18,
		color: Colors.primary,
		fontWeight: "bold",
	},
	bodyContainer: {
		flex: 7,
		paddingHorizontal: screenWidth / 10,
	},
	ayatContainer: {
		marginBottom: 10,
		padding: 10,
		borderRadius: 5,
		textAlign: "justify",
	},
	ayat: {
		fontSize: 25,
		fontFamily: "Arab",
	},
	ayatText: {
		fontFamily: "Arab",
	},
	footerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	microphone: {
		width: 50,
		height: 50,
	},
});
