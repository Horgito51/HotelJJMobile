import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { formatDisplayDate, nightsBetween } from '../../../shared/utils/date';
import { estimateStayTotal, formatMoney } from '../../../shared/utils/money';
import type { BookingDraft } from '../../marketplace/types/accommodation.types';

type PriceSummaryProps = {
  draft: BookingDraft;
  estimated?: boolean;
};

export function PriceSummary({ draft, estimated = true }: PriceSummaryProps) {
  const nights = nightsBetween(draft.search.fechaInicio, draft.search.fechaFin);
  const { subtotal, iva, total } = estimateStayTotal(
    draft.selectedRoom.precioNocheAplicado,
    nights,
    draft.selectedRoom.numHabitaciones,
  );

  return (
    <Card style={styles.card}>
      <Text style={styles.kicker}>Resumen {estimated ? 'estimado' : ''}</Text>
      <Text style={styles.hotel}>{draft.nombre}</Text>
      <View style={styles.metaBox}>
        <Text style={styles.meta}>
          {formatDisplayDate(draft.search.fechaInicio)} - {formatDisplayDate(draft.search.fechaFin)}
        </Text>
        <Text style={styles.meta}>
          {draft.selectedRoom.nombre} x {draft.selectedRoom.numHabitaciones} · {nights} noche(s)
        </Text>
      </View>
      <PriceRow label="Subtotal" value={formatMoney(subtotal, draft.moneda)} />
      <PriceRow label="IVA (15%)" value={formatMoney(iva, draft.moneda)} />
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total estimado</Text>
        <Text style={styles.totalValue}>{formatMoney(total, draft.moneda)}</Text>
      </View>
      {estimated ? (
        <Text style={styles.note}>
          El total oficial se confirma al crear la reserva en el backend.
        </Text>
      ) : null}
    </Card>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  kicker: {
    ...typography.caption,
    color: colors.coral,
    textTransform: 'uppercase',
  },
  hotel: {
    ...typography.h3,
  },
  metaBox: {
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.ms,
    gap: spacing.xs,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: {
    ...typography.bodySmall,
  },
  value: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...typography.label,
  },
  totalValue: {
    ...typography.h3,
    color: colors.primary,
  },
  note: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
