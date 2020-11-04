import { Entorno } from '../Entorno/Entorno';
import { _Error } from '../Errores/Error';
import { Generador } from '../Generador/Generador';
import { Instruccion } from './Instruccion';

export class Continue extends Instruccion{
    constructor(linea : number, columna : number){
        super(linea, columna);
    }
    public generar(entorno: Entorno) {
        if(entorno.continue == null){
            throw new _Error("Semantico", "La instruccion continue unicamente puede venir dentro de algun ciclo.", this.linea, this.columna);
        }
        Generador.getInstance().agregargoto(entorno.continue, entorno.verificar_entorno_global());
    }
}