import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AuthScreen from './AuthScreen';
import MainScreen from './MainScreen';
import FavoritesScreen from './FavoritesScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pantallaActual, setPantallaActual] = useState('feed'); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen onLoginSuccess={() => setPantallaActual('feed')} />;
  }

  if (pantallaActual === 'favoritos') {
    return <FavoritesScreen volver={() => setPantallaActual('feed')} />;
  }

  return (
    <MainScreen 
      onLogout={() => setPantallaActual('feed')} 
      verFavoritos={() => setPantallaActual('favoritos')} 
    />
  );
}