import { Platform } from 'react-native';

export const fontFamily = Platform.select({
  ios: 'Avenir Next',
  default: undefined,
});

export const typography = {
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  brandTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  detailTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  sheetBody: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500',
  },
  sheetLink: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '500',
  },
  pill: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
} as const;
