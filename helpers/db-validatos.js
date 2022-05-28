import { Categoria, Producto, Usuario } from '../models/index.js';
import Role from '../models/role.js';

//Verificar el rol con la BD
export const esRoleValido = async(rol = '') =>{
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}

//Verificar si el correo existe
export const emailExiste = async( correo = '')=>{    
    const existeEmail = await Usuario.findOne({correo});
        if (existeEmail) {
            throw new Error(`El correo ${correo}, ya esta registrado`);            
        }
}

//Verificar si el usuario existe
export const existeUsuarioPorId = async( id = '')=>{    
    const existeUsuario = await Usuario.findById(id);
        if (!existeUsuario) {
            throw new Error(`El Id no existe ${id}, no esta registrado`);            
        }
}

//Verificar si la categoria existe
export const existeCategoriaPorId = async( id = '')=>{    
    const existeCategoria = await Categoria.findById(id);
        if (!existeCategoria) {
            throw new Error(`El Id no existe ${id}, no esta registrado`);            
        }
}

//Verificar si la producto existe
export const existeProductoPorId = async( id = '')=>{    
    const existeProducto = await Producto.findById(id);
        if (!existeProducto) {
            throw new Error(`El Id no existe ${id}, no esta registrado`);            
        }
}

//Validar colecciones Permitidas

export const coleccionPermitidas = (coleccion='', colecciones=[]) =>{
    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}