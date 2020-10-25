import { Entorno } from '../Entorno/Entorno';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Expresion } from './Expresion';

export class Literal extends Expresion{
    constructor(private valor : any, private tipo : Type, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno : Entorno) {
        if(this.tipo == Type.NUMERO){
            return {
                valor : this.valor,
                tipo : Type.NUMERO
            };
        }else if(this.tipo == Type.BOOLEANO){
            const generador = Generador.getInstance();
            this.etiquetaverdadero = this.etiquetaverdadero == '' ? generador.generarEtiqueta() : this.etiquetaverdadero;
            this.etiquetafalso = this.etiquetafalso == '' ? generador.generarEtiqueta() : this.etiquetafalso;
            let instrucciones : Array<string> = new Array();
            let valor;
            if(this.valor.toString() == "true"){
                instrucciones.push("goto " + this.etiquetaverdadero);
                valor = 1;
            }else{
                instrucciones.push("goto " + this.etiquetafalso);
                valor = 0
            }
            return {
                instrucciones : instrucciones,
                tipo : Type.BOOLEANO,
                valor : valor
            }
        }
        else{
            return null;
        }
    }
}