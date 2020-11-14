// =============================
// Puerto
// =============================
process.env.PORT = process.env.PORT || 3000;


// =============================
// Entorno
// =============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================
// Entorno
// =============================
let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://rjvelazco:oRh5xMmsedWVImwO@cluster0.u7v4j.mongodb.net/cafe'
}

process.env.URLDB = urlDB;