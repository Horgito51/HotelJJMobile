import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { TextField } from '../../../shared/components/TextField';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import type { PaymentFormValues } from '../types/reservation.types';

type PaymentFormProps = {
  values: PaymentFormValues;
  onChange: (patch: Partial<PaymentFormValues>) => void;
  errors?: Partial<Record<keyof PaymentFormValues, string>>;
};

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCardholderName(value: string) {
  return value
    .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 60);
}

export function PaymentForm({ values, onChange, errors }: PaymentFormProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.kicker}>Pago</Text>
      <Text style={styles.title}>Tarjeta</Text>

      <TextField
        label="Nombre en tarjeta *"
        value={values.cardholderName}
        autoCapitalize="words"
        textContentType="name"
        maxLength={60}
        onChangeText={(cardholderName) =>
          onChange({ cardholderName: formatCardholderName(cardholderName) })
        }
        error={errors?.cardholderName}
      />
      <TextField
        label="Numero de tarjeta *"
        value={values.cardNumber}
        keyboardType="number-pad"
        textContentType="creditCardNumber"
        maxLength={19}
        onChangeText={(cardNumber) => onChange({ cardNumber: formatCardNumber(cardNumber) })}
        error={errors?.cardNumber}
      />

      <View style={styles.row}>
        <View style={styles.fieldHalf}>
          <TextField
            label="Vence *"
            value={values.expiry}
            placeholder="MM/AA"
            keyboardType="number-pad"
            maxLength={5}
            style={styles.shortInput}
            onChangeText={(expiry) => onChange({ expiry: formatExpiry(expiry) })}
            error={errors?.expiry}
          />
        </View>
        <View style={styles.fieldHalf}>
          <TextField
            label="CVV *"
            value={values.securityCode}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            style={styles.shortInput}
            onChangeText={(securityCode) =>
              onChange({ securityCode: securityCode.replace(/\D/g, '').slice(0, 4) })
            }
            error={errors?.securityCode}
          />
        </View>
      </View>
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  fieldHalf: {
    flex: 1,
    minWidth: 0,
  },
  shortInput: {
    minWidth: 0,
  },
});
