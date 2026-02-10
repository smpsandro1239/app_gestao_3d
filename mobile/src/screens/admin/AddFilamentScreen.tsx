import { Formik } from 'formik';
import {
    AlertCircle,
    Check,
    ChevronLeft,
    DollarSign,
    Euro,
    Palette,
    Save,
    Tag,
    Weight,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import * as Yup from 'yup';

import { useSettings } from '../../context/SettingsContext';
import { createFilament } from '../../services/filamentService';
import { COLORS } from '../../utils/theme';

const FilamentSchema = Yup.object().shape({
    brand: Yup.string().required('A marca é obrigatória'),
    color: Yup.string().required('A cor é obrigatória'),
    weight: Yup.number().typeError('O peso deve ser um número').positive('O peso deve ser positivo').required('O peso é obrigatório'),
    price: Yup.number().typeError('O preço deve ser um número').positive('O preço deve ser positivo').required('O preço é obrigatório'),
    stockAlert: Yup.number().typeError('O alerta deve ser um número').positive('Deve ser maior que zero').required('O alerta é obrigatório'),
    material: Yup.string().required(),
    colorHex: Yup.string().required(),
});

const AddFilamentScreen = ({ navigation }: any) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const { currency } = useSettings();
    const { width } = useWindowDimensions();

    const materials = ['PLA', 'PETG', 'ABS', 'TPU', 'ASA'];
    const colorsPalette = [
        { name: 'Preto', hex: '#000000' },
        { name: 'Branco', hex: '#FFFFFF' },
        { name: 'Cinza', hex: '#6b7280' },
        { name: 'Vermelho', hex: '#ef4444' },
        { name: 'Azul', hex: '#3b82f6' },
        { name: 'Verde', hex: '#22c55e' },
        { name: 'Amarelo', hex: '#eab308' },
        { name: 'Laranja', hex: '#f97316' },
        { name: 'Roxo', hex: '#a855f7' },
        { name: 'Rosa', hex: '#ec4899' },
        { name: 'Cobre', hex: '#b45309' },
        { name: 'Ouro', hex: '#d97706' },
        { name: 'Prata', hex: '#94a3b8' },
    ];

    const handleSubmitForm = async (values: any, { setSubmitting }: any) => {
        try {
            await createFilament({
                marca: values.brand,
                material: values.material,
                cor: values.color,
                corHex: values.colorHex,
                pesoInicial: Number(values.weight),
                pesoAtual: Number(values.weight),
                custo: Number(values.price),
                alertaMinimo: Number(values.stockAlert),
                ativo: true
            });

            setIsSuccess(true);
            setTimeout(() => {
                navigation.goBack();
            }, 2000);

        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Falha ao salvar o filamento.';
            Alert.alert('Erro', Array.isArray(errorMsg) ? errorMsg.join('\n') : errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const isWide = width > 600;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <ChevronLeft color="#FFF" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo Carretel</Text>
                <View style={{ width: 44 }} />
            </View>

            <Formik
                initialValues={{
                    brand: '',
                    color: '',
                    weight: '',
                    price: '',
                    stockAlert: '100',
                    material: 'PLA',
                    colorHex: '#000000',
                }}
                validationSchema={FilamentSchema}
                onSubmit={handleSubmitForm}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting, isValid }) => (
                    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                        <Text style={styles.sectionLabel}>TIPO DE MATERIAL</Text>
                        <View style={styles.materialGrid}>
                            {materials.map((m) => (
                                <TouchableOpacity
                                    key={m}
                                    style={[styles.materialChip, values.material === m && styles.activeChip]}
                                    onPress={() => setFieldValue('material', m)}
                                >
                                    <Text style={[styles.chipText, values.material === m && styles.activeChipText]}>{m}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <InputGroup
                            icon={Tag}
                            label="MARCA / FABRICANTE"
                            placeholder="Ex: Hatchbox, Prusament..."
                            value={values.brand}
                            onChangeText={handleChange('brand')}
                            onBlur={handleBlur('brand')}
                            error={touched.brand && errors.brand}
                        />

                        <InputGroup
                            icon={Palette}
                            label="NOME DA COR"
                            placeholder="Ex: Azul Cobalto"
                            value={values.color}
                            onChangeText={handleChange('color')}
                            onBlur={handleBlur('color')}
                            error={touched.color && errors.color}
                        />

                        <Text style={styles.sectionLabel}>PALETA DE CORES</Text>
                        <View style={styles.colorGrid}>
                            {colorsPalette.map((c) => (
                                <TouchableOpacity
                                    key={c.hex}
                                    style={[
                                        styles.colorOption,
                                        values.colorHex === c.hex && styles.activeColorOption,
                                        { backgroundColor: c.hex }
                                    ]}
                                    onPress={() => {
                                        setFieldValue('colorHex', c.hex);
                                        if (!values.color) setFieldValue('color', c.name);
                                    }}
                                >
                                    {values.colorHex === c.hex && (
                                        <Check color={c.hex === '#FFFFFF' ? '#000' : '#FFF'} size={16} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={[styles.row, !isWide && { flexDirection: 'column' }]}>
                            <View style={{ flex: 1 }}>
                                <InputGroup
                                    icon={Weight}
                                    label="PESO INICIAL (G)"
                                    placeholder="1000"
                                    keyboardType="numeric"
                                    value={values.weight}
                                    onChangeText={handleChange('weight')}
                                    onBlur={handleBlur('weight')}
                                    error={touched.weight && errors.weight}
                                />
                            </View>
                            <View style={[{ flex: 1 }, isWide ? { marginLeft: 15 } : { marginTop: 0 }]}>
                                <InputGroup
                                    icon={currency === '€' ? Euro : DollarSign}
                                    label={`PREÇO PAGO (${currency})`}
                                    placeholder="24.90"
                                    keyboardType="numeric"
                                    value={values.price}
                                    onChangeText={handleChange('price')}
                                    onBlur={handleBlur('price')}
                                    error={touched.price && errors.price}
                                />
                            </View>
                        </View>

                        <InputGroup
                            icon={AlertCircle}
                            label="ALERTA DE STOCK BAIXO (G)"
                            placeholder="100"
                            keyboardType="numeric"
                            helpText="Aviso quando o carretel atingir este peso."
                            value={values.stockAlert}
                            onChangeText={handleChange('stockAlert')}
                            onBlur={handleBlur('stockAlert')}
                            error={touched.stockAlert && errors.stockAlert}
                        />

                        <View style={styles.previewCard}>
                            <Text style={styles.previewLabel}>PRÉ-VISUALIZAÇÃO</Text>
                            <View style={styles.previewContent}>
                                <View style={[styles.previewColor, { backgroundColor: values.colorHex, borderWidth: values.colorHex === '#FFFFFF' ? 1 : 0, borderColor: COLORS.borderDark }]} />
                                <View>
                                    <Text style={styles.previewTitle}>{values.brand || 'Marca'} {values.material}</Text>
                                    <Text style={styles.previewSub}>{values.color || 'Cor'} • 1.75mm</Text>
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
                                    <Text style={styles.saveBtnText}>Adicionado!</Text>
                                </>
                            ) : (
                                <>
                                    <Save color="#FFF" size={20} />
                                    <Text style={styles.saveBtnText}>Adicionar ao Stock</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </Formik>
        </SafeAreaView>
    );
};

const InputGroup = ({ icon: Icon, label, placeholder, keyboardType, helpText, value, onChangeText, onBlur, error }: any) => (
    <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.inputWrapper, error && { borderColor: '#ef4444' }]}>
            <Icon color={error ? '#ef4444' : COLORS.primary} size={18} style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={COLORS.slate400}
                keyboardType={keyboardType}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
            />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
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
        paddingBottom: 50,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    sectionLabel: {
        color: COLORS.primary,
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 15,
    },
    materialGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 30,
    },
    materialChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: COLORS.cardDark,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    activeChip: {
        backgroundColor: COLORS.primary + '20',
        borderColor: COLORS.primary,
    },
    chipText: {
        color: COLORS.slate400,
        fontWeight: 'bold',
    },
    activeChipText: {
        color: COLORS.primary,
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
    inputIcon: {
        marginLeft: 15,
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        color: '#FFF',
        fontSize: 15,
    },
    helpText: {
        color: COLORS.slate500,
        fontSize: 11,
        marginTop: 6,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 11,
        marginTop: 6,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 30,
        backgroundColor: COLORS.cardDark,
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    colorOption: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeColorOption: {
        borderColor: COLORS.primary,
        transform: [{ scale: 1.1 }],
    },
    colorPickerTrigger: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: COLORS.cardDark,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: 15,
    },
    colorPreview: {
        width: 30,
        height: 30,
        borderRadius: 6,
    },
    previewCard: {
        marginTop: 20,
        padding: 20,
        backgroundColor: COLORS.primary + '0D',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.primary + '20',
        marginBottom: 30,
    },
    previewLabel: {
        color: COLORS.primary + '99',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    previewContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    previewColor: {
        width: 50,
        height: 50,
        borderRadius: 12,
    },
    previewTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    previewSub: {
        color: COLORS.slate500,
        fontSize: 12,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
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
});

export default AddFilamentScreen;
