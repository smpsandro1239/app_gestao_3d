import { AlertTriangle, Database, Edit3, MoreHorizontal, Plus, Search } from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { Filament, deleteFilament, getFilaments, updateFilament } from '../../services/filamentService';
import { COLORS } from '../../utils/theme';

const InventoryScreen = ({ navigation }: any) => {
  const [filaments, setFilaments] = React.useState<Filament[]>([]);
  const [filteredFilaments, setFilteredFilaments] = React.useState<Filament[]>([]);
  const [search, setSearch] = React.useState('');
  const [filterMaterial, setFilterMaterial] = React.useState('Todos');
  const [filterColor, setFilterColor] = React.useState<string | null>(null);
  const [selectedFilament, setSelectedFilament] = React.useState<Filament | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState<number | null>(null);
  const [editWeight, setEditWeight] = React.useState('');
  const [editAlert, setEditAlert] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const { width } = useWindowDimensions();
  const materials = ['Todos', 'PLA', 'PETG', 'ABS', 'TPU', 'ASA'];

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    filterData();
  }, [search, filterMaterial, filterColor, filaments]);

  const loadData = async () => {
    try {
      const data = await getFilaments();
      setFilaments(data);
    } catch (error) {
      console.error('Error loading filaments:', error);
    }
  };

  const filterData = () => {
    let result = [...filaments];
    if (search) {
      result = result.filter(f =>
        f.brand.toLowerCase().includes(search.toLowerCase()) ||
        f.color.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterMaterial !== 'Todos') {
      result = result.filter(f => f.material === filterMaterial);
    }
    if (filterColor) {
      result = result.filter(f => f.color === filterColor);
    }
    setFilteredFilaments(result);
  };

  // Get unique colors from filaments
  const uniqueColors = React.useMemo(() => {
    const colors = filaments.map(f => ({ name: f.color, hex: f.colorHex || '#CCC' }));
    const unique = colors.filter((c, index, self) =>
      index === self.findIndex(t => t.name === c.name)
    );
    return unique;
  }, [filaments]);

  const handleQuickEdit = (filament: Filament) => {
    setSelectedFilament(filament);
    setEditWeight(filament.currentWeight.toString());
    setEditAlert(filament.stockAlert.toString());
    setIsEditModalVisible(true);
  };

  const saveQuickEdit = async () => {
    if (!selectedFilament) return;
    setIsSaving(true);
    try {
      await updateFilament(selectedFilament.id, {
        pesoAtual: Number(editWeight),
        alertaMinimo: Number(editAlert)
      });
      setIsEditModalVisible(false);
      loadData();
      Alert.alert('Sucesso', 'Filamento atualizado!');
    } catch (error) {
      console.error('Error updating filament:', error);
      Alert.alert('Erro', 'Falha ao atualizar filamento.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmar Eliminação',
      'Tem a certeza que deseja remover este carretel?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await deleteFilament(id);
            loadData();
            Alert.alert('Sucesso', 'Filamento eliminado!');
          } catch (error) {
            console.error('Error deleting filament:', error);
            Alert.alert('Erro', 'Não foi possível eliminar o filamento.');
          }
        }}
      ]
    );
  };

  const totalWeight = filaments.reduce((acc, curr) => acc + (Number(curr.currentWeight) / 1000), 0);
  const lowStockCount = filaments.filter(f => Number(f.currentWeight) < Number(f.stockAlert)).length;

  const mostUsed = [...filaments]
    .map(f => ({ ...f, usage: Number(f.initialWeight) - Number(f.currentWeight) }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 3);

  const isWide = width > 768;
  const numColumns = isWide ? 2 : 1;
  const spoolCardWidth = (width - (isWide ? 80 : 50)) / numColumns;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Area */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>Inventário 3D</Text>
          <TouchableOpacity style={styles.headerBtn}>
             <Search color="#FFF" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick Summary Cards */}
        <View style={styles.summaryContainer}>
          <SummaryCard
            title="Total Stock"
            value={`${totalWeight.toFixed(1)}kg`}
            subtitle={`${filaments.length} Carretéis`}
            icon={Database}
            color={COLORS.primary}
          />
          <SummaryCard
            title="Sinal Crítico"
            value={lowStockCount.toString()}
            subtitle="Pedir Reposição"
            icon={AlertTriangle}
            color="#FF4444"
          />
        </View>

        {/* Most Used Section */}
        {mostUsed.length > 0 && mostUsed[0].usage > 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Filamentos Mais Usados</Text>
            <View style={styles.statsCard}>
              {mostUsed.map((f, idx) => (
                <View key={f.id} style={[styles.usageRow, idx === mostUsed.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={[styles.usageColor, { backgroundColor: f.colorHex }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.usageMeta}>
                      <Text style={styles.usageName}>{f.brand} {f.color}</Text>
                      <Text style={styles.usageValue}>{f.usage.toFixed(0)}g consumidos</Text>
                    </View>
                    <View style={styles.usageBarBg}>
                      <View style={[styles.usageBarFill, { width: `${Math.min(100, (f.usage / f.initialWeight) * 100)}%`, backgroundColor: COLORS.primary }]} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Filters & Search */}
        <View style={styles.filterSection}>
          <View style={styles.searchBar}>
            <Search color={COLORS.slate400} size={18} />
            <TextInput
              style={styles.searchInput}
              placeholder="Procurar marca, cor..."
              placeholderTextColor={COLORS.slate400}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.materialScroll}>
            {materials.map(mat => (
              <TouchableOpacity
                key={mat}
                style={[styles.matFilter, filterMaterial === mat && styles.matFilterActive]}
                onPress={() => setFilterMaterial(mat)}
              >
                <Text style={[styles.matFilterText, filterMaterial === mat && styles.matFilterTextActive]}>{mat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Color Filters */}
          {uniqueColors.length > 0 && (
            <View style={styles.colorFilterSection}>
              <Text style={styles.colorFilterLabel}>FILTRAR POR COR:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
                <TouchableOpacity
                  style={[styles.colorChip, !filterColor && styles.colorChipActive]}
                  onPress={() => setFilterColor(null)}
                >
                  <Text style={[styles.colorChipText, !filterColor && styles.colorChipTextActive]}>Todas</Text>
                </TouchableOpacity>
                {uniqueColors.map(c => (
                  <TouchableOpacity
                    key={c.name}
                    style={[styles.colorChip, filterColor === c.name && styles.colorChipActive]}
                    onPress={() => setFilterColor(c.name)}
                  >
                    <View style={[styles.colorDot, { backgroundColor: c.hex, borderWidth: c.hex === '#FFFFFF' ? 1 : 0 }]} />
                    <Text style={[styles.colorChipText, filterColor === c.name && styles.colorChipTextActive]}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Carretéis Ativos</Text>
            <View style={styles.itemBadge}>
                <Text style={styles.itemBadgeText}>{filteredFilaments.length} Itens</Text>
            </View>
        </View>

        <View style={[styles.spoolList, isWide && { flexDirection: 'row', flexWrap: 'wrap', gap: 15 }]}>
          {filteredFilaments.map((f) => (
             <SpoolCard
               key={f.id}
               filament={f}
               isLow={Number(f.currentWeight) < Number(f.stockAlert)}
               width={spoolCardWidth}
               menuVisible={menuVisible === f.id}
               onToggleMenu={() => setMenuVisible(menuVisible === f.id ? null : f.id)}
               onQuickEdit={() => handleQuickEdit(f)}
               onFullEdit={() => navigation.navigate('AddFilament', { filamentId: f.id })}
               onDelete={() => handleDelete(f.id)}
             />
          ))}
          {filteredFilaments.length === 0 && (
            <Text style={{color: COLORS.slate500, textAlign: 'center', marginTop: 20, width: '100%'}}>
              Nenhum filamento encontrado.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Quick Edit Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Rápido</Text>
            <Text style={styles.modalSubtitle}>{selectedFilament?.brand} {selectedFilament?.color}</Text>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>PESO ATUAL (G)</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={editWeight}
                onChangeText={setEditWeight}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>ALERTA DE STOCK (G)</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={editAlert}
                onChangeText={setEditAlert}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave]} onPress={saveQuickEdit} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.modalBtnText}>Guardar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddFilament')}>
        <Plus color="#FFF" size={30} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const SummaryCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <View style={[styles.summaryCard, { borderColor: color + '30' }]}>
    <View style={[styles.summaryIcon, { backgroundColor: color + '15' }]}>
      <Icon color={color} size={20} />
    </View>
    <View>
      <Text style={styles.summaryLabel}>{title}</Text>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summarySub}>{subtitle}</Text>
    </View>
  </View>
);

const SpoolCard = ({ filament, isLow, width, menuVisible, onToggleMenu, onQuickEdit, onFullEdit, onDelete }: any) => {
  const { brand, material, color, colorHex, currentWeight, initialWeight } = filament;
  const percentage = Math.round((currentWeight / initialWeight) * 100);
  return (
    <View style={[styles.spoolCard, { width }]}>
      <View style={styles.spoolHeader}>
        <View style={styles.spoolInfo}>
          <View style={[styles.colorPreview, { backgroundColor: colorHex || '#CCC', borderWidth: colorHex === '#FFFFFF' ? 1 : 0, borderColor: COLORS.borderDark }]} />
          <View>
            <Text style={styles.spoolBrand} numberOfLines={1}>{brand} {color}</Text>
            <Text style={styles.spoolMeta}>{material} • 1.75mm</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressWeight}>
            {currentWeight}g <Text style={styles.totalWeightUnit}>/ {initialWeight / 1000}kg</Text>
          </Text>
          <Text style={[styles.percentageText, isLow && { color: '#F26A38' }]}>{percentage}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { backgroundColor: isLow ? '#F26A38' : (colorHex === '#FFFFFF' ? COLORS.primary : colorHex), width: `${Math.min(100, percentage)}%` }
            ]}
          />
        </View>
      </View>

      <View style={styles.spoolActions}>
        <TouchableOpacity style={styles.editBtn} onPress={onQuickEdit}>
          <Edit3 color="#FFF" size={14} />
          <Text style={styles.editBtnText}>Editar Rápido</Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity style={styles.moreBtn} onPress={onToggleMenu}>
            <MoreHorizontal color={COLORS.slate400} size={20} />
          </TouchableOpacity>
          {menuVisible && (
            <View style={styles.menuDropdown}>
              <TouchableOpacity style={styles.menuOption} onPress={() => { onFullEdit(); onToggleMenu(); }}>
                <Edit color={COLORS.primary} size={16} />
                <Text style={styles.menuOptionText}>Editar Completo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuOption} onPress={() => { onQuickEdit(); onToggleMenu(); }}>
                <Edit3 color={COLORS.accentGold} size={16} />
                <Text style={styles.menuOptionText}>Editar Rápido</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuOption, { borderBottomWidth: 0 }]} onPress={() => { onDelete(); onToggleMenu(); }}>
                <Trash2 color="#FF4444" size={16} />
                <Text style={[styles.menuOptionText, { color: '#FF4444' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
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
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    color: COLORS.slate500,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summarySub: {
    color: COLORS.slate500,
    fontSize: 10,
  },
  statsSection: {
    marginBottom: 25,
  },
  statsCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginTop: 15,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  usageColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  usageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  usageName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
  usageValue: {
    color: COLORS.slate500,
    fontSize: 11,
  },
  usageBarBg: {
    height: 6,
    backgroundColor: COLORS.slate800,
    borderRadius: 3,
    overflow: 'hidden',
  },
  usageBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  filterSection: {
    marginBottom: 25,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingHorizontal: 15,
    height: 48,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#FFF',
    fontSize: 14,
  },
  materialScroll: {
    flexDirection: 'row',
  },
  matFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 8,
  },
  matFilterActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  matFilterText: {
    color: COLORS.slate500,
    fontSize: 12,
    fontWeight: 'bold',
  },
  matFilterTextActive: {
    color: COLORS.primary,
  },
  colorFilterSection: {
    marginTop: 12,
  },
  colorFilterLabel: {
    color: COLORS.slate500,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  colorScroll: {
    flexDirection: 'row',
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 8,
  },
  colorChipActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  colorChipText: {
    color: COLORS.slate500,
    fontSize: 11,
    fontWeight: '600',
  },
  colorChipTextActive: {
    color: COLORS.primary,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderColor: COLORS.borderDark,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemBadge: {
    backgroundColor: COLORS.slate800,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  itemBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  spoolList: {
    gap: 15,
  },
  spoolCard: {
    backgroundColor: COLORS.cardDark,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  spoolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  spoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreview: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  spoolBrand: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  spoolMeta: {
    color: COLORS.slate500,
    fontSize: 12,
  },
  progressSection: {
    marginBottom: 15,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressWeight: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
  totalWeightUnit: {
    color: COLORS.slate500,
    fontWeight: 'normal',
    fontSize: 11,
  },
  percentageText: {
    color: COLORS.slate400,
    fontSize: 11,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: COLORS.slate800,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  spoolActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: COLORS.primary + '20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  editBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  moreBtn: {
    backgroundColor: COLORS.slate800,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  menuOptionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalSubtitle: {
    color: COLORS.slate500,
    fontSize: 14,
    marginBottom: 25,
  },
  modalInputGroup: {
    marginBottom: 20,
  },
  modalLabel: {
    color: COLORS.slate500,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    height: 50,
    color: '#FFF',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: COLORS.slate800,
  },
  modalBtnSave: {
    backgroundColor: COLORS.primary,
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});

export default InventoryScreen;
