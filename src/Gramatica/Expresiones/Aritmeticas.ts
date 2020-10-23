import { Expresion } from './Expresion';
import { Type } from '../Retorno';
import { Generador } from '../Generador/Generador';
import { Entorno } from '../Entorno/Entorno';
import { type } from 'os';

export enum OpcionesAritmeticas {
    MAS,
    MENOS,
    POR,
    DIVISION,
    MODULO,
    POTENCIA
}

export class Aritmetica extends Expresion{
    constructor(private izquierdo : Expresion, private derecho : Expresion, private tipo : OpcionesAritmeticas, linea : number, columna : number){
        super(linea, columna);
    }
    
    public generar(entorno : Entorno) {
        if(this.tipo == OpcionesAritmeticas.MAS){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    let temp = generador.generarTemporal();
                    let instruccion = temp + '=' + izquierdo.valor + '+' + derecho.valor + ";";
                    if(entorno.verificar_entorno_global()){
                        generador.agregarInstruccionamain(instruccion);
                    }else{
                        generador.agregarinstruccionfuncion(instruccion);
                    }
                    return {
                        valor : temp,
                        tipo : Type.NUMERO
                    }
                }
                // TODO resto de operaciones con suma
            }
        }else if(this.tipo == OpcionesAritmeticas.MENOS){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    let temp = generador.generarTemporal();
                    let instruccion = temp + '=' + izquierdo.valor + '-' + derecho.valor + ';';
                    if(entorno.verificar_entorno_global()){
                        generador.agregarInstruccionamain(instruccion);
                    }else{
                        generador.agregarinstruccionfuncion(instruccion);
                    }
                    return{
                        valor : temp,
                        tipo : Type.NUMERO
                    }
                }
                //TODO resto de operaciones de resta
            }
        }else if(this.tipo == OpcionesAritmeticas.POR){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    let temp = generador.generarTemporal();
                    let instruccion = temp + '=' + izquierdo.valor + '*' + derecho.valor + ';';
                    if(entorno.verificar_entorno_global()){
                        generador.agregarInstruccionamain(instruccion);
                    }else{
                        generador.agregarinstruccionfuncion(instruccion);
                    }
                    return {
                        valor : temp,
                        tipo : Type.NUMERO
                    }
                }
                //todo multiplicaciones con otros tipos
            }
        }else if(this.tipo == OpcionesAritmeticas.DIVISION){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    let temp = generador.generarTemporal();
                    let instruccion = temp + '=' + izquierdo.valor + '/' + derecho.valor + ';';
                    if(entorno.verificar_entorno_global()){
                        generador.agregarInstruccionamain(instruccion);
                    }else{
                        generador.agregarinstruccionfuncion(instruccion);
                    }
                    return {
                        valor : temp,
                        tipo : Type.NUMERO
                    }
                    // todo divisiones con otros tipos
                }
            }
        }else if(this.tipo == OpcionesAritmeticas.MODULO){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    let temp = generador.generarTemporal();
                    let instruccion = temp + '=' + izquierdo.valor + '%' + derecho.valor + ';';
                    if(entorno.verificar_entorno_global()){
                        generador.agregarInstruccionamain(instruccion);
                    }else{
                        generador.agregarinstruccionfuncion(instruccion);
                    }
                    return {
                        valor : temp,
                        tipo : Type.NUMERO
                    }
                    // todo modulo con otros tipos
                }
            }
        }else if(this.tipo == OpcionesAritmeticas.POTENCIA){
            let izquierdo = this.izquierdo.generar(entorno);
            let derecho = this.derecho.generar(entorno);
            if(izquierdo != null && derecho != null){
                if(izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.NUMERO){
                    //todo potencia
                }
            }
        }
        return null;
    }
}