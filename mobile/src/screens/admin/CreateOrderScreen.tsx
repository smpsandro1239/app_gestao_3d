import { Formik } from 'formik';
import { Calendar, Check, ChevronDown, ChevronLeft, DollarSign, Package, Plus, Save, ShoppingCart, Trash2, User } from 'lucide-react-native';
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
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import * as Yup from 'yup';

import InputGroup from '../../components/InputGroup';
import { useSettings } from '../../context/SettingsContext';
import { Client, getClients } from '../../services/clientsService';
import { createOrder } from '../../services/orderService';
import { getProducts, Product } from '../../services/productsService';
import { COLORS } from '../../utils/theme';

const OrderSchema = Yup.object().shape({
    client: Yup.object().nullable().required('Selecione um cliente'),
    date: Yup.string().required('Data é obrigatória'),
    // orderItems validation is handled manually or via a custom test, but simpler to check on submit
});

const CreateOrderScreen = ({ navigation, route }: any) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  // Temp state for adding items (not part of main formik)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [itemPrice, setItemPrice] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'client' | 'product'>('client');
  const [isSuccess, setIsSuccess] = useState(false);

  const { width } = useWindowDimensions();
  const { preSelectedProductId, copyOrderId } = route.params || {};
  const { currency, formatPrice } = useSettings();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (preSelectedProductId && products.length > 0) {
        const product = products.find(p => p.id === preSelectedProductId);
        if (product) {
          setSelectedProduct(product);
          setItemPrice(product.preco.toString());
        }
    }
  }, [products, preSelectedProductId]);

  useEffect(() => {
    if (copyOrderId) {
      loadCopyOrder(copyOrderId);
    }
  }, [copyOrderId]);

  // We need a ref to set values if we load a copy order, but Formik handles initialValues.
  // Since we load data async, we might want to delay rendering Formik or use enableReinitialize.
  // For simplicity, we'll store the initial client in state if copying.
  const [initialClient, setInitialClient] = useState<Client | null>(null);

  const loadCopyOrder = async (id: number) => {
    try {
      const { getOrder } = require('../../services/orderService');
      const oldOrder = await getOrder(id);
      setInitialClient(oldOrder.cliente);

      const items = oldOrder.itens.map((it: any) => ({
        produtoId: it.produto.id,
        nome: it.produto.nome,
        quantidade: it.quantidade,
        precoUnitario: it.precoUnitario,
        total: it.quantidade * it.precoUnitario
      }));
      setOrderItems(items);
    } catch (error) {
       console.error('Error copying order:', error);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
        const total = selectedProduct.preco * Number(quantity);
        setItemPrice(total.toFixed(2));
    }
  }, [selectedProduct, quantity]);

  const loadData = async () => {
    try {
      const [c, p] = await Promise.all([getClients(), getProducts()]);
      setClients(c || []);
      setProducts(p || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao carregar dados. Verifique a conexão.');
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct || !quantity || Number(quantity) <= 0) {
      Alert.alert('Erro', 'Selecione um produto e uma quantidade válida.');
      return;
    }

    const newItem = {
      produtoId: selectedProduct.id,
      nome: selectedProduct.nome,
      quantidade: Number(quantity),
      precoUnitario: Number(itemPrice) / Number(quantity),
      total: Number(itemPrice)
    };

    setOrderItems([...orderItems, newItem]);

    // Reset selection
    setSelectedProduct(null);
    setQuantity('1');
    setItemPrice('');

    Alert.alert(
      'Item Adicionado',
      'Deseja adicionar mais itens ou finalizar a encomenda?',
      [
        {
          text: 'Adicionar Mais',
          onPress: () => console.log('Adicionar mais'),
          style: 'default',
        },
        {
          text: 'Continuar', // Changed to standard "Continuar" as "Finalizar" might be confusing with the main save button
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = async (values: any, { setSubmitting }: any) => {
    if (orderItems.length === 0 && !selectedProduct) {
      Alert.alert('Erro', 'Adicione pelo menos um item à encomenda.');
      setSubmitting(false);
      return;
    }

    // Final items list
    let finalItems = [...orderItems];
    if (selectedProduct) {
      finalItems.push({
        produtoId: selectedProduct.id,
        quantidade: Number(quantity),
        precoUnitario: Number(itemPrice) / Number(quantity)
      });
    }

    try {
        await createOrder({
            clienteId: values.client.id,
            dataEntregaPrevista: new Date(values.date).toISOString(),
            metodoEntrega: 'Entrega',
            custoEntrega: 0,
            itens: finalItems
        });

        setIsSuccess(true);
        setTimeout(() => {
            navigation.goBack();
        }, 2000);

    } catch (error: any) {
        const errorMsg = error.response?.data?.message || 'Falha ao criar a encomenda.';
        Alert.alert('Erro', Array.isArray(errorMsg) ? errorMsg.join('\n') : errorMsg);
    } finally {
        setSubmitting(false);
    }
  };

  const openModal = (type: 'client' | 'product') => {
    setModalType(type);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Encomenda</Text>
        <View style={{ width: 44 }} />
      </View>

      <Formik
        initialValues={{
            client: initialClient,
            date: new Date().toISOString().split('T')[0],
        }}
        enableReinitialize
        validationSchema={OrderSchema}
        onSubmit={handleSave}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting, isValid }) => (
            <>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.sectionTitle}>Detalhes do Cliente</Text>
                    <TouchableOpacity onPress={() => openModal('client')}>
                        <InputGroup
                            icon={User}
                            label="CLIENTE"
                            placeholder="Selecione um cliente"
                            value={values.client?.nome || ''}
                            editable={false}
                            rightIcon={ChevronDown}
                            error={touched.client && errors.client}
                        />
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Detalhes do Modelo</Text>
                    <TouchableOpacity onPress={() => openModal('product')}>
                        <InputGroup
                            icon={Package}
                            label="PRODUTO / SERVIÇO"
                            placeholder="Selecione um modelo"
                            value={selectedProduct?.nome || ''}
                            editable={false}
                            rightIcon={ChevronDown}
                        />
                    </TouchableOpacity>

                    <View style={styles.row}>
                        <View style={{flex: 1}}>
                            <InputGroup
                                icon={ShoppingCart}
                                label="QUANTIDADE"
                                placeholder="1"
                                keyboardType="numeric"
                                value={quantity}
                                onChangeText={setQuantity}
                            />
                        </View>
                        <View style={{width: 15}} />
                        <View style={{flex: 1}}>
                            <InputGroup
                                icon={DollarSign}
                                label={`SUBTOTAL (${currency})`}
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={itemPrice}
                                onChangeText={setItemPrice}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.addItemBtn} onPress={handleAddItem}>
                    <Plus color={COLORS.primary} size={20} />
                    <Text style={styles.addItemBtnText}>Adicionar à Encomenda</Text>
                    </TouchableOpacity>

                    {orderItems.length > 0 && (
                    <View style={styles.basketContainer}>
                        <Text style={styles.sectionTitle}>Itens na Encomenda</Text>
                        {orderItems.map((item, index) => (
                        <View key={index} style={styles.basketItem}>
                            <View style={styles.basketItemInfo}>
                            <Text style={styles.basketItemName}>{item.nome}</Text>
                            <Text style={styles.basketItemMeta}>{item.quantidade}x @ {formatPrice(item.precoUnitario)}</Text>
                            </View>
                            <View style={styles.basketItemRight}>
                            <Text style={styles.basketItemTotal}>{formatPrice(item.total)}</Text>
                            <TouchableOpacity onPress={() => {
                                const newItems = [...orderItems];
                                newItems.splice(index, 1);
                                setOrderItems(newItems);
                            }}>
                                <Trash2 color="#FF4444" size={18} style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                            </View>
                        </View>
                        ))}

                        <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>TOTAL DA ENCOMENDA</Text>
                        <Text style={styles.totalValue}>
                            {formatPrice(orderItems.reduce((acc, curr) => acc + curr.total, 0) + (selectedProduct ? Number(itemPrice) : 0))}
                        </Text>
                        </View>
                    </View>
                    )}

                    <View style={{ marginTop: 20 }}>
                    <InputGroup
                        icon={Calendar}
                        label="DATA ENTREGA PREVISTA"
                        placeholder="YYYY-MM-DD"
                        value={values.date}
                        onChangeText={handleChange('date')}
                        onBlur={handleBlur('date')}
                        error={touched.date && errors.date}
                    />
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.saveBtn,
                            (isSubmitting || !values.client || (orderItems.length === 0 && !selectedProduct) || isSuccess) && styles.saveBtnDisabled,
                            isSuccess && { backgroundColor: COLORS.success }
                        ]}
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting || !values.client || (orderItems.length === 0 && !selectedProduct) || isSuccess}
                    >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" />
                    ) : isSuccess ? (
                        <>
                        <Check color="#FFF" size={20} />
                        <Text style={styles.saveBtnText}>Encomenda Criada!</Text>
                        </>
                    ) : (
                        <>
                        <Save color="#FFF" size={20} />
                        <Text style={styles.saveBtnText}>Finalizar e Criar Encomenda</Text>
                        </>
                    )}
                    </TouchableOpacity>
                </ScrollView>

                {/* Selector Modal */}
                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Selecione {modalType === 'client' ? 'o Cliente' : 'o Produto'}</Text>
                            <FlatList
                                data={modalType === 'client' ? clients : products}
                                keyExtractor={(item: any) => item.id.toString()}
                                renderItem={({ item }: any) => (
                                    <TouchableOpacity style={styles.modalItem} onPress={() => {
                                        if (modalType === 'client') {
                                            setFieldValue('client', item);
                                        } else {
                                            setSelectedProduct(item);
                                        }
                                        setModalVisible(false);
                                    }}>
                                        <Text style={styles.modalItemText}>{item.nome}</Text>
                                        {modalType === 'product' && <Text style={styles.modalItemSub}>{formatPrice(item.preco)}</Text>}
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeBtnText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        )}
      </Formik>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
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
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 15,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveBtnDisabled: {
    backgroundColor: COLORS.slate800,
    opacity: 0.6,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 163, 139, 0.1)',
    height: 50,
    borderRadius: 12,
    marginTop: -5,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    gap: 10,
  },
  addItemBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  basketContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  basketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  basketItemInfo: {
    flex: 1,
  },
  basketItemName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  basketItemMeta: {
    color: COLORS.slate500,
    fontSize: 12,
    marginTop: 2,
  },
  basketItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  basketItemTotal: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
  },
  totalLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    color: COLORS.primary,
    fontSize: 20,
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
    maxHeight: '80%',
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
    borderBottomColor: COLORS.borderDark
  },
  modalItemText: {
    color: '#FFF',
    fontSize: 16
  },
  modalItemSub: {
    color: COLORS.primary,
    fontSize: 14,
    marginTop: 4
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

export default CreateOrderScreen;
