import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

// Obtener el ancho de la pantalla
const windowWidth = Dimensions.get('window').width;

// Componente para las tarjetas de productos/servicios
const ProductCard = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productType}>{item.type}</Text>
        <Text style={styles.productTitle} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <View style={styles.userDetails}>
          <Image
            source={{ uri: item.user.avatar }}
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>{item.user.name}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.likeButton}>
        <MaterialCommunityIcons name="heart" size={24} color="#007bff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const LikedProductsScreen = () => {
  const likedProducts = [
    {
      id: 1,
      title: 'Esto te va a doler: diario de un año loco',
      type: 'Libro',
      user: { name: 'Mariana', avatar: 'https://media.glamour.mx/photos/6723fc5b8852b44eefcc3538/16:9/w_2560%2Cc_limit/como-ser-una-mujer-segura-de-si-misma-demuestra-amor-propio.jpg ' },
      image: 'https://m.media-amazon.com/images/I/51667x5uY+L._AC_UF1000,1000_QL80_.jpg  ',
    },
    {
      id: 2,
      title: 'Fonendoscopio',
      type: 'Herramienta',
      user: { name: 'Juan Camilo', avatar: 'https://media.istockphoto.com/id/1200677760/es/foto/retrato-de-apuesto-joven-sonriente-con-los-brazos-cruzados.jpg?s=612x612&w=0&k=20&c=RhKR8pxX3y_YVe5CjrRnTcNFEGDryD2FVOcUT_w3m4w= ' },
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAwLeL6R2DdHbTfTTyP3JCVfgRl7qJRO2XZw&s ',
    },
    {
      id: 3,
      title: 'Clase. Bases del HTML',
      type: 'Servicio',
      user: { name: 'Alex', avatar: 'https://fotografias.antena3.com/clipping/cmsimages01/2021/05/02/26E03450-C5FB-4D16-BC9B-B282AE784352/57.jpg?crop=1868,1080,x52,y0&width=1280&height=740&optimize=low&format=webply' },
      image: 'https://cdn2.hubspot.net/hub/53/hubfs/como-hacer-una-pagina-web-en-html.jpg?width=595&name=como-hacer-una-pagina-web-en-html.jpg',
    },
    {
      id: 4,
      title: 'Diseño de logo',
      type: 'Servicio',
      user: { name: 'Laura', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmCfrDHAps3hamCP6CGJAYnDEI9QGwUb-vuQ&s' },
      image: 'https://www.safecreative.org/blog/es/wp-content/uploads/2023/02/derechos-de-autor-en-diseno-grafico.jpg',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
      <Link href="/productos">
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        </Link>
       
      </View>
      <View>
      <Text style={styles.title}>Los productos que me gustan</Text>
      </View>

      {/* Tarjetas de Productos */}
      <FlatList
        data={likedProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard item={item} />
        )}
        contentContainerStyle={styles.productsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#153dda', // Azul oscuro
  },
  backButton: {
    marginRight: 20,
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    flex: 1,
    textAlign: 'center',
    padding: 20,
  },
  productsContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20, // Espacio lateral para evitar que las tarjetas toquen los bordes
  },
  productCard: {
    width: (windowWidth / 2) - 20, // Ancho dinámico basado en el ancho de la pantalla
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 5, // Espacio entre las tarjetas
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productDetails: {
    padding: 10,
  },
  productType: {
    fontSize: 14,
    color: '#666',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap', // Limita el texto a 2 líneas
    overflow: 'hidden', // Agrega "..." si el texto es demasiado largo
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#666',
  },
  likeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    padding: 5,
  },
});

export default LikedProductsScreen;