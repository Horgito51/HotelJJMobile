import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client/react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../../shared/components/Screen';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { useAuth } from '../../../shared/hooks/useAuth';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { formatDisplayDate } from '../../../shared/utils/date';
import { formatMoney } from '../../../shared/utils/money';
import { parseGraphQLError } from '../../../shared/utils/graphqlError';
import { MY_RESERVATIONS } from '../graphql/queries';
import type { ReservationsStackParamList, RootTabParamList } from '../../../application/navigation/types';
import type { MyReservationsData } from '../../../services/graphql.types';

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<ReservationsStackParamList, 'MyReservations'>,
  BottomTabNavigationProp<RootTabParamList>
>;

export function MyReservationsScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<Nav>();
  const { data, loading, error, refetch } = useQuery<MyReservationsData>(MY_RESERVATIONS, {
    variables: { input: { page: 1, limit: 20 } },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const reservations = data?.myReservations.items ?? [];

  if (loading && !data) {
    return (
      <Screen>
        <LoadingState message="Cargando tus reservas..." />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState message={parseGraphQLError(error).message} onRetry={() => refetch()} />
        <Button title="Cerrar sesion" variant="outline" onPress={logout} style={styles.button} />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <Card style={styles.heroCard}>
            <Text style={styles.kicker}>Reservas</Text>
            <Text style={styles.greeting}>Hola, {user?.email}</Text>
            <Text style={styles.copy}>
              {reservations.length
                ? `${data?.myReservations.totalCount ?? reservations.length} reserva(s) asociada(s) a tu cuenta.`
                : 'Aun no tienes reservas asociadas a tu cuenta.'}
            </Text>
          </Card>

          {reservations.length ? (
            reservations.map((reservation) => (
              <Card key={reservation.reservaGuid} style={styles.reservationCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleBox}>
                    <Text style={styles.reservationCode}>{reservation.codigoReserva}</Text>
                    <Text style={styles.dateRange}>
                      {formatDisplayDate(reservation.fechaInicio)} -{' '}
                      {formatDisplayDate(reservation.fechaFin)}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{reservation.estadoReserva}</Text>
                  </View>
                </View>

                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Total</Text>
                  <Text style={styles.amountValue}>
                    {formatMoney(reservation.totalReserva, 'USD')}
                  </Text>
                </View>

                <Button
                  title="Ver detalle"
                  variant="outline"
                  onPress={() =>
                    navigation.navigate('ReservationDetail', {
                      reservaGuid: reservation.reservaGuid,
                    })
                  }
                />
              </Card>
            ))
          ) : (
            <EmptyState
              title="Sin reservas"
              message="Cuando completes una reserva, aparecera en este listado."
            />
          )}

          <Button title="Cerrar sesion" variant="ghost" onPress={logout} style={styles.button} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxl,
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
    gap: spacing.xs,
  },
  kicker: {
    ...typography.caption,
    color: colors.accentLight,
    textTransform: 'uppercase',
  },
  greeting: {
    ...typography.h3,
    color: '#fff',
  },
  copy: {
    ...typography.bodySmall,
    color: '#DCE7E2',
  },
  reservationCard: {
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cardTitleBox: {
    flex: 1,
    gap: spacing.xs,
  },
  reservationCode: {
    ...typography.label,
    color: colors.primaryDark,
  },
  dateRange: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  amountValue: {
    ...typography.h3,
    color: colors.primary,
  },
  button: {
    marginTop: spacing.sm,
  },
});
