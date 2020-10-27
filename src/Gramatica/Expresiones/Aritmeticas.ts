import { Expresion } from './Expresion';
import { Type } from '../Retorno';
import { Generador } from '../Generador/Generador';
import { Entorno } from '../Entorno/Entorno';
import { type } from 'os';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';

export enum OpcionesAritmeticas {
    MAS,
    MENOS,
    POR,
    DIVISION,
    MODULO,
    POTENCIA,
    NEGADO
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
                }else if((izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.BOOLEANO) || (izquierdo.tipo == Type.BOOLEANO && derecho.tipo ==Type.NUMERO)){
                    const generador = Generador.getInstance();
                    if(derecho.tipo == Type.BOOLEANO){
                        if(entorno.verificar_entorno_global()){
                            for(let i = 0; i < derecho.instrucciones.length; i++){
                                generador.agregarInstruccionamain(derecho.instrucciones[i]);
                            }
                            generador.agregarInstruccionamain(this.derecho.etiquetaverdadero + ":");
                            let temp = generador.generarTemporal();
                            generador.agregarInstruccionamain(temp + "=" + izquierdo.valor + "+1;")
                            let esalida = generador.generarEtiqueta();
                            generador.agregarInstruccionamain("goto " + esalida + ";");
                            generador.agregarInstruccionamain(this.derecho.etiquetafalso + ":");
                            generador.agregarInstruccionamain(temp + "=" + izquierdo.valor + "+0;");
                            generador.agregarInstruccionamain(esalida + ":");
                            return {
                                valor : temp,
                                tipo : Type.NUMERO
                            }
                        }else{
                            for(let i = 0; i < derecho.instrucciones.length; i++){
                                generador.agregarinstruccionfuncion(derecho.instrucciones[i]);
                            }
                            generador.agregarinstruccionfuncion(this.derecho.etiquetaverdadero + ":");
                            let temp = generador.generarTemporal();
                            generador.agregarinstruccionfuncion(temp + "=" + izquierdo.valor + "+1;");
                            let esalida = generador.generarEtiqueta();
                            generador.agregarinstruccionfuncion("goto " + esalida + ";");
                            generador.agregarinstruccionfuncion(this.derecho.etiquetafalso + ":");
                            generador.agregarinstruccionfuncion(temp + "=" + izquierdo.valor + "+0;");
                            generador.agregarinstruccionfuncion(esalida + ":")
                            return{
                                valor : temp,
                                tipo : Type.NUMERO
                            }
                        }
                    }else{
                        if(entorno.verificar_entorno_global()){
                            for(let i = 0; i < izquierdo.instrucciones.length; i++){
                                generador.agregarInstruccionamain(izquierdo.instrucciones[i]);
                            }
                            generador.agregarInstruccionamain(this.izquierdo.etiquetaverdadero + ":");
                            let temp = generador.generarTemporal();
                            generador.agregarInstruccionamain(temp + "=1+" + derecho.valor)
                            let esalida = generador.generarEtiqueta();
                            generador.agregarInstruccionamain("goto " + esalida + ";");
                            generador.agregarInstruccionamain(this.izquierdo.etiquetafalso + ":");
                            generador.agregarInstruccionamain(temp + "=0+" + derecho.valor);
                            generador.agregarInstruccionamain(esalida + ":");
                            return {
                                valor : temp,
                                tipo : Type.NUMERO
                            }
                        }else{
                            for(let i = 0; i < izquierdo.instrucciones.length; i++){
                                generador.agregarinstruccionfuncion(izquierdo.instrucciones[i]);
                            }
                            generador.agregarinstruccionfuncion(this.izquierdo.etiquetaverdadero + ":");
                            let temp = generador.generarTemporal();
                            generador.agregarinstruccionfuncion(temp + "=1+" + derecho.valor);
                            let esalida = generador.generarEtiqueta();
                            generador.agregarinstruccionfuncion("goto " + esalida + ";");
                            generador.agregarinstruccionfuncion(this.izquierdo.etiquetafalso + ':');
                            generador.agregarinstruccionfuncion(temp + "=0+" + derecho.valor);
                            generador.agregarinstruccionfuncion(esalida + ":");
                            return {
                                valor : temp,
                                tipo : Type.NUMERO
                            };
                        }
                    }
                }else if(izquierdo.tipo == Type.CADENA && derecho.tipo == Type.CADENA){
                    const generador = Generador.getInstance();
                    if(entorno.verificar_entorno_global()){
                        generador.agregarInstruccionamain("T0=" + izquierdo.valor + ";");
                        generador.agregarInstruccionamain("T1=" + derecho.valor + ";");
                        generador.agregarInstruccionamain("nativa_concat();");
                        return { 
                            valor : "T2",
                            tipo : Type.CADENA
                        }
                    }else{
                        generador.agregarinstruccionfuncion("T0=" + izquierdo.valor + ";");
                        generador.agregarinstruccionfuncion("T1=" + derecho.valor + ";");
                        generador.agregarinstruccionfuncion('nativa_concat();');
                        return {
                            valor : 'T2',
                            tipo : Type.CADENA
                        }
                    }
                }else if((izquierdo.tipo == Type.CADENA && derecho.tipo == Type.NUMERO) || (izquierdo.tipo == Type.NUMERO && derecho.tipo == Type.CADENA)){
                    console.log("izquierdo", izquierdo);
                    console.log("derecho", derecho);
                    const generador = Generador.getInstance();
                    if(izquierdo.tipo == Type.CADENA){
                        if(entorno.verificar_entorno_global()){
                            generador.agregarInstruccionamain("T0=" + izquierdo.valor + ";");
                            generador.agregarInstruccionamain("T1=" + derecho.valor + ";");
                            generador.agregarInstruccionamain("nativa_concat_string_number();");
                        }else{
                            generador.agregarinstruccionfuncion("T0="+izquierdo.valor + ";");
                            generador.agregarinstruccionfuncion("T1="+derecho.valor + ";");
                            generador.agregarinstruccionfuncion("nativa_concat_string_number();");
                        }
                    }else{
                        if(entorno.verificar_entorno_global()){
                            generador.agregarInstruccionamain("T0="+izquierdo.valor + ";");
                            generador.agregarInstruccionamain("T1=" + derecho.valor + ";");
                            generador.agregarInstruccionamain("nativa_concat_number_string();")
                        }else{
                            generador.agregarinstruccionfuncion("T0" + izquierdo.valor + ";");
                            generador.agregarinstruccionfuncion("T1=" + derecho.valor + ";");
                            generador.agregarinstruccionfuncion("nativa_concat_number_string();");
                        }
                    }
                    return {
                        valor : "T2",
                        tipo : Type.CADENA
                    }
                }
                // TODO suma con strings
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
                    let instruccion = temp + '=' + izquierdo.valor + '%(int)' + derecho.valor + ';';
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
        }else if(this.tipo == OpcionesAritmeticas.NEGADO){
            let izquierdo = this.izquierdo.generar(entorno);
            if(izquierdo != null){
                if(izquierdo.tipo == Type.NUMERO){
                    const generador = Generador.getInstance();
                    let temp = generador.generarTemporal();
                    let instruccion = temp + "=-" + izquierdo.valor + ';';
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
            }
        }
        return null;
    }
}