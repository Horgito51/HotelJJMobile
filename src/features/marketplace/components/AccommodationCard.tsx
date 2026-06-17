import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { formatMoney } from '../../../shared/utils/money';
import type { AccommodationCardModel } from '../types/accommodation.types';

type AccommodationCardProps = {
  item: AccommodationCardModel;
  onPress: () => void;
};

export function AccommodationCard({ item, onPress }: AccommodationCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <Card style={styles.card}>
        <View style={styles.imageWrap}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>Hotel JJ</Text>
            </View>
          )}
          <View style={styles.availabilityBadge}>
            <Text style={styles.availabilityText}>{item.availableRooms} disponibles</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            {item.rating != null ? (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.location} numberOfLines={1}>
            {item.location}
          </Text>

          <View style={styles.footer}>
            <View>
              <Text style={styles.priceLabel}>Desde</Text>
              <Text style={styles.price}>
                {formatMoney(item.priceFrom, item.currency)}
                <Text style={styles.perNight}> / noche</Text>
              </Text>
            </View>
            <Text style={styles.openText}>Ver detalle</Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 184,
  },
  imagePlaceholder: {
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.accentLight,
    fontWeight: '800',
    fontSize: 18,
  },
  availabilityBadge: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    borderRadius: 999,
    paddingHorizontal: spacing.ms,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
  },
  availabilityText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '800',
  },
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  title: {
    ...typography.h3,
    flex: 1,
  },
  location: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  ratingBadge: {
    minWidth: 44,
    minHeight: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentLight,
  },
  ratingText: {
    ...typography.label,
    color: colors.warning,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
  priceLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
  },
  perNight: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  openText: {
    ...typography.label,
    color: colors.coral,
  },
});
