import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ConfirmationSummary } from '../components/ConfirmationSummary';
import type {
  MarketplaceStackParamList,
  ReservationsStackParamList,
  RootTabParamList,
} from '../../../application/navigation/types';
import { Screen } from '../../../shared/components/Screen';
import { Button } from '../../../shared/components/Button';
import { spacing } from '../../../shared/theme/spacing';

type Props = NativeStackScreenProps<ReservationsStackParamList, 'ReservationConfirmation'>;

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<ReservationsStackParamList, 'ReservationConfirmation'>,
  BottomTabNavigationProp<RootTabParamList>
>;

export function ReservationConfirmationScreen({ route }: Props) {
  const { reservation, accommodationName } = route.params;
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <View style={styles.content}>
        <ConfirmationSummary reservation={reservation} accommodationName={accommodationName} />
        <Button
          title="Ver detalle"
          variant="outline"
          onPress={() =>
            navigation.navigate('ReservationDetail', {
              reservaGuid: reservation.reservaGuid,
              accommodationName,
            })
          }
        />
        <Button
          title="Volver al inicio"
          onPress={() =>
            navigation.navigate('Marketplace', {
              screen: 'Home',
            })
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.md,
    paddingTop: spacing.md,
  },
});
