import { useFocusEffect, useRouter } from "expo-router";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Dropdown from "react-native-paper-dropdown";
import {
  View,
  TextInput as RNTextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { FirebaseProductAdapter } from "@/infraestructure/adapters/FirebaseProduct";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput as PaperInput, Menu } from "react-native-paper";
import { ProductService } from "@/domain/servicios/ProductService";
import { FirebaseCategoryAdapter } from "@/infraestructure/adapters/FirebaseCategoria";
import type { Category } from "@/domain/entities/Categoria";
import { Product } from "@/domain/entities/Product";
import { FirebaseAuthAdapter } from "@/infraestructure/adapters/FirebaseAuthAdapter";
import * as ImagePicker from "expo-image-picker";

type CustomInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  rightIcon?: string;
};

// Componente de input
const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  secureTextEntry = false,
  rightIcon,
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.textInputWrapper}>
        <RNTextInput
          placeholder={placeholder}
          style={styles.textInput}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
        {rightIcon && (
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{rightIcon}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Pantalla principal
const AddProductScreen: React.FC = () => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [isCustomQuantity, setIsCustomQuantity] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const adapter = new FirebaseCategoryAdapter();
      const cats = await adapter.list();
      setCategories(cats);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setQuantity(1);
      setImages([]);

      const fetchUser = async () => {
        const authService = new FirebaseAuthAdapter();
        const user = await authService.getCurrentUser();
        if (user) setUserId(user.id);
      };
      fetchUser();

      return () => {
        setUserId("");
      };
    }, [])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se necesitan permisos para acceder a las imágenes.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset) => asset.uri);
      if (images.length + uris.length > 10) {
        alert("Solo puedes seleccionar hasta 10 imágenes");
        return;
      }
      setImages([...images, ...uris]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Agrega un producto o servicio</Text>
      </View>


      <View style={styles.imageUploadSection}>
        <TouchableOpacity style={styles.imageDropArea} onPress={pickImage}>
          <Image
            source={{ uri: "https://example.com/photo-icon.png" }}
            style={styles.photoIcon}
          />
          <Text style={styles.imageHint}>Agrega hasta 10 imágenes</Text>
        </TouchableOpacity>

        {/* Mostrar previsualizaciones */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 10,
          }}
        >
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={{ width: 80, height: 80, borderRadius: 10 }}
            />
          ))}
        </View>
      </View>

      {/* Inputs */}
      <View style={styles.inputSection}>
        <CustomInput
          label="Título"
          placeholder="Ingrese un título para su producto o servicio"
          value={title}
          onChangeText={setTitle}
        />
        <CustomInput
          label="Descripción"
          placeholder="Ingrese una descripción del producto"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Cantidad</Text>
        <View style={styles.quantitySelector}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.quantityButton,
                quantity === num &&
                  !isCustomQuantity &&
                  styles.selectedQuantityButton,
              ]}
              onPress={() => {
                setQuantity(num);
                setIsCustomQuantity(false);
              }}
            >
              <Text style={styles.quantityButtonText}>{num}</Text>
            </TouchableOpacity>
          ))}

          {/* Botón "Otro" para activar el campo manual */}
          <TouchableOpacity
            style={[
              styles.quantityButton,
              isCustomQuantity && styles.selectedQuantityButton,
            ]}
            onPress={() => {
              setIsCustomQuantity(true);
              setQuantity(0);
            }}
          >
            <Text style={styles.quantityButtonText}>Otro</Text>
          </TouchableOpacity>

          {/* Campo personalizado solo editable si se seleccionó "Otro" */}
          <RNTextInput
            placeholder="¿Cuántos?"
            value={quantity.toString()}
            onChangeText={(text) => {
              if (text === "") {
                setQuantity(0);
              } else {
                const parsed = parseInt(text);
                if (!isNaN(parsed) && parsed >= 0) {
                  setQuantity(parsed);
                }
              }
            }}
            editable={isCustomQuantity}
            style={[
              styles.textInput,
              {
                backgroundColor: isCustomQuantity ? "#fff" : "#eee",
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 10,
                width: 100,
                height: 50,
                marginLeft: 10,
              },
            ]}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categoría</Text>

          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setCategoryMenuVisible(true)}>
                <PaperInput
                  placeholder="Selecciona una categoría"
                  mode="outlined"
                  value={category}
                  editable={false}
                  right={<PaperInput.Icon icon="menu-down" />}
                  pointerEvents="none"
                />
              </TouchableOpacity>
            }
          >
            {categories.map((c) => (
              <Menu.Item
                key={c.name}
                title={c.name}
                onPress={() => {
                  setCategory(c.name);
                  setCategoryMenuVisible(false);
                }}
              />
            ))}
          </Menu>
        </View>
        <CustomInput
          label="Lugar de encuentro"
          placeholder="Ingrese el lugar de encuentro"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* Botón Publicar */}
      <TouchableOpacity
        style={styles.publishButton}
        onPress={async () => {
          try {
            if (!userId) {
              alert("No se ha identificado el usuario");
              return;
            }

            const product: Product = {
              title,
              description,
              category,
              location,
              quantity,
              images: images,
              ownerId: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              isActive: true,
              ownerName: '',
            };

            const productService = new ProductService(
              new FirebaseProductAdapter()
            );

            await productService.registerProduct(product);

            alert("Producto registrado con éxito");
            router.push("/productos");
          } catch (error: any) {
            console.error("Error al registrar producto:", error);
            alert(
              "Ocurrió un error al registrar el producto. Inténtalo de nuevo."
            );
          }
        }}
      >
        <Text style={styles.buttonText}>PUBLICAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  backIcon: {
    fontSize: 24,
    color: "white",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0100FE",
  },
  imageUploadSection: {
    marginTop: 20,
    alignItems: "center",
  },
  imageDropArea: {
    width: 300,
    height: 150,
    borderWidth: 2,
    borderColor: "#153dda",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  photoIcon: {
    width: 80,
    height: 80,
  },
  imageHint: {
    fontSize: 16,
    color: "#153dda",
    marginTop: 10,
  },
  inputSection: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    height: 50,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 10,
  },
  icon: {
    fontSize: 20,
    color: "#153dda",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 5,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedQuantityButton: {
    backgroundColor: "#153dda",
  },
  quantityButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  publishButton: {
    backgroundColor: "#153dda",
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
  },
});

export default AddProductScreen;