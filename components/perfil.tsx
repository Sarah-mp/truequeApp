// components/perfil.tsx
import React, { useState, useEffect, useCallback } from "react";
import {View,Text,TextInput,Image,TouchableOpacity,StyleSheet,Alert,FlatList,Platform,} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {onAuthStateChanged,signOut,deleteUser,updateProfile,User,} from "firebase/auth";
import {collection,deleteDoc,doc,getDoc,getDocs,query,updateDoc,where,onSnapshot,} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL,} from "firebase/storage";
import { auth, db } from "@/config/firebase";
import { FirebaseLikeAdapter } from "@/infraestructure/adapters/FirebaseLikeAdapter";
import { LikeService }         from "@/domain/servicios/LikeService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";


export type Post = {
  image: string | undefined;
  id: string;
  title: string;
};

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [editingName, setEditingName] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [tempDesc, setTempDesc] = useState<string>("");
  const [editingDesc, setEditingDesc] = useState<boolean>(false);
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [postMenuVisible, setPostMenuVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>();

  // Refresca publicaciones
  const fetchPosts = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const q = query(
      collection(db, "productos"),
      where("ownerId", "==", currentUser.uid)
    );
    const snap = await getDocs(q);
    setPosts(
      snap.docs.map((d) => ({
        id: d.id,
        title: (d.data() as any).title,
        image: (d.data() as any).images?.[0],
      }))
    );
  }, []);

  // Carga inicial del perfil
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) return router.replace("/");
      setUser(currentUser);
      setAvatarUri(currentUser.photoURL || undefined);

      // --- Carga nombre y descripción ---
      const udoc = await getDoc(doc(db, "Usuario", currentUser.uid));
      if (udoc.exists()) {
        const d = udoc.data() as any;
        setFullName(d.fullName || currentUser.displayName || "Anónimo");
        setDescription(d.description || "");
        setTempDesc(d.description || "");
      } else {
        setFullName(currentUser.displayName || "Anónimo");
      }

      // --- CONTEO DE LIKES recibidos por TODOS sus productos ---
      const likeService = new LikeService(new FirebaseLikeAdapter());
      const count = await likeService.countLikesForUser(currentUser.uid);
      setLikeCount(count);

      // --- Carga posts ---
      await fetchPosts();
    });
    return () => unsub();
  }, [router, fetchPosts]);
  
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  // Función genérica de confirmación
  async function confirmAction(
    message: string,
    action: () => Promise<void>,
    afterNavigate?: () => void
  ) {
    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        await action();
        afterNavigate?.();
      }
    } else {
      Alert.alert(
        "Confirmar",
        message,
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí",
            style: "destructive",
            onPress: async () => {
              await action();
              afterNavigate?.();
            },
          },
        ],
        { cancelable: true }
      );
    }
  }

  // Handlers de menú
  const handleSignOut = () =>
    confirmAction("¿Cerrar sesión?", async () => {
      await signOut(auth);
    }, () => {
      router.replace("/");
    });

  const handleDeleteAccount = () =>
    confirmAction("¿Eliminar tu cuenta?", async () => {
      if (user) await deleteUser(user);
    }, () => {
      router.replace("/");
    });

  const handleHelp = () => router.push("/");

  const saveName = async () => {
    if (!user) return;
    await updateProfile(user, { displayName: fullName });
    await updateDoc(doc(db, "Usuario", user.uid), { fullName });
    setEditingName(false);
  };

  const saveDescription = async () => {
    if (!user) return;
    await updateDoc(doc(db, "Usuario", user.uid), { description: tempDesc });
    setDescription(tempDesc);
    setEditingDesc(false);
  };

  const pickAvatar = async () => {
    if (!user) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tus fotos.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    const uri = (res as any).assets?.[0]?.uri || (res as any).uri;
    if (!uri) return;
    const storage = getStorage();
    const ref = storageRef(storage, `avatars/${user.uid}`);
    const blob = await (await fetch(uri)).blob();
    await uploadBytes(ref, blob);
    const url = await getDownloadURL(ref);
    await updateProfile(user, { photoURL: url });
    await updateDoc(doc(db, "Usuario", user.uid), { photoURL: url });
    setAvatarUri(url);
  };

  const removePost = async (id: string) => {
    await deleteDoc(doc(db, "productos", id));
    setPosts((ps) => ps.filter((p) => p.id !== id));
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <MaterialCommunityIcons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={handleSignOut} title="Cerrar sesión" />
          <Menu.Item onPress={handleDeleteAccount} title="Eliminar cuenta" />
          <Divider />
          <Menu.Item onPress={handleHelp} title="Necesitas ayuda" />
        </Menu>
      </View>

      {/* Profile row */}
      <View style={styles.profileRow}>
        <TouchableOpacity onPress={pickAvatar} style={styles.avatarTouchable}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={styles.changeTxt}>Cambiar foto</Text>
        </TouchableOpacity>
        <View style={styles.infoCol}>
          {editingName ? (
            <TextInput
              style={styles.nameInput}
              value={fullName}
              onChangeText={setFullName}
              onBlur={saveName}
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Text style={styles.nameTxt}>{fullName}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.since}>
          En TrueQ U desde {new Date(user.metadata.creationTime!).toLocaleDateString()}
          </Text>
          <View style={styles.likesRow}>
            <MaterialCommunityIcons name="heart" size={20} color="red"/>
            <Text style={styles.likesTxt}>{likeCount} likes recibidos</Text>
          </View>
        </View>
      </View>

      {/* Descripción */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <TouchableOpacity onPress={() => setEditingDesc(true)}>
            <MaterialCommunityIcons name="pencil" size={20} color="#153dda" />
          </TouchableOpacity>
        </View>
        {editingDesc ? (
          <>
            <TextInput
              style={styles.textArea}
              value={tempDesc}
              onChangeText={setTempDesc}
              multiline
            />
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={saveDescription}
            >
              <Text style={styles.saveTxt}>Guardar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.sectionText}>
            {description || "Sin descripción."}
          </Text>
        )}
      </View>

      {/* Mis publicaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis publicaciones</Text>
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.postImage} />
              )}
              <Text style={styles.postTitle}>{item.title}</Text>
              <Menu
                visible={postMenuVisible && selectedPostId === item.id}
                onDismiss={() => setPostMenuVisible(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedPostId(item.id);
                      setPostMenuVisible(true);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="dots-vertical"
                      size={24}
                      color="#666"
                    />
                  </TouchableOpacity>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setPostMenuVisible(false);
                    router.push({
                      pathname: "/editar",
                      params: { productId: item.id },
                    });
                  }}
                  title="Editar"
                />
                <Menu.Item
                  onPress={() =>
                    confirmAction(
                      "¿Eliminar esta publicación?",
                      async () => await removePost(item.id)
                    )
                  }
                  title="Eliminar"
                />
              </Menu>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Sin publicaciones</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: '#153dda'
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileRow: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  avatarTouchable: { marginRight: 16, alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#ddd" },
  changeTxt: { fontSize: 12, color: "#007bff", marginTop: 4 },
  infoCol: { flex: 1 },
  nameTxt: { fontSize: 20, fontWeight: "bold", color: "#153dda" },
  nameInput: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#153dda",
    borderBottomWidth: 1,
    borderColor: "#153dda",
    width: 200,
  },
  email: { fontSize: 14, color: "#003366" },
  since: { fontSize: 12, color: "#003366", marginBottom: 8 },
  likesRow: { flexDirection: "row", alignItems: "center" },
  likesTxt: { marginLeft: 4, color: "#333" },
  section: { padding: 16, backgroundColor: "#fff", marginTop: 8 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#153dda" },
  sectionText: { marginTop: 8, fontSize: 14, color: "#333" },
  textArea: {
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    padding: 8,
    minHeight: 60,
  },
  saveBtn: {
    marginTop: 8,
    backgroundColor: "#153dda",
    padding: 10,
    borderRadius: 4,
  },
  saveTxt: { color: "#fff", textAlign: "center" },
  postCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  postImage: { width: 50, height: 50, borderRadius: 4, marginRight: 12 },
  postTitle: { flex: 1, fontSize: 14, color: "#333" },
  empty: { textAlign: "center", color: "#666" },
});
