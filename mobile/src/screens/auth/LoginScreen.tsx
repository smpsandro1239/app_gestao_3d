import { ChevronRight, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

const LoginScreen = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1629196911514-cfd8d6316216?q=80&w=2671&auto=format&fit=crop' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />

          <View style={styles.header}>
            <Text style={styles.title}>3D Manager</Text>
            <Text style={styles.subtitle}>Gestão de Produção Aditiva</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail color={COLORS.slate400} size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.slate400}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock color={COLORS.slate400} size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.slate400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Entrar</Text>
                  <ChevronRight color="#FFF" size={20} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: 60,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
