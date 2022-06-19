import express from 'express';
import { check } from 'express-validator';
import { actualizarImagenCarrucel, borrarImagenCarrusel, crearImgCarrusel, obtenerImagenCarrusel } from '../controllers/carrusel.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';



const router= express.Router();

//Obtener todas las imagenes
router.get('/',obtenerImagenCarrusel)

//Crear imagenes
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearImgCarrusel)

//Actualizar una imagen
router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de mongo valido').isMongoId(),
    validarCampos
],actualizarImagenCarrucel)

//Borrar una imagen
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de mongo valido').isMongoId(),
    validarCampos
],borrarImagenCarrusel)

export default router;