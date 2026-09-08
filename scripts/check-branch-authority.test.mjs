import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateBranchAuthority } from './branch-authority-core.mjs';

const MAIN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const OLD = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

test('current refine branch from current main passes', () => {
  const result = evaluateBranchAuthority({
    head: 'refine/nixon-canonical-2026-09-08',
    base: 'main',
    mergeBase: MAIN,
    originMain: MAIN,
    behind: 0,
  });
  assert.equal(result.ok, true);
  assert.equal(result.kind, 'CURRENT_WORK');
});

test('stale work branch fails even with an allowed-looking prefix', () => {
  const result = evaluateBranchAuthority({
    head: 'refine/future-task',
    base: 'main',
    mergeBase: OLD,
    originMain: MAIN,
    behind: 3,
  });
  assert.equal(result.ok, false);
  assert.equal(result.kind, 'STALE_WORK_BRANCH');
});

test('historical artigo branch always fails as an execution base', () => {
  const result = evaluateBranchAuthority({
    head: 'artigo/china-1972',
    base: 'main',
    mergeBase: MAIN,
    originMain: MAIN,
    behind: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.kind, 'HISTORICAL');
});

test('recovery branch is explicitly quarantine, not execution authority', () => {
  const result = evaluateBranchAuthority({
    head: 'audit/nixon-recovery-2026-09-08',
    base: 'main',
    mergeBase: OLD,
    originMain: MAIN,
    behind: 4,
  });
  assert.equal(result.ok, true);
  assert.equal(result.kind, 'QUARANTINE');
});

test('product PRs cannot target a non-main base', () => {
  const result = evaluateBranchAuthority({
    head: 'refine/future-task',
    base: 'editorial',
    mergeBase: MAIN,
    originMain: MAIN,
    behind: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.kind, 'WRONG_BASE');
});
