import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import type { ReviewModel } from '../types/accommodation.types';

type ReviewCardProps = {
  review: ReviewModel;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.clientName.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{review.clientName}</Text>
          {review.tripType ? <Text style={styles.trip}>{review.tripType}</Text> : null}
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.score}>{review.score.toFixed(1)}</Text>
        </View>
      </View>
      {review.positiveComment ? (
        <Text style={styles.comment}>{review.positiveComment}</Text>
      ) : null}
      {review.negativeComment ? (
        <Text style={styles.negative}>Mejorable: {review.negativeComment}</Text>
      ) : null}
      {review.propertyReply ? (
        <View style={styles.reply}>
          <Text style={styles.replyLabel}>Respuesta del hotel</Text>
          <Text style={styles.replyText}>{review.propertyReply}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  avatarText: {
    ...typography.label,
    color: colors.primary,
  },
  headerText: {
    flex: 1,
  },
  name: {
    ...typography.label,
  },
  scoreBadge: {
    minWidth: 46,
    minHeight: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentLight,
  },
  score: {
    ...typography.label,
    color: colors.warning,
  },
  trip: {
    ...typography.caption,
  },
  comment: {
    ...typography.bodySmall,
  },
  negative: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  reply: {
    padding: spacing.ms,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
  },
  replyLabel: {
    ...typography.caption,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  replyText: {
    ...typography.bodySmall,
  },
});
