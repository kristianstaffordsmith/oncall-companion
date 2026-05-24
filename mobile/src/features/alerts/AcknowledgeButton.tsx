import { PrimaryButton } from '@/components/PrimaryButton';

type Props = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function AcknowledgeButton({ onPress, loading, disabled }: Props) {
  return (
    <PrimaryButton
      label="Acknowledge alert"
      onPress={onPress}
      loading={loading}
      disabled={disabled}
    />
  );
}
