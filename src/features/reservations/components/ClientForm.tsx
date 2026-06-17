import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { TextField } from '../../../shared/components/TextField';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import type { ClientFormValues } from '../types/reservation.types';

type ClientFormProps = {
  values: ClientFormValues;
  onChange: (patch: Partial<ClientFormValues>) => void;
  errors?: Partial<Record<keyof ClientFormValues, string>>;
  readOnly?: boolean;
};

export function ClientForm({ values, onChange, errors, readOnly }: ClientFormProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.kicker}>Huésped principal</Text>
      <Text style={styles.title}>Datos del huésped</Text>
      <TextField
        label="Tipo identificación"
        value={values.tipoIdentificacion}
        editable={!readOnly}
        onChangeText={(tipoIdentificacion) => onChange({ tipoIdentificacion })}
        error={errors?.tipoIdentificacion}
      />
      <TextField
        label="Número identificación *"
        value={values.numeroIdentificacion}
        editable={!readOnly}
        onChangeText={(numeroIdentificacion) => onChange({ numeroIdentificacion })}
        error={errors?.numeroIdentificacion}
      />
      <TextField
        label="Nombres *"
        value={values.nombres}
        editable={!readOnly}
        onChangeText={(nombres) => onChange({ nombres })}
        error={errors?.nombres}
      />
      <TextField
        label="Apellidos"
        value={values.apellidos}
        editable={!readOnly}
        onChangeText={(apellidos) => onChange({ apellidos })}
      />
      <TextField
        label="Correo *"
        value={values.correo}
        editable={!readOnly}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(correo) => onChange({ correo })}
        error={errors?.correo}
      />
      <TextField
        label="Teléfono *"
        value={values.telefono}
        editable={!readOnly}
        keyboardType="phone-pad"
        onChangeText={(telefono) => onChange({ telefono })}
        error={errors?.telefono}
      />
      <TextField
        label="Dirección"
        value={values.direccion}
        editable={!readOnly}
        onChangeText={(direccion) => onChange({ direccion })}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  kicker: {
    ...typography.caption,
    color: colors.coral,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
});
