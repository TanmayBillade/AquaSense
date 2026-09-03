import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import GradientBackground from '../../components/common/GradientBackground';
import { useAppTheme } from '../../theme';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const theme = useAppTheme();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.onPrimary }]}>Create Account</Text>

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <TextInput label="Name" value={name} onChangeText={setName} mode="outlined" left={<TextInput.Icon icon="account" />} style={styles.input} />
            <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" autoCapitalize="none" keyboardType="email-address" left={<TextInput.Icon icon="email" />} style={styles.input} />
            <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry left={<TextInput.Icon icon="lock" />} style={styles.input} />
            <TextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} mode="outlined" secureTextEntry left={<TextInput.Icon icon="lock-check" />} style={styles.input} />
            <Button mode="contained" onPress={handleRegister} loading={loading} style={styles.button}>Register</Button>
            <Button mode="text" onPress={() => navigation.navigate('Login')} style={styles.textButton}>Already have an account? Login</Button>
          </View>
        </ScrollView>
        <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000}>{error}</Snackbar>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', fontWeight: 'bold', marginBottom: 32 },
  card: { padding: 24, borderRadius: 16, elevation: 4 },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
  textButton: { marginTop: 12 },
});

export default RegisterScreen;
