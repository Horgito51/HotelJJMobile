import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { formatMoney } from '../../../shared/utils/money';
import type { RoomTypeModel } from '../types/accommodation.types';

type RoomTypeSelectorProps = {
  roomTypes: RoomTypeModel[];
  selectedId?: string;
  quantity: number;
  currency: string;
  fallbackAvailable?: number;
  onSelect: (room: RoomTypeModel) => void;
  onQuantityChange: (quantity: number) => void;
};

export function RoomTypeSelector({
  roomTypes,
  selectedId,
  quantity,
  currency,
  fallbackAvailable,
  onSelect,
  onQuantityChange,
}: RoomTypeSelectorProps) {
  const selected = roomTypes.find((room) => room.id === selectedId);
  const maxAvailable = selected?.availableInRange ?? fallbackAvailable ?? 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Elige tu habitación</Text>
        <Text style={styles.subtitle}>Precios por noche, sujetos a disponibilidad.</Text>
      </View>

      {roomTypes.map((room) => {
        const isSelected = room.id === selectedId;
        const available = room.availableInRange ?? 1;
        const isUnavailable = available <= 0;
        return (
          <Pressable key={room.id} disabled={isUnavailable} onPress={() => onSelect(room)}>
            <Card style={[styles.roomCard, isSelected ? styles.roomCardSelected : undefined]}>
              {room.images[0] ? (
                <Image source={{ uri: room.images[0] }} style={styles.roomImage} />
              ) : (
                <View style={[styles.roomImage, styles.roomImageFallback]}>
                  <Text style={styles.roomImageFallbackText}>Habitación</Text>
                </View>
              )}
              <View style={styles.roomContent}>
                <View style={styles.roomTitleRow}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  {isSelected ? (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedText}>Seleccionada</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.roomMeta}>
                  {room.bedType ?? 'Cama estándar'} · {room.adultCapacity} adultos
                  {room.childCapacity ? ` · ${room.childCapacity} niños` : ''}
                </Text>
                <View style={styles.roomFooter}>
                  <Text style={styles.roomPrice}>
                    {formatMoney(room.pricePerNight, currency)}
                    <Text style={styles.perNight}> / noche</Text>
                  </Text>
                  {room.availableInRange != null ? (
                    <Text style={[styles.available, isUnavailable ? styles.unavailable : undefined]}>
                      {isUnavailable ? 'Sin cupo' : `${room.availableInRange} disp.`}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Card>
          </Pressable>
        );
      })}

      {selected ? (
        <Card style={styles.quantityCard}>
          <View>
            <Text style={styles.quantityLabel}>Cantidad de habitaciones</Text>
            <Text style={styles.quantityHint}>Máximo disponible: {maxAvailable}</Text>
          </View>
          <View style={styles.quantityRow}>
            <Pressable
              accessibilityRole="button"
              style={styles.qtyBtn}
              onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable
              accessibilityRole="button"
              style={styles.qtyBtn}
              onPress={() => onQuantityChange(Math.min(maxAvailable, quantity + 1))}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
          </View>
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  roomCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  roomCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primarySoft,
  },
  roomImage: {
    width: '100%',
    height: 124,
  },
  roomImageFallback: {
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomImageFallbackText: {
    ...typography.label,
    color: colors.accentLight,
  },
  roomContent: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  roomName: {
    ...typography.label,
    flex: 1,
  },
  selectedBadge: {
    borderRadius: 999,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  selectedText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
  roomMeta: {
    ...typography.caption,
  },
  roomFooter: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomPrice: {
    ...typography.h3,
    color: colors.primary,
  },
  perNight: {
    ...typography.caption,
    color: colors.textMuted,
  },
  available: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '800',
  },
  unavailable: {
    color: colors.error,
  },
  quantityCard: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: {
    ...typography.label,
  },
  quantityHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.ms,
  },
  qtyBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  qtyValue: {
    ...typography.h3,
    minWidth: 28,
    textAlign: 'center',
  },
});
