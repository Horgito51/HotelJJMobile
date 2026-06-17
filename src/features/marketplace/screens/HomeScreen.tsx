import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEARCH_ACCOMMODATIONS } from '../graphql/queries';
import { SearchForm } from '../components/SearchForm';
import { AccommodationCard } from '../components/AccommodationCard';
import { mapSearchItemToCard } from '../mappers/accommodationMapper';
import type { SearchParams } from '../types/accommodation.types';
import type { MarketplaceStackParamList } from '../../../application/navigation/types';
import { Screen } from '../../../shared/components/Screen';
import { LoadingState } from '../../../shared/components/LoadingState';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { getDefaultDateRange } from '../../../shared/utils/date';
import { config } from '../../../services/config';
import type { SearchAccommodationsData } from '../../../services/graphql.types';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Home'>;

const defaultSearch: SearchParams = {
  destino: '',
  ...getDefaultDateRange(),
  adultos: 2,
  ninos: 0,
  habitaciones: 1,
};

export function HomeScreen({ navigation }: Props) {
  const [searchDraft, setSearchDraft] = useState<SearchParams>(defaultSearch);

  const { data, loading } = useQuery<SearchAccommodationsData>(SEARCH_ACCOMMODATIONS, {
    variables: {
      input: {
        destino: '',
        pagina: 1,
        limite: 3,
        fechaInicio: searchDraft.fechaInicio,
        fechaFin: searchDraft.fechaFin,
        numAdultos: searchDraft.adultos,
        numNinos: searchDraft.ninos,
        numHabitaciones: searchDraft.habitaciones,
      },
    },
  });

  const featured = useMemo(
    () => (data?.searchAccommodations?.items ?? []).map(mapSearchItemToCard),
    [data],
  );

  const handleSearch = async (search: SearchParams) => {
    setSearchDraft(search);
    await AsyncStorage.setItem(config.searchDraftKey, JSON.stringify(search));
    navigation.navigate('SearchResults', { search });
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.brand}>Hotel JJ</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Ecuador</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Estadías cómodas, reservas simples.</Text>
          <Text style={styles.heroSubtitle}>
            Encuentra habitaciones disponibles, compara precios y confirma tu reserva desde el móvil.
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>consulta</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>+20</Text>
              <Text style={styles.statLabel}>habitaciones</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>15%</Text>
              <Text style={styles.statLabel}>IVA claro</Text>
            </View>
          </View>
        </View>

        <View style={styles.formWrap}>
          <SearchForm initialValues={searchDraft} onSubmit={handleSearch} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>Recomendados</Text>
              <Text style={styles.sectionTitle}>Alojamientos destacados</Text>
            </View>
          </View>
          {loading ? (
            <LoadingState message="Cargando alojamientos..." />
          ) : (
            featured.map((item) => (
              <AccommodationCard
                key={item.id}
                item={item}
                onPress={() =>
                  navigation.navigate('AccommodationDetail', {
                    sucursalGuid: item.id,
                    search: searchDraft,
                  })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    ...typography.label,
    color: colors.accentLight,
    textTransform: 'uppercase',
  },
  badge: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.ms,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    ...typography.caption,
    color: '#fff',
  },
  heroTitle: {
    ...typography.h1,
    color: '#fff',
  },
  heroSubtitle: {
    ...typography.bodySmall,
    color: '#DCE7E2',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: spacing.ms,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statValue: {
    ...typography.h3,
    color: '#fff',
  },
  statLabel: {
    ...typography.caption,
    color: colors.accentLight,
  },
  formWrap: {
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionEyebrow: {
    ...typography.caption,
    color: colors.coral,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    ...typography.h2,
  },
});
