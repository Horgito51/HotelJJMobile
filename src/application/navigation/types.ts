import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BookingDraft, SearchParams } from '../../features/marketplace/types/accommodation.types';
import type { ReservationModel } from '../../features/reservations/types/reservation.types';

export type AuthStackParamList = {
  Login: { returnTo?: keyof ReservationsStackParamList } | undefined;
  Register: { returnTo?: keyof ReservationsStackParamList } | undefined;
  Account: undefined;
};

export type MarketplaceStackParamList = {
  Home: undefined;
  SearchResults: { search: SearchParams };
  AccommodationDetail: { sucursalGuid: string; search: SearchParams };
  Reviews: { sucursalGuid: string; accommodationName: string };
};

export type ReservationsStackParamList = {
  Checkout: { draft: BookingDraft };
  ReservationConfirmation: {
    reservation: ReservationModel;
    accommodationName?: string;
  };
  ReservationDetail: { reservaGuid: string; accommodationName?: string };
  MyReservations: undefined;
};

export type RootTabParamList = {
  Marketplace: NavigatorScreenParams<MarketplaceStackParamList>;
  Reservas: NavigatorScreenParams<ReservationsStackParamList>;
  Cuenta: NavigatorScreenParams<AuthStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
