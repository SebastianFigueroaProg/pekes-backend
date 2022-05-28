import express from 'express';
import cors from 'cors';
import auth from '../routes/auth.js';
import buscar from '../routes/buscar.js'
import categorias from '../routes/categorias.js';
import routes from '../routes/usuarios.js';
import productos from '../routes/productos.js';
import { dbConnection } from '../database/config.js';

export default class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/auth',
            busqueda:     '/buscar',
            categorias: '/categorias',
            productos:  '/productos',
            usuarios:   '/usuarios'            
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi Aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );

        //Lectura u parseo del body
        this.app.use(express.json());

        //Directorio Publico
        this.app.use( express.static('public') )
    }

    routes(){        
        this.app.use( this.paths.auth, auth);
        this.app.use( this.paths.busqueda, buscar);
        this.app.use( this.paths.categorias, categorias);
        this.app.use( this.paths.productos, productos);
        this.app.use( this.paths.usuarios, routes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ',this.port);            
        });
    }

}

