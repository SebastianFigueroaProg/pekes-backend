import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: true
    },
    precio:{
        type:Number,
        default: 0
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref:'Categoria',
        required: true
    },
    descripcion:{type: String},
    disponible:{type: Boolean, default: true},
    img:{type: String}
},{
    timestamps:true
});

ProductoSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...Producto } = this.toObject();
    Producto.uid = _id;
    return Producto;
}


export default mongoose.model('Producto', ProductoSchema );