import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FirebaseProductAdapter } from "@/infraestructure/adapters/FirebaseProduct";
import { FirebaseAuthAdapter } from "@/infraestructure/adapters/FirebaseAuthAdapter";
import { Product } from "@/domain/entities/Product";
import { FirebaseUserAdapter } from "@/infraestructure/adapters/FirebaseUserAdapter";
import { auth } from "@/config/firebase";
import { NotificationService } from "@/domain/servicios/NotificationService";

const DetalleProducto: React.FC = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const adapter = new FirebaseProductAdapter();
      const result = await adapter.getById(productId);
      setProduct(result);
      setLoading(false);

      if (result?.ownerId) {
        const userAdapter = new FirebaseUserAdapter();
        const user = await userAdapter.getById(result.ownerId);
        setOwnerName(user?.fullName || "Usuario");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleRequest = async () => {
    const current = auth.currentUser;
    if (!current || !product || !product.id) {
      Alert.alert("Error", "No se puede procesar la solicitud en este momento.");
      return;
    }

    await NotificationService.registerNotification({
      toUserId: product.ownerId,
      fromUserId: current.uid,
      fromUserName: current.displayName || "",
      productId: product.id,
      productTitle: product.title,
      type: "request",
      createdAt: new Date(),
      isRead: false,
    });

    Alert.alert(
      "Solicitud enviada",
      "Se ha notificado al propietario de tu interés."
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Detalle del Producto</Text>
      </View>

      {/* Imágenes */}
      <ScrollView horizontal pagingEnabled style={styles.imageSection}>
        {product.images?.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>

      {/* Info del usuario y producto */}
      <View style={styles.infoSection}>
        <View style={styles.userInfo}>
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color="#007bff"
          />
          <Text style={styles.userName}>{ownerName} está regalando</Text>
        </View>

        <Text style={styles.articuloTitulo}>{product.title}</Text>

        <View style={styles.lugarEncuentro}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#007bff" />
          <Text style={styles.encuentroTexto}>{product.location}</Text>
        </View>

        <View style={styles.descripcion}>
          <Text style={styles.descripcionTitulo}>Descripción</Text>
          <Text style={styles.descripcionTexto}>{product.description}</Text>
        </View>
      </View>

      {/* Botón */}
      <TouchableOpacity style={styles.solicitarButton} onPress={handleRequest}>
        <Text style={styles.solicitarButtonText}>SOLICITAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 15,
    alignItems: "center",
  },
  imageSection: {
    height: 250,
    backgroundColor: "#fff",
  },
  image: {
    width: 300,
    height: 250,
    resizeMode: "cover",
    marginRight: 10,
    borderRadius: 10,
  },
  infoSection: {
    padding: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  articuloTitulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  lugarEncuentro: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  encuentroTexto: {
    marginLeft: 10,
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
  },
  descripcion: {
    marginBottom: 20,
  },
  descripcionTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
  descripcionTexto: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  solicitarButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  solicitarButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginTop: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0100FE",
  },
});

export default DetalleProducto;
