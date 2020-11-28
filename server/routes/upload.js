const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', (req, res) => {

    if (!fs.existsSync(path.resolve(__dirname, '../../uploads'))) {
        crearDirectorio(res);
    };

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    };

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidos son: ' + tiposValidos.join(', '),
                tipo
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones validas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    };

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Aqui, imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo)
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo('usuarios', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!usuarioDB) {
            borrarArchivo('usuarios', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo('usuarios', usuarioDB.img);


        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };
            return res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    })

};

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarArchivo('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!productoDB) {
            borrarArchivo('productos', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        };


        borrarArchivo('productos', productoDB.img)

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            return res.json({
                ok: true,
                producto: productoGuardado
            })
        })

    });


};

const borrarArchivo = (tipo, nombreImagen) => {
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }

};

const crearDirectorio = (res) => {
    fs.mkdir(path.resolve(__dirname, '../../uploads'), { recursive: true }, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        fs.mkdir(path.resolve(__dirname, '../../uploads/usuarios'), { recursive: true }, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        });
        fs.mkdir(path.resolve(__dirname, '../../uploads/productos'), { recursive: true }, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        })
    });
};

module.exports = app;