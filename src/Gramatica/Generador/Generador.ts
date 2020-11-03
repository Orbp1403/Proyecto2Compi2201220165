import { FunctionCall } from '@angular/compiler';
import { globalAgent } from 'http';
import { Nativa } from './Nativas';

export class Generador{
    private static instance : Generador;
    private code : Array<string> = new Array();
    private main_code : Array<string> = new Array();
    private function_code : Array<string> = new Array();
    private temporal = 0;
    private etiqueta = 0;

    private constructor(){
        
    }

    public static getInstance(){
        if(!Generador.instance){
            Generador.instance = new Generador();
        }
        return Generador.instance;
    }

    public iniciarGenerador(){
        this.code.splice(0, this.code.length);
        this.main_code.splice(0, this.main_code.length);
        this.function_code.slice(0, this.function_code.length);
        this.code.push("#include <stdio.h>")
        this.code.push("float heap[16384]; //estructura para el heap");
        this.code.push("float stack[16384]; //estructura para el stack");
        this.code.push("float p; //puntero p");
        this.code.push("float h;//puntero h");
        this.main_code.push("void main(){");
        this.temporal = 0;
        this.etiqueta = 0;
        this.generarTemporal(); //t0
        this.generarTemporal(); //T1 T0 y T1 sirven para guardar las cadenas
        this.generarTemporal(); //T2 guarda el resultado
        this.generarTemporal(); //T3 para auxiliar en la suma de numeros y cadenas
        
    }

    public generarTemporal(){
        return 'T' + this.temporal++;
    }

    public generarEtiqueta(){
        return "L" + this.etiqueta++;
    }

    public agregarInstruccion(instruccion : string){
        this.code.push(instruccion);
    }

    public agregarInstruccionamain(instruccion : string){
        this.main_code.push(instruccion);
    }

    public agregarinstruccionfuncion(instruccion : string){
        this.function_code.push(instruccion);
    }

    public addSetStack(posicion : number, value : any, global : boolean){
        if(global){
            this.agregarInstruccionamain("stack[(int)" + posicion + "] = " + value + ";");
        }else{
            this.agregarinstruccionfuncion("stack[(int)"+posicion+"] = " + value + ";");
        }
    }

    public addcomentarioiniciosent(comentario : string, global : boolean){
        if(global){
            this.agregarInstruccionamain("/***** " + comentario + " *****/");
        }else{
            this.agregarinstruccionfuncion("/***** " + comentario + " *****/");
        }
    }

    public agregaretiqueta(etiqueta : string, global : boolean){
        if(global){
            this.agregarInstruccionamain(etiqueta + ":");
        }else{
            this.agregarinstruccionfuncion(etiqueta + ":");
        }
    }

    public agregargoto(etiqueta : string, global : boolean){
        if(global){
            this.agregarInstruccionamain("goto " + etiqueta + ";");
        }else{
            this.agregarinstruccionfuncion("goto " + etiqueta + ";");
        }
    }

    public addSetHeap(posicion : any, value : any, global : boolean){
        if(global){
            this.agregarInstruccionamain(`heap[(int)${posicion}] = ${value};`)
        }else{
            this.agregarinstruccionfuncion(`heap[(int)${posicion}] = ${value};`);
        }
    }

    public siguienteHeap(global : boolean){
        if(global){
            this.agregarInstruccionamain("h = h+1;")
        }else{
            this.agregarinstruccionfuncion("h = h+1;");
        }
    }

    public juntarcodigo(){
        this.code.push("// delaracion de los temporales")
        let tempconcat = this.generarTemporal();
        let tempconcatn = this.generarTemporal();
        if(this.temporal != 0){
            let cadena : string = "float ";
            for(let i = 0; i < this.temporal; i++){
                cadena += 'T' + i;
                if(i != this.temporal - 1){
                    cadena += ', ';
                }else{
                    cadena += ';'
                }
            }
            this.code.push(cadena);
        }
        this.code.push("//funciones nativas");
        let func_nat = new Nativa();
        let nativa_concat_string = func_nat.SumaCadenas(this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), tempconcat);
        for(let i = 0; i < nativa_concat_string.length; i++){
            this.code.push(nativa_concat_string[i]);
        }
        this.code.push("")
        let etiquetas : Array<string> = new Array();
        for(let i = 0; i <= 12 ; i++){
            etiquetas.push(this.generarEtiqueta());
        }
        nativa_concat_string = func_nat.SumaCadenaNumero(this.generarEtiqueta(), etiquetas, this.generarEtiqueta(), tempconcat);
        for(let i = 0; i < nativa_concat_string.length; i++){
            this.code.push(nativa_concat_string[i]);
        } 
        nativa_concat_string = func_nat.SumaCadenaBool(this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), tempconcat, this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta());
        for(let i = 0; i < nativa_concat_string.length; i++){
            this.code.push(nativa_concat_string[i])
        }
        nativa_concat_string = func_nat.Metodo_potencia(this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta())
        for(let i = 0; i < nativa_concat_string.length; i++){
            this.code.push(nativa_concat_string[i]);
        }
        nativa_concat_string = func_nat.Metodo_comparar_string(this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta());
        for(let i = 0; i < nativa_concat_string.length; i++){
            this.code.push(nativa_concat_string[i]);
        }
        nativa_concat_string = func_nat.Metodo_imprimir_string(this.generarEtiqueta(), this.generarEtiqueta(), this.generarEtiqueta());
        for(let i = 0; i < nativa_concat_string.length; i++){
            this.code.push(nativa_concat_string[i]);
        }
        this.code.push("//declaracion de las funciones")
        for(let i = 0; i < this.function_code.length; i++){
            let instruccion = this.function_code[i];
            this.code.push(instruccion);
        }
        this.code.push("//fin declaracion funciones");
        this.code.push("//declaracion del metodo main");
        for(let i = 0; i < this.main_code.length; i++){
            if(i == 0){
                let instruccion = this.main_code[i];
                this.code.push(instruccion);
                continue;
            }else{
                let instruccion = '\t' + this.main_code[i];
                this.code.push(instruccion);
            }
        }
        this.code.push('\treturn;')
        this.code.push('}');
    }

    public getCode(){
        return this.code;
    }
}