import express from 'express';
import buscar from '../controllers/buscar.js';

const router = express.Router();


router.get('/:coleccion/:termino', buscar);


export default router;



