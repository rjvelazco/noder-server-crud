// =============================
// Puerto
// =============================
process.env.PORT = process.env.PORT || 3000;


// =============================
// Entorno
// =============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================
// Vencmiento del Token
// =============================

process.env.CADUCIDAD_TOKEN = '48h';

// =============================
// SEED de autenticacion
// =============================

process.env.SEED = process.env.SEED || 'este-es-el-see-desarrollo';

// =============================
// Base de Dato
// =============================
let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// =============================
// Google Client ID
// =============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '826396277298-ejlh1a03k5ddda8davgdcnf8g8ngb6l9.apps.googleusercontent.com'