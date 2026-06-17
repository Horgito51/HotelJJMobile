import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { formatDisplayDate } from '../../../shared/utils/date';
import { formatMoney } from '../../../shared/utils/money';
import type { ReservationModel } from '../types/reservation.types';
import { ReservationStatusBadge } from './ReservationStatusBadge';

type ConfirmationSummaryProps = {
  reservation: ReservationModel;
  accommodationName?: string;
};

export function ConfirmationSummary({ reservation, accommodationName }: ConfirmationSummaryProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.success}>✓ Reserva registrada</Text>
      <Text style={styles.code}>{reservation.codigoReserva}</Text>
      {accommodationName ? <Text style={styles.hotel}>{accommodationName}</Text> : null}
      <ReservationStatusBadge status={reservation.estadoReserva} />
      <View style={styles.row}>
        <Text style={styles.label}>Entrada</Text>
        <Text style={styles.value}>{formatDisplayDate(reservation.fechaInicio.slice(0, 10))}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Salida</Text>
        <Text style={styles.value}>{formatDisplayDate(reservation.fechaFin.slice(0, 10))}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatMoney(reservation.subtotalReserva)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>IVA</Text>
        <Text style={styles.value}>{formatMoney(reservation.valorIva)}</Text>
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatMoney(reservation.totalReserva)}</Text>
      </View>
      {reservation.saldoPendiente > 0 ? (
        <Text style={styles.pending}>Saldo pendiente: {formatMoney(reservation.saldoPendiente)}</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  success: {
    ...typography.label,
    color: colors.success,
  },
  code: {
    ...typography.h2,
  },
  hotel: {
    ...typography.body,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  value: {
    ...typography.bodySmall,
    fontWeight: '600',
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
  pending: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
