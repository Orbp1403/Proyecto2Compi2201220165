import { Entorno } from '../Entorno/Entorno';
import { lerrores } from '../Errores/Error';
import { Instruccion } from './Instruccion';

export class Cuerposentencia extends Instruccion{
    constructor(private cuerpo : Array<Instruccion>, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        for(let i = 0; i < this.cuerpo.length; i++){
            try{
                let instruccion = this.cuerpo[i].generar(entorno);
            }catch(error){
                lerrores.push(error);
            }
        }
    }
}