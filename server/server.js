require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    // json() -> formato JSON;
    // send() -> formato HTML;
    res.json('Hello world');
});

app.get('/usuario', (req, res) => {
    res.json('Get usuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (!body.nombre) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params['id'];
    res.json({
        id
    });
});


app.delete('/usuario', (req, res) => {
    res.json('Delete usuario');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});