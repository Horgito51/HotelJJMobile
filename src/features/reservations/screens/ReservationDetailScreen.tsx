import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery, useMutation } from '@apollo/client/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { RESERVATION_QUERY } from '../graphql/queries';
import { CANCEL_RESERVATION } from '../graphql/mutations';
import { mapReservation } from '../mappers/reservationMapper';
import { ConfirmationSummary } from '../components/ConfirmationSummary';
import type { ReservationsStackParamList } from '../../../application/navigation/types';
import { Screen } from '../../../shared/components/Screen';
import { Button } from '../../../shared/components/Button';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { useAuth } from '../../../shared/hooks/useAuth';
import { parseGraphQLError } from '../../../shared/utils/graphqlError';
import type { CancelReservationData, ReservationData } from '../../../services/graphql.types';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

type Props = NativeStackScreenProps<ReservationsStackParamList, 'ReservationDetail'>;

export function ReservationDetailScreen({ route, navigation }: Props) {
  const { reservaGuid, accommodationName } = route.params;
  const { isAuthenticated } = useAuth();
  const [cancelMessage, setCancelMessage] = useState('');

  const { data, loading, error, refetch } = useQuery<ReservationData>(RESERVATION_QUERY, {
    variables: { reservaGuid },
    skip: !isAuthenticated,
  });

  const [cancelReservation, { loading: cancelling }] =
    useMutation<CancelReservationData>(CANCEL_RESERVATION);

  const reservation = useMemo(
    () => (data?.reservation ? mapReservation(data.reservation) : null),
    [data],
  );

  const handleCancel = async () => {
    setCancelMessage('');
    try {
      const { data: result } = await cancelReservation({
        variables: { input: { reservaGuid, motivo: 'Cancelada desde app móvil' } },
      });
      if (!result?.cancelReservation?.success) {
        setCancelMessage(
          result?.cancelReservation?.errors?.[0]?.message ?? 'No se pudo cancelar la reserva.',
        );
        return;
      }
      setCancelMessage('Reserva cancelada correctamente.');
      refetch();
    } catch (err) {
      setCancelMessage(parseGraphQLError(err).message);
    }
  };

  if (!isAuthenticated) {
    return (
      <Screen>
        <ErrorState
          title="Sesión requerida"
          message="Inicia sesión para consultar el detalle de tu reserva."
        />
        <Button title="Ir a cuenta" onPress={() => navigation.getParent()?.navigate('Cuenta')} />
      </Screen>
    );
  }

  if (loading && !reservation) {
    return (
      <Screen>
        <LoadingState message="Cargando reserva..." />
      </Screen>
    );
  }

  if (error || !reservation) {
    return (
      <Screen>
        <ErrorState
          message={error ? parseGraphQLError(error).message : 'Reserva no encontrada.'}
          onRetry={() => refetch()}
        />
      </Screen>
    );
  }

  const canCancel = !reservation.estadoReserva.toUpperCase().includes('CANCEL');

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ConfirmationSummary reservation={reservation} accommodationName={accommodationName} />
        {reservation.observaciones ? (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Observaciones</Text>
            <Text style={styles.notesText}>{reservation.observaciones}</Text>
          </View>
        ) : null}
        {cancelMessage ? <Text style={styles.message}>{cancelMessage}</Text> : null}
        {canCancel ? (
          <Button
            title="Cancelar reserva"
            variant="outline"
            loading={cancelling}
            onPress={handleCancel}
          />
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  notes: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesTitle: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  notesText: {
    ...typography.bodySmall,
  },
  message: {
    ...typography.bodySmall,
    color: colors.primary,
  },
});
