import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

type ImageCarouselProps = {
  images: string[];
  height?: number;
};

const { width } = Dimensions.get('window');

export function ImageCarousel({ images, height = 280 }: ImageCarouselProps) {
  if (!images.length) {
    return (
      <View style={[styles.placeholder, { height }]}>
        <Text style={styles.placeholderTitle}>Hotel JJ</Text>
        <Text style={styles.placeholderText}>Galería no disponible</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ height }}
      >
        {images.map((uri, index) => (
          <Image
            key={`${uri}-${index}`}
            source={{ uri }}
            style={{ width, height }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      <View style={styles.counter}>
        <Text style={styles.counterText}>{images.length} fotos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    width: '100%',
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  placeholderTitle: {
    ...typography.h2,
    color: '#fff',
  },
  placeholderText: {
    ...typography.bodySmall,
    color: colors.accentLight,
  },
  counter: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    borderRadius: 999,
    paddingHorizontal: spacing.ms,
    paddingVertical: spacing.xs,
    backgroundColor: colors.overlay,
  },
  counterText: {
    ...typography.caption,
    color: '#fff',
  },
});
