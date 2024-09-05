import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InputApi() {
    const navigation = useNavigation();
  const [apiUrl, setApiUrl] = useState('');

  const handleSend = () => {
    navigation.navigate('Home', { api_url:apiUrl });
    
  };

  return (
    <View style={styles.container}>
      <Text>Masukkan API URL</Text>
      <TextInput
        style={styles.input}
        value={apiUrl}
        onChangeText={setApiUrl}
        placeholder="Masukkan URL API di sini"
      />
      <Button title="Kirim" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
});
