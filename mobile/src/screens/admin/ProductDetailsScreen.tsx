import { ArrowRight, ChevronLeft, Clock, DollarSign, Edit, Package, ShoppingCart, Trash2, Weight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { getImageUrl } from '../../services/api';
import { getProduct, Product } from '../../services/productsService';
import { COLORS } from '../../utils/theme';

// Constants for estimation (should be in settings later)
const FILAMENT_COST_PER_KG = 20.0; // €
const ENERGY_COST_PER_HOUR = 0.05; // € (approx for 3D printer)

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useSettings();
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await getProduct(productId);
      setProduct(data);
    } catch (error) {
      Alert.alert('Erro', 'Produto não encontrado');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Produto',
      'Tem a certeza que deseja eliminar este produto? Esta ação não pode ser revertida.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { deleteProduct } = require('../../services/productsService');
              await deleteProduct(productId);
              Alert.alert('Sucesso', 'Produto eliminado com sucesso!');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Erro', 'Não foi possível eliminar o produto.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!product) return null;

  // Calculations
  const filamentCost = (product.pesoEstimado || 0) / 1000 * FILAMENT_COST_PER_KG;
  const energyCost = (product.tempoImpressao || 0) / 60 * ENERGY_COST_PER_HOUR;
  const totalCost = (product.custoProducao || 0) + filamentCost + energyCost;
  const profit = product.preco - totalCost;
  const margin = product.preco > 0 ? (profit / product.preco) * 100 : 0;

  const isWide = width > 768;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with Back Button */}
      <View style={styles.headerOverlay}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft color="#FFF" size={28} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionBtn} onPress={() => navigation.navigate('AddProduct', { productId })}>
              <Edit color="#FFF" size={22} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionBtn} onPress={handleDelete}>
              <Trash2 color="#FF4444" size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
            {/* Image Hero */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: getImageUrl(product.imagens?.[0]) }}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{formatPrice(product.preco)}</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{product.nome}</Text>
                    <View style={[styles.stockBadge, { backgroundColor: product.stockQuantity > 0 ? COLORS.accentLime + '20' : COLORS.slate800 }]}>
                        <Text style={[styles.stockText, { color: product.stockQuantity > 0 ? COLORS.accentLime : COLORS.slate500 }]}>
                            {product.stockQuantity > 0 ? `${product.stockQuantity} em Stock` : 'Sem Stock (Sob Encomenda)'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.description}>{product.descricao || 'Sem descrição disponível.'}</Text>

                {/* Technical Specs */}
                <View style={[styles.specsGrid, isWide && { justifyContent: 'center' }]}>
                    <View style={styles.specCard}>
                        <Weight color={COLORS.primary} size={20} />
                        <Text style={styles.specLabel}>Peso</Text>
                        <Text style={styles.specValue}>{product.pesoEstimado || 0}g</Text>
                    </View>
                    <View style={styles.specCard}>
                        <Clock color={COLORS.primary} size={20} />
                        <Text style={styles.specLabel}>Tempo</Text>
                        <Text style={styles.specValue}>{product.tempoImpressao || 0}m</Text>
                    </View>
                    <View style={styles.specCard}>
                        <Package color={COLORS.primary} size={20} />
                        <Text style={styles.specLabel}>Material</Text>
                        <Text style={styles.specValue}>PLA</Text>
                    </View>
                </View>

                {/* Financials (Admin Only) */}
                <View style={styles.financialSection}>
                    <View style={styles.sectionHeader}>
                        <DollarSign color={COLORS.primary} size={18} />
                        <Text style={styles.sectionTitle}>Análise Financeira</Text>
                    </View>

                    <View style={styles.costBreakdown}>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>Custo Filamento (estimado)</Text>
                            <Text style={styles.costValue}>{formatPrice(filamentCost)}</Text>
                        </View>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>Custo Energia</Text>
                            <Text style={styles.costValue}>{formatPrice(energyCost)}</Text>
                        </View>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>Outros Custos</Text>
                            <Text style={styles.costValue}>{formatPrice(product.custoProducao || 0)}</Text>
                        </View>
                        <View style={[styles.costRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>CUSTO TOTAL</Text>
                            <Text style={styles.totalValue}>{formatPrice(totalCost)}</Text>
                        </View>
                    </View>

                    <View style={styles.profitCard}>
                        <View>
                            <Text style={styles.profitLabel}>Lucro Estimado / Unidade</Text>
                            <Text style={styles.profitValue}>{formatPrice(profit)}</Text>
                        </View>
                        <View style={styles.marginBadge}>
                            <Text style={styles.marginText}>{margin.toFixed(0)}% Margem</Text>
                        </View>
                    </View>
                </View>

            </View>
        </View>
      </ScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
          <View style={styles.footerInner}>
            <TouchableOpacity
                style={styles.orderBtn}
                onPress={() => navigation.navigate('CreateOrder', { preSelectedProductId: product.id })}
            >
                <ShoppingCart color="#FFF" size={20} />
                <Text style={styles.orderBtnText}>Criar Encomenda deste Item</Text>
                <ArrowRight color="#FFF" size={20} />
            </TouchableOpacity>
          </View>
      </View>
    </SafeAreaView>
  );
};

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
  headerOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerInner: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  contentWrapper: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
  },
  priceText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  contentContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: COLORS.backgroundDark,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  titleRow: {
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    color: COLORS.slate400,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  specsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  specCard: {
    flex: 1,
    backgroundColor: COLORS.cardDark,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 5,
  },
  specLabel: {
    color: COLORS.slate500,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  specValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  financialSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  costBreakdown: {
    gap: 8,
    marginBottom: 15,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingTop: 8,
    marginTop: 4,
  },
  costLabel: {
    color: COLORS.slate400,
    fontSize: 12,
  },
  costValue: {
    color: COLORS.slate200,
    fontSize: 12,
    fontWeight: '500',
  },
  totalLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profitCard: {
    backgroundColor: COLORS.cardDark,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  profitLabel: {
    color: COLORS.slate500,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profitValue: {
    color: COLORS.accentLime,
    fontSize: 20,
    fontWeight: 'bold',
  },
  marginBadge: {
    backgroundColor: COLORS.accentLime + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  marginText: {
    color: COLORS.accentLime,
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: COLORS.backgroundDark,
      borderTopWidth: 1,
      borderTopColor: COLORS.borderDark,
      alignItems: 'center',
  },
  footerInner: {
      maxWidth: 1000,
      width: '100%',
  },
  orderBtn: {
      backgroundColor: COLORS.primary,
      height: 56,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
  },
  orderBtnText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
  }
});

export default ProductDetailsScreen;
