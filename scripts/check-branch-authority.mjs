import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { evaluateBranchAuthority } from './branch-authority-core.mjs';

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function readEventPayload() {
  const path = process.env.GITHUB_EVENT_PATH;
  if (!path) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return {};
  }
}

const event = readEventPayload();
const head = process.env.GITHUB_HEAD_REF
  || process.env.GITHUB_REF_NAME
  || git('rev-parse', '--abbrev-ref', 'HEAD');
const base = process.env.GITHUB_BASE_REF
  || event.pull_request?.base?.ref
  || '';

let originMain = '';
try {
  originMain = git('rev-parse', 'origin/main');
} catch {
  try {
    git('fetch', 'origin', 'main', '--depth=50');
    originMain = git('rev-parse', 'origin/main');
  } catch (error) {
    throw new Error(`Não foi possível resolver origin/main: ${error.message}`);
  }
}

// Em pull_request, actions/checkout normalmente deixa HEAD no merge ref sintético.
// Para testar a autoridade da branch real, use o SHA do head registrado no evento.
let headSha = event.pull_request?.head?.sha || git('rev-parse', 'HEAD');
try {
  git('cat-file', '-e', `${headSha}^{commit}`);
} catch {
  if (!head || head === 'HEAD') {
    throw new Error(`Não foi possível resolver o commit real da branch: ${headSha}`);
  }
  git('fetch', 'origin', head, '--depth=50');
  headSha = git('rev-parse', 'FETCH_HEAD');
}

const mergeBase = git('merge-base', headSha, 'origin/main');
const behind = Number(git('rev-list', '--count', `${headSha}..origin/main`));
const ahead = Number(git('rev-list', '--count', `origin/main..${headSha}`));

console.log(`branch: ${head}`);
console.log(`branch HEAD: ${headSha}`);
console.log(`origin/main: ${originMain}`);
console.log(`merge-base: ${mergeBase}`);
console.log(`ahead: ${ahead}  behind: ${behind}`);

const verdict = evaluateBranchAuthority({
  head,
  base,
  mergeBase,
  originMain,
  behind,
});

console.log(`authority: ${verdict.kind}`);
console.log(verdict.message);

if (!verdict.ok) {
  throw new Error(`${verdict.kind}: ${verdict.message}`);
}

if (verdict.kind === 'QUARANTINE') {
  console.warn('QUARANTINE: esta branch pode ser auditada, mas não é base válida para novo trabalho nem autorização de merge.');
}

console.log('Autoridade da branch conferida.');
