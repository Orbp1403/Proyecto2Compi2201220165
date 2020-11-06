import { Entorno } from '../Entorno/Entorno';
import { lerrores, _Error } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Instruccion } from './Instruccion';

export class SentenciaTernaria extends Instruccion{
    etiquetaverdadero : string | null;
    etiquetafalso : string | null;

    constructor(private condicion : Expresion, private verdadero : Expresion, private falso : Expresion, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        try{
            let condicion = this.condicion.generar(entorno);
            if(condicion != null && condicion.tipo == Type.BOOLEANO){
                const generador = Generador.getInstance();
                let global = entorno.verificar_entorno_global();
                generador.addcomentarioiniciosent("Inicio ternario", global);
                let verdadero = this.verdadero.generar(entorno);
                let falso = this.falso.generar(entorno);
                if(verdadero != null && falso != null){
                    if(verdadero.tipo == falso.tipo){
                        generador.addcomentarioiniciosent("Inicio condicion sentencia ternario", global)
                        for(let i = 0; i < condicion.instrucciones.length; i++){
                            if(global){
                                generador.agregarInstruccionamain(condicion.instrucciones[i]);
                            }else{
                                generador.agregarinstruccionfuncion(condicion.instrucciones[i]);
                            }
                        }
                        generador.agregaretiqueta(this.condicion.etiquetaverdadero, global);
                        if(verdadero.tipo == Type.BOOLEANO){
                            
                            for(let i = 0; i < verdadero.instrucciones.length; i++){
                                if(global){
                                    generador.agregarInstruccionamain(verdadero.instrucciones[i]);
                                }else{
                                    generador.agregarinstruccionfuncion(verdadero.instrucciones[i]);
                                }
                            }
                            generador.agregaretiqueta(this.condicion.etiquetafalso, global);
                            for(let i = 0; i < falso.instrucciones.length; i++){
                                if(global){
                                    generador.agregarInstruccionamain(falso.instrucciones[i]);
                                }else{
                                    generador.agregarinstruccionfuncion(falso.instrucciones[i]);
                                }
                            }
                            generador.addcomentarioiniciosent("Fin condicion sentencia ternario", global);
                            generador.addcomentarioiniciosent("inicio parte verdadera ternario", global);
                            let temporal = generador.generarTemporal();
                            let etiquetasalida = generador.generarEtiqueta();
                            generador.agregaretiqueta(this.verdadero.etiquetaverdadero, global);
                            if(global){
                                generador.agregarInstruccionamain(temporal + "=1;")
                            }else{
                                generador.agregarinstruccionfuncion(temporal + "=1;")
                            }
                            generador.agregargoto(etiquetasalida, global);
                            generador.agregaretiqueta(this.verdadero.etiquetafalso, global);
                            if(global){
                                generador.agregarInstruccionamain(temporal + "=0;");
                            }else{
                                generador.agregarinstruccionfuncion(temporal + "=0;")
                            }
                            generador.agregargoto(etiquetasalida, global);
                            generador.addcomentarioiniciosent("Fin parte verdadera ternario", global);
                            generador.addcomentarioiniciosent("inicio parte falsa ternario", global);
                            generador.agregaretiqueta(this.falso.etiquetaverdadero, global);
                            if(global){
                                generador.agregarInstruccionamain(temporal + "=1;");
                            }else{
                                generador.agregarinstruccionfuncion(temporal + "=1;");
                            }
                            generador.agregargoto(etiquetasalida, global);
                            generador.agregaretiqueta(this.falso.etiquetafalso, global);
                            if(global){
                                generador.agregarInstruccionamain(temporal + "=0;");
                            }else{
                                generador.agregarinstruccionfuncion(temporal + "=0;");
                            }
                            generador.addcomentarioiniciosent("fin parte falsa ternario", global);
                            generador.agregaretiqueta(etiquetasalida, global);
                            let instrucciones : Array<string> = new Array();
                            let etiquetaverdadero = generador.generarEtiqueta();
                            let etiquetafalso = generador.generarEtiqueta();
                            instrucciones.push("if(" + temporal + "==1) goto " + etiquetaverdadero + ";");
                            instrucciones.push("goto " + etiquetafalso + ";");
                            this.etiquetaverdadero = etiquetaverdadero;
                            this.etiquetafalso = etiquetafalso;
                            generador.addcomentarioiniciosent("Fin ternario", global);
                            return {
                                instrucciones : instrucciones,
                                tipo : Type.BOOLEANO,
                                valor : temporal
                            }
                        }else
                            generador.addcomentarioiniciosent("Fin condicion sentencia ternario", global);{
                            let temporal = generador.generarTemporal();
                            let etiquetasalida = generador.generarEtiqueta();
                            if(global){
                                generador.agregarInstruccionamain(temporal + "=" + verdadero.valor + ";");
                            }else{
                                generador.agregarinstruccionfuncion(temporal + "=" + verdadero.valor + ";");
                            }
                            generador.agregargoto(etiquetasalida, global);
                            generador.agregaretiqueta(this.condicion.etiquetafalso, global);
                            if(global){
                                generador.agregarInstruccionamain(temporal + "=" + falso.valor + ";")
                            }else{
                                generador.agregarinstruccionfuncion(temporal + "=" + falso.valor + ";");
                            }
                            generador.agregaretiqueta(etiquetasalida, global);
                            generador.addcomentarioiniciosent("Fin ternario", global);
                            return {
                                valor : temporal,
                                tipo : verdadero.tipo
                            }
                        }
                    }else{
                        throw new _Error("Semantico", "Las expresiones de una instruccion ternaria deben tener el mismo tipo", this.linea, this.columna);
                    }
                }
                
            }else if(condicion.tipo != Type.BOOLEANO){
                throw new _Error("Semantico", "La condicion de una sentencia ternaria solo puede ser booleana.", this.linea, this.columna)
            }
        }catch(error){
            lerrores.push(error);
        }
    }
}