import { SSL_OP_NO_TLSv1_1 } from 'constants';
import { Entorno } from '../Entorno/Entorno';
import { lerrores } from '../Errores/Error';
import { Generador } from '../Generador/Generador';
import { Instruccion } from "./Instruccion"

export class CasoDefault extends Instruccion{
    constructor(private cuerpo : Instruccion[] | null, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        const generador = Generador.getInstance();
        const global = entorno.verificar_entorno_global();
        generador.addcomentarioiniciosent("inicio caso default", global);
        for(let i = 0; i < this.cuerpo.length; i++){
            try{
                this.cuerpo[i].generar(entorno);
            }catch(error){
                lerrores.push(error);
            }
        }
        generador.addcomentarioiniciosent("fin caso default", global);
    }

}