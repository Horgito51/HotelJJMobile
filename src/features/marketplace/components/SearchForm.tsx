import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Card } from '../../../shared/components/Card';
import { TextField } from '../../../shared/components/TextField';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { addDays, formatDate, formatDisplayDate, parseDate } from '../../../shared/utils/date';
import type { SearchParams } from '../types/accommodation.types';
import { GuestSelector } from './GuestSelector';

type SearchFormProps = {
  initialValues: SearchParams;
  onSubmit: (values: SearchParams) => void;
  loading?: boolean;
};

export function SearchForm({ initialValues, onSubmit, loading }: SearchFormProps) {
  const [values, setValues] = useState<SearchParams>(initialValues);
  const [pickerMode, setPickerMode] = useState<'checkIn' | 'checkOut' | null>(null);

  const openPicker = (mode: 'checkIn' | 'checkOut') => setPickerMode(mode);
  const handleSubmit = () => {
    onSubmit({
      ...values,
      destino: values.destino.trim().replace(/\s+/g, ' '),
    });
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setPickerMode(null);
    if (event.type === 'dismissed' || !date) return;

    const formatted = formatDate(date);
    if (pickerMode === 'checkIn') {
      const next = { ...values, fechaInicio: formatted };
      if (parseDate(next.fechaFin) <= parseDate(formatted)) {
        next.fechaFin = addDays(formatted, 1);
      }
      setValues(next);
    } else if (pickerMode === 'checkOut') {
      const safe =
        parseDate(formatted) <= parseDate(values.fechaInicio)
          ? addDays(values.fechaInicio, 1)
          : formatted;
      setValues((prev) => ({ ...prev, fechaFin: safe }));
    }
    if (Platform.OS === 'ios') setPickerMode(null);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Reserva directa</Text>
          <Text style={styles.heading}>¿A dónde quieres ir?</Text>
        </View>
      </View>

      <TextField
        label="Destino"
        placeholder="Ciudad, provincia o nombre del hotel"
        value={values.destino}
        onChangeText={(destino) => setValues((prev) => ({ ...prev, destino }))}
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="off"
        importantForAutofill="no"
        keyboardType="default"
        returnKeyType="search"
        editable={!loading}
        underlineColorAndroid="transparent"
        onSubmitEditing={handleSubmit}
        style={styles.destinationInput}
      />

      <View style={styles.dateGrid}>
        <View style={styles.dateColumn}>
          <Text style={styles.label}>Entrada</Text>
          <Pressable style={styles.dateButton} onPress={() => openPicker('checkIn')}>
            <Text style={styles.dateText}>{formatDisplayDate(values.fechaInicio)}</Text>
          </Pressable>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.label}>Salida</Text>
          <Pressable style={styles.dateButton} onPress={() => openPicker('checkOut')}>
            <Text style={styles.dateText}>{formatDisplayDate(values.fechaFin)}</Text>
          </Pressable>
        </View>
      </View>

      <GuestSelector
        adultos={values.adultos}
        ninos={values.ninos}
        habitaciones={values.habitaciones}
        onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
      />

      <Button
        title="Buscar alojamientos"
        loading={loading}
        onPress={handleSubmit}
        style={styles.submit}
      />

      {pickerMode ? (
        <DateTimePicker
          value={parseDate(pickerMode === 'checkIn' ? values.fechaInicio : values.fechaFin)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={pickerMode === 'checkOut' ? parseDate(values.fechaInicio) : new Date()}
          onChange={onDateChange}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xs,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.coral,
    textTransform: 'uppercase',
  },
  heading: {
    ...typography.h3,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  destinationInput: {
    minHeight: 56,
    backgroundColor: colors.surface,
    textAlignVertical: 'center',
  },
  dateGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateColumn: {
    flex: 1,
  },
  dateButton: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.ms,
    marginBottom: spacing.md,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textHeading,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
