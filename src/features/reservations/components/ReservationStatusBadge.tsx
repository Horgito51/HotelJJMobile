import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

type ReservationStatusBadgeProps = {
  status: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  CONFIRMADA: { bg: colors.successBg, text: colors.success },
  PENDIENTE: { bg: colors.accentLight, text: colors.primaryDark },
  CANCELADA: { bg: colors.errorBg, text: colors.error },
};

export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  const normalized = status.toUpperCase();
  const palette = statusColors[normalized] ?? { bg: colors.border, text: colors.text };

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.text, { color: palette.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
