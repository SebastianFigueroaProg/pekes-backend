import {request,response} from 'express';
import bcryptsjs from 'bcryptjs';
import Usuario from '../models/usuario.js';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL );


export const UsuariosGet = async (req = request,res = response)=>{

    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total, usuarios] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

export const UsuariosPost = async (req,res = response)=>{    

    const {nombre, correo, password, rol} = req.body;
    const usuario = Usuario({nombre, correo, password, rol});

    //Encriptar la contraseña
    const salt = bcryptsjs.genSaltSync();
    usuario.password = bcryptsjs.hashSync(password, salt)

    //Guardar en BD
    await usuario.save()

    res.json({
        usuario
    });
}

export const UsuariosPut = async (req,res = response)=>{

    const id = req.params.id;
    const  { _id, password, google, correo, ...resto } = req.body;

    //Validar contra base de datos
    if (password) {
        //Encriptar la contraseña
        const salt = bcryptsjs.genSaltSync();
        resto.password = bcryptsjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

export const UsuariosDelete = async (req,res = response)=>{

    const {id} = req.params;

    const model = await Usuario.findById(id);
    
    //Borrar Imagen de Raiz
    if (model.img) {
        const nombreArr   = model.img.split('/');
        const nombre      = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.')
        cloudinary.uploader.destroy(public_id);
    }

    // Fisicamente borrado
    const usuario = await Usuario.findByIdAndDelete( id );

    res.json(usuario);
}