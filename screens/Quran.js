import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from '@react-navigation/native';
import { Colors } from "../utils/color";
import { screenWidth, screenHeight } from "../utils/scale";
import mic from "../assets/mic.png";
import { Audio } from 'expo-av';

const imageMic = Image.resolveAssetSource(mic).uri;

export default function Quran() {
    const route = useRoute();
    const { surat } = route.params;
    const [listAyat, setListAyat] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null); // Menyimpan objek rekaman
    // const [response, setResponse] = useState(null);

    // let newRecording = null;
    // const [newRecording, setNewRecording] = useState(null);

    const api_url = `https://crisis-cocktail-appearance-telephony.trycloudflare.com/api/v1`;
    useEffect(() => {
        axios.get(`${api_url}/surat/${surat.number}`).then((response) => {
            setListAyat(response.data.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    // console.log(listAyat)
    const toggleRecording = async () => {
        if (isRecording) {
            await stopRecording();
            console.log("Recording stopped");
        } else {
            const newRecording = await startRecording();
            // setRecording(newRecording); // Menyimpan objek rekaman saat mulai merekam
            console.log("Recording started");
        }
        setIsRecording(!isRecording); // Mengubah status rekaman setelah toggle
    };

const startRecording = async () => {
    try {
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status !== 'granted') {
            console.error('Permission to access microphone was denied');
            return;
        }

        // Start the interval to send data every 5 seconds
        const intervalId = setInterval(async () => {
            try {
                let newRecording = new Audio.Recording();
                await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                await newRecording.startAsync();
                console.log('Recording started');

                // Set recording state
                setRecording(newRecording);

                // Ensure some time to record
                await new Promise(resolve => setTimeout(resolve, 3000)); // Record for 3 seconds

                // Stop the current recording
                // console.log('Recording stopped');
                await newRecording.stopAndUnloadAsync();
                // Get the recording file URI
                const uri = await newRecording.getURI();
                if (!uri) {
                    throw new Error('No valid audio data has been received');
                }

                // Prepare the form data
                const formData = await new FormData();
                await formData.append('blob_data', {
                    uri,
                    type: 'audio/wav',
                    name: 'recording.wav'
                });

                // Send the recording to the API using Axios
                console.log('Sending recording... to the API ' + api_url + '/prediksi-benar');
                axios.post(`${api_url}/prediksi-benar`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    if (response.data.code === 200) {
                        response.data.data.map((responseLagi) => {
                            listAyat.map((surat) => {
                                surat.map((ayat) => {
                                    ayat.map((ayat_per_kata) => {
                                        if (ayat_per_kata.id === responseLagi[0].id) {
                                            console.log(responseLagi)
                                            ayat_per_kata.type = responseLagi[0].type
                                        }
                                    })
                                })
                            })
                        });
                        setListAyat([...listAyat]);
                    } else {
                        console.log(response.data);
                    }
                }).catch((error) => {
                    console.log(error);
                });

            } catch (error) {
                console.error('Failed to send recording', error);
                clearInterval(intervalId); // Stop the interval if there's an error
            }
        }, 5000);

    } catch (error) {
        console.error('Failed to start recording', error);
    }
};


    const stopRecording = async () => {
        try {
            await recording.stopAndUnloadAsync();
        } catch (error) {
            console.error('Failed to stop recording', error);
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
                                <View key={ayatIndex} style={styles.ayatContainer}>
                                    <Text style={styles.ayat}>
                                        {ayat.map((ayat_per_kata, index) => (
                                            <Text key={index} style={getStyleForType(ayat_per_kata.type)}>
                                                {ayat_per_kata.text}
                                            </Text>
                                        ))}
                                        {ayat[0].ayat_ke.toLocaleString('ar')}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={toggleRecording}>
                    <Image source={{ uri: imageMic }} style={styles.microphone} />
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
