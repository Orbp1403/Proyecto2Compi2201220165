import { Entorno } from '../Entorno/Entorno';
import { lerrores, _Error } from '../Errores/Error';
import { Expresion } from '../Expresiones/Expresion';
import { Generador } from '../Generador/Generador';
import { Type } from '../Retorno';
import { Instruccion } from './Instruccion';

export class Caso extends Instruccion{
    private valor_condicion : any;
    private tipo_condicion : Type;
    private indice : number;
    public etiquetav : any;
    private etiquetaf : any;    
    private etiquetav_sig : any | null;

    constructor(private valor_caso : Expresion, private cuerpo : Instruccion[] | null, linea : number, columna : number){
        super(linea, columna);
    }

    public setValor(valor_condicion : any, tipo_condicion : Type, indice : number){
        this.valor_condicion = valor_condicion
        this.tipo_condicion = tipo_condicion
        this.indice = indice;
    }

    public Generaretiquetas(){
        const generador = Generador.getInstance();
        this.etiquetav = generador.generarEtiqueta();
        this.etiquetaf = generador.generarEtiqueta();
    }

    public setSiguienteetiqueta(etiquetav_sig : any){
        this.etiquetav_sig = etiquetav_sig
    }

    public generar(entorno: Entorno) {
        const generador = Generador.getInstance();
        const global = entorno.verificar_entorno_global();
        try{
            let valor_caso = this.valor_caso.generar(entorno);
            if(valor_caso != null && this.tipo_condicion == valor_caso.tipo){
                generador.addcomentarioiniciosent("inicio caso", global);
                if(this.tipo_condicion != Type.CADENA){
                    let etiquetav = this.etiquetav
                    let etiquetaf = this.etiquetaf;
                    if(global){
                        generador.agregarInstruccionamain("if(" + valor_caso.valor + "==" + this.valor_condicion + ") goto " + etiquetav + ";")
                        generador.agregargoto(etiquetaf, global);
                    }else{
                        generador.agregarinstruccionfuncion("if(" + valor_caso.valor + "==" + this.valor_condicion + ") goto " + etiquetav + ";");
                        generador.agregargoto(etiquetaf, global); 
                    }
                    generador.agregaretiqueta(etiquetav, global);
                    for(let i = 0; i < this.cuerpo.length; i++){
                        this.cuerpo[i].generar(entorno);
                    }
                    if(this.etiquetav_sig != null){
                        generador.agregargoto(this.etiquetav_sig, global);
                    }
                    generador.agregaretiqueta(etiquetaf, global);
                }else{
                    let etiquetav = this.etiquetav
                    let eitquetaf = this.etiquetaf
                    if(this.indice != 0){
                        generador.agregargoto(etiquetav, global);
                    }
                    if(global){
                        generador.agregarInstruccionamain("T0=" + this.valor_condicion + ";");
                        generador.agregarInstruccionamain("T1=" + valor_caso.valor + ";")
                        generador.agregarInstruccionamain("nativa_cmp_strings();");
                        generador.agregarInstruccionamain("if(T2==1) goto " + etiquetav + ";")
                        generador.agregargoto(eitquetaf, global);
                    }else{
                        generador.agregarinstruccionfuncion("T0=" + this.valor_condicion + ";")
                        generador.agregarinstruccionfuncion("T1=" + valor_caso.valor + ";")
                        generador.agregarinstruccionfuncion("nativa_cmp_strings();")
                        generador.agregarinstruccionfuncion("if(T2==1) goto " + etiquetav + ";");
                        generador.agregargoto(eitquetaf, global);
                    }
                    generador.agregaretiqueta(etiquetav, global);
                    for(let i = 0; i < this.cuerpo.length; i++){
                        this.cuerpo[i].generar(entorno);
                    }
                    if(this.etiquetav_sig != null){
                        generador.agregargoto(this.etiquetav_sig, global);
                    }
                    generador.agregaretiqueta(eitquetaf, global);
                }
                generador.addcomentarioiniciosent("fin caso", global);
            }else if(valor_caso != null && this.tipo_condicion != valor_caso.tipo){
                throw new _Error("Semantico", "El tipo de dato no coincide.", this.linea, this.columna);
            }
        }catch(error){
            lerrores.push(error);
        }
    }

}