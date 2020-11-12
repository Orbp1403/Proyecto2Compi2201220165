import { Entorno } from '../Entorno/Entorno';
import { lerrores } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Caso } from './Caso';
import { CasoDefault } from './CasoDefault';
import { Instruccion } from './Instruccion';

export class Sentenciaswitch extends Instruccion{
    constructor(private condicion : Expresion, private cuerpo : Instruccion[] | null, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        const generador = Generador.getInstance();
        if(this.cuerpo != null){
            try{
                const global = entorno.verificar_entorno_global();
                let nuevoentorno = new Entorno(entorno, "switch");
                generador.addcomentarioiniciosent("inicio switch", global);
                let etiquetasalida = generador.generarEtiqueta();
                nuevoentorno.break = etiquetasalida;
                let cuerpo = this.ordenar(this.cuerpo);
                let condicion = this.condicion.generar(nuevoentorno);
                console.log(condicion);
                console.log(cuerpo);
                for(let i = 0; i < cuerpo.length; i++){
                    let instruccion = cuerpo[i];
                    if(instruccion instanceof Caso){
                        instruccion.Generaretiquetas();
                    }
                }
                for(let i = 0; i < cuerpo.length - 1; i++){
                    let casoactual = cuerpo[i];
                    let casosiguiente = cuerpo[i+1];
                    if(casosiguiente instanceof Caso && casoactual instanceof Caso){
                        casoactual.setSiguienteetiqueta(casosiguiente.etiquetav);
                    }
                }
                for(let i = 0; i < cuerpo.length; i++){
                    let instruccion = cuerpo[i];
                    if(instruccion instanceof Caso){
                        instruccion.setValor(condicion.valor, condicion.tipo, i)
                    }                    
                    instruccion.generar(nuevoentorno);
                }
                generador.agregaretiqueta(etiquetasalida, global);
                generador.addcomentarioiniciosent("fin switch", global)
            }catch(error){
                lerrores.push(error);
            }
        }
    }

    private ordenar(instrucciones : Instruccion[]){
        for(let i = 0; i < instrucciones.length; i++){
            if(i < instrucciones.length - 1){
                if(instrucciones[i] instanceof CasoDefault){
                    let casodef = instrucciones[i];
                    let caso = instrucciones[instrucciones.length - 1];
                    instrucciones[i] = caso;
                    instrucciones[instrucciones.length - 1] = casodef;
                    break;
                }
            }
        }
        return instrucciones;
    }
}