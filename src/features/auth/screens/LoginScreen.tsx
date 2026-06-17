import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import type { AuthStackParamList } from '../../../application/navigation/types';
import { Screen } from '../../../shared/components/Screen';
import { TextField } from '../../../shared/components/TextField';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { useAuth } from '../../../shared/hooks/useAuth';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password) {
      setError('Ingresa usuario y contraseña.');
      return;
    }
    setLoading(true);
    try {
      const result = await login({ username: username.trim(), password });
      if (!result.success) {
        setError(result.message ?? 'Credenciales inválidas.');
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Cuenta Hotel JJ</Text>
          <Text style={styles.title}>Bienvenido de vuelta</Text>
          <Text style={styles.subtitle}>
            Accede para completar reservas más rápido y consultar tus datos.
          </Text>
        </View>

        <Card style={styles.formCard}>
          <TextField
            label="Usuario"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <TextField
            label="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Iniciar sesión" loading={loading} onPress={handleLogin} />
          <Button
            title="Crear cuenta"
            variant="ghost"
            onPress={() => navigation.navigate('Register')}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  kicker: {
    ...typography.caption,
    color: colors.coral,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  formCard: {
    gap: spacing.xs,
    padding: spacing.lg,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    backgroundColor: colors.errorBg,
    borderRadius: 12,
    padding: spacing.ms,
  },
});
