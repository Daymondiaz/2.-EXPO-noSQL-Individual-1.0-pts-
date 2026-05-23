import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function MainScreen({ onLogout, verFavoritos }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch('https://picsum.photos/v2/list?page=1&limit=15')
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(err => console.log(err));
  }, []);

  const guardarFavorito = async (foto) => {
    try {
      await addDoc(collection(db, "favoritos"), {
        usuarioEmail: auth.currentUser.email,
        fotoId: foto.id,
        autor: foto.author,
        urlImagen: foto.download_url,
        fechaGuardado: new Date().toISOString()
      });
      Alert.alert("⭐ Guardado", "¡Añadido a tus favoritos en Firebase NoSQL!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userText}>👤 {auth.currentUser?.email}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.favNavBtn} onPress={verFavoritos}>
            <Text style={styles.favNavText}>Mis ❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut(auth).then(onLogout)}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.download_url }} style={styles.image} />
            <View style={styles.cardFooter}>
              <Text style={styles.author}>Autor: {item.author}</Text>
              <TouchableOpacity style={styles.favBtn} onPress={() => guardarFavorito(item)}>
                <Text style={styles.favBtnText}>❤️ Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', backgroundColor: '#1e293b' },
  userText: { color: 'white', fontWeight: 'bold', fontSize: 13, maxWidth: 180 },
  favNavBtn: { backgroundColor: '#e2e8f0', padding: 8, borderRadius: 5 },
  favNavText: { color: '#1e293b', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#ef4444', padding: 8, borderRadius: 5 },
  logoutText: { color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: '#1e293b', margin: 15, borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: 220 },
  cardFooter: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { color: 'white', fontSize: 14, fontWeight: 'bold', flex: 1 },
  favBtn: { backgroundColor: '#38bdf8', padding: 8, borderRadius: 8 },
  favBtnText: { color: 'white', fontWeight: 'bold' }
});