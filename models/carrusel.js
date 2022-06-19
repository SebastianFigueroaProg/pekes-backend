import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CarruselSchema = new Schema(
    {
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    estado:{
        type:Boolean,
        default: true
    },    
    img:{
        type:  String
    }
},
{
    timestamps:true
});

CarruselSchema.methods.toJSON = function() {
    const { __v, _id, ...Carrusel } = this.toObject();
    Carrusel.uid = _id;
    return Carrusel;
}

export default mongoose.model( 'Carrusel', CarruselSchema );