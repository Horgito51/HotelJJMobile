import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_RESERVATION } from '../graphql/mutations';
import { ClientForm } from '../components/ClientForm';
import { PaymentForm } from '../components/PaymentForm';
import { PriceSummary } from '../components/PriceSummary';
import { mapReservation } from '../mappers/reservationMapper';
import {
  emptyClientForm,
  emptyPaymentForm,
  type ClientFormValues,
  type PaymentFormValues,
} from '../types/reservation.types';
import type { ReservationsStackParamList, RootTabParamList } from '../../../application/navigation/types';
import { Screen } from '../../../shared/components/Screen';
import { Button } from '../../../shared/components/Button';
import { TextField } from '../../../shared/components/TextField';
import { useAuth } from '../../../shared/hooks/useAuth';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { isValidDateRange, toApiDateTime } from '../../../shared/utils/date';
import { config } from '../../../services/config';
import type { CreateReservationData } from '../../../services/graphql.types';

type Props = NativeStackScreenProps<ReservationsStackParamList, 'Checkout'>;

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<ReservationsStackParamList, 'Checkout'>,
  BottomTabNavigationProp<RootTabParamList>
>;

function validateClient(values: ClientFormValues): Partial<Record<keyof ClientFormValues, string>> {
  const errors: Partial<Record<keyof ClientFormValues, string>> = {};
  if (!values.numeroIdentificacion.trim()) errors.numeroIdentificacion = 'Requerido';
  if (!values.nombres.trim()) errors.nombres = 'Requerido';
  if (!values.correo.trim()) errors.correo = 'Requerido';
  if (!values.telefono.trim()) errors.telefono = 'Requerido';
  return errors;
}

function hasSixteenCardDigits(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length === 16;
}

function isValidExpiry(value: string) {
  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) {
    return false;
  }

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return year > currentYear || (year === currentYear && month >= currentMonth);
}

function validatePayment(
  values: PaymentFormValues,
): Partial<Record<keyof PaymentFormValues, string>> {
  const errors: Partial<Record<keyof PaymentFormValues, string>> = {};
  const cardholderName = values.cardholderName.trim();

  if (cardholderName.length < 3) {
    errors.cardholderName = 'Requerido';
  } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(cardholderName)) {
    errors.cardholderName = 'Solo letras';
  }

  if (!hasSixteenCardDigits(values.cardNumber)) {
    errors.cardNumber = 'Ingresa 16 numeros';
  }

  if (!isValidExpiry(values.expiry)) {
    errors.expiry = 'Fecha invalida';
  }

  if (!/^\d{3,4}$/.test(values.securityCode)) {
    errors.securityCode = 'Codigo invalido';
  }

  return errors;
}

export function CheckoutScreen({ route }: Props) {
  const { draft } = route.params;
  const navigation = useNavigation<Nav>();
  const { isAuthenticated, user } = useAuth();
  const [client, setClient] = useState<ClientFormValues>(() => ({
    ...emptyClientForm,
    correo: user?.email ?? '',
    nombres: user?.username ?? '',
  }));
  const [payment, setPayment] = useState<PaymentFormValues>(emptyPaymentForm);
  const [observaciones, setObservaciones] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ClientFormValues, string>>>(
    {},
  );
  const [paymentErrors, setPaymentErrors] = useState<
    Partial<Record<keyof PaymentFormValues, string>>
  >({});
  const [submitError, setSubmitError] = useState('');
  const [createReservation, { loading }] = useMutation<CreateReservationData>(CREATE_RESERVATION);

  const handleSubmit = async () => {
    setSubmitError('');

    if (!isValidDateRange(draft.search.fechaInicio, draft.search.fechaFin)) {
      setSubmitError('La fecha de salida debe ser posterior a la de entrada.');
      return;
    }

    if (draft.search.adultos < 1) {
      setSubmitError('Debe haber al menos un adulto.');
      return;
    }

    if (
      draft.selectedRoom.numHabitaciones >
      draft.selectedRoom.disponiblesEnRango
    ) {
      setSubmitError('La cantidad de habitaciones supera la disponibilidad.');
      return;
    }

    const errors = validateClient(client);
    setFormErrors(errors);
    if (Object.keys(errors).length) {
      setSubmitError('Completa los datos obligatorios del huésped.');
      return;
    }

    const paymentValidationErrors = validatePayment(payment);
    setPaymentErrors(paymentValidationErrors);
    if (Object.keys(paymentValidationErrors).length) {
      setSubmitError('Completa los datos de pago.');
      return;
    }

    try {
      const { data } = await createReservation({
        variables: {
          input: {
            sucursalGuid: draft.sucursalGuid,
            fechaInicio: toApiDateTime(draft.search.fechaInicio, '14:00:00'),
            fechaFin: toApiDateTime(draft.search.fechaFin, '12:00:00'),
            origenCanalReserva: config.reservationChannel,
            observaciones: observaciones.trim() || null,
            esWalkin: false,
            cliente: {
              tipoIdentificacion: client.tipoIdentificacion,
              numeroIdentificacion: client.numeroIdentificacion.trim(),
              nombres: client.nombres.trim(),
              apellidos: client.apellidos.trim() || null,
              correo: client.correo.trim(),
              telefono: client.telefono.trim(),
              direccion: client.direccion.trim() || null,
            },
            habitaciones: [
              {
                tipoHabitacionGuid: draft.selectedRoom.tipoHabitacionGuid,
                numHabitaciones: draft.selectedRoom.numHabitaciones,
                numAdultos: draft.search.adultos,
                numNinos: draft.search.ninos,
              },
            ],
          },
        },
      });

      const result = data?.createReservation;
      if (!result?.success || !result.data) {
        setSubmitError(
          result?.errors?.[0]?.message ?? result?.message ?? 'No se pudo crear la reserva.',
        );
        return;
      }

      navigation.navigate('ReservationConfirmation', {
        reservation: mapReservation(result.data),
        accommodationName: draft.nombre,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al crear la reserva.');
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <Text style={styles.title}>Confirmar reserva</Text>
          <PriceSummary draft={draft} />

          {!isAuthenticated ? (
            <View style={styles.authBanner}>
              <Text style={styles.authText}>
                ¿Ya tienes cuenta? Inicia sesión para agilizar futuras reservas.
              </Text>
              <View style={styles.authActions}>
                <Button
                  title="Iniciar sesión"
                  variant="outline"
                  onPress={() =>
                    navigation.navigate('Cuenta', {
                      screen: 'Login',
                      params: { returnTo: 'Checkout' },
                    })
                  }
                />
                <Button
                  title="Registrarse"
                  variant="ghost"
                  onPress={() =>
                    navigation.navigate('Cuenta', {
                      screen: 'Register',
                      params: { returnTo: 'Checkout' },
                    })
                  }
                />
              </View>
            </View>
          ) : (
            <Text style={styles.loggedIn}>Sesión activa: {user?.email}</Text>
          )}

          <ClientForm values={client} onChange={(patch) => setClient((prev) => ({ ...prev, ...patch }))} errors={formErrors} />
          <PaymentForm
            values={payment}
            onChange={(patch) => setPayment((prev) => ({ ...prev, ...patch }))}
            errors={paymentErrors}
          />

          <TextField
            label="Observaciones"
            value={observaciones}
            onChangeText={setObservaciones}
            multiline
            numberOfLines={3}
            style={styles.observations}
          />

          {submitError ? <Text style={styles.error}>{submitError}</Text> : null}

          <Button title="Pagar y confirmar" loading={loading} onPress={handleSubmit} />
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
    padding: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
  },
  authBanner: {
    backgroundColor: colors.accentLight,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  authText: {
    ...typography.bodySmall,
  },
  authActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  loggedIn: {
    ...typography.bodySmall,
    color: colors.success,
  },
  observations: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
  },
});
