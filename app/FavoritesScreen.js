import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function FavoritesScreen({ volver }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "favoritos"),
      where("usuarioEmail", "==", auth.currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setFavorites(docs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={volver}>
          <Text style={styles.backBtnText}>⬅️ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Favoritos (Firestore)</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No has guardado fotos todavía. 😢</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.urlImagen }} style={styles.image} />
              <View style={styles.cardFooter}>
                <Text style={styles.author}>Por: {item.autor}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#1e293b' },
  backBtn: { backgroundColor: '#38bdf8', padding: 8, borderRadius: 5, marginRight: 15 },
  backBtnText: { color: 'white', fontWeight: 'bold' },
  headerTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 16 },
  card: { backgroundColor: '#1e293b', margin: 15, borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: 220 },
  cardFooter: { padding: 15 },
  author: { color: '#38bdf8', fontSize: 14, fontWeight: 'bold' }
});