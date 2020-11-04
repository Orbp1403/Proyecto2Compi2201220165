import { Entorno } from '../Entorno/Entorno';
import { lerrores, _Error } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Instruccion } from './Instruccion';

export class Sentenciawhile extends Instruccion{
    constructor(private condicion : Expresion, private cuerpo : Instruccion | null, linea, columna){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        try{
            const generador = Generador.getInstance();
            generador.addcomentarioiniciosent("inicio while", entorno.verificar_entorno_global());
            let etiquetawhile = generador.generarEtiqueta();
            generador.agregaretiqueta(etiquetawhile, entorno.verificar_entorno_global());
            let condicion = this.condicion.generar(entorno);
            let nuevoentorno = new Entorno(entorno, "while");
            if(condicion != null && condicion.tipo == Type.BOOLEANO){
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
                generador.agregargoto(etiquetawhile, entorno.verificar_entorno_global());
                generador.agregaretiqueta(this.condicion.etiquetafalso, entorno.verificar_entorno_global());
            }else{
                throw new _Error("Semantico", "La condicion de un while solo puede ser booleana.", this.linea, this.columna);
            }
        }catch(error){
            lerrores.push(error);
        }
    }
}