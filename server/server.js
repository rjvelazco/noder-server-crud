// Configuraciones Globales de la aplicacion.
require('./config/config');

// Paquetes externos.
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Configuracion global de rutas
app.use(require('./routes/index'));

// Constante DataBase MongoDB y la Configuracion
// const db = 'mongodb://localhost:27017/cafe';
const dbCongif = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect(process.env.URLDB, dbCongif, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});