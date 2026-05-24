import { AppText } from '@/components/AppText';
import { SectionCard } from '@/components/SectionCard';
import { DEMO_USER_ID } from '@/constants/demoUser';
import { getDemoUserName } from '@/constants/demoUsers';

type Props = {
  createdBy: string;
};

export function IncidentRespondersSection({ createdBy }: Props) {
  const name = getDemoUserName(createdBy);
  const label = createdBy === DEMO_USER_ID ? `${name} · You` : name;

  return (
    <SectionCard title="Responders">
      <AppText variant="body">{label}</AppText>
    </SectionCard>
  );
}
