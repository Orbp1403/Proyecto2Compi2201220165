import { Entorno } from '../Entorno/Entorno';

export abstract class Expresion {
    constructor(private linea : number, private columna : number) {
    }

    public abstract generar(entorno : Entorno);
}