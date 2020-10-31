import { Entorno } from '../Entorno/Entorno';
import { lerrores } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Instruccion } from './Instruccion';

export class Imprimir extends Instruccion{
    constructor(private valor : Expresion[] | null, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        console.log(this.valor);
        if(this.valor != null){
            const generador = Generador.getInstance();
            for(let i = 0; i < this.valor.length; i++){
                try{
                    let valor = this.valor[i].generar(entorno);
                    console.log("valor", valor);
                    if(valor.tipo == Type.NUMERO){
                        if(entorno.verificar_entorno_global()){
                            generador.agregarInstruccionamain("printf(\"%d\", (int) " + valor.valor + ");");
                        }else{
                            generador.agregarinstruccionfuncion("printf(\"%d\", (int) " + valor.valor + ");")
                        }
                    }else if(valor.tipo == Type.BOOLEANO){
                        console.log("val1", valor);
                        if(entorno.verificar_entorno_global()){
                            for(let j = 0; j < valor.instrucciones.length; j++){
                                generador.agregarInstruccionamain(valor.instrucciones[j]);
                            }
                            generador.agregarInstruccionamain(this.valor[i].etiquetaverdadero + ":");
                            generador.agregarInstruccionamain("printf(\"true\");")
                            let etisalida = generador.generarEtiqueta();
                            generador.agregarInstruccionamain("goto " + etisalida + ";");
                            generador.agregarInstruccionamain(this.valor[i].etiquetafalso + ":");
                            generador.agregarInstruccionamain("printf(\"false\");");
                            generador.agregarInstruccionamain(etisalida + ":");
                        }else{
                            for(let j = 0; j < valor.instrucciones.length; j++){
                                generador.agregarinstruccionfuncion(valor.instrucciones[j]);
                            }
                            generador.agregarinstruccionfuncion(this.valor[i].etiquetaverdadero + ":");
                            generador.agregarinstruccionfuncion("printf(\"true\");")
                            let etisalida = generador.generarEtiqueta();
                            generador.agregarinstruccionfuncion("goto " + etisalida + ";");
                            generador.agregarinstruccionfuncion(this.valor[i].etiquetafalso + ":");
                            generador.agregarinstruccionfuncion("printf(\"false\");");
                            generador.agregarinstruccionfuncion(etisalida + ":");
                        }
                    }
                    if(i != this.valor.length - 1){
                        if(entorno.verificar_entorno_global()){
                            generador.agregarInstruccionamain("printf(\",\");")
                        }else{
                            generador.agregarinstruccionfuncion("printf(\",\");")
                        }
                    }
                }catch(error){
                    lerrores.push(error);
                }
            }
        }
    }
}