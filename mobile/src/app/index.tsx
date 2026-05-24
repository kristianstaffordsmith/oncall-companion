import { BrandHeader } from '@/components/BrandHeader';
import { ComponentShowcase } from '@/components/ComponentShowcase';
import { Screen } from '@/components/Screen';

export default function HomeScreen() {
  return (
    <Screen>
      <BrandHeader />
      <ComponentShowcase />
    </Screen>
  );
}
