import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

type GuestSelectorProps = {
  adultos: number;
  ninos: number;
  habitaciones: number;
  onChange: (patch: Partial<{ adultos: number; ninos: number; habitaciones: number }>) => void;
};

function CounterRow({
  label,
  hint,
  value,
  min,
  onDecrement,
  onIncrement,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowHint}>{hint}</Text>
      </View>
      <View style={styles.counter}>
        <Pressable
          accessibilityRole="button"
          style={[styles.counterBtn, value <= min && styles.counterBtnDisabled]}
          disabled={value <= min}
          onPress={onDecrement}
        >
          <Text style={styles.counterBtnText}>-</Text>
        </Pressable>
        <Text style={styles.counterValue}>{value}</Text>
        <Pressable accessibilityRole="button" style={styles.counterBtn} onPress={onIncrement}>
          <Text style={styles.counterBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function GuestSelector({ adultos, ninos, habitaciones, onChange }: GuestSelectorProps) {
  return (
    <View style={styles.container}>
      <CounterRow
        label="Adultos"
        hint="13 años o más"
        value={adultos}
        min={1}
        onDecrement={() => onChange({ adultos: Math.max(1, adultos - 1) })}
        onIncrement={() => onChange({ adultos: adultos + 1 })}
      />
      <CounterRow
        label="Niños"
        hint="0 a 12 años"
        value={ninos}
        min={0}
        onDecrement={() => onChange({ ninos: Math.max(0, ninos - 1) })}
        onIncrement={() => onChange({ ninos: ninos + 1 })}
      />
      <CounterRow
        label="Habitaciones"
        hint="Unidades a reservar"
        value={habitaciones}
        min={1}
        onDecrement={() => onChange({ habitaciones: Math.max(1, habitaciones - 1) })}
        onIncrement={() => onChange({ habitaciones: habitaciones + 1 })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    ...typography.label,
  },
  rowHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  counterBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnDisabled: {
    opacity: 0.4,
  },
  counterBtnText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  counterValue: {
    ...typography.label,
    minWidth: 24,
    textAlign: 'center',
  },
});
