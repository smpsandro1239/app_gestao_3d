import {
    ChevronRight,
    CircleDollarSign,
    ClipboardList,
    Copy,
    Eye,
    Layers,
    LogOut,
    MoreVertical,
    Search,
    Trash2,
    Users,
    Zap
} from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { COLORS } from '../../utils/theme';

import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { getOrders } from '../../services/orderService';
import { getPrinters, Printer } from '../../services/printerService';
import { DashboardStats, getDashboardStats } from '../../services/reportService';

const DashboardScreen = ({ navigation }: any) => {
  const { signOut } = useAuth();
  const { formatPrice } = useSettings();
  const { width } = useWindowDimensions();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [printers, setPrinters] = React.useState<Printer[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState<number | null>(null);

  React.useEffect(() => {
    loadData();
    const unsubscribe = navigation?.addListener('focus', () => {
      loadData();
    });

    const interval = setInterval(loadData, 30000);
    return () => {
        unsubscribe?.();
        clearInterval(interval);
    };
  }, [navigation]);

  const loadData = async () => {
    try {
      const [dashboardStats, orders, printersData] = await Promise.all([
          getDashboardStats(),
          getOrders(),
          getPrinters()
      ]);
      setStats(dashboardStats);
      setRecentOrders(orders.slice(0, 3));
      setPrinters(printersData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
      setRefreshing(true);
      await loadData();
      setRefreshing(false);
  };

  const handleLogout = () => {
      Alert.alert(
          'Sair',
          'Tem a certeza que deseja terminar sessão?',
          [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', style: 'destructive', onPress: signOut }
          ]
      );
  };

  const handleDeleteOrder = async (orderId: number) => {
    Alert.alert(
      'Eliminar Encomenda',
      'Tem a certeza que deseja eliminar esta encomenda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { deleteOrder } = require('../../services/orderService');
              await deleteOrder(orderId);
              loadData();
              Alert.alert('Sucesso', 'Encomenda eliminada!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível eliminar a encomenda.');
            }
          }
        }
      ]
    );
  };

  const activePrintsCount = printers.filter(p => p.status === 'PRINTING').length;

  // Responsive calculations
  const isWide = width > 768;
  const kpiWidth = isWide ? (width - 60) / 2 : width - 40;
  const printerCardWidth = isWide ? (width - 80) / 3 : (width - 60) / 2;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.greeting}>Bem-vindo,</Text>
            <Text style={styles.username}>Administrador</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search color={COLORS.textDark} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Clients')}>
              <Users color={COLORS.textDark} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
              <LogOut color={COLORS.textDark} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtn}>
               {/* Profile Image or Initials */}
               <View style={{width: 35, height: 35, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center'}}>
                   <Text style={{color: 'white', fontWeight: 'bold'}}>A</Text>
               </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* KPI Section */}
        <View style={[styles.kpiGrid, isWide && { flexDirection: 'row', flexWrap: 'wrap' }]}>
          <View style={[styles.kpiCard, { width: isWide ? (width - 60) / 2 : '100%' }]}>
            <View style={styles.kpiHeader}>
              <CircleDollarSign color={COLORS.primary} size={20} />
              {/* Trend hardcoded for now, implies calculation from previous month */}
              <Text style={styles.trendText}>+12%</Text>
            </View>
            <Text style={styles.kpiLabel}>Receita Mensal</Text>
            <Text style={styles.kpiValue}>
              {stats?.monthlyRevenue ? formatPrice(stats.monthlyRevenue) : formatPrice(0)}
            </Text>
          </View>

          <View style={[styles.kpiCard, { width: isWide ? (width - 60) / 2 : '100%', marginTop: isWide ? 0 : 12 }]}>
            <View style={styles.kpiHeader}>
              <ClipboardList color={COLORS.primary} size={20} />
            </View>
            <Text style={styles.kpiLabel}>Encomendas Ativas</Text>
            <Text style={styles.kpiValue}>{stats?.activeOrders || 0}</Text>
          </View>
        </View>

        <View style={styles.activePrintBar}>
          <View style={styles.activePrintInfo}>
            <View style={styles.activePrintIcon}>
              <Layers color="#FFF" size={18} />
            </View>
            <View>
              <Text style={styles.activePrintCount}>{activePrintsCount}</Text>
              <Text style={styles.activePrintLabel}>IMPRESSÕES ATIVAS AGORA</Text>
            </View>
          </View>
          <Zap color={COLORS.primary} size={20} />
        </View>

        {/* Live Status Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.liveDot} />
            <Text style={styles.sectionTitle}>Estado em Tempo Real</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.allPrintersLabel}>TODAS AS IMPRESSORAS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.printerGrid}>
          {printers.map((p) => (
            <PrinterCard
              key={p.id}
              width={printerCardWidth}
              name={p.model || 'Impressora'}
              job={p.status === 'PRINTING' ? (p.currentJobName || 'Imprimindo...') : p.status}
              progress={p.progress || 0}
            />
          ))}
          {printers.length === 0 && (
             <Text style={{color: COLORS.slate500, fontStyle: 'italic', width: '100%', textAlign: 'center'}}>Nenhuma impressora conectada.</Text>
          )}
        </View>

        {/* Recent Orders Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Encomendas Recentes</Text>
          <ChevronRight color={COLORS.slate400} size={20} />
        </View>

        <View style={styles.ordersList}>
          {recentOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              initials={order.cliente?.nome ? order.cliente.nome.substring(0, 2).toUpperCase() : 'CLI'}
              name={order.cliente?.nome || 'Cliente Desconhecido'}
              id={`#ORD-${order.id}`}
              status={order.status}
              price={formatPrice(Number(order.total))}
              statusColor={
                order.status === 'FINALIZADO' ? COLORS.accentLime :
                order.status === 'CANCELADO' ? COLORS.slate500 :
                COLORS.primary
              }
              menuVisible={menuVisible === order.id}
              onToggleMenu={() => setMenuVisible(menuVisible === order.id ? null : order.id)}
              onView={() => navigation.navigate('OrderDetails', { id: order.id })}
              onCopy={() => navigation.navigate('CreateOrder', { copyOrderId: order.id })}
              onDelete={() => handleDeleteOrder(order.id)}
            />
          ))}
          {recentOrders.length === 0 && (
             <Text style={{color: COLORS.slate500, fontStyle: 'italic'}}>Nenhuma encomenda recente.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PrinterCard = ({ name, job, progress, width }: any) => (
  <View style={[styles.printerCard, { width }]}>
    <View style={styles.progressCircle}>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
    <Text style={styles.printerName} numberOfLines={1}>{name}</Text>
    <Text style={styles.printerJob} numberOfLines={1}>{job}</Text>
  </View>
);

const OrderCard = ({ order, initials, name, id, status, price, statusColor, menuVisible, onToggleMenu, onView, onCopy, onDelete }: any) => (
  <TouchableOpacity style={styles.orderCard} onPress={onView}>
    <View style={styles.orderLeft}>
      <View style={styles.initialsBox}>
        <Text style={styles.initialsText}>{initials}</Text>
      </View>
      <View>
        <Text style={styles.orderName}>{name}</Text>
        <Text style={styles.orderId}>{id}</Text>
      </View>
    </View>
    <View style={styles.orderRight}>
      <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
      </View>
      <Text style={styles.orderPrice}>{price}</Text>
      <View>
        <TouchableOpacity style={styles.orderMenuBtn} onPress={(e) => { e.stopPropagation(); onToggleMenu(); }}>
          <MoreVertical color={COLORS.slate400} size={18} />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.orderMenuDropdown}>
            <TouchableOpacity style={styles.orderMenuItem} onPress={(e) => { e.stopPropagation(); onView(); onToggleMenu(); }}>
              <Eye color={COLORS.primary} size={16} />
              <Text style={styles.orderMenuText}>Ver Detalhes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderMenuItem} onPress={(e) => { e.stopPropagation(); onCopy(); onToggleMenu(); }}>
              <Copy color={COLORS.accentGold} size={16} />
              <Text style={styles.orderMenuText}>Copiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.orderMenuItem, { borderBottomWidth: 0 }]} onPress={(e) => { e.stopPropagation(); onDelete(); onToggleMenu(); }}>
              <Trash2 color="#FF4444" size={16} />
              <Text style={[styles.orderMenuText, { color: '#FF4444' }]}>Eliminar</Text>
            </TouchableOpacity>
          </View>
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
  greeting: {
    color: COLORS.slate500,
    fontSize: 12,
    fontWeight: '500',
  },
  username: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBtn: {
    padding: 5,
  },
  profileBtn: {
    marginLeft: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  kpiCard: {
    backgroundColor: COLORS.cardDark,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendText: {
    color: COLORS.accentLime,
    fontSize: 10,
    fontWeight: 'bold',
  },
  kpiLabel: {
    color: COLORS.slate500,
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
  },
  kpiValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  activePrintBar: {
    backgroundColor: COLORS.primary + '10',
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  activePrintInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activePrintIcon: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 8,
  },
  activePrintCount: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  activePrintLabel: {
    color: COLORS.slate500,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  allPrintersLabel: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  printerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 25,
  },
  printerCard: {
    backgroundColor: COLORS.cardDark,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    marginBottom: 12,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  printerName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  printerJob: {
    color: COLORS.slate500,
    fontSize: 10,
  },
  ordersList: {
    gap: 12,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  initialsBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.slate800,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  orderName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderId: {
    color: COLORS.slate500,
    fontSize: 10,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  orderPrice: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
