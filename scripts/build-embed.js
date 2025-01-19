const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Chemins des fichiers
const DIST_DIR = path.resolve(__dirname, '../dist');
const JS_FILE = path.resolve(DIST_DIR, 'embed.min.js');
const FINAL_FILE = path.resolve(DIST_DIR, 'embed.min.js');

// Fonction principale de build
async function build() {
  try {
    // Ensure dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // Déterminer l'environnement
    const env = process.env.NODE_ENV || 'development';
    console.log(`🔧 Building for ${env}...`);

    // 2. Exécuter webpack
    console.log('🚀 Building with webpack...');
    execSync(`cross-env NODE_ENV=${env} webpack --config webpack.embed.config.js`, { stdio: 'inherit' });

    // Log bundle size
    const stats = fs.statSync(FINAL_FILE);
    const fileSizeInKiB = stats.size / 1024;
    console.log(`✅ Build complete! Bundle size: ${fileSizeInKiB.toFixed(2)} KiB`);

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Lancer le build
build(); 