import { execFileSync } from 'node:child_process';

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

const historical = /^(artigo|revisao|copilot|redesign|rebuild|recovery|feature|agent)\//;
const allowed = /^(main|editorial|dependabot\/|audit\/|refine\/)/;

const head = process.env.GITHUB_HEAD_REF
  || process.env.GITHUB_REF_NAME
  || git('rev-parse', '--abbrev-ref', 'HEAD');

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

const headSha = git('rev-parse', 'HEAD');
const mergeBase = git('merge-base', 'HEAD', 'origin/main');
const behind = Number(git('rev-list', '--count', 'HEAD..origin/main'));
const ahead = Number(git('rev-list', '--count', 'origin/main..HEAD'));

console.log(`branch: ${head}`);
console.log(`HEAD: ${headSha}`);
console.log(`origin/main: ${originMain}`);
console.log(`merge-base: ${mergeBase}`);
console.log(`ahead: ${ahead}  behind: ${behind}`);

if (historical.test(head) && !allowed.test(head)) {
  throw new Error(
    `A branch "${head}" é histórica e nunca é base de execução. `
    + 'Faça fetch de origin/main, crie uma branch nova a partir dela e recomece. '
    + 'Ver AGENTS.md.',
  );
}

if (!allowed.test(head) && head !== 'HEAD') {
  console.warn(`Aviso: a branch "${head}" não está na lista explícita de prefixos permitidos. Confira AGENTS.md antes de mesclar.`);
}

const base = process.env.GITHUB_BASE_REF;
if (base && base !== 'main') {
  throw new Error(`PRs de produto devem ter base "main". Base atual: "${base}".`);
}

if (process.env.GITHUB_EVENT_NAME === 'pull_request' && behind > 0 && historical.test(head)) {
  throw new Error(`A branch histórica "${head}" está ${behind} commit(s) atrás de origin/main.`);
}

console.log('Autoridade da branch conferida.');
