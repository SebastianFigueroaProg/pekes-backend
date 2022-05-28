import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RoleSchema = Schema({
    rol:{
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});


export default mongoose.model('Role', RoleSchema );