import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import GradientBackground from '../../components/common/GradientBackground';
import { useAppTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { forgotPassword } = useAuth();
  const theme = useAppTheme();

  const handleReset = async () => {
    try {
      setLoading(true);
      await forgotPassword(email);
      setMessage('Password reset instructions sent to your email.');
    } catch (err: any) {
      setMessage(err.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="lock-reset" size={80} color={theme.colors.onPrimary} />
          </View>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onPrimary }]}>Reset Password</Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onPrimary }]}>Enter your email address and we'll send you instructions to reset your password.</Text>

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" autoCapitalize="none" keyboardType="email-address" left={<TextInput.Icon icon="email" />} style={styles.input} />
            <Button mode="contained" onPress={handleReset} loading={loading} style={styles.button}>Send Reset Link</Button>
            <Button mode="text" onPress={() => navigation.navigate('Login')} style={styles.textButton}>Back to Login</Button>
          </View>
        </View>
        <Snackbar visible={!!message} onDismiss={() => setMessage('')} duration={3000}>{message}</Snackbar>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  iconContainer: { alignItems: 'center', marginBottom: 16 },
  title: { textAlign: 'center', fontWeight: 'bold', marginBottom: 8 },
  description: { textAlign: 'center', marginBottom: 32, opacity: 0.9 },
  card: { padding: 24, borderRadius: 16, elevation: 4 },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
  textButton: { marginTop: 12 },
});

export default ForgotPasswordScreen;
