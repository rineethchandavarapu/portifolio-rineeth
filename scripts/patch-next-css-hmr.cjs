const fs = require('node:fs')
const path = require('node:path')

const hmrFile = path.join(
  process.cwd(),
  'node_modules',
  'next',
  'dist',
  'compiled',
  'mini-css-extract-plugin',
  'hmr',
  'hotModuleReplacement.js',
)

if (!fs.existsSync(hmrFile)) {
  console.warn('[postinstall] Next CSS HMR file was not found; skipping the safety patch.')
  process.exit(0)
}

const unguardedRemoval = 'e.parentNode.removeChild(e)'
const guardedRemoval = 'e.parentNode?.removeChild(e)'
const source = fs.readFileSync(hmrFile, 'utf8')

if (source.includes(guardedRemoval)) {
  process.exit(0)
}

if (!source.includes(unguardedRemoval)) {
  console.warn('[postinstall] Next CSS HMR code has changed; skipping the safety patch.')
  process.exit(0)
}

fs.writeFileSync(hmrFile, source.replaceAll(unguardedRemoval, guardedRemoval))
console.info('[postinstall] Added a guard for already-removed CSS links in Next Webpack HMR.')
