import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
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
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import * as Yup from 'yup';
import InputGroup from '../../components/InputGroup';
import { useSettings } from '../../context/SettingsContext';
import { createProduct, getProduct, updateProduct } from '../../services/productsService';
import { uploadImage } from '../../services/uploadService';
import { COLORS } from '../../utils/theme';

const ProductSchema = Yup.object().shape({
    name: Yup.string().required('O nome é obrigatório'),
    description: Yup.string(),
    price: Yup.number().typeError('Deve ser um número').positive('O preço deve ser positivo').required('O preço é obrigatório'),
    productionCost: Yup.number().typeError('Deve ser um número').min(0, 'Não pode ser negativo'),
    estimatedWeight: Yup.number().typeError('Deve ser um número').positive('Deve ser maior que zero'),
    printTime: Yup.number().typeError('Deve ser um número').positive('Deve ser maior que zero'),
    stockQuantity: Yup.number().typeError('Deve ser um número').integer('Deve ser um inteiro').min(0, 'Não pode ser negativo'),
    imageUrl: Yup.string(),
});

const AddProductScreen = ({ navigation, route }: any) => {
  const { productId } = route.params || {};
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
      name: '',
      description: '',
      price: '',
      productionCost: '',
      estimatedWeight: '',
      printTime: '',
      stockQuantity: '0',
      imageUrl: '',
  });

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
      setInitialValues({
          name: product.nome,
          description: product.descricao || '',
          price: product.preco.toString(),
          productionCost: product.custoProducao?.toString() || '',
          estimatedWeight: product.pesoEstimado?.toString() || '',
          printTime: product.tempoImpressao?.toString() || '',
          stockQuantity: product.stockQuantity.toString(),
          imageUrl: (product.imagens && product.imagens.length > 0) ? product.imagens[0] : '',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o produto');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async (setFieldValue: any) => {
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
      setFieldValue('imageUrl', ''); // Clear URL input if picking local
    }
  };

  const handleSave = async (values: any, { setSubmitting }: any) => {
    console.log('Starting save process for:', values.name);

    let finalImageUrl = values.imageUrl;

    try {
      // Helper to handle comma as decimal separator
      const parseNum = (val: string | number) => {
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
        nome: values.name,
        descricao: values.description,
        preco: parseNum(values.price),
        custoProducao: parseNum(values.productionCost),
        pesoEstimado: parseNum(values.estimatedWeight),
        tempoImpressao: parseNum(values.printTime),
        stockQuantity: parseNum(values.stockQuantity),
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
      setSubmitting(false);
    }
  };

  const isWide = width > 768;

  if (isLoading) {
      return (
          <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color={COLORS.primary} />
          </SafeAreaView>
      );
  }

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
            <Text style={styles.headerTitle}>{productId ? 'Editar Produto' : 'Novo Produto 3D'}</Text>
            <View style={{ width: 44 }} />
        </View>

        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={ProductSchema}
            onSubmit={handleSave}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting, isValid }) => (
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
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            error={touched.name && errors.name}
                        />

                        <InputGroup
                            icon={Type}
                            label="DESCRIÇÃO"
                            placeholder="Detalhes sobre a peça..."
                            value={values.description}
                            onChangeText={handleChange('description')}
                            onBlur={handleBlur('description')}
                            multiline
                        />

                        <View style={[styles.row, !isWide && { flexDirection: 'column' }]}>
                            <View style={{ flex: 1 }}>
                                <InputGroup
                                    icon={currency === '€' ? Euro : DollarSign}
                                    label={`PREÇO DE VENDA (${currency})`}
                                    placeholder="25.00"
                                    keyboardType="numeric"
                                    value={values.price}
                                    onChangeText={handleChange('price')}
                                    onBlur={handleBlur('price')}
                                    error={touched.price && errors.price}
                                />
                            </View>
                            <View style={[{ flex: 1 }, isWide ? { marginLeft: 15 } : { marginTop: 0 }]}>
                                <InputGroup
                                    icon={currency === '€' ? Euro : DollarSign}
                                    label={`CUSTO FIXO (${currency})`}
                                    placeholder="5.00"
                                    keyboardType="numeric"
                                    value={values.productionCost}
                                    onChangeText={handleChange('productionCost')}
                                    onBlur={handleBlur('productionCost')}
                                    error={touched.productionCost && errors.productionCost}
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
                                    value={values.estimatedWeight}
                                    onChangeText={handleChange('estimatedWeight')}
                                    onBlur={handleBlur('estimatedWeight')}
                                    error={touched.estimatedWeight && errors.estimatedWeight}
                                />
                            </View>
                            <View style={[{ flex: 1 }, isWide ? { marginLeft: 15 } : { marginTop: 0 }]}>
                                <InputGroup
                                    icon={Clock}
                                    label="TEMPO (MIN)"
                                    placeholder="120"
                                    keyboardType="numeric"
                                    value={values.printTime}
                                    onChangeText={handleChange('printTime')}
                                    onBlur={handleBlur('printTime')}
                                    error={touched.printTime && errors.printTime}
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
                                    value={values.stockQuantity}
                                    onChangeText={handleChange('stockQuantity')}
                                    onBlur={handleBlur('stockQuantity')}
                                    error={touched.stockQuantity && errors.stockQuantity}
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
                                <TouchableOpacity style={[styles.imagePickerBtn, !isWide && { width: '100%', height: 180 }]} onPress={() => pickImage(setFieldValue)}>
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
                                        value={values.imageUrl}
                                        onChangeText={(text: string) => {
                                            setFieldValue('imageUrl', text);
                                            setLocalImageUri(null);
                                        }}
                                        onBlur={handleBlur('imageUrl')}
                                        error={touched.imageUrl && errors.imageUrl}
                                    />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.saveBtn,
                                (isSubmitting || !isValid) && styles.saveBtnDisabled,
                                isSuccess && { backgroundColor: COLORS.success }
                            ]}
                            onPress={() => handleSubmit()}
                            disabled={isSubmitting || isSuccess || !isValid}
                        >
                            {isSubmitting ? (
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
            )}
        </Formik>
      </KeyboardAvoidingView>
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
    paddingBottom: 150, // Increased to ensure the bottom button is never clipped
    width: '100%',
  },
  formWrapper: {
    width: '100%',
  },
  inputLabel: {
    color: COLORS.slate500,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
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
