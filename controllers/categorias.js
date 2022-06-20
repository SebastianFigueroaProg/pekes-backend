import { response } from "express";
import { Categoria } from '../models/index.js';


export const crearCategoria = async(req, res = response)=>{

    const nombre = req.body.nombre.trim().toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);
}

//Obtener categorias - paginado - total - populate
export const obtenerCategorias = async (req = request,res = response)=>{

    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total, categorias] = await Promise.all([
        Categoria.count(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

//Obtener categoria - populate{}
export const obtenerCategoria = async(req,res)=>{

    const {id} = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.json( categoria );

}

//Actualizar categoria
export const actualizarCategoria = async(req,res)=>{

    const {id} = req.params;
    let {estado, usuario, ...data} = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate(id,data,{new: true});

    res.json(categoria);

}

//Borrar categoria - Cambiar estado a false
export const borrarCategoria = async(req,res)=>{

    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.status(200).json(categoriaBorrada);
}