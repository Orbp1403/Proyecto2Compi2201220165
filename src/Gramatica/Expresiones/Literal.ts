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
                instrucciones.push("goto " + this.etiquetaverdadero + ";");
                valor = 1;
            }else{
                instrucciones.push("goto " + this.etiquetafalso + ";");
                valor = 0
            }
            return {
                instrucciones : instrucciones,
                tipo : Type.BOOLEANO,
                valor : valor
            }
        }else if(this.tipo == Type.CADENA){
            const generador = Generador.getInstance();
            const temp = generador.generarTemporal();
            let isglobal : boolean = false;
            if(entorno.verificar_entorno_global()){
                generador.agregarInstruccionamain(temp + "=h;");
                isglobal = true;
            }else{
                generador.agregarinstruccionfuncion(temp + "=h;");
            }
            for(let i = 0; i < this.valor.length; i++){
                generador.addSetHeap("h", this.valor.charCodeAt(i), isglobal);
                generador.siguienteHeap(isglobal);
            }
            generador.addSetHeap("h", '-1', isglobal);
            generador.siguienteHeap(isglobal);
            return {
                valor : temp,
                tipo : Type.CADENA
            }
        }
        else{
            return null;
        }
    }
}