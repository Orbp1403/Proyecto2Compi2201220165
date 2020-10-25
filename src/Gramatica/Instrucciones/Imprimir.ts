import { Entorno } from '../Entorno/Entorno';
import { Expresion } from '../Expresiones/Expresion';
import { Instruccion } from './Instruccion';

export class Imprimir extends Instruccion{
    constructor(private valor : Expresion | null, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        throw new Error('Method not implemented.');
    }
}