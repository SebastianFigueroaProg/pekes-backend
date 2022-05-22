import Role from '../models/role.js';
import Usuario from '../models/usuario.js';

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