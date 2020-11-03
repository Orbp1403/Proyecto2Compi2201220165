import { sign } from 'crypto';
import { Entorno } from '../Entorno/Entorno';
import { lerrores, _Error } from '../Errores/Error';
import { OpcionesAritmeticas } from '../Expresiones/Aritmeticas';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Instruccion } from './Instruccion';

export class Incremento extends Instruccion{
    constructor(private variable : string, private valor : Expresion, private tipo : OpcionesAritmeticas, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        try{
            if(entorno.Existevariable(this.variable)){
                let valor = this.valor.generar(entorno);
                let variable = entorno.getVariable(this.variable);
                if(variable.tipo == Type.NUMERO){
                    if(valor.tipo == Type.NUMERO){
                        const generador = Generador.getInstance();
                        let temp = generador.generarTemporal();
                        let signo : string;
                        if(this.tipo == OpcionesAritmeticas.DIVISION){
                            signo = "/";
                        }else if(this.tipo == OpcionesAritmeticas.MAS){
                            signo = "+"
                        }else if(this.tipo == OpcionesAritmeticas.MENOS){
                            signo = "-"
                        }else if(this.tipo == OpcionesAritmeticas.MODULO){
                            signo = "%"
                        }else{
                            signo = "*"
                        }
                        generador.addcomentarioiniciosent("Inicio aumento", entorno.verificar_entorno_global());
                        if(entorno.verificar_entorno_global()){
                            generador.agregarInstruccionamain(temp + "=stack[(int) " + variable.posicion + "];");
                            generador.agregarInstruccionamain(temp + "=" + temp + signo + valor.valor + ";");
                            generador.addSetStack(variable.posicion, temp, true);
                        }else{
                            generador.agregarinstruccionfuncion(temp + "=stack[(int) " + variable.posicion + "];")
                            generador.agregarinstruccionfuncion(temp + "=" + temp + signo + valor.valor + ";");
                            generador.addSetStack(variable.posicion, temp, false);
                        }
                        generador.addcomentarioiniciosent("Fin aumento", entorno.verificar_entorno_global());
                    }else{
                        throw new  _Error("Semantico", "El valor de aumento no es numerico.", this.linea, this.columna);
                    }
                }else{
                    throw new _Error("Semantico", "La variable a la que se le quiere hacer un aumento no es numerica.", this.linea, this.columna);
                }
            }else{
                throw new _Error("Semantico", "La variable " + this.variable + ", no existe declarada.", this.linea, this.columna);
            }
        }catch(error){
            lerrores.push(error);
        }
    }
}