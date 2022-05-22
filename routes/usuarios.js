
import express from 'express';
import { check } from 'express-validator';
import { UsuariosGet, UsuariosPost, UsuariosPut, UsuariosDelete } from '../controllers/usuarios.js';
import { emailExiste, esRoleValido, existeUsuarioPorId } from '../helpers/db-validatos.js';
import {validarCampos, validarJWT, esAdminRole} from '../middlewares/index.js';


const router= express.Router();


router.get('/', UsuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    validarCampos
], UsuariosPut);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    check('rol').custom( esRoleValido ),
    validarCampos
], UsuariosPost);

router.delete('/:id', [
    validarJWT,
    esAdminRole,    
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], UsuariosDelete);

export default router;



