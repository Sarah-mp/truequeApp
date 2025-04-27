// services/notificacionesService.ts

import { collection, addDoc, getDocs, query, orderBy, Timestamp, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../../infraestructure/adapters/drivers/database"

// Interfaz que refleja exactamente la estructura de tus documentos
interface Notificacion {
  createdAt: Timestamp;
  message: string;
  read: boolean;
  userId: string;
}

// Función para crear una nueva notificación de prueba
export const crearNotificacion = async () => {
  try {
    // Datos de prueba que coinciden con tu estructura
    const nuevaNotificacion: Notificacion = {
      createdAt: Timestamp.now(),
      message: "Esta es una notificación de prueba",
      read: false,
      userId: "Usuario al que se notifica"
    };

    // Referencia a la colección "Notificaciones"
    const notificacionesCollection = collection(db, "Notificaciones");
    
    // Agregar el documento
    const docRef = await addDoc(notificacionesCollection, nuevaNotificacion);
    
    console.log("Notificación creada con ID: ", docRef.id);
    return {
      id: docRef.id,
      ...nuevaNotificacion,
      createdAt: nuevaNotificacion.createdAt.toDate() // Convertir a Date para mejor visualización
    };
  } catch (error) {
    console.error("Error al crear notificación: ", error);
    throw error;
  }
};

// Función para obtener todas las notificaciones
export const obtenerTodasLasNotificaciones = async () => {
  try {
    const notificacionesCollection = collection(db, "Notificaciones");
    
    // Consulta ordenada por fecha de creación (más recientes primero)
    const q = query(notificacionesCollection, orderBy("createdAt", "desc"));
    
    const snapshot = await getDocs(q);
    
    // Mapear los documentos para incluir el ID y convertir Timestamp a Date
    const notificaciones = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate() // Convertir Timestamp a Date
    }));
    
    console.log(`Se encontraron ${notificaciones.length} notificaciones`);
    return notificaciones;
  } catch (error) {
    console.error("Error al consultar notificaciones: ", error);
    throw error;
  }
};

// Función para obtener notificaciones de un usuario específico
export const obtenerNotificacionesDeUsuario = async (userId: string): Promise<Notificacion[]> => {
  try {
    const notificacionesCollection = collection(db, "Notificaciones");
    
    // Consulta para obtener solo las notificaciones del usuario especificado
    const q = query(
      notificacionesCollection, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    const notificaciones:Notificacion[] = [];
    
    const resultado = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));


    resultado.map((res) => {
      if (isNotificacion(res)) {
        notificaciones.push(res);
      }
    })
    
    console.log(`Se encontraron ${notificaciones.length} notificaciones para el usuario ${userId}`);
    return notificaciones;
  } catch (error) {
    console.error(`Error al consultar notificaciones del usuario ${userId}: `, error);
    throw error;
  }
};


const isNotificacion = (data: any): data is Notificacion => {
  return (
    typeof data === 'object' &&
    data !== null &&
    data.createdAt instanceof Date &&
    typeof data.message === 'string' &&
    typeof data.read === 'boolean' &&
    typeof data.userId === 'string'
  );
};