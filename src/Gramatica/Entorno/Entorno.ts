import { _Error } from '../Errores/Error';
import { Type } from '../Retorno';
import { Simbolo } from './Simbolo';

export class Entorno{
    private size = 0; 
    public variables : Map<string, Simbolo>;
    constructor(private anterior : Entorno | null, private nombre : string){
        this.variables = new Map();
    }

    public verificar_entorno_global(){
        let entorno : Entorno | null = this;
        while(entorno != null){
            if(entorno.nombre == "global"){
                return true;
            }else if(entorno.nombre == "funcion"){
                return false;
            }
            entorno = entorno.anterior;
        }
    }

    public setentornoglobal(){
        this.size = 1;
    }

    public agregarvariable(nombre : string, linea : number, columna : number, tipo : Type, constante : boolean, heap : boolean) : Simbolo{
        nombre = nombre.toLowerCase();
        let entorno : Entorno | null = this;
        if(entorno != null){
            if(!entorno.variables.has(nombre)){
                //todo guardar variable
                let isglobal = entorno.verificar_entorno_global();
                let newVar = new Simbolo(this.size++, nombre, tipo, linea, columna, constante, isglobal, heap);
                entorno.variables.set(nombre, newVar);
                return newVar;
            }else{
                throw new _Error("Semantico", "La variable " + nombre + " ya existe", linea, columna);
            }
        }
    }
}