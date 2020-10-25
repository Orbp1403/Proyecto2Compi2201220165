import { Entorno } from '../Entorno/Entorno';
import { lerrores, _Error } from '../Errores/Error';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Expresion } from './Expresion';

export enum OpcionesLogicas{
    MENOR,
    MAYOR,
    MENORIGUAL,
    MAYORIGUAL,
    IGUAL,
    NOIGUAL,
    AND,
    OR,
    NOT
}

export class Logica extends Expresion{
    constructor(private izquierdo : Expresion, private derecho : Expresion, private tipo : OpcionesLogicas, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        if(this.tipo == OpcionesLogicas.MENOR){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero;
                    this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso;
                    let instrucciones : Array<string> = new Array();
                    instrucciones.push("if(" + izquierdo.valor + " < " + derecho.valor + ") goto " + this.etiquetaverdadero + ";");
                    instrucciones.push("goto " + this.etiquetafalso + ";");
                    return {
                        instrucciones : instrucciones,
                        tipo : Type.BOOLEANO
                    }
                }else{
                    lerrores.push(new _Error("Semantico", "La operacion relacional < no puede realizarse con tipos que no sean numero", this.linea, this.columna))
                }
            }
        }else if(this.tipo == OpcionesLogicas.MAYOR){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero;
                    this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso;
                    let instrucciones : Array<string> = new Array();
                    instrucciones.push("if(" + izquierdo.valor + " > " + derecho.valor + ") goto " + this.etiquetaverdadero + ";");
                    instrucciones.push("goto " + this.etiquetafalso + ";");
                    return {
                        instrucciones : instrucciones,
                        tipo : Type.BOOLEANO
                    }
                }else{
                    lerrores.push(new _Error("Semantico", "La operacion relacional > no puede realizarse con tipos que no sean numero", this.linea, this.columna))
                }
            }
        }else if(this.tipo == OpcionesLogicas.MENORIGUAL){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo != Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero
                    this.etiquetafalso = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetafalso
                    let instrucciones : Array<string> = new Array();
                    instrucciones.push("if(" + izquierdo.valor + " <= " + derecho.valor + ") goto " + this.etiquetaverdadero + ";");
                    instrucciones.push("goto " + this.etiquetafalso + ";");
                    return {
                        instrucciones : instrucciones,
                        tipo : Type.BOOLEANO
                    }
                }else{
                    lerrores.push(new _Error("Semantico", "La operacion relacional <= no puede realizarse con tipos que no sean numero", this.linea, this.columna))
                }
            }
        }else if(this.tipo == OpcionesLogicas.MAYORIGUAL){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero
                    this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso
                    let instrucciones : Array<string> = new Array();
                    instrucciones.push("if(" + izquierdo.valor + " >= " + derecho.valor + ") goto " + this.etiquetaverdadero + ";");
                    instrucciones.push("goto " + this.etiquetafalso + ";");
                    return {
                        instrucciones : instrucciones,
                        tipo : Type.BOOLEANO
                    }
                }else{
                    lerrores.push(new _Error("Semantico", "La operacion relacional >= no puede realizarse con tipos que no sean numero", this.linea, this.columna));
                }
            }
        }else if(this.tipo == OpcionesLogicas.IGUAL){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo != Type.NUMERO){
                    const generador = Generador.getInstance();
                    this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero;
                    this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso;
                    let instrucciones : Array<string> = new Array();
                    instrucciones.push("if(" + izquierdo.valor + " == " + derecho.valor + ") goto " + this.etiquetaverdadero + ";");
                    instrucciones.push("goto " + this.etiquetafalso + ";");
                    return {
                        instrucciones : instrucciones,
                        tipo : Type.BOOLEANO
                    }
                }else{
                    lerrores.push(new _Error("Semantico", "La operacion relacional == no puede realizarse con tipos que no sean numero", this.linea, this.columna));
                }
            }
        }else if(this.tipo == OpcionesLogicas.NOIGUAL){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero
                    this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso
                    let instrucciones : Array<string> = new Array();
                    instrucciones.push("if(" + izquierdo.valor + " != " + derecho.valor + ") goto " + this.etiquetaverdadero + ";");
                    instrucciones.push("goto " + this.etiquetafalso + ";");
                    return {
                        instrucciones : instrucciones,
                        tipo : Type.BOOLEANO
                    }
                }else{
                    lerrores.push(new _Error("Semantico", "la operacion relacional != no puede realizarse con tipos que no sean numero", this.linea, this.columna));
                }
            }
        }else if(this.tipo == OpcionesLogicas.AND){
            const generador = Generador.getInstance();
            this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero;
            this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso;

            this.izquierdo.etiquetaverdadero = this.etiquetaverdadero
            this.derecho.etiquetaverdadero = generador.generarEtiqueta();
            this.izquierdo.etiquetafalso = this.derecho.etiquetafalso = this.etiquetafalso;

            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.BOOLEANO && derecho.tipo == Type.BOOLEANO){
                    let instrucciones : Array<string> = new Array();
                    for(let i = 0; i < izquierdo.instrucciones.length; i++){
                        instrucciones.push(izquierdo.instrucciones[i]);
                    }
                    instrucciones.push(this.etiquetaverdadero + ":");
                    for(let i = 0; i < derecho.instrucciones.length; i++){
                        instrucciones.push(derecho.instrucciones[i]);
                    }
                    this.etiquetaverdadero = this.derecho.etiquetaverdadero;
                    return {
                        instrucciones : instrucciones,
                        tipo : Type.BOOLEANO
                    }
                }else{
                    lerrores.push(new _Error("Semantico", "La operacion && no puede realizarse con tipos que no sean boolean.", this.linea, this.columna));
                }
            }
        }else if(this.tipo == OpcionesLogicas.OR){
            const generador = Generador.getInstance();
            this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero;
            this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso;
            
            this.izquierdo.etiquetaverdadero = this.derecho.etiquetaverdadero = this.etiquetaverdadero;
            this.izquierdo.etiquetafalso = generador.generarEtiqueta();
            this.derecho.etiquetafalso = this.etiquetafalso;

            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.BOOLEANO && derecho.tipo == Type.BOOLEANO){
                    let instrucciones : Array<string> = new Array();
                    for(let i = 0; i < izquierdo.instrucciones.length; i++){
                        instrucciones.push(izquierdo.instrucciones[i]);
                    }
                    instrucciones.push(this.izquierdo.etiquetafalso + ":");
                    for(let i = 0; i < derecho.instrucciones.length; i++){
                        instrucciones.push(derecho.instrucciones[i]);
                    }
                    this.etiquetafalso = this.derecho.etiquetafalso;
                    return{
                        instrucciones : instrucciones,
                        tipo : Type.BOOLEANO
                    }
                }else{
                    throw new _Error("Semantico", "La operacion || no puede realizarse con tipos que no sean boolean.", this.linea, this.columna);
                }
            }
        }else if(this.tipo == OpcionesLogicas.NOT){
            const generador = Generador.getInstance();
            this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero;
            this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso;

            this.izquierdo.etiquetafalso = this.etiquetaverdadero;
            this.izquierdo.etiquetaverdadero = this.etiquetafalso;

            let valor = this.izquierdo.generar(entorno);
            if(valor != null){
                if(valor.tipo == Type.BOOLEANO){
                    let instrucciones : Array<string> = new Array();
                    for(let i = 0; i < valor.instrucciones.length; i++){
                        instrucciones.push(valor.instrucciones[i]);
                    }
                    return {
                        instrucciones : instrucciones,
                        tipo : Type.BOOLEANO
                    }
                }
            }
        }
        return null;
    }
}