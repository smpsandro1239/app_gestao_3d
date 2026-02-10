import {
    Bell,
    Box,
    Clock,
    Cpu,
    Plus,
    Search,
    User,
    UserCircle
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
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
import { COLORS } from '../../utils/theme';

import { RefreshControl } from 'react-native';
import { getOrders, Order } from '../../services/orderService';

const OrdersPage = ({ navigation }: any) => {
  const [filter, setFilter] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const { width } = useWindowDimensions();

  const filters = [
    { id: 'All', label: 'Todos' },
    { id: 'RECEBIDO', label: 'Recebidos' },
    { id: 'EM_PRODUCAO', label: 'Produção' },
    { id: 'FINALIZADO', label: 'Prontos' },
    { id: 'ENTREGUE', label: 'Entregues' },
  ];

  React.useEffect(() => {
    loadOrders();
    const unsubscribe = navigation.addListener('focus', () => {
      loadOrders();
    });
    return unsubscribe;
  }, [navigation]);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'All' || o.status === filter;
    const searchLower = search.toLowerCase();
    const matchesSearch = !search ||
      o.id.toString().includes(searchLower) ||
      (o.cliente?.nome || '').toLowerCase().includes(searchLower) ||
      (o.itens?.[0]?.produto?.nome || '').toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const isWide = width > 768;
  const numColumns = width > 1200 ? 3 : width > 768 ? 2 : 1;
  const cardWidth = isWide ? (1200 / numColumns) - 20 : '100%';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Area */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerInner}>
          <View style={styles.topBar}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <Cpu color={COLORS.primary} size={20} />
              </View>
              <Text style={styles.headerTitle}>Encomendas</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.topBtn}>
                <Bell color={COLORS.textDark} size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.topBtn}>
                <UserCircle color={COLORS.textDark} size={22} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search style={styles.searchIcon} color={COLORS.slate400} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Procurar encomendas, clientes..."
              placeholderTextColor={COLORS.slate400}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterChip, filter === f.id && styles.activeFilter]}
                onPress={() => setFilter(f.id)}
              >
                <Text style={[styles.filterLabel, filter === f.id && styles.activeFilterLabel]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={[styles.ordersGrid, isWide && { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 }]}>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              id={`#ORD-${order.id}`}
              title={order.itens?.[0]?.produto?.nome || 'Produto Personalizado'}
              client={order.cliente?.nome || 'Cliente'}
              material={order.itens?.[0]?.cor || 'N/A'}
              time={new Date(order.dataEntregaPrevista).toLocaleDateString()}
              progress={getStatusProgress(order.status)}
              status={order.status}
              statusColor={getStatusColor(order.status)}
              navigation={navigation}
              fullOrder={order}
              width={cardWidth}
            />
          ))}
        </View>
        {filteredOrders.length === 0 && (
          <Text style={{color: COLORS.slate500, textAlign: 'center', marginTop: 40}}>
            Nenhuma encomenda encontrada.
          </Text>
        )}
      </ScrollView>

      {/* FAB */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateOrder')}>
          <Plus color="#FFF" size={30} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Helper functions for status
const getStatusColor = (status: string) => {
  switch(status) {
    case 'RECEBIDO': return COLORS.slate400;
    case 'EM_PRODUCAO': return COLORS.primary;
    case 'FATIAMENTO': return COLORS.accentGold;
    case 'FINALIZADO': return COLORS.accentLime;
    case 'ENTREGUE': return '#3b82f6';
    default: return COLORS.slate500;
  }
};

const getStatusProgress = (status: string) => {
  switch(status) {
    case 'RECEBIDO': return 10;
    case 'FATIAMENTO': return 25;
    case 'EM_PRODUCAO': return 60;
    case 'FINALIZADO': return 100;
    case 'ENTREGUE': return 100;
    default: return 0;
  }
};

const OrderCard = ({ id, title, client, material, time, progress, status, statusColor, opacity = 1, navigation, width }: any) => (
  <TouchableOpacity
    style={[styles.orderCard, { opacity, width }]}
    onPress={() => navigation.navigate('OrderDetails', { id })}
  >
    <View style={styles.cardTop}>
      <View style={styles.cardHeader}>
        <View style={styles.cardMeta}>
          <Text style={styles.orderId}>{id}</Text>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={styles.progressLabel}>{progress}% Concluído</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15', borderColor: statusColor + '30' }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      <Text style={styles.orderTitle}>{title}</Text>

      <View style={styles.clientRow}>
        <User color={COLORS.slate400} size={14} />
        <Text style={styles.clientName}>{client}</Text>
      </View>
    </View>

    <View style={styles.cardDetails}>
      <View style={styles.detailItem}>
        <View style={styles.detailIconBox}>
          <Box color="#FFF" size={12} />
        </View>
        <View>
          <Text style={styles.detailLabel}>MATERIAL</Text>
          <Text style={styles.detailValue}>{material}</Text>
        </View>
      </View>

      <View style={styles.detailItem}>
        <View style={[styles.detailIconBox, { backgroundColor: COLORS.primary + '20' }]}>
          <Clock color={COLORS.primary} size={12} />
        </View>
        <View>
          <Text style={styles.detailLabel}>TEMPO EST.</Text>
          <Text style={styles.detailValue}>{time}</Text>
        </View>
      </View>
    </View>

    {progress > 0 && progress < 100 && (
      <View style={styles.progressLineBg}>
        <View style={[styles.progressLineFill, { width: `${progress}%` }]} />
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  stickyHeader: {
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    zIndex: 10,
  },
  headerInner: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    height: 48,
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    paddingLeft: 45,
    paddingRight: 15,
    color: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  filterScroll: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterLabel: {
    color: COLORS.slate400,
    fontSize: 13,
    fontWeight: '500',
  },
  activeFilterLabel: {
    color: '#FFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  ordersGrid: {
    width: '100%',
  },
  orderCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
    marginBottom: 15,
  },
  cardTop: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  progressLabel: {
    color: COLORS.slate400,
    fontSize: 11,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  orderTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clientName: {
    color: COLORS.slate400,
    fontSize: 12,
  },
  cardDetails: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark + '40',
    marginTop: 10,
    paddingTop: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.slate800,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    color: COLORS.slate500,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  progressLineBg: {
    height: 3,
    backgroundColor: COLORS.slate800,
  },
  progressLineFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'flex-end',
    pointerEvents: 'box-none',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    marginBottom: 70, // Adjust for tab bar
  },
});

export default OrdersPage;
