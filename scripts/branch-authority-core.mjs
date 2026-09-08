const historicalPattern = /^(artigo|revisao|copilot|redesign|rebuild|recovery|feature|agent)\//;
const quarantineBranches = new Set(['audit/nixon-recovery-2026-09-08']);

export function evaluateBranchAuthority({
  head,
  base = '',
  mergeBase,
  originMain,
  behind,
}) {
  if (historicalPattern.test(head)) {
    return {
      ok: false,
      kind: 'HISTORICAL',
      message: `A branch "${head}" é histórica e nunca é base de execução.`,
    };
  }

  if (base && base !== 'main') {
    return {
      ok: false,
      kind: 'WRONG_BASE',
      message: `PRs de produto devem ter base "main". Base atual: "${base}".`,
    };
  }

  if (quarantineBranches.has(head)) {
    return {
      ok: true,
      kind: 'QUARANTINE',
      message: `A branch "${head}" é quarentena arqueológica: pode ser verificada, mas não é autoridade de execução nem deve ser mesclada por atacado.`,
    };
  }

  if (mergeBase !== originMain || behind > 0) {
    return {
      ok: false,
      kind: 'STALE_WORK_BRANCH',
      message: `A branch "${head}" não nasce do origin/main atual (merge-base=${mergeBase}, origin/main=${originMain}, behind=${behind}). Faça fetch e recrie/rebaseie o trabalho sobre origin/main.`,
    };
  }

  return {
    ok: true,
    kind: 'CURRENT_WORK',
    message: `A branch "${head}" está baseada no origin/main atual.`,
  };
}
