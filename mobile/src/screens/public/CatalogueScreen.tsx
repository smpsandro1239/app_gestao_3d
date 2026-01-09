import { Filter, Search, ShoppingCart } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CatalogueScreen = ({ navigation }: any) => {
  // Mock data para demonstração enquanto a API não tem dados
  const [products, setProducts] = useState([
    { id: 1, nome: 'Miniatura Dragão 3D', preco: 25.90, imagem: 'https://via.placeholder.com/150' },
    { id: 2, nome: 'Vaso Geométrico', preco: 15.00, imagem: 'https://via.placeholder.com/150' },
    { id: 3, nome: 'Suporte Headset', preco: 12.50, imagem: 'https://via.placeholder.com/150' },
    { id: 4, nome: 'Chaveiro Personalizado', preco: 5.00, imagem: 'https://via.placeholder.com/150' },
  ]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.price}>{item.preco.toFixed(2)} €</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo 3D</Text>
        <View style={styles.headerIcons}>
          <Search color="#1A73E8" size={24} style={{ marginRight: 15 }} />
          <ShoppingCart color="#1A73E8" size={24} />
        </View>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchText}>Pesquisar produtos...</Text>
        <Filter color="#666" size={20} />
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEE',
    margin: 15,
    padding: 12,
    borderRadius: 10,
  },
  searchText: {
    color: '#666',
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    margin: 8,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1A73E8',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CatalogueScreen;
