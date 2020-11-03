import { Entorno } from '../Entorno/Entorno';
import { lerrores, _Error } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Instruccion } from './Instruccion';

export class Sentenciaif extends Instruccion{
    constructor(private condicion : Expresion, private cuerpo : Instruccion | null, private sentenciaelse : Instruccion | null, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        try{
            let condicion = this.condicion.generar(entorno);
            let nuevoentorno = new Entorno(entorno, "if");
            if(condicion.tipo == Type.BOOLEANO){
                const generador = Generador.getInstance();
                generador.addcomentarioiniciosent("Inicio IF", entorno.verificar_entorno_global());
                for(let i = 0; i < condicion.instrucciones.length; i++){
                    if(entorno.verificar_entorno_global()){
                        generador.agregarInstruccionamain(condicion.instrucciones[i]);
                    }else{
                        generador.agregarinstruccionfuncion(condicion.instrucciones[i]);
                    }
                }
                generador.agregaretiqueta(this.condicion.etiquetaverdadero, entorno.verificar_entorno_global());
                if(this.cuerpo != null){
                    this.cuerpo.generar(nuevoentorno);
                }
                if(this.sentenciaelse != null){
                    let etiquetasalida = generador.generarEtiqueta();
                    generador.agregargoto(etiquetasalida, entorno.verificar_entorno_global());
                    generador.agregaretiqueta(this.condicion.etiquetafalso, entorno.verificar_entorno_global());
                    this.sentenciaelse.generar(entorno);
                    generador.agregaretiqueta(etiquetasalida, entorno.verificar_entorno_global());
                }
                generador.addcomentarioiniciosent("Fin IF", entorno.verificar_entorno_global());
            }else{
                throw new _Error("Semantico", "La condicion de un if solo puede ser booleana.", this.linea, this.columna)
            }
        }catch(error){
            lerrores.push(error);
        }
    }
}