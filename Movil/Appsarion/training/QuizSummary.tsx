import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { commonColors, commonStyles } from '../styles/commonStyles';
import { useFontScale } from '../context/FontScaleContext';

// Types kept loose to avoid tight coupling with backend shape
interface AnswerItem { id: number; answerText?: string; text?: string; isCorrect?: boolean }
interface QuestionItem { id: number; questionText?: string; text?: string; answers?: AnswerItem[] }
interface UserAnswer { questionId: number; answerId: number }
interface BackendResult { questionId: number; selectedAnswerId: number; correctAnswerId: number; correctAnswerText?: string; correct?: boolean }

export default function QuizSummary({ route, navigation }: any) {
  const { fontScale } = useFontScale();
  const params = route?.params ?? {};
  const questions: QuestionItem[] = params?.questions ?? [];
  const answers: UserAnswer[] = params?.answers ?? [];
  const backendResults: BackendResult[] = params?.results ?? [];
  const score: number | null = typeof params?.score === 'number' ? params.score : null;
  const status: string | null = params?.status ?? null;

  const items = useMemo(() => {
    // If backend results provided, use them as source of truth
    if (backendResults && backendResults.length) {
      const byQ = new Map<number, QuestionItem>();
      (questions || []).forEach(q => byQ.set(q.id, q));
      return backendResults.map((r) => {
        const q = byQ.get(r.questionId);
        const qText = q?.questionText ?? (q as any)?.text ?? `Pregunta ${r.questionId}`;
        const ansList = q?.answers || [];
        const userAns = ansList.find(a => a.id === r.selectedAnswerId);
        const correctAns = ansList.find(a => a.id === r.correctAnswerId);
        const correctText = r.correctAnswerText || correctAns?.answerText || correctAns?.text || '—';
        return {
          id: r.questionId,
          question: qText,
          userAnswer: userAns?.answerText ?? userAns?.text ?? `Opción ${r.selectedAnswerId}`,
          correctAnswer: correctText,
          isCorrect: Boolean(r.correct),
        };
      });
    }

    // Fallback: infer correctness from local questions/answers
    const map = new Map<number, UserAnswer>();
    (answers || []).forEach(a => map.set(a.questionId, a));
    return (questions || []).map((q) => {
      const qText = q.questionText ?? (q as any).text ?? '';
      const ansList = q.answers || [];
      const ua = map.get(q.id);
      const userAns = ansList.find(a => a.id === (ua?.answerId ?? -1));
      const correctAns = ansList.find(a => a.isCorrect === true);
      return {
        id: q.id,
        question: qText,
        userAnswer: userAns?.answerText ?? userAns?.text ?? '—',
        correctAnswer: correctAns?.answerText ?? correctAns?.text ?? '—',
        isCorrect: userAns && correctAns ? userAns.id === correctAns.id : false,
      };
    });
  }, [questions, answers, backendResults]);

  // Normalizamos el puntaje para mostrarlo en escala 0–5.0
  const computedPercent = useMemo(() => {
    // Si viene 'score' desde backend:
    if (typeof score === 'number') {
      if (score <= 5.01) {
        // Score ya en escala 0–5
        const pct = (score / 5) * 100;
        return Math.max(0, Math.min(100, Number(pct.toFixed(2))));
      }
      // Score probablemente en porcentaje 0–100 (respetamos decimales si vienen)
      return Math.max(0, Math.min(100, Number(score.toFixed(2))));
    }
    // Sin score, calculamos porcentaje a partir de correctas (mantener decimales)
    if (!items.length) return 0;
    const correct = items.filter(i => i.isCorrect).length;
    const pct = (correct / items.length) * 100;
    return Number(pct.toFixed(2));
  }, [items, score]);

  const displayScoreFive = useMemo(() => {
    // Convertimos cualquier caso a 0–5 con 2 decimales para mostrar
    const five = (computedPercent / 100) * 5;
    return Number(five.toFixed(2));
  }, [computedPercent]);

  const total = items.length;
  const correct = items.filter(i => i.isCorrect).length;
  const passed = typeof status === 'string'
    ? status.toLowerCase().includes('aprob') || status.toLowerCase().includes('pass')
    : displayScoreFive >= 3.5; // asumimos 3.5/5 como umbral ≈ 70%

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header summary */}
      <View style={styles.summaryCard}>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons name={passed ? 'check-decagram' : 'alert-decagram'} size={28} color={passed ? commonColors.success : commonColors.danger} />
        </View>
        <Text style={[styles.title, { fontSize: 20 * fontScale }]}>{passed ? '¡Examen aprobado!' : 'Examen finalizado'}</Text>
        {/* Puntaje 0–5.0 con énfasis */}
        <View style={styles.scoreWrap}>
          <Text style={[styles.scoreBig, passed ? styles.scoreBigPassed : styles.scoreBigFailed, { fontSize: 44 * fontScale }]}>{displayScoreFive.toFixed(2)}</Text>
          <Text style={[styles.scoreSymbol, passed ? styles.scoreBigPassed : styles.scoreBigFailed, { fontSize: 20 * fontScale }]}>/5.0</Text>
        </View>
        <Text style={[styles.subtitle, { fontSize: 13 * fontScale }]}>{correct}/{total} correctas</Text>

        {/* Barra de progreso (usa % interno, pero mostramos 0–5 arriba) */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, computedPercent))}%`, backgroundColor: passed ? commonColors.success : commonColors.danger }]} />
        </View>

        <View style={[styles.statusPillBase, passed ? styles.statusPillPassed : styles.statusPillFailed]}>
          <MaterialCommunityIcons name={passed ? 'thumb-up-outline' : 'thumb-down-outline'} size={16} color={passed ? '#0f5132' : '#842029'} />
          <Text style={[passed ? styles.statusTextPassed : styles.statusTextFailed, { fontSize: 13 * fontScale }]}>{passed ? 'Aprobado' : 'No aprobado'}</Text>
        </View>
      </View>

      {/* Details list */}
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
        renderItem={({ item, index }) => (
          <View style={[styles.detailCard, item.isCorrect ? styles.detailCorrect : styles.detailIncorrect]}>
            <View style={styles.detailHeader}>
              <View style={[styles.resultDot, { backgroundColor: item.isCorrect ? commonColors.success : commonColors.danger }]} />
              <Text style={[styles.questionText, { fontSize: 13 * fontScale }]}>{index + 1}. {item.question}</Text>
            </View>
            <Text style={[styles.answerLine, { fontSize: 12 * fontScale }]}>Tu respuesta: <Text style={styles.strong}>{item.userAnswer}</Text></Text>
            {!item.isCorrect && (
              <Text style={[styles.answerLine, { fontSize: 12 * fontScale }]}>Correcta: <Text style={styles.strong}>{item.correctAnswer}</Text></Text>
            )}
          </View>
        )}
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={[commonStyles.buttonSecondary, styles.actionHalf]} onPress={() => navigation.navigate('Prueba')}>
          <Text style={[commonStyles.buttonSecondaryText, { fontSize: 13 * fontScale }]}>Repetir examen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[passed ? commonStyles.buttonSuccess : commonStyles.buttonPrimary, styles.actionHalf]} onPress={() => navigation.navigate('TrainingHome')}>
          <Text style={[passed ? commonStyles.buttonSuccessText : commonStyles.buttonPrimaryText, { fontSize: 13 * fontScale }]}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: commonColors.background },
  summaryCard: {
    backgroundColor: commonColors.cardBackground,
    margin: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 16,
    alignItems: 'center',
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: '700', color: commonColors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: commonColors.textSecondary, marginBottom: 10 },
  scoreWrap: { flexDirection: 'row', alignItems: 'baseline' },
  scoreBig: { fontSize: 44, fontWeight: '800', letterSpacing: -0.5 },
  scoreSymbol: { fontSize: 20, fontWeight: '800', marginLeft: 4 },
  scoreBigPassed: { color: commonColors.success },
  scoreBigFailed: { color: commonColors.danger },
  progressTrack: { width: '100%', height: 8, backgroundColor: commonColors.divider, borderRadius: 6, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', borderRadius: 6 },
  statusPillBase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillPassed: {
    backgroundColor: '#d1e7dd',
    borderColor: '#badbcc',
  },
  statusPillFailed: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c2c7',
  },
  statusTextPassed: {
    color: '#0f5132',
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextFailed: {
    color: '#842029',
    fontSize: 12,
    fontWeight: '700',
  },
  detailCard: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  resultDot: { width: 8, height: 8, borderRadius: 4 },
  questionText: { fontWeight: '700', color: commonColors.textPrimary },
  answerLine: { color: commonColors.textSecondary, marginTop: 0 },
  strong: { fontWeight: '700', color: commonColors.textPrimary },
  detailCorrect: { backgroundColor: '#f5fff8' },
  detailIncorrect: { backgroundColor: '#fff6f6' },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingBottom: 20 },
  actionHalf: { flex: 1 },
});
