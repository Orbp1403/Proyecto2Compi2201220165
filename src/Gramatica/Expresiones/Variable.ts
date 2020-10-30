import { Entorno } from '../Entorno/Entorno';
import { _Error } from '../Errores/Error';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Expresion } from './Expresion';

export class Variable extends Expresion{
    constructor(private nombre : string, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        console.log(entorno.Existevariable(this.nombre));
        if(entorno.Existevariable(this.nombre) == false){
            console.log(entorno);
            throw new _Error("Semantico", "La variable: " + this.nombre + ", no se encuentra declarada", this.linea, this.columna);
        }
        let valorvariable = entorno.getVariable(this.nombre);
        const generador = Generador.getInstance();
        if(valorvariable.tipo == Type.NUMERO){
            let temp = generador.generarTemporal();
            if(entorno.verificar_entorno_global()){
                generador.agregarInstruccionamain(temp + "=stack[" + valorvariable.posicion + "];");
            }else{
                generador.agregarinstruccionfuncion(temp + "=stack[" + valorvariable.posicion + "];");
            }
            return {
                valor : temp,
                tipo : Type.NUMERO
            };
        }else if(valorvariable.tipo == Type.BOOLEANO){
            let temp = generador.generarTemporal();
            this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero;
            this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso;
            if(entorno.verificar_entorno_global()){
                generador.agregarInstruccionamain(temp + "=stack[" + valorvariable.posicion + "];");
            }else{
                generador.agregarinstruccionfuncion(temp + "=stack[" + valorvariable.posicion + "];");
            }
            let instrucciones : Array<string> = new Array();
            instrucciones.push("if(" + temp + "==1) goto " + this.etiquetaverdadero + ";");
            instrucciones.push("goto " + this.etiquetafalso + ";")
            return {
                instrucciones : instrucciones,
                tipo : Type.BOOLEANO
            }
        }else if(valorvariable.tipo == Type.CADENA){
            let temp = generador.generarTemporal();
            if(entorno.verificar_entorno_global()){
                generador.agregarInstruccionamain(temp + "=stack[" + valorvariable.posicion + "];")
            }else{
                generador.agregarinstruccionfuncion(temp + "=stack[" + valorvariable.posicion + "];")
            }
            return {
                valor : temp,
                tipo : Type.CADENA
            }
        }
    }
}