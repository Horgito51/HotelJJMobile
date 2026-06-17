import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

type AmenityListProps = {
  amenities: string[];
};

export function AmenityList({ amenities }: AmenityListProps) {
  if (!amenities.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios incluidos</Text>
      <View style={styles.grid}>
        {amenities.map((item) => (
          <View key={item} style={styles.chip}>
            <View style={styles.dot} />
            <Text style={styles.chipText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.ms,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
});
