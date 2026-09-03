import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import GradientBackground from '../../components/common/GradientBackground';
import { useAppTheme } from '../../theme';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const theme = useAppTheme();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <Image source={require('../../../assets/logo.jpg')} style={styles.logo} />
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.onPrimary }]}>AquaSense</Text>
          <Text variant="titleMedium" style={[styles.subtitle, { color: theme.colors.onPrimary }]}>IoT Water Quality Monitor</Text>

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" autoCapitalize="none" keyboardType="email-address" left={<TextInput.Icon icon="email" />} style={styles.input} />
            <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry left={<TextInput.Icon icon="lock" />} style={styles.input} />
            <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>Login</Button>
            <Button mode="text" onPress={() => navigation.navigate('ForgotPassword')} style={styles.textButton}>Forgot Password?</Button>
            <Button mode="text" onPress={() => navigation.navigate('Register')} style={styles.textButton}>Don't have an account? Register</Button>
          </View>
        </View>
        <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000}>{error}</Snackbar>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 16, borderRadius: 50 },
  title: { textAlign: 'center', fontWeight: 'bold' },
  subtitle: { textAlign: 'center', marginBottom: 32, opacity: 0.9 },
  card: { padding: 24, borderRadius: 16, elevation: 4 },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
  textButton: { marginTop: 12 },
});

export default LoginScreen;
