import { StatusBar } from 'expo-status-bar';


import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
// 1. Importamos la librería de SQLite
import * as SQLite from 'expo-sqlite';


export default function App() {

  const db = SQLite.openDatabaseSync('miBaseDeDatos.db'); 

  const [respuestaConsulta, setRespuestaConsulta] = useState<boolean>(false);
 

  useEffect(() => {
    setupDatabase();
  }, []);

  const setupDatabase = () => {
    // Ejecutamos un comando SQL: CREATE TABLE IF NOT EXISTS
    db.execSync(`
      CREATE TABLE IF NOT EXISTS miTabla (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL,
        miColumna TEXT
      );
    `);
  };

  const resultado = db.getAllSync<{ name: string }>(`PRAGMA table_info(miTabla)`);
  const respuesta: boolean = resultado.some(column => column.name === 'miColumna');
  setRespuestaConsulta(respuesta);

  //console.log('¿La columna "miColumna" existe en "miTabla"?', respuestaConsulta); 
  //console.log('Información de las columnas de "miTabla":', resultado);

  return (
    <View style={styles.container}>
      <Text>¿La columna "miColumna" existe en "miTabla"?, {respuestaConsulta ? "Sí" : "No"}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
