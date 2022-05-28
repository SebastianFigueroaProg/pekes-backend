import express from 'express';
import { check } from 'express-validator';
import { actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from '../controllers/uploads.js';

import { coleccionPermitidas } from '../helpers/db-validatos.js';
import { validarCampos, validarArchivoSubir } from '../middlewares/index.js';

const router= express.Router();

router.post('/',validarArchivoSubir,cargarArchivo)

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id debe de ser un id de mongo').isMongoId(),
    check('coleccion').custom(c=> coleccionPermitidas(c,['usuarios','productos'])),
    validarCampos
],actualizarImagenCloudinary)

router.get('/:coleccion/:id',[
    check('id','El id debe de ser un id de mongo').isMongoId(),
    check('coleccion').custom(c=> coleccionPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarImagen)

export default router;
