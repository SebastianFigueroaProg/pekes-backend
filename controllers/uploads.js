import { subirArchivo } from "../helpers/subir-archivo.js";
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL );

import {Producto, Usuario} from '../models/index.js'

export const cargarArchivo = async(req,res)=>{
    
    try {
        
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
    
        res.json({nombre});    

    } catch (msg) {
        res.status(400).json({msg})
    }

}

export const actualizarImagenCloudinary = async(req,res) =>{
    
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                })
            }    
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un producto con el id ${id}`
                })
            }    
        break;
    
        default:
            return res.status(500).json({msg:'Se me olvido validar esto'})
    }

    const __filename = fileURLToPath(import.meta.url);    
    const __dirname = path.dirname(__filename);
        
    //Limpiar imagenes previas
    if (modelo.img) {
        const nombreArr   = modelo.img.split('/');
        const nombre      = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.')
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url; 

    await modelo.save();

    res.json(modelo);
}

export const mostrarImagen = async (req,res)=>{

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                })
            }    
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un producto con el id ${id}`
                })
            }    
        break;
    
        default:
            return res.status(500).json({msg:'Se me olvido validar esto'})
    }

    const __filename = fileURLToPath(import.meta.url);    
    const __dirname = path.dirname(__filename);
        
    //Limpiar imagenes previas
    if (modelo.img) {
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }    
    }

    const pathImagen = path.join(__dirname,'../assets/no-image.jpg')

    res.sendFile(pathImagen);
}