import { ScrollView, StyleSheet, Text } from 'react-native';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!nombres.trim() || !correo.trim() || !username.trim() || !password) {
      setError('Completa los campos obligatorios.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim(),
        username: username.trim(),
        password,
        confirmPassword,
      });
      if (!result.success) {
        setError(result.message ?? 'No se pudo registrar.');
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.kicker}>Nueva cuenta</Text>
        <Text style={styles.title}>Crea tu perfil</Text>
        <Text style={styles.subtitle}>Guarda tus datos para futuras reservas en Hotel JJ.</Text>

        <Card style={styles.card}>
          <TextField label="Nombres *" value={nombres} onChangeText={setNombres} />
          <TextField label="Apellidos" value={apellidos} onChangeText={setApellidos} />
          <TextField
            label="Correo *"
            value={correo}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setCorreo}
          />
          <TextField
            label="Usuario *"
            value={username}
            autoCapitalize="none"
            onChangeText={setUsername}
          />
          <TextField
            label="Contraseña *"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextField
            label="Confirmar contraseña *"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Registrarse" loading={loading} onPress={handleRegister} />
          <Button
            title="Ya tengo cuenta"
            variant="ghost"
            onPress={() => navigation.navigate('Login')}
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
  kicker: {
    ...typography.caption,
    color: colors.coral,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.h1,
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  card: {
    padding: spacing.lg,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    backgroundColor: colors.errorBg,
    borderRadius: 12,
    padding: spacing.ms,
    marginBottom: spacing.sm,
  },
});
