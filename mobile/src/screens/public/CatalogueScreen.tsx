import { DollarSign, Filter, Plus, RefreshCcw, Search, ShoppingCart } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { getImageUrl } from '../../services/api';
import { getProducts, Product } from '../../services/productsService';
import { COLORS } from '../../utils/theme';

const CatalogueScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { formatPrice, currency, setCurrency } = useSettings();
  const { width } = useWindowDimensions();

  // Dynamic columns for responsiveness
  const numColumns = width > 1000 ? 5 : width > 768 ? 4 : width > 480 ? 3 : 2;

  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
        const data = await getProducts();
        setProducts(data || []);
    } catch (e) {
        console.error('Erro ao carregar catalogo:', e);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const unsubscribe = navigation.addListener('focus', () => {
        fetchProducts();
    });
    return unsubscribe;
  }, [navigation, fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(true);
  };

  const toggleCurrency = () => {
    const currencies: any = ['€', '$', 'R$'];
    const nextIndex = (currencies.indexOf(currency) + 1) % currencies.length;
    setCurrency(currencies[nextIndex]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}>
      <Image
        source={{ uri: getImageUrl(item.imagens?.[0]) }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.nome}</Text>
        <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(item.preco)}</Text>
            {item.stockQuantity <= 0 && <Text style={styles.noStock}>Sob enc.</Text>}
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}>
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.title}>Catálogo 3D</Text>
            <Text style={styles.subtitle}>{products.length} itens disponíveis</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleCurrency} style={styles.iconBtn}>
               <DollarSign color={COLORS.accentGold} size={20} />
               <Text style={styles.currencyText}>{currency}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddProduct')} style={styles.iconBtn}>
               <Plus color={COLORS.primary} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <ShoppingCart color={COLORS.slate400} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.searchBar}>
        <View style={styles.searchInner}>
          <Search color={COLORS.slate400} size={18} style={{ marginRight: 10 }} />
          <Text style={styles.searchText}>Pesquisar produtos...</Text>
        </View>
        <Filter color={COLORS.slate400} size={20} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando catálogo...</Text>
        </View>
      ) : (
        <FlatList
          key={numColumns} // Force re-render when columns change
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <RefreshCcw color={COLORS.slate400} size={48} style={{ marginBottom: 15 }} />
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => fetchProducts()}>
                <Text style={styles.retryText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.slate500,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    padding: 4,
  },
  currencyText: {
    color: COLORS.accentGold,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 2,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    margin: 15,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    maxWidth: 1200,
    width: '94%',
    alignSelf: 'center',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    color: COLORS.slate400,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.slate400,
    marginTop: 10,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.slate400,
    fontSize: 16,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.cardDark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  retryText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.cardDark,
    margin: 8,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.slate800,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 6,
    height: 36,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  noStock: {
    fontSize: 9,
    color: '#EF4444',
    fontWeight: 'bold',
    backgroundColor: '#EF444420',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CatalogueScreen;
