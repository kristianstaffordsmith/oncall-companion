import { type ReactNode } from 'react';
import { View } from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { detailScreenHeaderBlockStyles } from '@/components/detailHeaderStyles';

type Props = {
  title: string;
  children?: ReactNode;
};

export function DetailScreenHeaderBlock({ title, children }: Props) {
  return (
    <View style={detailScreenHeaderBlockStyles.block}>
      <ScreenHeader title={title} centerTitle />
      {children}
    </View>
  );
}
