import { variationPlacements } from '@popperjs/core';
import { Entorno } from '../Entorno/Entorno';
import { lerrores, _Error } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Instruccion } from './Instruccion';

export class Asignacion extends Instruccion{
    constructor(private nombre : string, private valor : Expresion, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        if(entorno.Existevariable(this.nombre)){
            let variable = entorno.getVariable(this.nombre);
            if(variable.constante){
                throw new _Error("Semantico", "La variable: " + this.nombre + ", es constante entonces su valor no puede cambiar.", this.linea, this.columna)
            }else{
                try{
                    let valor = this.valor.generar(entorno);
                    if(valor.tipo == variable.tipo){
                        const generador = Generador.getInstance();
                        if(valor.tipo != Type.BOOLEANO){
                            generador.addSetStack(variable.posicion, valor.valor, entorno.verificar_entorno_global());
                        }else{
                            if(entorno.verificar_entorno_global()){
                                for(let i = 0; i < valor.instrucciones.length; i++){
                                    generador.agregarInstruccionamain(valor.instrucciones[i]);
                                }
                                generador.agregarInstruccionamain(this.valor.etiquetaverdadero + ":");
                                generador.addSetStack(variable.posicion, "1", true);
                                let etiquetasalida = generador.generarEtiqueta();
                                generador.agregarInstruccionamain("goto " + etiquetasalida + ";")
                                generador.agregarInstruccionamain(this.valor.etiquetafalso + ":");
                                generador.addSetStack(variable.posicion, "0", true);
                                generador.agregarInstruccionamain(etiquetasalida + ":");
                            }else{
                                for(let i = 0; i < valor.instrucciones.length; i++){
                                    generador.agregarinstruccionfuncion(valor.instrucciones[i]);
                                }
                                generador.agregarinstruccionfuncion(this.valor.etiquetaverdadero + ":");
                                generador.addSetStack(variable.posicion, "1", false);
                                let etiquetasalida = generador.generarEtiqueta();
                                generador.agregarinstruccionfuncion("goto " + etiquetasalida + ";");
                                generador.agregarinstruccionfuncion(this.valor.etiquetafalso + ":")
                                generador.addSetStack(variable.posicion, "0", false);
                                generador.agregarinstruccionfuncion(etiquetasalida + ":");
                            }
                        }
                    }else{
                        throw new _Error("Semantico", "El valor de la varibale no es el mismo que el de la asignacion.", this.linea, this.columna);
                    }
                }catch(error){
                    lerrores.push(error);
                }
            }
        }else{
            throw new _Error("Semantico", "La variable: " + this.nombre + ", no esta declarada.", this.linea, this.columna)
        }
    }
}