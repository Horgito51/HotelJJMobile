import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../../shared/components/Screen';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { useAuth } from '../../../shared/hooks/useAuth';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export function AccountScreen() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <Screen>
        <Text style={styles.subtitle}>Cargando sesión...</Text>
      </Screen>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.username.slice(0, 1).toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>Mi cuenta</Text>
          <Text style={styles.subtitle}>{user.email}</Text>
        </View>

        <Card style={styles.card}>
          <InfoRow label="Correo" value={user.email} />
          <InfoRow label="Usuario" value={user.username} />
        </Card>

        <Button title="Cerrar sesión" variant="outline" onPress={logout} />
      </View>
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  avatarText: {
    ...typography.h2,
    color: '#fff',
  },
  title: {
    ...typography.h2,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  infoRow: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.body,
    fontWeight: '700',
  },
});
