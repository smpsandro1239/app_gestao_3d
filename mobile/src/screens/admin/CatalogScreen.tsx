import { Grid, List, Search, ShoppingCart } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { getImageUrl } from '../../services/api';
import { getProducts, Product } from '../../services/productsService';
import { COLORS } from '../../utils/theme';

const CatalogScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  const { width } = useWindowDimensions();
  const { formatPrice } = useSettings();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [search, sortBy, products]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let result = [...products];

    // Filter by search
    if (search) {
      result = result.filter(p =>
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        (p.descricao || '').toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'price-asc':
        result.sort((a, b) => a.preco - b.preco);
        break;
      case 'price-desc':
        result.sort((a, b) => b.preco - a.preco);
        break;
    }

    setFilteredProducts(result);
  };

  const isWide = width > 768;
  const numColumns = width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero Header */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Catálogo 3D</Text>
          <Text style={styles.heroSubtitle}>
            Explore nossa coleção de modelos impressos em 3D de alta qualidade
          </Text>
        </View>
      </View>

      {/* Search & Filters */}
      <View style={styles.controlsSection}>
        <View style={styles.controlsInner}>
          <View style={styles.searchBar}>
            <Search color={COLORS.slate400} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Procurar produtos..."
              placeholderTextColor={COLORS.slate400}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.controlsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
              <TouchableOpacity
                style={[styles.sortBtn, sortBy === 'name' && styles.sortBtnActive]}
                onPress={() => setSortBy('name')}
              >
                <Text style={[styles.sortBtnText, sortBy === 'name' && styles.sortBtnTextActive]}>
                  A-Z
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortBtn, sortBy === 'price-asc' && styles.sortBtnActive]}
                onPress={() => setSortBy('price-asc')}
              >
                <Text style={[styles.sortBtnText, sortBy === 'price-asc' && styles.sortBtnTextActive]}>
                  Preço ↑
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortBtn, sortBy === 'price-desc' && styles.sortBtnActive]}
                onPress={() => setSortBy('price-desc')}
              >
                <Text style={[styles.sortBtnText, sortBy === 'price-desc' && styles.sortBtnTextActive]}>
                  Preço ↓
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive]}
                onPress={() => setViewMode('grid')}
              >
                <Grid color={viewMode === 'grid' ? COLORS.primary : COLORS.slate400} size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
                onPress={() => setViewMode('list')}
              >
                <List color={viewMode === 'list' ? COLORS.primary : COLORS.slate400} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Products Grid/List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={viewMode === 'grid' ? numColumns : 1}
        key={viewMode + numColumns}
        contentContainerStyle={styles.productsContainer}
        renderItem={({ item }) =>
          viewMode === 'grid' ? (
            <ProductGridCard
              product={item}
              formatPrice={formatPrice}
              onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
              width={isWide ? (width - 60) / numColumns : (width - 40) / numColumns}
            />
          ) : (
            <ProductListCard
              product={item}
              formatPrice={formatPrice}
              onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
            />
          )
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const ProductGridCard = ({ product, formatPrice, onPress, width }: any) => (
  <TouchableOpacity style={[styles.gridCard, { width }]} onPress={onPress}>
    <View style={styles.gridImageContainer}>
      <Image
        source={{ uri: getImageUrl(product.imagens?.[0]) }}
        style={styles.gridImage}
        resizeMode="cover"
      />
      {product.stockQuantity === 0 && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockText}>Sob Encomenda</Text>
        </View>
      )}
    </View>
    <View style={styles.gridContent}>
      <Text style={styles.gridTitle} numberOfLines={2}>{product.nome}</Text>
      <View style={styles.gridFooter}>
        <Text style={styles.gridPrice}>{formatPrice(product.preco)}</Text>
        <View style={styles.cartIconCircle}>
          <ShoppingCart color={COLORS.primary} size={16} />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const ProductListCard = ({ product, formatPrice, onPress }: any) => (
  <TouchableOpacity style={styles.listCard} onPress={onPress}>
    <Image
      source={{ uri: getImageUrl(product.imagens?.[0]) }}
      style={styles.listImage}
      resizeMode="cover"
    />
    <View style={styles.listContent}>
      <Text style={styles.listTitle}>{product.nome}</Text>
      <Text style={styles.listDescription} numberOfLines={2}>
        {product.descricao || 'Produto impresso em 3D de alta qualidade'}
      </Text>
      <View style={styles.listFooter}>
        <Text style={styles.listPrice}>{formatPrice(product.preco)}</Text>
        {product.stockQuantity > 0 ? (
          <Text style={styles.listStock}>Em Stock: {product.stockQuantity}</Text>
        ) : (
          <Text style={styles.listOutOfStock}>Sob Encomenda</Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
  },
  heroSection: {
    backgroundColor: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentGold})`,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  controlsSection: {
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  controlsInner: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#FFF',
    fontSize: 15,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortScroll: {
    flex: 1,
    marginRight: 15,
  },
  sortBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 8,
  },
  sortBtnActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  sortBtnText: {
    color: COLORS.slate400,
    fontSize: 13,
    fontWeight: '600',
  },
  sortBtnTextActive: {
    color: COLORS.primary,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
  },
  viewBtn: {
    padding: 10,
  },
  viewBtnActive: {
    backgroundColor: COLORS.primary + '20',
  },
  productsContainer: {
    padding: 20,
    paddingBottom: 100,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  // Grid Card Styles
  gridCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 15,
    marginRight: 15,
    overflow: 'hidden',
  },
  gridImageContainer: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: COLORS.slate800,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  outOfStockText: {
    color: COLORS.accentGold,
    fontSize: 11,
    fontWeight: 'bold',
  },
  gridContent: {
    padding: 15,
  },
  gridTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    minHeight: 40,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridPrice: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // List Card Styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 15,
    overflow: 'hidden',
  },
  listImage: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.slate800,
  },
  listContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  listTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listDescription: {
    color: COLORS.slate400,
    fontSize: 13,
    lineHeight: 18,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  listPrice: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  listStock: {
    color: COLORS.accentLime,
    fontSize: 12,
    fontWeight: '600',
  },
  listOutOfStock: {
    color: COLORS.accentGold,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.slate500,
    fontSize: 16,
  },
});

export default CatalogScreen;
