import * as ImagePicker from 'expo-image-picker';
import {
    Camera,
    Check,
    ChevronLeft,
    Clock,
    DollarSign,
    Euro,
    Image as ImageIcon,
    Layers,
    Package,
    Save,
    Tag,
    Type,
    Weight
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image as RNImage,
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
import { useSettings } from '../../context/SettingsContext';
import { createProduct, getProduct, updateProduct } from '../../services/productsService';
import { uploadImage } from '../../services/uploadService';
import { COLORS } from '../../utils/theme';

const AddProductScreen = ({ navigation, route }: any) => {
  const { productId } = route.params || {};
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [productionCost, setProductionCost] = useState('');
  const [estimatedWeight, setEstimatedWeight] = useState('');
  const [printTime, setPrintTime] = useState('');
  const [stockQuantity, setStockQuantity] = useState('0');
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { currency } = useSettings();
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const product = await getProduct(productId);
      setName(product.nome);
      setDescription(product.descricao || '');
      setPrice(product.preco.toString());
      setProductionCost(product.custoProducao?.toString() || '');
      setEstimatedWeight(product.pesoEstimado?.toString() || '');
      setPrintTime(product.tempoImpressao?.toString() || '');
      setStockQuantity(product.stockQuantity.toString());
      if (product.imagens && product.imagens.length > 0) {
        setImageUrl(product.imagens[0]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o produto');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos de acesso às suas fotos para continuar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLocalImageUri(result.assets[0].uri);
      setImageUrl('');
    }
  };

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert('Erro', 'Nome e Preço são obrigatórios.');
      return;
    }

    setIsUploading(true);
    console.log('Starting save process for:', name);

    let finalImageUrl = imageUrl;

    try {
      // Helper to handle comma as decimal separator (common in PT/BR)
      const parseNum = (val: string) => {
        if (!val) return 0;
        const sanitized = val.toString().replace(',', '.');
        return parseFloat(sanitized) || 0;
      };

      if (localImageUri) {
        console.log('Uploading image:', localImageUri);
        const uploadedUrl = await uploadImage(localImageUri);
        finalImageUrl = uploadedUrl;
      }

      const productData = {
        nome: name,
        descricao: description,
        preco: parseNum(price),
        custoProducao: parseNum(productionCost),
        pesoEstimado: parseNum(estimatedWeight),
        tempoImpressao: parseNum(printTime),
        stockQuantity: parseNum(stockQuantity),
        imagens: finalImageUrl ? [finalImageUrl] : [],
      };

      console.log(productId ? 'Updating product with:' : 'Creating product with:', productData);

      if (productId) {
        await updateProduct(productId, productData);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        await createProduct(productData);
        Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
      }

      setIsSuccess(true);

      setTimeout(() => {
          navigation.goBack();
      }, 1500);

    } catch (error: any) {
      console.error('AddProduct Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro de conexão';
      Alert.alert('Erro', `Falha ao salvar: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isWide = width > 768;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                <ChevronLeft color="#FFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Novo Produto 3D</Text>
            <View style={{ width: 44 }} />
        </View>

        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
        >
            <View style={[styles.formWrapper, isWide && { maxWidth: 800, alignSelf: 'center' }]}>
                <InputGroup
                    icon={Tag}
                    label="NOME DO MODELO"
                    placeholder="Ex: Miniatura Dragão, Suporte Headset..."
                    value={name}
                    onChangeText={setName}
                />

                <InputGroup
                    icon={Type}
                    label="DESCRIÇÃO"
                    placeholder="Detalhes sobre a peça..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <View style={[styles.row, !isWide && { flexDirection: 'column' }]}>
                    <View style={{ flex: 1 }}>
                        <InputGroup
                            icon={currency === '€' ? Euro : DollarSign}
                            label={`PREÇO DE VENDA (${currency})`}
                            placeholder="25.00"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                        />
                    </View>
                    <View style={[{ flex: 1 }, isWide ? { marginLeft: 15 } : { marginTop: 0 }]}>
                        <InputGroup
                            icon={currency === '€' ? Euro : DollarSign}
                            label={`CUSTO FIXO (${currency})`}
                            placeholder="5.00"
                            keyboardType="numeric"
                            value={productionCost}
                            onChangeText={setProductionCost}
                        />
                    </View>
                </View>

                <View style={[styles.row, !isWide && { flexDirection: 'column' }]}>
                    <View style={{ flex: 1 }}>
                        <InputGroup
                            icon={Weight}
                            label="PESO EST. (G)"
                            placeholder="150"
                            keyboardType="numeric"
                            value={estimatedWeight}
                            onChangeText={setEstimatedWeight}
                        />
                    </View>
                    <View style={[{ flex: 1 }, isWide ? { marginLeft: 15 } : { marginTop: 0 }]}>
                        <InputGroup
                            icon={Clock}
                            label="TEMPO (MIN)"
                            placeholder="120"
                            keyboardType="numeric"
                            value={printTime}
                            onChangeText={setPrintTime}
                        />
                    </View>
                </View>

                <View style={[styles.row, !isWide && { flexDirection: 'column' }]}>
                    <View style={{ flex: 1 }}>
                        <InputGroup
                            icon={Layers}
                            label="STOCK INICIAL"
                            placeholder="0"
                            keyboardType="numeric"
                            value={stockQuantity}
                            onChangeText={setStockQuantity}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: isWide ? 15 : 0 }} />
                </View>

                <View style={styles.imageSection}>
                    <View style={styles.sectionHeader}>
                        <ImageIcon color={COLORS.primary} size={18} />
                        <Text style={styles.inputLabel}>IMAGEM DO PRODUTO</Text>
                    </View>

                    <View style={[styles.imagePickerOptions, !isWide && { flexDirection: 'column', alignItems: 'stretch' }]}>
                        <TouchableOpacity style={[styles.imagePickerBtn, !isWide && { width: '100%', height: 180 }]} onPress={pickImage}>
                            {localImageUri ? (
                                <RNImage source={{ uri: localImageUri }} style={styles.previewImage} resizeMode="cover" />
                            ) : (
                                <View style={styles.imagePlaceHolder}>
                                    <Camera color={COLORS.slate400} size={32} />
                                    <Text style={styles.imagePlaceholderText}>Carregar Foto</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <View style={[styles.urlInputContainer, !isWide && { marginTop: 15 }]}>
                            {isWide && <Text style={styles.orText}>— OU —</Text>}
                            <InputGroup
                                icon={Package}
                                label="URL DA IMAGEM"
                                placeholder="https://..."
                                value={imageUrl}
                                onChangeText={(text: string) => {
                                    setImageUrl(text);
                                    setLocalImageUri(null);
                                }}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.saveBtn,
                        (isUploading || !name || !price) && styles.saveBtnDisabled,
                        isSuccess && { backgroundColor: COLORS.success }
                    ]}
                    onPress={handleSave}
                    disabled={isUploading || isSuccess || !name || !price}
                >
                    {isUploading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : isSuccess ? (
                        <>
                            <Check color="#FFF" size={20} />
                            <Text style={styles.saveBtnText}>Produto Guardado!</Text>
                        </>
                    ) : (
                        <>
                            <Save color="#FFF" size={20} />
                            <Text style={styles.saveBtnText}>Guardar Produto</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const InputGroup = ({ icon: Icon, label, placeholder, keyboardType, value, onChangeText, multiline }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputWrapper, multiline && styles.multilineWrapper]}>
      <Icon color={COLORS.primary} size={18} style={[styles.inputIcon, multiline && { marginTop: 15 }]} />
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.slate400}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  </View>
);

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
    paddingBottom: 150, // Increased to ensure the bottom button is never clipped
    width: '100%',
  },
  formWrapper: {
    width: '100%',
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    height: 56,
  },
  multilineWrapper: {
    height: 100,
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginLeft: 15,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    color: '#FFF',
    fontSize: 15,
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top',
    paddingTop: 15,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  imageSection: {
    marginBottom: 25,
  },
  imagePickerOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  imagePickerBtn: {
    width: 120,
    height: 120,
    borderRadius: 15,
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceHolder: {
    alignItems: 'center',
    gap: 5,
  },
  imagePlaceholderText: {
    color: COLORS.slate500,
    fontSize: 10,
    fontWeight: 'bold',
  },
  urlInputContainer: {
    flex: 1,
  },
  orText: {
    color: COLORS.slate500,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AddProductScreen;
