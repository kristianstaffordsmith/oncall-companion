import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';

const headerFlame = require('../../assets/images/header-flame.png');

type Props = {
  title?: string;
};

export function BrandHeader({ title = 'OnCall Companion' }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={headerFlame}
        style={styles.logo}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <AppText variant="brandTitle" style={styles.title}>
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    marginTop: 8,
  },
});
