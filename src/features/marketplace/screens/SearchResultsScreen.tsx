import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { SEARCH_ACCOMMODATIONS } from '../graphql/queries';
import { AccommodationCard } from '../components/AccommodationCard';
import { SearchForm } from '../components/SearchForm';
import { mapSearchItemToCard } from '../mappers/accommodationMapper';
import type { MarketplaceStackParamList } from '../../../application/navigation/types';
import { Screen } from '../../../shared/components/Screen';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { parseGraphQLError } from '../../../shared/utils/graphqlError';
import type { SearchAccommodationsData } from '../../../services/graphql.types';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'SearchResults'>;

export function SearchResultsScreen({ route, navigation }: Props) {
  const { search } = route.params;

  const { data, loading, error, refetch } = useQuery<SearchAccommodationsData>(SEARCH_ACCOMMODATIONS, {
    variables: {
      input: {
        destino: search.destino || undefined,
        fechaInicio: search.fechaInicio,
        fechaFin: search.fechaFin,
        numAdultos: search.adultos,
        numNinos: search.ninos,
        numHabitaciones: search.habitaciones,
        precioMin: search.precioMin,
        precioMax: search.precioMax,
        ordenarPor: search.ordenarPor,
        pagina: 1,
        limite: 20,
      },
    },
  });

  const items = useMemo(
    () => (data?.searchAccommodations?.items ?? []).map(mapSearchItemToCard),
    [data],
  );

  if (loading && !data) {
    return (
      <Screen>
        <LoadingState message="Buscando alojamientos..." />
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
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.form}>
              <SearchForm
                initialValues={search}
                onSubmit={(next) => navigation.setParams({ search: next })}
              />
            </View>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{items.length} alojamientos encontrados</Text>
              <Text style={styles.resultsSubtitle}>
                {search.destino || 'Todos los destinos'} · {search.adultos + search.ninos} huéspedes
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Sin resultados"
            message="Prueba otro destino o ajusta las fechas de tu búsqueda."
          />
        }
        renderItem={({ item }) => (
          <AccommodationCard
            item={item}
            onPress={() =>
              navigation.navigate('AccommodationDetail', {
                sucursalGuid: item.id,
                search,
              })
            }
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  form: {
    paddingTop: spacing.md,
  },
  resultsHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  resultsTitle: {
    ...typography.h3,
  },
  resultsSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
