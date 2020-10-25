import { FunctionCall } from '@angular/compiler';

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
            this.agregarInstruccionamain("stack[" + posicion + "] = " + value + ";");
        }else{
            this.agregarinstruccionfuncion("stack["+posicion+"] = " + value + ";");
        }
    }

    public juntarcodigo(){
        this.code.push("// delaracion de los temporales")
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