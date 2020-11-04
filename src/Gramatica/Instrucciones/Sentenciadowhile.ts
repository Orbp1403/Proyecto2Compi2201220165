import { Entorno } from '../Entorno/Entorno';
import { lerrores } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Instruccion } from './Instruccion';

export class Sentenciadowhile extends Instruccion{
    constructor(private condicion : Expresion, private cuerpo : Instruccion, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        try{
            const generador = Generador.getInstance();
            let nuevoentorno = new Entorno(entorno, "do_while");
            let global = entorno.verificar_entorno_global();
            generador.addcomentarioiniciosent("Inicio do while", global);
            let etiquetawhile = generador.generarEtiqueta();
            generador.agregaretiqueta(etiquetawhile, global);
            let condicion = this.condicion.generar(nuevoentorno);
            if(condicion != null && condicion.tipo == Type.BOOLEANO){
                nuevoentorno.break = this.condicion.etiquetafalso;
                nuevoentorno.continue = etiquetawhile;
            }
            if(this.cuerpo != null){
                this.cuerpo.generar(nuevoentorno);
            }
            if(condicion != null && condicion.tipo == Type.BOOLEANO){
                for(let i = 0; i < condicion.instrucciones.length; i++){
                    if(global){
                        generador.agregarInstruccionamain(condicion.instrucciones[i]);
                    }else{
                        generador.agregarinstruccionfuncion(condicion.instrucciones[i]);
                    }
                }
                generador.agregaretiqueta(this.condicion.etiquetaverdadero, global);
                generador.agregargoto(etiquetawhile, global);
                generador.agregaretiqueta(this.condicion.etiquetafalso, global);
            }
            generador.addcomentarioiniciosent("Fin do while", global);
        }catch(error){
            lerrores.push(error);
        }
    }
}