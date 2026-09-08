import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateBranchAuthority } from './branch-authority-core.mjs';

const MAIN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const OLD = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

test('work branch from current main passes', () => {
  const result = evaluateBranchAuthority({
    head: 'chore/example',
    base: 'main',
    mergeBase: MAIN,
    originMain: MAIN,
    behind: 0,
  });
  assert.equal(result.ok, true);
  assert.equal(result.kind, 'CURRENT_WORK');
});

test('stale work branch fails even with an allowed prefix', () => {
  const result = evaluateBranchAuthority({
    head: 'chore/example',
    base: 'main',
    mergeBase: OLD,
    originMain: MAIN,
    behind: 3,
  });
  assert.equal(result.ok, false);
  assert.equal(result.kind, 'STALE_WORK_BRANCH');
});

test('historical artigo branch is never an execution base', () => {
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

test('audit inventory branch is never an execution base', () => {
  const result = evaluateBranchAuthority({
    head: 'audit/nixon-recovery-2026-09-08',
    base: 'main',
    mergeBase: OLD,
    originMain: MAIN,
    behind: 4,
  });
  assert.equal(result.ok, false);
  assert.equal(result.kind, 'HISTORICAL');
});

test('archive refs are never an execution base', () => {
  const result = evaluateBranchAuthority({
    head: 'archive/artigo-china-1972',
    base: 'main',
    mergeBase: MAIN,
    originMain: MAIN,
    behind: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.kind, 'HISTORICAL');
});

test('product PRs cannot target a non-main base', () => {
  const result = evaluateBranchAuthority({
    head: 'chore/example',
    base: 'editorial',
    mergeBase: MAIN,
    originMain: MAIN,
    behind: 0,
  });
  assert.equal(result.ok, false);
  assert.equal(result.kind, 'WRONG_BASE');
});
