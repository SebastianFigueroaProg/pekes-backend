import { response } from "express";
import { Carrusel } from '../models/index.js';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL );

export const crearImgCarrusel = async(req, res=response)=>{
    
    const {nombre} = req.body;

    const nameDB = nombre.trim().toUpperCase();

    const carruselDB = await Carrusel.findOne({nombre:nameDB});    
    
    if (carruselDB) {
        return res.status(400).json({
            msg: `El nombre de la imagen ${carruselDB.nombre}, ya existe`
        })
    }
    const data = {
        nombre: nombre.toUpperCase()
    }

    const carrusel = new Carrusel(data)

    //Guardar en DB
    await carrusel.save();

    res.status(201).json(carrusel);
}

export const obtenerImagenCarrusel = async(req,res)=>{
    const { limite = 3, desde = 0} = req.query;
    const query = {estado:true};

    const [total,carrusel] = await Promise.all([
        Carrusel.count(query),
        Carrusel.find(query)
            .sort('-updatedAt')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        carrusel
    });
}

//Actualizar Imagen Carrusel
export const actualizarImagenCarrucel = async(req,res)=>{

    const {id} = req.params;
    let {estado, ...data} = req.body;

    if (data.nombre) {
        data.nombre  = data.nombre.toUpperCase();        
    }

    const carrusel = await Carrusel.findByIdAndUpdate(id,data,{new: true});

    res.json(carrusel);
}

//Borrar Imagen Carrusel - Borrar
export const borrarImagenCarrusel = async(req,res)=>{

    const {id} = req.params;
    const model = await Carrusel.findById(id);
    
    if (model.img) {
        const nombreArr   = model.img.split('/');
        const nombre      = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.')
        cloudinary.uploader.destroy(public_id);
    }

    const imagenBorrada = await Carrusel.findByIdAndDelete(id);
    

    res.status(200).json({
        imagenBorrada,
        msg: 'Imagen Borrada'
    });
}