import express from 'express';
import { check } from 'express-validator';
import { 
        actualizarProducto,
        borrarProducto,
        crearProducto,
        obtenerProducto,
        obtenerProductos } from '../controllers//productos.js';
import { existeCategoriaPorId, existeProductoPorId } from '../helpers/db-validatos.js';

import { validarCampos,validarJWT, esAdminRole } from '../middlewares/index.js';

const router= express.Router();

//Obtener todas las categorias - Publico
router.get('/', obtenerProductos);

//Obtener una categoria por ID - Publico
router.get('/:id',[
    check('id', 'No es un Id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

//Crear categoria - Privado - Cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un Id de mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//Actualizar - Privado - Cualquier persona con un token valido
router.put('/:id',[
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

//Borrar( cambiar el estado unicamente) - Privado - Cualquier persona con un token valido
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

export default router;
