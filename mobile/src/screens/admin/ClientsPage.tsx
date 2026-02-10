import { ChevronLeft, Phone, Plus, Search, Trash2, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
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
import { Client, createClient, deleteClient, getClients, updateClient } from '../../services/clientsService';
import { COLORS } from '../../utils/theme';

const ClientsPage = ({ navigation }: any) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nif, setNif] = useState('');
  const [address, setAddress] = useState('');

  const { width } = useWindowDimensions();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    const result = clients.filter(c =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.telefone || '').includes(search)
    );
    setFilteredClients(result);
  }, [search, clients]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await getClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setSelectedClient(client);
      setName(client.nome);
      setEmail(client.email);
      setPhone(client.telefone || '');
      setNif(client.nif || '');
      setAddress(client.endereco || '');
    } else {
      setSelectedClient(null);
      setName('');
      setEmail('');
      setPhone('');
      setNif('');
      setAddress('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Erro', 'Nome e Email são obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      const clientData = {
        nome: name,
        email,
        telefone: phone,
        nif,
        endereco: address
      };

      if (selectedClient) {
        await updateClient(selectedClient.id, clientData);
      } else {
        await createClient(clientData);
      }

      setModalVisible(false);
      loadClients();
      Alert.alert('Sucesso', `Cliente ${selectedClient ? 'atualizado' : 'criado'} com sucesso!`);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao guardar cliente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Eliminar Cliente',
      'Tem a certeza que deseja eliminar este cliente? Esta ação não pode ser revertida.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClient(id);
              loadClients();
            } catch (error) {
               Alert.alert('Erro', 'Não é possível eliminar o cliente, talvez existam encomendas associadas.');
            }
          }
        }
      ]
    );
  };

  const isWide = width > 768;
  const numColumns = isWide ? 2 : 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft color="#FFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestão de Clientes</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleOpenModal()}>
            <Plus color="#FFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchInner}>
          <View style={styles.searchBar}>
            <Search color={COLORS.slate400} size={18} />
            <TextInput
              style={styles.searchInput}
              placeholder="Procurar cliente (nome, email, telefone)..."
              placeholderTextColor={COLORS.slate400}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ClientCard
              client={item}
              onEdit={() => handleOpenModal(item)}
              onDelete={() => handleDelete(item.id)}
              width={isWide ? '48%' : '100%'}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <User color={COLORS.slate800} size={64} />
              <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
            </View>
          }
        />
      )}

      {/* Form Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedClient ? 'Editar Cliente' : 'Novo Cliente'}</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NOME</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nome completo"
                  placeholderTextColor={COLORS.slate500}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="exemplo@email.com"
                  placeholderTextColor={COLORS.slate500}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>TELEFONE</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="912..."
                    placeholderTextColor={COLORS.slate500}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>NIF / VAT</Text>
                  <TextInput
                    style={styles.input}
                    value={nif}
                    onChangeText={setNif}
                    placeholder="Ex: 512..."
                    placeholderTextColor={COLORS.slate500}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>MORADA / ENDEREÇO</Text>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Morada completa"
                  placeholderTextColor={COLORS.slate500}
                  multiline
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)} disabled={isSaving}>
                  <Text style={styles.modalBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleSave} disabled={isSaving}>
                  {isSaving ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.modalBtnText}>Guardar</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const ClientCard = ({ client, onEdit, onDelete, width }: any) => (
  <TouchableOpacity style={[styles.clientCard, { width }]} onPress={onEdit}>
    <View style={styles.cardHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{client.nome.substring(0, 2).toUpperCase()}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.clientName} numberOfLines={1}>{client.nome}</Text>
        <Text style={styles.clientMeta}>{client.email}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Trash2 color="#FF4444" size={18} />
      </TouchableOpacity>
    </View>
    <View style={styles.cardDetails}>
      <View style={styles.detailItem}>
        <Phone color={COLORS.primary} size={14} />
        <Text style={styles.detailText}>{client.telefone || 'Sem telefone'}</Text>
      </View>
      {client.nif && (
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>NIF:</Text>
          <Text style={styles.detailText}>{client.nif}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    paddingVertical: 15,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  searchInner: {
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
    height: 48,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#FFF',
    fontSize: 14,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  clientCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: 15,
    marginBottom: 12,
    marginRight: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clientName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  clientMeta: {
    color: COLORS.slate500,
    fontSize: 12,
  },
  deleteBtn: {
    padding: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    color: COLORS.slate500,
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailText: {
    color: COLORS.slate400,
    fontSize: 12,
  },
  emptyBox: {
    padding: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.slate500,
    marginTop: 20,
    fontSize: 16,
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
    maxWidth: 450,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.slate500,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    height: 50,
    color: '#FFF',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
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
  cancelBtn: {
    backgroundColor: COLORS.slate800,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  }
});

export default ClientsPage;
