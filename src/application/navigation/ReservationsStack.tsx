import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CheckoutScreen } from '../../features/reservations/screens/CheckoutScreen';
import { ReservationConfirmationScreen } from '../../features/reservations/screens/ReservationConfirmationScreen';
import { ReservationDetailScreen } from '../../features/reservations/screens/ReservationDetailScreen';
import { MyReservationsScreen } from '../../features/reservations/screens/MyReservationsScreen';
import { colors } from '../../shared/theme/colors';
import type { ReservationsStackParamList } from './types';

const Stack = createNativeStackNavigator<ReservationsStackParamList>();

export function ReservationsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primaryDark,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="MyReservations"
        component={MyReservationsScreen}
        options={{ title: 'Mis reservas' }}
      />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen
        name="ReservationConfirmation"
        component={ReservationConfirmationScreen}
        options={{ title: 'Confirmación', headerBackVisible: false }}
      />
      <Stack.Screen
        name="ReservationDetail"
        component={ReservationDetailScreen}
        options={{ title: 'Detalle de reserva' }}
      />
    </Stack.Navigator>
  );
}
