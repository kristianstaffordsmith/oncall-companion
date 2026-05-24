import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { components } from '@/api/generated';
import { AppText } from '@/components/AppText';
import { BlinkingLabel } from '@/components/BlinkingLabel';
import { BottomSheet } from '@/components/BottomSheet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spinner } from '@/components/Spinner';
import { TypewriterText } from '@/components/TypewriterText';
import { useGenerateAISummary } from '@/features/incidents/hooks';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  visible: boolean;
  incidentId: string;
  onClose: () => void;
};

type Summary = components['schemas']['IncidentAISummary'];

const EXPAND_DURATION_MS = 320;
const TYPEWRITER_SPEED_MS = 14;
const SEE_MORE_DELAY_MS = 750;
const SEE_MORE_FADE_MS = 800;

export function AISummarySheet({ visible, incidentId, onClose }: Props) {
  const generateSummary = useGenerateAISummary(incidentId);
  const { mutate, reset, isPending, isError, data } = generateSummary;

  useEffect(() => {
    if (!visible) {
      return;
    }

    reset();
    mutate();
  }, [visible, incidentId, mutate, reset]);

  return (
    <BottomSheet
      visible={visible}
      title="AI incident summary"
      onClose={onClose}
      dismissable={!isPending}
      variant="aiSummary"
    >
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {isPending ? <GeneratingRow /> : null}

        {isError ? (
          <View style={styles.errorBlock}>
            <AppText variant="caption" style={styles.error}>
              Couldn't generate summary. Try again.
            </AppText>
            <PrimaryButton label="Try again" onPress={() => mutate()} />
          </View>
        ) : null}

        {data ? <SummaryContent key={incidentId} summary={data} /> : null}
      </ScrollView>
    </BottomSheet>
  );
}

function GeneratingRow() {
  return (
    <View style={styles.generatingRow}>
      <Spinner size={22} />
      <BlinkingLabel style={styles.generatingLabel}>Generating…</BlinkingLabel>
    </View>
  );
}

function SummaryContent({ summary }: { summary: Summary }) {
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const seeMoreOpacity = useRef(new Animated.Value(0)).current;

  const handleSummaryComplete = useCallback(() => {
    setTypewriterComplete(true);
  }, []);

  useEffect(() => {
    if (!typewriterComplete || expanded) {
      return;
    }

    const timeout = setTimeout(() => {
      setShowSeeMore(true);
      Animated.timing(seeMoreOpacity, {
        toValue: 1,
        duration: SEE_MORE_FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, SEE_MORE_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [typewriterComplete, expanded, seeMoreOpacity]);

  function handleSeeMore() {
    setExpanded(true);
    expandAnim.setValue(0);
    Animated.timing(expandAnim, {
      toValue: 1,
      duration: EXPAND_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  return (
    <>
      <View style={styles.section}>
        <AppText variant="label" style={styles.sectionTitle}>
          Summary
        </AppText>
        <TypewriterText
          text={summary.summary}
          speedMs={TYPEWRITER_SPEED_MS}
          onComplete={handleSummaryComplete}
          variant="sheetBody"
          style={styles.sheetText}
        />
      </View>

      {showSeeMore && !expanded ? (
        <Animated.View style={{ opacity: seeMoreOpacity }}>
          <Pressable
            onPress={handleSeeMore}
            style={({ pressed }) => [styles.seeMoreRow, pressed ? styles.seeMorePressed : null]}
          >
            <AppText variant="sheetLink" style={styles.seeMore}>
              See more
            </AppText>
          </Pressable>
        </Animated.View>
      ) : null}

      {expanded ? (
        <Animated.View style={[styles.expandedSection, { opacity: expandAnim }]}>
          <ExpandedDetails summary={summary} />
        </Animated.View>
      ) : null}
    </>
  );
}

function ExpandedDetails({ summary }: { summary: Summary }) {
  return (
    <View style={styles.expandedContent}>
      <SummarySection title="Likely cause" body={summary.likely_cause} />

      <View style={styles.section}>
        <AppText variant="label" style={styles.sectionTitle}>
          Suggested actions
        </AppText>
        <View style={styles.actionList}>
          {summary.suggested_actions.map((action, index) => (
            <AppText key={`${index}-${action}`} variant="sheetBody" style={styles.sheetText}>
              • {action}
            </AppText>
          ))}
        </View>
      </View>

      <SummarySection title="Draft status page update" body={summary.status_page_draft} />
      <SummarySection title="Draft Slack update" body={summary.slack_update_draft} />

      <AppText variant="sheetBody" style={styles.confidence}>
        Confidence: {Math.round(summary.confidence * 100)}%
      </AppText>
    </View>
  );
}

function SummarySection({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.section}>
      <AppText variant="label" style={styles.sectionTitle}>
        {title}
      </AppText>
      <AppText variant="sheetBody" style={styles.sheetText}>
        {body}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  generatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.aiSheetLoadingTop,
    marginBottom: spacing.lg,
  },
  generatingLabel: {
    color: colors.textMuted,
  },
  errorBlock: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.textMuted,
  },
  sheetText: {
    color: colors.textSecondary,
  },
  seeMoreRow: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    paddingRight: spacing.sm,
  },
  seeMorePressed: {
    opacity: 0.7,
  },
  seeMore: {
    color: colors.accent,
  },
  expandedSection: {
    marginTop: spacing.xl,
  },
  expandedContent: {
    gap: spacing.xl,
  },
  actionList: {
    gap: spacing.xs,
  },
  confidence: {
    color: colors.textMuted,
  },
});
