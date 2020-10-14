import { ReturnStatement } from '@angular/compiler';

export class Nodo
{
    private hijos : Array<Nodo>;

    constructor(private valor : string){
        this.hijos = new Array<Nodo>();
    }

    public getValor(){
        return this.valor;
    }

    public getHijos(){
        return this.hijos;
    }

    public agregarHijo(hijo : Nodo){
        this.hijos.push(hijo);
    }
}