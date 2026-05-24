import { Text, type TextProps } from 'react-native';

import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

type Props = TextProps & {
  variant?: keyof typeof typography;
};

export function AppText({ variant = 'body', style, ...props }: Props) {
  return <Text style={[{ color: colors.text }, typography[variant], style]} {...props} />;
}
