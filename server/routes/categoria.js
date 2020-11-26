const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');

const app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    let from = req.query.from || 0;
    let limit = req.query.limit || 10;

    from = Number(from);
    limit = Number(limit);

    Categoria.find({})
        .sort('descripcion')
        .skip(from)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            };
            Categoria.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    categorias: categoriasDB,
                    cuantos: count
                });
            })

        });
});

// ============================
// Mostrar categoria ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no pertenece a ninguna categoria'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});

// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Regresa la nueva categoria

    const body = req.body;
    const usuario = req.usuario

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

// ============================
// Actualizar una categoria
// ============================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params['id'];
    let body = _.pick(req.body, ['descripcion']);

    let opc = { new: true, runValidators: true, context: 'query' }

    Categoria.findByIdAndUpdate(id, body, opc, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});


// ============================
// Crear nueva categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un administrador puede borrar categoria
    const id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

module.exports = app;