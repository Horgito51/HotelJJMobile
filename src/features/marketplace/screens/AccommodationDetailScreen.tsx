import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ACCOMMODATION_DETAIL, ACCOMMODATION_REVIEWS } from '../graphql/queries';
import { ImageCarousel } from '../components/ImageCarousel';
import { AmenityList } from '../components/AmenityList';
import { RoomTypeSelector } from '../components/RoomTypeSelector';
import { ReviewCard } from '../components/ReviewCard';
import { mapDetailToModel, mapReview } from '../mappers/accommodationMapper';
import type { BookingDraft, RoomTypeModel } from '../types/accommodation.types';
import type { MarketplaceStackParamList, RootTabParamList } from '../../../application/navigation/types';
import { Screen } from '../../../shared/components/Screen';
import { Button } from '../../../shared/components/Button';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { formatDisplayDate, isValidDateRange } from '../../../shared/utils/date';
import { formatMoney } from '../../../shared/utils/money';
import { parseGraphQLError } from '../../../shared/utils/graphqlError';
import type { AccommodationDetailData, AccommodationReviewsData } from '../../../services/graphql.types';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'AccommodationDetail'>;

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<MarketplaceStackParamList, 'AccommodationDetail'>,
  BottomTabNavigationProp<RootTabParamList>
>;

export function AccommodationDetailScreen({ route }: Props) {
  const navigation = useNavigation<Nav>();
  const { sucursalGuid, search } = route.params;
  const [selectedRoom, setSelectedRoom] = useState<RoomTypeModel | undefined>();
  const [roomQuantity, setRoomQuantity] = useState(1);

  const detailInput = {
    fechaInicio: search.fechaInicio,
    fechaFin: search.fechaFin,
  };

  const { data, loading, error, refetch } = useQuery<AccommodationDetailData>(ACCOMMODATION_DETAIL, {
    variables: { sucursalGuid, input: detailInput },
  });

  const { data: reviewsData } = useQuery<AccommodationReviewsData>(ACCOMMODATION_REVIEWS, {
    variables: { sucursalGuid, pagination: { pagina: 1, limite: 3 } },
  });

  const detail = useMemo(
    () => (data?.accommodation ? mapDetailToModel(data.accommodation) : null),
    [data],
  );

  useEffect(() => {
    if (!detail?.roomTypes.length || selectedRoom) return;

    const firstAvailableRoom =
      detail.roomTypes.find((room) => (room.availableInRange ?? 1) > 0) ?? detail.roomTypes[0];
    setSelectedRoom(firstAvailableRoom);
    setRoomQuantity(1);
  }, [detail, selectedRoom]);

  const previewReviews = useMemo(
    () => (reviewsData?.accommodationReviews?.items ?? []).map(mapReview),
    [reviewsData],
  );

  const selectedRoomAvailability = selectedRoom?.availableInRange ?? detail?.availableRooms ?? 1;
  const canContinue =
    Boolean(detail && selectedRoom) &&
    isValidDateRange(search.fechaInicio, search.fechaFin) &&
    selectedRoomAvailability > 0 &&
    roomQuantity <= selectedRoomAvailability;

  const handleContinue = () => {
    if (!detail || !selectedRoom) return;
    if (!isValidDateRange(search.fechaInicio, search.fechaFin)) return;
    if (!canContinue) return;

    const draft: BookingDraft = {
      sucursalGuid,
      nombre: detail.title,
      moneda: detail.currency,
      imagenUrl: detail.imageUrl,
      search,
      selectedRoom: {
        tipoHabitacionGuid: selectedRoom.id,
        nombre: selectedRoom.name,
        numHabitaciones: roomQuantity,
        precioNocheAplicado: selectedRoom.pricePerNight,
        disponiblesEnRango: selectedRoom.availableInRange ?? detail.availableRooms ?? roomQuantity,
      },
    };

    navigation.navigate('Reservas', {
      screen: 'Checkout',
      params: { draft },
    });
  };

  if (loading && !detail) {
    return (
      <Screen>
        <LoadingState message="Cargando detalle..." />
      </Screen>
    );
  }

  if (error || !detail) {
    return (
      <Screen>
        <ErrorState
          message={error ? parseGraphQLError(error).message : 'Alojamiento no encontrado.'}
          onRetry={() => refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ImageCarousel images={detail.images} />

        <View style={styles.content}>
          <View style={styles.summary}>
            <Text style={styles.location}>{detail.location}</Text>
            <Text style={styles.title}>{detail.title}</Text>
            <View style={styles.metaRow}>
              {detail.rating != null ? (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaText}>
                    {detail.rating.toFixed(1)} · {detail.reviewCount} reseñas
                  </Text>
                </View>
              ) : null}
              <View style={styles.metaBadge}>
                <Text style={styles.metaText}>
                  {formatDisplayDate(search.fechaInicio)} - {formatDisplayDate(search.fechaFin)}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>{detail.fullDescription ?? detail.description}</Text>

          <AmenityList amenities={detail.amenities.length ? detail.amenities : detail.services} />

          {detail.policies?.text ? (
            <View style={styles.policy}>
              <Text style={styles.sectionTitle}>Políticas</Text>
              <Text style={styles.policyText}>{detail.policies.text}</Text>
            </View>
          ) : null}

          <RoomTypeSelector
            roomTypes={detail.roomTypes}
            selectedId={selectedRoom?.id}
            quantity={roomQuantity}
            currency={detail.currency}
            fallbackAvailable={detail.availableRooms}
            onSelect={(room) => {
              setSelectedRoom(room);
              setRoomQuantity(1);
            }}
            onQuantityChange={setRoomQuantity}
          />

          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>Opiniones</Text>
                <Text style={styles.sectionTitle}>Reseñas recientes</Text>
              </View>
              <Button
                title="Ver todas"
                variant="ghost"
                onPress={() =>
                  navigation.navigate('Reviews', {
                    sucursalGuid,
                    accommodationName: detail.title,
                  })
                }
              />
            </View>
            {previewReviews.length ? (
              previewReviews.map((review) => <ReviewCard key={review.id} review={review} />)
            ) : (
              <Text style={styles.emptyReviews}>Aún no hay reseñas publicadas.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Desde</Text>
          <Text style={styles.footerPrice}>
            {formatMoney(selectedRoom?.pricePerNight ?? detail.priceFrom, detail.currency)}
          </Text>
        </View>
        <Button
          title={selectedRoomAvailability <= 0 ? 'Sin disponibilidad' : 'Continuar'}
          disabled={!canContinue}
          onPress={handleContinue}
          style={styles.footerButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 128,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  summary: {
    gap: spacing.xs,
  },
  title: {
    ...typography.h2,
  },
  location: {
    ...typography.label,
    color: colors.coral,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  metaBadge: {
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.ms,
    paddingVertical: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  description: {
    ...typography.body,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionEyebrow: {
    ...typography.caption,
    color: colors.coral,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    ...typography.h3,
  },
  policy: {
    borderRadius: 14,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  policyText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emptyReviews: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  footerLabel: {
    ...typography.caption,
  },
  footerPrice: {
    ...typography.h3,
    color: colors.primary,
  },
  footerButton: {
    minWidth: 160,
  },
});
