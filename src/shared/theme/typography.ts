import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
  h1: { fontSize: 32, lineHeight: 38, fontWeight: '800', color: colors.textHeading } as TextStyle,
  h2: { fontSize: 24, lineHeight: 30, fontWeight: '800', color: colors.textHeading } as TextStyle,
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '700', color: colors.textHeading } as TextStyle,
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400', color: colors.text } as TextStyle,
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400', color: colors.text } as TextStyle,
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', color: colors.textMuted } as TextStyle,
  label: { fontSize: 14, lineHeight: 18, fontWeight: '700', color: colors.textHeading } as TextStyle,
} as const;
