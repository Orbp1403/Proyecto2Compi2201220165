import { Type } from '../Retorno';

export enum TipoSimbolo{
    CONST,
    VAR
}

export class Simbolo{
    tipo : Type;
    nombre : string;
    posicion : number;
    constante : boolean;
    global : boolean;
    heap : boolean;
    linea : number;
    columna : number;
    
    constructor(posicion : number, nombre : string, tipo : Type, linea : number, columna : number, constante : boolean, global : boolean, heap : boolean){
        this.columna = columna;
        this.constante = constante;
        this.global = global;
        this.heap = heap;
        this.linea = linea;
        this.nombre = nombre;
        this.posicion = posicion;
        this.tipo = tipo;
    }
}