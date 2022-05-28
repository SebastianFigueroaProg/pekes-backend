import express from 'express';
import { check } from 'express-validator';
import { 
        actualizarCategoria,
        borrarCategoria,
        crearCategoria,
        obtenerCategoria,
        obtenerCategorias } from '../controllers/categorias.js';
import { existeCategoriaPorId } from '../helpers/db-validatos.js';

import { validarCampos,validarJWT, esAdminRole } from '../middlewares/index.js';

const router= express.Router();

//Obtener todas las categorias - Publico
router.get('/', obtenerCategorias);

//Obtener una categoria por ID - Publico
router.get('/:id',[
    check('id', 'No es un Id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

//Crear categoria - Privado - Cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar - Privado - Cualquier persona con un token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un Id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

//Borrar( cambiar el estado unicamente) - Privado - Cualquier persona con un token valido
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

export default router;
