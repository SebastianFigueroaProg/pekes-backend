import express from 'express';
import cors from 'cors';
import routes from '../routes/usuarios.js';
import auth from '../routes/auth.js';
import { dbConnection } from '../database/config.js';


export default class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/usuarios';
        this.authPath = '/auth';

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
        this.app.use( this.authPath, auth);
        this.app.use( this.usuariosPath, routes);

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ',this.port);            
        });
    }

}

