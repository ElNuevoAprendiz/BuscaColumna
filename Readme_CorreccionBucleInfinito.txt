Porque el siguiente codigo se hace render infinitos:import { StatusBar } from 'expo-status-bar';


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
    db.execSync(
      CREATE TABLE IF NOT EXISTS miTabla (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL,
        miColumna TEXT
      );
    );
  };

  const resultado = db.getAllSync<{ name: string }>(PRAGMA table_info(miTabla));
  const respuesta: boolean = resultado.some(column => column.name === 'miColumna');
  setRespuestaConsulta(respuesta);

  //console.log('¿La columna "miColumna" existe en "miTabla"?', respuestaConsulta); 
  //console.log('Información de las columnas de "miTabla":', resultado);

  return (
    <View style={styles.container}>
      
      <Text>¿La columna "miColumna2" existe en "miTabla"?, {respuestaConsulta ? "Sí" : "No"}</Text>
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

Porque estás actualizando el estado durante el render.
Eso en React = loop infinito 🔁

Vamos paso a paso 👇

🔥 El problema clave

Estas líneas no están dentro de un useEffect:

const resultado = db.getAllSync<{ name: string }>(`PRAGMA table_info(miTabla)`);
const respuesta: boolean = resultado.some(column => column.name === 'miColumna');
setRespuestaConsulta(respuesta);

¿Qué pasa entonces?

React renderiza el componente

Se ejecuta setRespuestaConsulta(respuesta)

Cambia el estado → React vuelve a renderizar

En el nuevo render se vuelve a ejecutar setRespuestaConsulta

🔁 infinito

👉 Nunca llames a setState directamente en el cuerpo del componente.

🧠 Regla de oro

El render debe ser puro
(sin efectos secundarios como setState, llamadas a DB, fetch, etc.)

✅ Solución correcta

Mueve la consulta y el setRespuestaConsulta a un useEffect:

useEffect(() => {
  const resultado = db.getAllSync<{ name: string }>(
    `PRAGMA table_info(miTabla)`
  );

  const respuesta = resultado.some(
    column => column.name === 'miColumna'
  );

  setRespuestaConsulta(respuesta);
}, []);


Y elimina estas líneas del cuerpo del componente.

🧩 Código corregido (resumen)
useEffect(() => {
  setupDatabase();

  const resultado = db.getAllSync<{ name: string }>(
    `PRAGMA table_info(miTabla)`
  );

  const respuesta = resultado.some(
    column => column.name === 'miColumna'
  );

  setRespuestaConsulta(respuesta);
}, []);

⚠️ Extra tip importante

Esta línea también se ejecuta en cada render:

const db = SQLite.openDatabaseSync('miBaseDeDatos.db');


No rompe nada, pero es mejor moverla fuera del componente o memoizarla:

const db = React.useMemo(
  () => SQLite.openDatabaseSync('miBaseDeDatos.db'),
  []
);

📌 En resumen

❌ setState en el render → loop infinito

✅ setState solo dentro de useEffect, eventos, callbacks

❌ lógica con efectos secundarios fuera de useEffect

Si quieres, te ayudo a separar la lógica de DB en un hook (useDatabase) y dejar el componente limpito 👌




