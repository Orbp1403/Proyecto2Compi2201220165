import { Entorno } from '../Entorno/Entorno';
import { Simbolo } from '../Entorno/Simbolo';
import { lerrores, _Error } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Instruccion } from './Instruccion';

export class Sentenciafor extends Instruccion{
    constructor(private declaracion : boolean, private variablecontrol : string, private valor_inicio : Expresion, private condicion : Expresion, private aumento : Instruccion, private cuerpo : Instruccion, linea : number, columna : number){
        super(linea, columna);
    }

    public generar(entorno: Entorno) {
        try{
            const generador = Generador.getInstance();
            const nuevoentorno = new Entorno(entorno, "for");
            let global = entorno.verificar_entorno_global();
            generador.addcomentarioiniciosent("Inicio for", global);
            let variable : Simbolo;
            const valor_inicio = this.valor_inicio.generar(nuevoentorno);
            if(!this.declaracion){
                variable = nuevoentorno.getVariable(this.variablecontrol);
            }else{
                nuevoentorno.agregarvariable(this.variablecontrol, this.linea, this.columna, valor_inicio.tipo, false, false);
                variable = nuevoentorno.getVariable(this.variablecontrol);
            }
            generador.addSetStack(variable.posicion, valor_inicio.valor, global);
            let etiquetafor = generador.generarEtiqueta();
            generador.agregaretiqueta(etiquetafor, global);
            let condicion = this.condicion.generar(nuevoentorno);
            for(let i = 0; i < condicion.instrucciones.length; i++){
                if(global){
                    generador.agregarInstruccionamain(condicion.instrucciones[i]);
                }else{
                    generador.agregarinstruccionfuncion(condicion.instrucciones[i]);
                }
            }
            generador.agregaretiqueta(this.condicion.etiquetaverdadero, global);
            if(this.cuerpo != null){
                this.cuerpo.generar(nuevoentorno);
            }
            this.aumento.generar(nuevoentorno);
            generador.agregargoto(etiquetafor, global);
            generador.agregaretiqueta(this.condicion.etiquetafalso, global);
            generador.addcomentarioiniciosent("Fin for", global);
        }catch(error){
            lerrores.push(error);
        }
    }
}