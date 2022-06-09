import bcryptjs from 'bcryptjs';
import {response} from 'express';
import {generarJWT} from '../helpers/generar-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';
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

export const googleSignIn = async(req, res)=>{

    const {id_token} = req.body;

    try {
        
        const {nombre,img,correo} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo})

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        res.status(401).json({
            ok:false,
            msg: 'El token no se pudo verifica'
        })        
    }

}

export const revalidarToken = async (req, res = response ) => {

    const {id,nombre, correo, estado, rol}  = req.usuario;
    
    try {

        // Generar JWT
        const token = await generarJWT( id );
    
        res.json({
            ok: true,
            id,
            nombre,
            correo,
            estado,
            rol,
            token
        })
        
    } catch (error) {
        res.status(401).json({
            ok:false,
            msg: 'El token ya expiro'
        })  
    }
}