// app/editar/[productId].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db } from "@/config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FirebaseProductAdapter } from "@/infraestructure/adapters/FirebaseProduct";
import { ProductService } from "@/domain/servicios/ProductService";

export default function EditarProductoScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const productService = new ProductService(
    new FirebaseProductAdapter()
  );

  useEffect(() => {
    if (!productId) return;
    (async () => {
      const ref = doc(db, "productos", productId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        Alert.alert("Error", "Producto no encontrado");
        return router.back();
      }
      const data = snap.data() as any;
      setTitle(data.title);
      setDescription(data.description);
      setLocation(data.location);
      setImages(data.images || []);
    })();
  }, [productId]);

  const pickImage = async () => {
    if (!productId) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permiso denegado", "Necesitamos acceso a tus fotos.");
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    const uri = (res as any).assets?.[0]?.uri || (res as any).uri;
    if (!uri) return;

    // Subir a Storage
    const storage = getStorage();
    const imgRef = storageRef(storage, `productos/${productId}/${Date.now()}`);
    const blob = await (await fetch(uri)).blob();
    await uploadBytes(imgRef, blob);
    const url = await getDownloadURL(imgRef);

    // Actualizar estado e inmediatamente Firestore
    const newImages = [...images, url];
    setImages(newImages);
    await updateDoc(doc(db, "productos", productId), {
      images: newImages,
      updatedAt: new Date(),
    });
  };

  const saveChanges = async () => {
    if (!productId) return;
    try {
      await updateDoc(doc(db, "productos", productId), {
        title,
        description,
        location,
        images,
        updatedAt: new Date(),
      });
      Alert.alert("¡Listo!", "Producto actualizado");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  async function confirmDeletion(onDelete: () => Promise<void>) {
    if (Platform.OS === "web") {
      const ok = window.confirm("¿Seguro que quieres eliminar este producto?");
      if (ok) {
        await onDelete();
      }
    } else {
      Alert.alert(
        "Eliminar producto",
        "¿Seguro que quieres eliminar este producto?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí",
            style: "destructive",
            onPress: async () => {
              await onDelete();
            },
          },
        ]
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Lugar de encuentro</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Imágenes</Text>
      <View style={styles.imageRow}>
        {images.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.imageThumb} />
        ))}
        <TouchableOpacity onPress={pickImage} style={styles.addImageBtn}>
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveTxt}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() =>
          confirmDeletion(async () => {
            await productService.deleteProduct(productId);
            router.replace('/profile');
          })
        }
      >
        <Text style={styles.deleteTxt}>Eliminar producto </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f0f0f0" },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 12 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  textarea: { height: 80, textAlignVertical: "top" },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  imageThumb: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 8,
  },
  addImageBtn: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: "#153dda",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#153dda",
    padding: 12,
    borderRadius: 4,
    marginTop: 24,
    alignItems: "center",
  },
  saveTxt: { color: "#fff", fontWeight: "bold" },
  deleteBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e53935",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  deleteTxt: {
    color: "#e53935",
    fontWeight: "bold",
  },
});
