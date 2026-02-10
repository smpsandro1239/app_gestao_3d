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
import { useSettings } from '../../context/SettingsContext';
import { createFilament } from '../../services/filamentService';
import { COLORS } from '../../utils/theme';

const AddFilamentScreen = ({ navigation }: any) => {
  const [material, setMaterial] = useState('PLA');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [stockAlert, setStockAlert] = useState('100');
  const [colorHex, setColorHex] = useState('#000000');
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = async () => {
    if (!brand || !color || !weight || !price) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      await createFilament({
        marca: brand,
        material,
        cor: color,
        corHex: colorHex,
        pesoInicial: Number(weight),
        pesoAtual: Number(weight),
        custo: Number(price),
        alertaMinimo: Number(stockAlert),
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
      setIsSaving(false);
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

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionLabel}>TIPO DE MATERIAL</Text>
        <View style={styles.materialGrid}>
          {materials.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.materialChip, material === m && styles.activeChip]}
              onPress={() => setMaterial(m)}
            >
              <Text style={[styles.chipText, material === m && styles.activeChipText]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <InputGroup
          icon={Tag}
          label="MARCA / FABRICANTE"
          placeholder="Ex: Hatchbox, Prusament..."
          value={brand}
          onChangeText={setBrand}
        />

        <InputGroup
          icon={Palette}
          label="NOME DA COR"
          placeholder="Ex: Azul Cobalto"
          value={color}
          onChangeText={setColor}
        />

        <Text style={styles.sectionLabel}>PALETA DE CORES</Text>
        <View style={styles.colorGrid}>
          {colorsPalette.map((c) => (
            <TouchableOpacity
              key={c.hex}
              style={[
                styles.colorOption,
                colorHex === c.hex && styles.activeColorOption,
                { backgroundColor: c.hex }
              ]}
              onPress={() => {
                setColorHex(c.hex);
                if (!color) setColor(c.name);
              }}
            >
              {colorHex === c.hex && (
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
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          <View style={[{ flex: 1 }, isWide ? { marginLeft: 15 } : { marginTop: 0 }]}>
            <InputGroup
              icon={currency === '€' ? Euro : DollarSign}
              label={`PREÇO PAGO (${currency})`}
              placeholder="24.90"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        </View>

        <InputGroup
          icon={AlertCircle}
          label="ALERTA DE STOCK BAIXO (G)"
          placeholder="100"
          keyboardType="numeric"
          helpText="Aviso quando o carretel atingir este peso."
          value={stockAlert}
          onChangeText={setStockAlert}
        />

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>PRÉ-VISUALIZAÇÃO</Text>
          <View style={styles.previewContent}>
            <View style={[styles.previewColor, { backgroundColor: colorHex, borderWidth: colorHex === '#FFFFFF' ? 1 : 0, borderColor: COLORS.borderDark }]} />
            <View>
              <Text style={styles.previewTitle}>{brand || 'Marca'} {material}</Text>
              <Text style={styles.previewSub}>{color || 'Cor'} • 1.75mm</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
            style={[
                styles.saveBtn,
                (isSaving || !brand || !color) && styles.saveBtnDisabled,
                isSuccess && { backgroundColor: COLORS.success }
            ]}
            onPress={handleSave}
            disabled={isSaving || isSuccess || !brand || !color}
        >
          {isSaving ? (
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
    </SafeAreaView>
  );
};

const InputGroup = ({ icon: Icon, label, placeholder, keyboardType, helpText, value, onChangeText }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Icon color={COLORS.primary} size={18} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.slate400}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
    {helpText && <Text style={styles.helpText}>{helpText}</Text>}
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
