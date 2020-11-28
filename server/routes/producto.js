const express = require('express');
const { verificaToken } = require('../middlewares/authentication');
const producto = require('../models/producto');
const { model } = require('../models/producto');

const app = express();

let Producto = require('../models/producto');
let Categoria = require('../models/categoria');

// ============================
// Obtener productos
// ============================

app.get('/producto', (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let from = req.query.from || 0;
    let limit = req.query.limit || 10;

    from = Number(from);
    limit = Number(limit);

    Producto.find({ disponible: true })
        .skip(from)
        .limit(limit)
        .sort('categoria')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({ disponible: true })
                .skip(from)
                .limit(limit)
                .exec((err, count) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    };
                    res.json({
                        ok: true,
                        producto: productoDB,
                        count: count
                    })
                })
        })
});

// ============================
// Obtener un producto por ID
// ============================

app.get('/producto/:id', (req, res) => {
    // populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            };
            res.json({
                ok: true,
                producto: productoDB
            })
        })
});

// ============================
// Buscar un producto.
// ============================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params['termino'];

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                producto: productos
            })
        })

});

// ============================
// Crear un nuevo producto.
// ============================

app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    const body = req.body;
    const categoria = req.body.categoria;
    const usuarioId = req.usuario._id;

    Categoria.findById(categoria, (err, categoriaDB) => {
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID de categoria no existe'
                }
            });
        }
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: categoria,
            usuario: usuarioId
        });
        producto.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            return res.status(201).json({
                ok: true,
                producto: productoDB
            })
        });
    })

});

// ============================
// Actualizar un producto
// ============================

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    // let usuarioId = req.usuario._id

    // const bodyObj = {
    //     ...body,
    //     usuario: usuarioId
    // }

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no es valido'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        })

    });

    // Producto.findById(id, (err, productoDB)=>{
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (!productoDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'El id de producto no es valido'
    //             }
    //         });
    //     };
    // producto.nombre = body.nombre;
    // producto.precioUni = body.precioUni;
    // producto.categoria = body.categoria;
    // producto.disponible = body.nombrdisponible;

    // producto.save((err, productoGuardado)=>{
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     res.json({
    //         ok: true,
    //         producto: productoGuardado
    //     })
    // })
    // });

});

// ============================
// Borrar un producto
// ============================

app.delete('/producto/:id', (req, res) => {
    const id = req.params.id;

    const noDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, noDisponible, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(4).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        })
    });
});


module.exports = app;