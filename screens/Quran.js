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

    const api_url = `https://8a35-35-245-157-0.ngrok-free.app/api/v1`;
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
            setRecording(newRecording); // Menyimpan objek rekaman saat mulai merekam
            console.log("Recording started");
        }
        setIsRecording(!isRecording); // Mengubah status rekaman setelah toggle
    };

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await newRecording.startAsync();

            // Start the interval to send data every 5 seconds
            const intervalId = setInterval(async () => {
                try {
                    // Stop the current recording
                    await newRecording.stopAndUnloadAsync();

                    // Get the recording file URI
                    const uri = newRecording.getURI();
                    // console.log('uri', uri);

                    // Fetch the file as a Blob
                    const response = await fetch(uri);
                    const blob = await response.blob();
                    // console.log('blob', blob);

                    // Prepare the form data
                    const formData = new FormData();
                    formData.append('blob_data', {
                        uri,
                        type: 'audio/wav',
                        name: 'recording.wav'
                    });

                    // Send the recording to the API using Axios
                    console.log('Sending recording... to the API ' + api_url + '/prediksi-benar');
                    const apiResponse = await axios.post(`${api_url}/prediksi-benar`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    if (apiResponse.status === 200) {
                        if(apiResponse.data.code === 200){
                        console.log(apiResponse.data)
                        console.log(apiResponse.data.data)
                        apiResponse.data.data.map((response)=>{
                            listAyat.map((surat) =>{
                                surat.map((ayat)=>{
                                    ayat.map((ayat_per_kata)=>{
                                        if(ayat_per_kata.id === response[0].id){
                                            console.log(response)
                                            ayat_per_kata.type = response[0].type
                                        }
                                    })
                                })
                            })
                        })
                        setListAyat([...listAyat]);
                    }
                        // setResponse(apiResponse.data);
                        console.log('Recording sent successfully');
                    } else {
                        console.error('Failed to send recording', apiResponse.statusText);
                    }

                    // Prepare for the next recording
                    await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                    await newRecording.startAsync();
                } catch (error) {
                    console.error('Failed to send recording', error);
                    clearInterval(intervalId); // Stop the interval if there's an error
                }
            }, 5000);

            return newRecording;

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
