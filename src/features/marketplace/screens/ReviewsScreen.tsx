import { FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { ACCOMMODATION_REVIEWS } from '../graphql/queries';
import { ReviewCard } from '../components/ReviewCard';
import { mapReview } from '../mappers/accommodationMapper';
import type { MarketplaceStackParamList } from '../../../application/navigation/types';
import { Screen } from '../../../shared/components/Screen';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { parseGraphQLError } from '../../../shared/utils/graphqlError';
import type { AccommodationReviewsData } from '../../../services/graphql.types';
import { spacing } from '../../../shared/theme/spacing';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Reviews'>;

export function ReviewsScreen({ route }: Props) {
  const { sucursalGuid } = route.params;

  const { data, loading, error, refetch, fetchMore } = useQuery<AccommodationReviewsData>(
    ACCOMMODATION_REVIEWS,
    {
    variables: { sucursalGuid, pagination: { pagina: 1, limite: 10 } },
    },
  );

  const reviews = useMemo(
    () => (data?.accommodationReviews?.items ?? []).map(mapReview),
    [data],
  );

  const hasNext = data?.accommodationReviews?.tieneSiguiente;
  const currentPage = data?.accommodationReviews?.pagina ?? 1;

  if (loading && !data) {
    return (
      <Screen>
        <LoadingState message="Cargando reseñas..." />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState message={parseGraphQLError(error).message} onRetry={() => refetch()} />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState title="Sin reseñas" message="Este alojamiento aún no tiene valoraciones." />
        }
        onEndReached={() => {
          if (hasNext) {
            fetchMore({
              variables: {
                pagination: { pagina: currentPage + 1, limite: 10 },
              },
            });
          }
        }}
        renderItem={({ item }) => <ReviewCard review={item} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
