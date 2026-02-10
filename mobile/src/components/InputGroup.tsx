import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../utils/theme';

interface InputGroupProps {
  icon: LucideIcon;
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: any) => void;
  multiline?: boolean;
  error?: string | boolean;
  editable?: boolean;
  rightIcon?: LucideIcon;
}

const InputGroup: React.FC<InputGroupProps> = ({
  icon: Icon,
  label,
  placeholder,
  keyboardType,
  value,
  onChangeText,
  onBlur,
  multiline,
  error,
  editable = true,
  rightIcon: RightIcon
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputWrapper, multiline && styles.multilineWrapper, error ? { borderColor: COLORS.danger } : {}]}>
      <Icon color={error ? COLORS.danger : COLORS.primary} size={18} style={[styles.inputIcon, multiline ? { marginTop: 15 } : {}]} />
      <TextInput
        style={[styles.input, multiline && styles.multilineInput, !editable && { opacity: 0.7 }]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.slate400}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        multiline={multiline}
        editable={editable}
      />
      {RightIcon && <RightIcon color={COLORS.slate400} size={20} style={{ marginRight: 15 }} />}
    </View>
    {error && typeof error === 'string' && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
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
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
});

export default InputGroup;
