import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = resolve(projectRoot, 'dist')
const indexPath = resolve(distRoot, 'index.html')
const outputPath = resolve(projectRoot, '饱了么-离线版.html')

let html = readFileSync(indexPath, 'utf8')

html = html.replace(
  /<link rel="stylesheet" crossorigin href="\.\/(assets\/[^"?]+\.css)">/,
  (_, assetPath) => `<style>${readFileSync(resolve(distRoot, assetPath), 'utf8')}</style>`,
)

html = html.replace(
  /<script type="module" crossorigin src="\.\/(assets\/[^"?]+\.js)"><\/script>/,
  (_, assetPath) => `<script type="module">${readFileSync(resolve(distRoot, assetPath), 'utf8')}</script>`,
)

writeFileSync(outputPath, html)
console.log(`Offline app created: ${outputPath}`)
