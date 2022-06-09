import jwt from 'jsonwebtoken'; 
import Usuario from '../models/usuario.js';


export const validarJWT = async (req,res,next) =>{

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Leer usuario que corresponde al UID
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg:'Token no valido - usuario no existe en DB'
            });
        }
        
        req.usuario = usuario;
        
    } catch (error) {
        res.status(401).json({
            msg:'Token no valido'
        });
    }

    next();  

}