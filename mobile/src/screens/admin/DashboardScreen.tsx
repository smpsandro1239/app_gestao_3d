import { AlertCircle, LucideIcon, Package, Plus, TrendingUp, Users } from 'lucide-react-native';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

const DashboardScreen = () => {
  const stats: Stat[] = [
    { label: 'Pedidos Ativos', value: '12', icon: Package, color: '#1A73E8' },
    { label: 'Novos Clientes', value: '5', icon: Users, color: '#34A853' },
    { label: 'Lucro Mensal', value: '450 €', icon: TrendingUp, color: '#FBBC05' },
    { label: 'Atrasados', value: '2', icon: AlertCircle, color: '#EA4335' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.welcome}>Olá, Sandro!</Text>
          <Text style={styles.subtitle}>Aqui está o teu resumo de hoje.</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <stat.icon color={stat.color} size={30} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Plus color="#FFF" size={24} />
              <Text style={styles.actionText}>Novo Pedido</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#34A853' }]}>
              <Package color="#FFF" size={24} />
              <Text style={styles.actionText}>Add Produto</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          <View style={styles.activityList}>
            <Text style={styles.emptyText}>Sem atividade recente.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '46%',
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#1A73E8',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  activityList: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
  },
});

export default DashboardScreen;
