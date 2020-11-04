import { Entorno } from '../Entorno/Entorno';
import { _Error } from '../Errores/Error';
import { Generador } from '../Generador/Generador';
import { Instruccion } from './Instruccion';

export class Break extends Instruccion{
    constructor(linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        if(entorno.break == null){
            throw new _Error("Semantico", "La instruccion break unicamente puede venir dentro de algun ciclo.", this.linea, this.columna);
        }
        Generador.getInstance().agregargoto(entorno.break, entorno.verificar_entorno_global());
    }
}