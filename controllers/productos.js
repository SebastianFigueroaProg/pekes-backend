import { response } from "express";
import { Producto } from '../models/index.js';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL );

export const crearProducto = async(req, res = response)=>{

    const {estado, usuario, ...body} = req.body;
    const nameDB = body.nombre.trim().toUpperCase();


    const productoDB = await Producto.findOne({nombre: nameDB});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //Guardar en DB
    await producto.save();

    res.status(201).json(producto);
} 

//Obtener Productos - paginado - total - populate
export const obtenerProductos = async (req = request,res = response)=>{

    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total, productos] = await Promise.all([
        Producto.count(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .sort('-updatedAt')
            .skip(Number(desde))
            .limit(Number(limite))
            
    ]);

    res.json({
        total,
        productos
    });
}

//Obtener Producto - populate{}
export const obtenerProducto = async(req,res)=>{

    const {id} = req.params;
    const producto = await Producto.findById( id )
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre')

    res.json( producto );

}

//Actualizar Producto
export const actualizarProducto = async(req,res)=>{

    const {id} = req.params;
    let {estado, usuario, ...data} = req.body;

    if (data.nombre) {
        data.nombre  = data.nombre.toUpperCase();        
    }
    data.usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate(id,data,{new: true});

    res.json(producto);

}

//Borrar categoria - Cambiar estado a false
export const borrarProducto = async(req,res)=>{

    const {id} = req.params;

    const model = await Producto.findById(id);
    
    //Borrar Imagen de Raiz
    if (model.img) {
        const nombreArr   = model.img.split('/');
        const nombre      = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.')
        cloudinary.uploader.destroy(public_id);
    }

    const productoBorrado = await Producto.findByIdAndDelete( id );

    res.status(200).json(productoBorrado);
}