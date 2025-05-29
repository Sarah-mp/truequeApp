import React, { useState, useEffect, ReactNode } from "react";
import {
  View,
  TextInput as RNTextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { NotificationService } from "@/domain/servicios/NotificationService";

const windowWidth = Dimensions.get("window").width;

type Product = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  quantity: number;
  images: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  ownerName: string;
};

type ProductCardProps = {
  item: Product;
  onPress: () => void;
  onLikePress: (item: Product, liked: boolean) => Promise<void>;
};

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onPress,
  onLikePress,
}) => {
  const image = item.images?.[0];
  const [liked, setLiked] = useState(false);
  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    await onLikePress(item, next);
  };

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      {image ? (
        <Image source={{ uri: image }} style={styles.productImage} />
      ) : (
        <View
          style={[
            styles.productImage,
            {
              backgroundColor: "#eee",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ color: "#aaa" }}>Sin imagen</Text>
        </View>
      )}

      <View style={styles.productDetails}>
        <Text style={styles.productType}>
          {item.category || "Sin categoría"}
        </Text>
        <Text
          style={styles.productTitle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>

        <View style={styles.userDetails}>
          <MaterialCommunityIcons
            name="account-circle"
            size={16}
            color="#666"
          />
          <Text style={styles.userName}>{item.ownerName}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
        <MaterialCommunityIcons
          name={liked ? "heart" : "heart-outline"}
          color={liked ? "#e91e63" : "#007bff"}
          size={24}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const DashboardScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputText, setInputText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(
      collection(db, "notificaciones"),
      where("toUserId", "==", user.uid),
      where("isRead", "==", false)
    );
    const unsub = onSnapshot(q, (snap) => {
      setUnreadCount(snap.size);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const usersSnap = await getDocs(collection(db, "Usuario"));
      const userMap: Record<string, string> = {};
      usersSnap.docs.forEach((d) => {
        const data = d.data() as any;
        userMap[d.id] = data.fullName ?? "Anónimo";
      });

      const prodSnap = await getDocs(collection(db, "productos"));

      const prods: Product[] = prodSnap.docs.map((doc) => {
        const d = doc.data() as any;
        return {
          id: doc.id,
          title: d.title,
          description: d.description,
          location: d.location,
          category: d.category,
          quantity: d.quantity,
          images: d.images || [],
          ownerId: d.ownerId,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          isActive: d.isActive,

          ownerName: userMap[d.ownerId] || "Anónimo",
        };
      });

      setProducts(prods);

      const cats = Array.from(
        new Set(prods.map((p) => p.category).filter(Boolean))
      );
      setCategories(["Todo", ...cats]);
    };

    fetchAll();
  }, []);

  const visible = products.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    // Si hay término de búsqueda, ignoramos categoría y filtramos por término
    if (term) {
      const title = (p.title ?? "").toLowerCase();
      const owner = (p.ownerName ?? "").toLowerCase();
      const category = (p.category ?? "").toLowerCase();
      return (
        title.includes(term) || owner.includes(term) || category.includes(term)
      );
    }
    // Si no hay búsqueda, filtramos por categoría
    return selectedCategory === "Todo" || p.category === selectedCategory;
  });

  const handleSearch = () => {
    setSearchTerm(inputText);
    Keyboard.dismiss();
  };

  const handleCategoryPress = (cat: string) => {
    setSelectedCategory(cat);

    setSearchTerm("");
    setInputText("");
  };

  const handleLike = async (product: Product, liked: boolean) => {
    const current = auth.currentUser;
    if (!current) return;

    if (liked) {
      // CREAR notificación
      await NotificationService.registerNotification({
        toUserId: product.ownerId,
        fromUserId: current.uid,
        fromUserName: current.displayName || "",
        productId: product.id,
        productTitle: product.title,
        type: "like",
        createdAt: new Date(),
        isRead: false,
      });
    } else {
      // Buscamos el doc con esos campos
      const q = query(
        collection(db, "notificaciones"),
        where("toUserId", "==", product.ownerId),
        where("fromUserId", "==", current.uid),
        where("productId", "==", product.id),
        where("type", "==", "like")
      );
      const snap = await getDocs(q);
      // Borramos todos los docs que coincidan (normalmente 1)
      await Promise.all(
        snap.docs.map((docSnap) =>
          deleteDoc(doc(db, "notificaciones", docSnap.id))
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.appName}>TrueQ U</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="menu" size={30} color="#153dda" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.navigate("/notifications")}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={30}
              color="#153dda"
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <RNTextInput
          placeholder="Buscar"
          style={styles.searchInput}
          value={inputText}
          onChangeText={setInputText}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <MaterialCommunityIcons name="magnify" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              selectedCategory === cat && styles.activeFilter,
            ]}
            onPress={() => handleCategoryPress(cat)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === cat && styles.activeFilter,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={visible}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => router.push(`/detalle?productId=${item.id}`)}
            onLikePress={handleLike}
          />
        )}
        contentContainerStyle={styles.productsContainer}
      />

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => router.push("/productos")}
        >
          <MaterialCommunityIcons name="home" size={24} color="#fff" />
          <Text style={styles.navBarText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem}>
          <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
          <Text style={styles.navBarText}>Explora</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => router.push("/registroproducto")}
        >
          <MaterialCommunityIcons name="plus-circle" size={24} color="#fff" />
          <Text style={styles.navBarText}>Agregar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => router.push("/profile")}
        >
          <MaterialCommunityIcons name="account" size={24} color="#fff" />
          <Text style={styles.navBarText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#153dda",
    flex: 1,
    textAlign: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 25,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#153dda",
    color: "white",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productsContainer: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20, // Espacio lateral para evitar que las tarjetas toquen los bordes
  },
  productCard: {
    width: windowWidth / 3 - 10, // Ancho dinámico basado en el ancho de la pantalla
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 5, // Espacio entre las tarjetas
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  productDetails: {
    padding: 10,
  },
  productType: {
    fontSize: 14,
    color: "#666",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flexWrap: "wrap", //
    overflow: "hidden", //
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  userName: {
    fontSize: 14,
    color: "#666",
  },
  likeButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 5,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#153dda",
    paddingVertical: 10,
  },
  navBarItem: {
    alignItems: "center",
  },
  navBarText: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#e91e63',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
function setSelectedCategory(cat: string) {
  throw new Error("Function not implemented.");
}

function setSearchTerm(arg0: string) {
  throw new Error("Function not implemented.");
}
