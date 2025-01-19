const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = 8000
const host = '127.0.0.1'

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`📥 Requête reçue: ${req.method} ${req.url}`)
  next()
})

// Servir les fichiers statiques
const distPath = path.resolve(__dirname, '../dist')
const testPath = path.resolve(__dirname, '../test')

console.log('📂 Dossiers servis:')
console.log(`- dist: ${distPath}`)
console.log(`- test: ${testPath}`)

// Vérifier l'existence du fichier embed.min.js
const embedPath = path.join(distPath, 'embed.min.js')
try {
  const stats = fs.statSync(embedPath)
  console.log(`✅ embed.min.js trouvé (${stats.size} bytes)`)
  console.log(`⏰ Dernière modification: ${stats.mtime}`)
} catch (error) {
  console.error('❌ embed.min.js non trouvé!')
}

app.use('/dist', express.static(distPath))
app.use('/test', express.static(testPath))

// Rediriger la racine vers la page de test
app.get('/', (req, res) => {
  console.log('↪️ Redirection vers /test/index.html')
  res.redirect('/test/index.html')
})

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err)
  res.status(500).send('Internal Server Error')
})

// Démarrer le serveur
try {
  app.listen(port, host, () => {
    console.log(`🚀 Serveur de test démarré sur http://${host}:${port}`)
    console.log('📋 URLs disponibles:')
    console.log(`- http://${host}:${port}/test/client.html`)
    console.log(`- http://${host}:${port}/dist/embed.min.js`)
  })
} catch (error) {
  console.error('❌ Erreur démarrage serveur:', error)
  process.exit(1)
} 