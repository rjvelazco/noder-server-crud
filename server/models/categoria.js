const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcion del producto es requerida']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

categoriaSchema.plugin(uniqueValidator, { message: 'Errpr, {PATH} debe de ser unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);