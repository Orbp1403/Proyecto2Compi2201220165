import { Entorno } from '../Entorno/Entorno';

export abstract class Expresion {
    etiquetaverdadero : string;
    etiquetafalso : string;
    constructor(public linea : number, public columna : number) {
        this.etiquetafalso = this.etiquetaverdadero = '';
    }

    public abstract generar(entorno : Entorno);
}