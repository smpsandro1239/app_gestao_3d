import {
    Bookmark,
    Check,
    ChevronLeft,
    Copy,
    Cpu,
    Edit,
    MoreHorizontal,
    Receipt,
    Settings2,
    Timer,
    Trash2
} from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ImageBackground,
    Modal,
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

import { deleteOrder, getOrder, Order, updateOrderStatus } from '../../services/orderService';

const OrderDetailsScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const { width, height } = useWindowDimensions();

  const statuses = [
      'RECEBIDO', 'FATIAMENTO', 'EM_PRODUCAO', 'FINALIZADO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'
  ];

  const statusLabels: Record<string, string> = {
      'RECEBIDO': 'Recebido',
      'FATIAMENTO': 'Fatiamento',
      'EM_PRODUCAO': 'Em Produção',
      'FINALIZADO': 'Finalizado',
      'ENVIADO': 'Enviado',
      'ENTREGUE': 'Entregue',
      'CANCELADO': 'Cancelado'
  };

  React.useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id.replace('#ORD-', '').replace('#', '')) : id;
      const data = await getOrder(numericId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
      if (!order) return;
      try {
          await updateOrderStatus(order.id, newStatus);
          Alert.alert('Sucesso', 'Estado atualizado!');
          setModalVisible(false);
          loadOrderDetails();
      } catch (error) {
          Alert.alert('Erro', 'Não foi possível atualizar o estado.');
      }
  };

  const handleDelete = () => {
    if (!order) return;
    Alert.alert(
      'Eliminar Encomenda',
      'Tem a certeza que deseja eliminar permanentemente esta encomenda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteOrder(order.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível eliminar a encomenda.');
            }
          }
        }
      ]
    );
  };

  const handleCopy = () => {
    if (!order) return;
    setIsMenuVisible(false);
    // Navigate to CreateOrder with existing order data as pre-filled
    // We can pass the whole order or just pieces of it
    navigation.navigate('CreateOrder', { copyOrderId: order.id });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>Pedido não encontrado.</Text>
      </View>
    );
  }

  const isWide = width > 768;
  const contentWidth = isWide ? Math.min(width * 0.9, 1000) : width;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.headerInner}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
              <ChevronLeft color="#FFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Encomenda #{order.id}</Text>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setIsMenuVisible(!isMenuVisible)}>
              <MoreHorizontal color="#FFF" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.contentWrapper, { width: contentWidth }]}>
          {/* Quick Actions Bar (If Menu Visible) */}
          {isMenuVisible && (
            <View style={styles.quickMenu}>
              <TouchableOpacity style={styles.menuItem} onPress={handleCopy}>
                <Copy color="#FFF" size={18} />
                <Text style={styles.menuText}>Copiar / Duplicar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleDelete}>
                <Trash2 color="#FF4444" size={18} />
                <Text style={[styles.menuText, { color: '#FF4444' }]}>Eliminar Encomenda</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Banner Image & Status */}
          <View style={[styles.mainLayout, isWide && styles.wideLayout]}>
            <View style={[styles.imageSection, isWide && { flex: 1.2 }]}>
              <View style={styles.imageContainer}>
                <ImageBackground
                  source={{ uri: 'https://images.unsplash.com/photo-1631033256082-902ee146f8c7?q=80&w=1000&auto=format&fit=crop' }}
                  style={styles.mainImage}
                  imageStyle={{ borderRadius: 24 }}
                >
                  <View style={styles.imageOverlay}>
                    <View style={styles.floatingStatus}>
                      <View style={styles.pulseDot} />
                      <Text style={styles.statusText}>{statusLabels[order.status] || order.status}</Text>
                    </View>
                    <Text style={styles.modelName}>
                      {order.itens?.[0]?.produto?.nome || 'Produto Personalizado'}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            </View>

            <View style={[styles.statsSection, isWide && { flex: 1 }]}>
               {/* Real-time Progress */}
              <View style={styles.progressCard}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Progresso de Produção</Text>
                  <Text style={styles.progressPercent}>
                    {order.status === 'FINALIZADO' ? '100%' : order.status === 'EM_PRODUCAO' ? '60%' : order.status === 'FATIAMENTO' ? '25%' : '10%'}
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[
                    styles.progressBarFill,
                    { width: order.status === 'FINALIZADO' ? '100%' : order.status === 'EM_PRODUCAO' ? '60%' : order.status === 'FATIAMENTO' ? '25%' : '10%' }
                  ]} />
                </View>
                <View style={styles.timeInfo}>
                  <Timer color={COLORS.primary} size={14} />
                  <Text style={styles.timeInfoText}>
                    Entrega Prevista: {new Date(order.dataEntregaPrevista).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Price Row (Integrated in list for wide) */}
              <View style={styles.priceRowLarge}>
                <View style={styles.priceLeft}>
                  <View style={styles.iconCircleWhite}>
                    <Receipt color="#FFF" size={20} />
                  </View>
                  <Text style={styles.priceLabel}>Valor Total</Text>
                </View>
                <Text style={styles.priceValue}>{Number(order.total).toFixed(2)} €</Text>
              </View>
            </View>
          </View>

          {/* Details Row */}
          <View style={[styles.detailsRow, isWide && styles.wideLayout]}>
            <View style={{ flex: 1 }}>
              <SectionTitle title="Informações do Pedido" icon={Settings2} />
              <View style={styles.techGrid}>
                <TechItem label="CLIENTE" value={order.cliente?.nome || 'N/A'} />
                <TechItem label="MATERIAL" value={order.itens?.[0]?.material || 'PLA'} />
                <TechItem label="COR / ACABAMENTO" value={order.itens?.[0]?.cor || 'N/A'} color={order.itens?.[0]?.corHex} />
                <TechItem label="QUANTIDADE" value={`${order.itens?.[0]?.quantidade || 1} un`} />
                <TechItem label="DATA DO PEDIDO" value={new Date(order.dataCriacao).toLocaleDateString()} />
                <TechItem label="MÉTODO ENTREGA" value="Recolha Local" />
              </View>
            </View>

            {isWide && <View style={{ width: 30 }} />}

            <View style={{ flex: 1 }}>
              <SectionTitle title="Fluxo de Trabalho" icon={Bookmark} />
              <View style={styles.timeline}>
                <TimelineStep title="Pedido Recebido" sub={new Date(order.dataCriacao).toLocaleString()} completed={true} />
                <TimelineStep
                  title="Produção"
                  sub={['FATIAMENTO', 'EM_PRODUCAO'].includes(order.status) ? "Em andamento" : "Aguardando"}
                  active={order.status === 'EM_PRODUCAO' || order.status === 'FATIAMENTO'}
                  completed={['FINALIZADO','ENVIADO','ENTREGUE'].includes(order.status)}
                  icon={Cpu}
                />
                <TimelineStep
                  title="Finalizado & Envios"
                  sub={order.status === 'FINALIZADO' ? "Pronto para recolha" : order.status === 'ENTREGUE' ? "Entregue" : "Pendente"}
                  active={['FINALIZADO','ENVIADO'].includes(order.status)}
                  completed={order.status === 'ENTREGUE'}
                  last
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <TouchableOpacity
            style={[styles.mainAction, { backgroundColor: order.status === 'ENTREGUE' ? COLORS.success : COLORS.primary }]}
            onPress={() => setModalVisible(true)}
          >
            <Edit color="#FFF" size={20} />
            <Text style={styles.mainActionText}>
              {order.status === 'ENTREGUE' ? 'Estado: Entregue' : 'Atualizar Estado'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction} onPress={handleCopy}>
            <Copy color={COLORS.primary} size={20} />
            <Text style={styles.secondaryActionText}>Copiar</Text>
          </TouchableOpacity>
          {isWide && (
            <TouchableOpacity style={[styles.secondaryAction, { borderColor: '#FF4444' }]} onPress={handleDelete}>
              <Trash2 color="#FF4444" size={20} />
              <Text style={[styles.secondaryActionText, { color: '#FF4444' }]}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Status Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Atualizar Estado</Text>
                  <FlatList
                      data={statuses}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                          <TouchableOpacity
                              style={[styles.modalItem, order.status === item && { backgroundColor: COLORS.primary + '20' }]}
                              onPress={() => handleUpdateStatus(item)}
                          >
                              <Text style={[styles.modalItemText, order.status === item && { color: COLORS.primary, fontWeight: 'bold' }]}>
                                  {statusLabels[item]}
                              </Text>
                              {order.status === item && <Check color={COLORS.primary} size={16} />}
                          </TouchableOpacity>
                      )}
                  />
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                      <Text style={styles.closeBtnText}>Cancelar</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
    </View>
  );
};

const SectionTitle = ({ title, icon: Icon }: any) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitleText}>{title}</Text>
    <Icon color={COLORS.primary + '80'} size={20} />
  </View>
);

const TechItem = ({ label, value, color }: any) => (
  <View style={styles.techItem}>
    <Text style={styles.techLabel}>{label}</Text>
    <View style={styles.techValueRow}>
      {color && <View style={[styles.colorDot, { backgroundColor: color }]} />}
      <Text style={styles.techValueText}>{value}</Text>
    </View>
  </View>
);

const TimelineStep = ({ title, sub, completed, active, last, icon: Icon }: any) => (
  <View style={styles.timelineRow}>
    <View style={styles.timelineLeft}>
      <View style={[
        styles.timelineDot,
        completed && styles.dotCompleted,
        active && styles.dotActive,
      ]}>
        {completed && <Check color="#FFF" size={12} />}
        {active && (Icon ? <Icon color="#FFF" size={12} /> : null)}
      </View>
      {!last && <View style={[styles.timelineLine, completed && styles.lineCompleted]} />}
    </View>
    <View style={styles.timelineContent}>
      <Text style={[styles.stepTitle, active && { color: COLORS.primary }]}>{title}</Text>
      <Text style={styles.stepSub}>{sub}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  safeHeader: {
    backgroundColor: COLORS.backgroundDark,
  },
  headerInner: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150,
  },
  contentWrapper: {
    alignSelf: 'center',
    gap: 25,
  },
  quickMenu: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  menuText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mainLayout: {
    gap: 20,
  },
  wideLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageSection: {
    width: '100%',
  },
  statsSection: {
    width: '100%',
    gap: 15,
  },
  imageContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.cardDark,
    elevation: 8,
  },
  mainImage: {
    height: 380,
    justifyContent: 'flex-end',
  },
  imageOverlay: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlay: {
    padding: 20,
    backgroundColor: 'rgba(15, 35, 32, 0.4)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  floatingStatus: {
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modelName: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: COLORS.cardDark,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  progressLabel: {
    color: COLORS.slate400,
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercent: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: COLORS.slate800,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeInfoText: {
    color: COLORS.slate500,
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  techItem: {
    width: '48%',
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    flexGrow: 1,
  },
  techLabel: {
    color: COLORS.slate500,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  techValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  techValueText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  costCard: {
    gap: 12,
    marginBottom: 30,
  },
  costInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.cardDark,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  costItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  costItemRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  costLabel: {
    color: COLORS.primary + '99',
    fontSize: 9,
    fontWeight: 'bold',
  },
  costValue: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  priceRowLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    elevation: 8,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconCircleWhite: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  priceValue: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  priceTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsRow: {
    gap: 20,
  },
  timeline: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 15,
  },
  timelineLeft: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.slate800,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dotCompleted: {
    backgroundColor: COLORS.success,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: COLORS.primary + '33',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: COLORS.slate800,
  },
  lineCompleted: {
    backgroundColor: COLORS.success,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 25,
  },
  stepTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  stepSub: {
    color: COLORS.slate500,
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.backgroundDark + 'F2',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    zIndex: 10,
  },
  footerInner: {
    flexDirection: 'row',
    padding: 15,
    paddingBottom: 35,
    gap: 12,
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  mainAction: {
    flex: 2,
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  mainActionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: COLORS.primary + '1A',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + '33',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  secondaryActionText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 15,
    padding: 20,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: COLORS.borderDark
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalItemText: {
    color: '#FFF',
    fontSize: 16
  },
  closeBtn: {
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.slate800,
    borderRadius: 10,
    alignItems: 'center'
  },
  closeBtnText: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});

export default OrderDetailsScreen;
