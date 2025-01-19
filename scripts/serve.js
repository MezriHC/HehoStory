const express = require('express')
const path = require('path')

const app = express()
const port = 3000
const host = '127.0.0.1'

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Servir les fichiers statiques
console.log('Serving static files from:')
console.log('- dist:', path.resolve(__dirname, '../dist'))
console.log('- test:', path.resolve(__dirname, '../test'))

app.use('/dist', express.static(path.resolve(__dirname, '../dist')))
app.use('/test', express.static(path.resolve(__dirname, '../test')))

// Rediriger la racine vers la page de test
app.get('/', (req, res) => {
  console.log('Redirecting to /test/index.html')
  res.redirect('/test/index.html')
})

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).send('Internal Server Error')
})

// Démarrer le serveur
try {
  app.listen(port, host, () => {
    console.log(`Test server running at http://${host}:${port}`)
  })
} catch (error) {
  console.error('Failed to start server:', error)
  process.exit(1)
} 