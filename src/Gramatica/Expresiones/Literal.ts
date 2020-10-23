import { Entorno } from '../Entorno/Entorno';
import { Type } from '../Retorno';
import { Expresion } from './Expresion';

export class Literal extends Expresion{
    constructor(private valor : any, private tipo : Type, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno : Entorno) {
        if(this.tipo == Type.NUMERO){
            return {
                valor : this.valor,
                tipo : Type.NUMERO
            };
        }
        else{
            return null;
        }
    }
}