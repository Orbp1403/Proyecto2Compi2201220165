import { Entorno } from '../Entorno/Entorno';
import { lerrores, _Error } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Literal } from '../Expresiones/Literal';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Instruccion } from './Instruccion';

export class Declaracion extends Instruccion{
    constructor(private nombre : string, private tipo : Type, private valor : Expresion | null, private tipo_d : number,  linea : number, columna : number){
        super(linea, columna);
        //si tipo_d = 0 --> es variable, si es 1  es constante
    }
    
    public generar(entorno: Entorno) {
        try{
            let auxvalor = null;
            const generador = Generador.getInstance();
            if(this.valor != null){
                auxvalor = this.valor.generar(entorno);
                if(auxvalor.tipo != this.tipo){
                    throw new _Error("Semantico", "El tipo declarado no es el mismo del valor", this.linea, this.columna);
                }
            }else{
                if(this.tipo == Type.NUMERO){
                    auxvalor = {
                        tipo : Type.NUMERO,
                        valor : 0
                    }
                }else if(this.tipo == Type.BOOLEANO){
                    this.valor = new Literal(false, this.tipo, this.linea, this.columna);
                    auxvalor = this.valor.generar(entorno);
                }else if(this.tipo == Type.CADENA){
                    let isglobal = false;
                    let temp = generador.generarTemporal();
                    if(entorno.verificar_entorno_global()){
                        generador.agregarInstruccionamain(temp + "=h;");
                        isglobal = true;
                    }else{
                        generador.agregarinstruccionfuncion(temp + "=h");
                    }
                    generador.addSetHeap("h", "-1", isglobal);
                    generador.siguienteHeap(isglobal);
                    auxvalor = {
                        tipo : Type.CADENA,
                        valor : temp
                    }
                }
            }
            let isheap : boolean;
            if(this.tipo == Type.CADENA){
                isheap = true;
            }else{
                isheap = false;
            }
            let isconst : boolean;
            if(this.tipo_d == 0){
                isconst = false;
            }else{
                isconst = true;
            }
            let nuevavar = entorno.agregarvariable(this.nombre, this.linea, this.columna, this.tipo, isconst, isheap)
            
            if(this.tipo != Type.BOOLEANO){
                generador.addSetStack(nuevavar.posicion, auxvalor.valor, nuevavar.global);
            }else{
                if(entorno.verificar_entorno_global()){
                    for(let i = 0; i< auxvalor.instrucciones.length; i++){
                        generador.agregarInstruccionamain(auxvalor.instrucciones[i]);
                    }
                    generador.agregarInstruccionamain(this.valor.etiquetaverdadero + ":");
                    generador.addSetStack(nuevavar.posicion, "1", nuevavar.global);
                    let esalida = generador.generarEtiqueta()
                    generador.agregarInstruccionamain("goto " + esalida + ";");
                    generador.agregarInstruccionamain(this.valor.etiquetafalso + ":");
                    generador.addSetStack(nuevavar.posicion, "0", nuevavar.global);
                    generador.agregarInstruccionamain(esalida + ":");
                }
            }
        }catch(error){
            lerrores.push(error);
        }
    }
}