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
                    if(valor.tipo == Type.NUMERO){
                        if(entorno.verificar_entorno_global()){
                            generador.agregarInstruccionamain("printf(\"%d\", (int) " + valor.valor + ");");
                        }else{
                            generador.agregarinstruccionfuncion("printf(\"%d\", (int) " + valor.valor + ");")
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