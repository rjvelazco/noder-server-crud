// Configuraciones Globales de la aplicacion.
require('./config/config');

// Paquetes externos.
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded y parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

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