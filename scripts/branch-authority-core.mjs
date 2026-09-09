const historicalPattern = /^(artigo|revisao|copilot|redesign|rebuild|recovery|feature|agent|audit|archive)\//;

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
      message: `A branch "${head}" é histórica ou de inventário e não serve como base de trabalho.`,
    };
  }

  if (base && base !== 'main') {
    return {
      ok: false,
      kind: 'WRONG_BASE',
      message: `PRs de produto devem ter base "main". Base atual: "${base}".`,
    };
  }

  if (mergeBase !== originMain || behind > 0) {
    return {
      ok: false,
      kind: 'STALE_WORK_BRANCH',
      message: `A branch "${head}" não nasce do origin/main atual (merge-base=${mergeBase}, origin/main=${originMain}, behind=${behind}). Recrie o trabalho sobre origin/main.`,
    };
  }

  return {
    ok: true,
    kind: 'CURRENT_WORK',
    message: `A branch "${head}" está baseada no origin/main atual.`,
  };
}
