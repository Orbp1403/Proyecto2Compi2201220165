import { Entorno } from '../Entorno/Entorno';

export abstract class Instruccion{
    constructor(public linea : number, public columna : number){
    }

    public abstract generar(entorno : Entorno);
}