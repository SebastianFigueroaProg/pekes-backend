import bcryptjs from 'bcryptjs';
import {response} from 'express';
import {generarJWT} from '../helpers/generar-jwt.js';
import Usuario from '../models/usuario.js';

export const login = async (req, res=response) =>{

    const {correo, password} = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo})
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password  );
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);        
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}