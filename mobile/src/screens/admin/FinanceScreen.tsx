import {
    Bolt,
    Calendar,
    ChevronLeft,
    CircleDollarSign,
    FileSpreadsheet,
    FileText,
    Layers,
    TrendingUp,
    Wrench,
} from 'lucide-react-native';
import React from 'react';
import {
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

import { Alert, Linking } from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { downloadFinanceExcel, FinanceSummary, getFinanceSummary } from '../../services/financeService';

const FinanceScreen = () => {
  const [data, setData] = React.useState<FinanceSummary | null>(null);
  const { formatPrice } = useSettings();
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const summary = await getFinanceSummary();
      setData(summary);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExport = async (type: 'excel' | 'pdf') => {
    if (type === 'excel') {
      const url = await downloadFinanceExcel();
      Linking.openURL(url).catch(err => Alert.alert('Erro', 'Não foi possível abrir o link'));
    } else {
      Alert.alert('Info', 'Exportação PDF implementada em breve.');
    }
  };

  const isWide = width > 768;
  const breakdownItemWidth = isWide ? (width - 55) / 2 : width - 40;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Nav Bar */}
      <View style={styles.navBar}>
        <View style={styles.navBarInner}>
          <TouchableOpacity style={styles.navIconBtn}>
            <ChevronLeft color={COLORS.textDark} size={24} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Relatórios Financeiros</Text>
          <TouchableOpacity style={styles.navIconBtn}>
            <Calendar color={COLORS.textDark} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Revenue Overview */}
        <View style={styles.overview}>
          <Text style={styles.overviewLabel}>RECEITA TOTAL ESTIMADA</Text>
          <View style={styles.revenueRow}>
            <Text style={[styles.revenueValue, { fontSize: isWide ? 42 : 34 }]}>
              {data ? formatPrice(data.revenue) : '--'}
            </Text>
            <View style={styles.trendBadge}>
              <TrendingUp color={COLORS.primary} size={isWide ? 18 : 12} />
              <Text style={[styles.trendText, { fontSize: isWide ? 16 : 13 }]}>{data?.trend}%</Text>
            </View>
          </View>
        </View>

        {/* Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Lucro vs. Despesas</Text>
              <Text style={styles.chartSubtitle}>Desempenho nos últimos 6 meses</Text>
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                <Text style={styles.legendText}>Lucro</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#395651' }]} />
                <Text style={styles.legendText}>Gastos</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartBars}>
            {data?.history.map((h, i) => (
              <Bar
                key={h.month}
                month={h.month}
                profit={h.profit}
                expense={h.expense}
                active={i === (data?.history.length || 0) - 1}
                barWidth={isWide ? 15 : 8}
              />
            ))}
          </View>
        </View>

        {/* Breakdown Section */}
        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
        <View style={[styles.breakdownList, isWide && { flexDirection: 'row', flexWrap: 'wrap', gap: 15 }]}>
          {data?.breakdown.map((item, index) => (
             <BreakdownItem
               key={index}
               icon={item.type === 'income' ? CircleDollarSign : item.type === 'expense' && item.label.includes('Filamento') ? Layers : item.label.includes('Eletricidade') ? Bolt : Wrench}
               label={item.label}
               sub={item.sub}
               value={`${item.type === 'expense' ? '-' : '+'}${formatPrice(item.value)}`}
               isNegative={item.type === 'expense'}
               width={breakdownItemWidth}
             />
          ))}
        </View>
      </ScrollView>

      {/* Export Action Sheet Area */}
      <View style={styles.footer}>
        <View style={[styles.exportButtons, isWide && { flexDirection: 'row' }]}>
          <TouchableOpacity style={[styles.excelBtn, isWide && { flex: 1 }]} onPress={() => handleExport('excel')}>
            <FileSpreadsheet color={COLORS.primary} size={20} />
            <Text style={styles.excelBtnText}>Exportar para Excel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pdfBtn, isWide && { flex: 1 }]} onPress={() => handleExport('pdf')}>
            <FileText color="#FFF" size={20} />
            <Text style={styles.pdfBtnText}>Exportar para PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Bar = ({ month, profit, expense, active, barWidth = 8 }: any) => (
  <View style={styles.barGroup}>
    <View style={styles.barContainer}>
      <View style={[styles.barProfit, { height: profit, width: barWidth }]} />
      <View style={[styles.barExpense, { height: expense, width: barWidth }]} />
    </View>
    <Text style={[styles.barMonth, active && { color: COLORS.primary }]}>{month}</Text>
  </View>
);

const BreakdownItem = ({ icon: Icon, label, sub, value, isNegative, width }: any) => (
  <View style={[styles.breakdownItem, width ? { width } : {}]}>
    <View style={styles.breakdownLeft}>
      <View style={styles.itemIconBox}>
        <Icon color={COLORS.primary} size={22} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemLabel} numberOfLines={1}>{label}</Text>
        <Text style={styles.itemSub} numberOfLines={1}>{sub}</Text>
      </View>
    </View>
    <Text style={[styles.itemValue, { color: isNegative ? '#ef4444' : COLORS.primary }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  navBar: {
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  navBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  navIconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  navTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 220,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  overview: {
    marginTop: 10,
    marginBottom: 25,
  },
  overviewLabel: {
    color: COLORS.slate500,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  revenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
  },
  revenueValue: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: 20,
    marginBottom: 30,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  chartTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartSubtitle: {
    color: COLORS.slate500,
    fontSize: 11,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: COLORS.slate400,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  barGroup: {
    alignItems: 'center',
    gap: 10,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: '100%',
  },
  barProfit: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  barExpense: {
    backgroundColor: '#395651',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  barMonth: {
    color: COLORS.slate400,
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  breakdownList: {
    gap: 10,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  itemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
  itemSub: {
    color: COLORS.slate500,
    fontSize: 11,
  },
  itemValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.backgroundDark + 'F2',
    padding: 20,
    paddingBottom: 100,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    alignItems: 'center',
  },
  exportButtons: {
    gap: 12,
    maxWidth: 1200,
    width: '100%',
  },
  excelBtn: {
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  excelBtnText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pdfBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  pdfBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FinanceScreen;
