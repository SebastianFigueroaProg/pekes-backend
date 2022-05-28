import path from 'path';
import {fileURLToPath} from 'url';
import { v4 as uuidv4 } from 'uuid';

export const subirArchivo = (files, extensionesValidas=['png','jpg','jpeg','gif'],carpeta='') =>{

    return new Promise((resolve, reject)=>{
        const {archivo} = files;

    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    //Validar la Extension
    if (!extensionesValidas.includes(extension)) {
        return reject(`La extension ${extension} no es permitida - ${extensionesValidas}`);
    }

    const nombreTemp = uuidv4() + '.' + extension;

    const __filename = fileURLToPath(import.meta.url);    
    const __dirname = path.dirname(__filename);
    
    const uploadPath = path.join(__dirname, '../uploads/',carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
    if (err) {
        return reject(err);
    }

    resolve( nombreTemp );

    });
    })

}