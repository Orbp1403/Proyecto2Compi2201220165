import { IfStmt } from '@angular/compiler';
import { Generador } from './Generador';

export class Nativa{
    public SumaCadenas(etiqueta1p : string, etiqueta2p : string, etiqueta3p : string, temprecorridop : string){
        let metodo_nativo : Array<string> = new Array();
        metodo_nativo.push("void nativa_concat(){");
        metodo_nativo.push("\tT2=h;");
        let etiqueta1 = etiqueta1p;//etiqueta para el primer string
        let etiqueta2 = etiqueta2p;
        let temprecorrido = temprecorridop;
        metodo_nativo.push("\t" + etiqueta1 + ":");
        metodo_nativo.push("\t" + temprecorrido + "=heap[(int)T0];");
        metodo_nativo.push("\theap[(int) h]="+temprecorrido + ";");
        metodo_nativo.push("\tT0=T0+1;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\t" + temprecorrido + "=heap[(int)T0];");
        metodo_nativo.push("\tif(" + temprecorrido + "!=-1) goto " + etiqueta1 + ";");
        metodo_nativo.push("\tgoto " + etiqueta2 + ";");
        metodo_nativo.push("\t" + etiqueta2 + ":");
        metodo_nativo.push("\t" + temprecorrido + "=heap[(int)T1];");
        metodo_nativo.push("\theap[(int) h]="+temprecorrido + ";");
        metodo_nativo.push("\tT1=T1+1;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\t" + temprecorrido + "=heap[(int)T1];");
        metodo_nativo.push("\tif(" + temprecorrido + "!= -1) goto " + etiqueta2 + ";");
        let etiqueta3 = etiqueta3p;
        metodo_nativo.push("\tgoto " + etiqueta3 + ";");
        metodo_nativo.push("\t" + etiqueta3 + ":");
        metodo_nativo.push("\theap[(int) h] = -1;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\treturn ;");
        metodo_nativo.push("}");
        return metodo_nativo;
    }

    public SumaCadenaNumero(etiquetastring : string, etiquetas : Array<string>, etiquetasalida : string, temprecorridop : string){
        let metodo_nativo : Array<string> = new Array();
        metodo_nativo.push("void nativa_concat_string_number(){");
        metodo_nativo.push("\tT2=h;")
        metodo_nativo.push("\t" + etiquetastring + ":");
        metodo_nativo.push("\t" + temprecorridop + "=heap[(int)T0];");
        metodo_nativo.push("\theap[(int)h]=" + temprecorridop + ";");
        metodo_nativo.push("\tT0=T0+1;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\t" + temprecorridop + "=heap[(int)T0];");
        metodo_nativo.push("\tif(" + temprecorridop + "!=-1) goto " + etiquetastring + ";");
        metodo_nativo.push("\tgoto " + etiquetas[0] + ";");
        let auxmetodo = this.convertirnumeros("T1", etiquetas, etiquetasalida, temprecorridop);
        for(let i = 0; i < auxmetodo.length; i++){
            metodo_nativo.push(auxmetodo[i]);
        }
        metodo_nativo.push('\t' + etiquetasalida + ":");
        metodo_nativo.push("\theap[(int)h]=-1;");
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("return;")
        metodo_nativo.push("}");
        metodo_nativo.push("");
        metodo_nativo.push("void nativa_concat_number_string(){");
        metodo_nativo.push("\tT2=h;")
        auxmetodo = this.convertirnumeros("T0", etiquetas, etiquetastring, temprecorridop);
        for(let i = 0; i < auxmetodo.length; i++){
            metodo_nativo.push(auxmetodo[i]);
        }
        metodo_nativo.push("\t" + etiquetastring + ":");
        metodo_nativo.push("\t" + temprecorridop + "=heap[(int)T1];");
        metodo_nativo.push("\theap[(int)h]="+temprecorridop + ";");
        metodo_nativo.push("\tT1=T1+1;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\t" + temprecorridop + "=heap[(int)T1];");
        metodo_nativo.push("\tif(" + temprecorridop + "!=-1) goto " + etiquetastring + ";");
        metodo_nativo.push("\tgoto " + etiquetasalida + ";");
        metodo_nativo.push("\t" + etiquetasalida + ":");
        metodo_nativo.push("\theap[(int)h]=-1;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\treturn;")
        metodo_nativo.push("}");
        return metodo_nativo;
    }

    public convertirnumeros(etiquetastring : string, etiquetas : Array<string>, etiquetasalida : string, temprecorridop : string){
        let metodo_nativo : Array<string> = new Array();
        metodo_nativo.push("\t" + etiquetas[0] + ":");
        metodo_nativo.push("\tif(" + etiquetastring + "<0) goto " + etiquetas[1] + ";");
        metodo_nativo.push("\tgoto " + etiquetas[2] + ";")
        metodo_nativo.push("\t" + etiquetas[1] + ":");
        metodo_nativo.push("\theap[(int)h] = 45;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\t" + etiquetastring + "=" + etiquetastring + "*-1;");
        metodo_nativo.push("\tgoto " + etiquetas[2] + ";");
        metodo_nativo.push("\t" + etiquetas[2] + ":");
        metodo_nativo.push("\tif(" + etiquetastring + "<10) goto " + etiquetas[3] + ";");
        metodo_nativo.push("\tgoto " + etiquetas[4] + ";");
        metodo_nativo.push("\t" + etiquetas[3] + ":");
        metodo_nativo.push("\theap[(int)h]=" + etiquetastring + "+48;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\tgoto " + etiquetasalida + ";");
        metodo_nativo.push("\t" + etiquetas[4] + ":");
        metodo_nativo.push("\tif(" + etiquetastring + "<100) goto " + etiquetas[5] + ";")
        metodo_nativo.push("\goto " + etiquetas[6] + ";");
        metodo_nativo.push("\t" + etiquetas[5] + ":");
        metodo_nativo.push("\tT3=(int)" + etiquetastring + "/10;");
        metodo_nativo.push("\t" + temprecorridop + "=T3*10;")
        metodo_nativo.push("\t" + etiquetastring + "=" + etiquetastring + "-" + temprecorridop + ";");
        metodo_nativo.push("\theap[(int)h]=T3+48;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\tgoto " + etiquetas[2] + ";");
        metodo_nativo.push("\t" + etiquetas[6] + ":");
        metodo_nativo.push("\tif(" + etiquetastring + "<1000) goto " + etiquetas[7] + ";");
        metodo_nativo.push("\tgoto " + etiquetas[8] + ";");
        metodo_nativo.push("\t" + etiquetas[7] + ":");
        metodo_nativo.push("\tT3=(int)" + etiquetastring + "/100;");
        metodo_nativo.push("\t" + temprecorridop + "=T3*100;");
        metodo_nativo.push("\t" + etiquetastring + "=" + etiquetastring + "-" + temprecorridop + ";");
        metodo_nativo.push("\theap[(int)h]=T3+48;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\tgoto " + etiquetas[2] + ";");
        metodo_nativo.push("\t" + etiquetas[8] + ":");
        metodo_nativo.push("\tif(" + etiquetastring + "<10000) goto " + etiquetas[9] + ";");
        metodo_nativo.push("\tgoto " + etiquetas[10] + ";");
        metodo_nativo.push("\t" + etiquetas[9] + ":");
        metodo_nativo.push("\tT3=(int)"+etiquetastring + "/1000;");
        metodo_nativo.push("\t" + temprecorridop + "=T3*1000;");
        metodo_nativo.push("\t" + etiquetastring + "=" + etiquetastring + "-" + temprecorridop + ";");
        metodo_nativo.push('\theap[(int)h]=T3+48;');
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\tgoto " + etiquetas[2] + ";");
        metodo_nativo.push("\t" + etiquetas[10] + ":");
        metodo_nativo.push("\tif(" + etiquetastring + "<100000) goto " + etiquetas[11] + ";");
        metodo_nativo.push("\tgoto " + etiquetas[12] + ";");
        metodo_nativo.push("\t" + etiquetas[11] + ":");
        metodo_nativo.push("\tT3=(int)" + etiquetastring + "/10000;");
        metodo_nativo.push("\t" + temprecorridop + "=T3*10000;")
        metodo_nativo.push("\t" + etiquetastring + "=" + etiquetastring + "-" + temprecorridop + ";");
        metodo_nativo.push("\theap[(int)h]=T3+48;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\tgoto " + etiquetas[2] + ";");
        metodo_nativo.push("\t" + etiquetas[12] + ":");
        
        return metodo_nativo;
    }

    public SumaCadenaBool(etiquetastring : string, etiquetastring1 : string, etiqueta1bool : string, etiqueta2bool : string, temprecorridop : string, etiquetabool, etiquetafalsa : string, etiquetaverdadera : string, etiquetasalida : string, etiquetafalsa1 : string, etiquetaverdadera1 : string){
        let metodo_nativo : Array<string> = new Array();
        metodo_nativo.push("void nativa_concat_string_bool(){");
        metodo_nativo.push("\tT2=h;");
        metodo_nativo.push("\tif(T3==0) goto " + etiqueta1bool + ";");
        metodo_nativo.push("\tgoto " + etiqueta2bool + ";");
        //si el primero es cadena
        metodo_nativo.push("\t" + etiqueta1bool + ":");
        metodo_nativo.push("\t" + temprecorridop + "=heap[(int)T0];");
        metodo_nativo.push("\t" + etiquetastring + ":");
        metodo_nativo.push("\theap[(int)h]="+temprecorridop + ";");
        metodo_nativo.push("\tT0=T0+1;")
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\t" + temprecorridop + "=heap[(int)T0];");
        metodo_nativo.push("\tif(" + temprecorridop + "!=-1) goto " + etiquetastring + ";");
        metodo_nativo.push("\tgoto " + etiquetabool + ";");
        metodo_nativo.push("\t" + etiquetabool + ":");
        metodo_nativo.push("\tif(T1==0) goto " + etiquetafalsa + ";");
        metodo_nativo.push("\tgoto " + etiquetaverdadera + ";");
        metodo_nativo.push("\t" + etiquetafalsa + ":");
        metodo_nativo.push("\theap[(int)h]=102;");
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\theap[(int)h]=97;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\theap[(int)h]=108;");
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\theap[(int)h]=115;");
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\theap[(int)h]=101;");
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\tgoto " + etiquetasalida + ";");
        metodo_nativo.push("\t" + etiquetaverdadera + ":");
        metodo_nativo.push("\theap[(int)h]=116;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\theap[(int)h]=114;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\theap[(int)h]=117;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\theap[(int)h]=101;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\tgoto " + etiquetasalida + ";");

        //si el segundo es cadena
        metodo_nativo.push("\t" + etiqueta2bool + ":");
        metodo_nativo.push("\tif(T0==0) goto " + etiquetafalsa1 + ";");
        metodo_nativo.push("\tgoto " + etiquetaverdadera1 + ";")
        metodo_nativo.push("\t" + etiquetafalsa1 + ":");
        metodo_nativo.push("\theap[(int)h]=102;");
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\theap[(int)h]=97;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\theap[(int)h]=108;");
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\theap[(int)h]=115;");
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\theap[(int)h]=101;");
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\tgoto " + etiquetastring1 + ";");
        metodo_nativo.push("\t" + etiquetaverdadera1 + ":");
        metodo_nativo.push("\theap[(int)h]=116;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\theap[(int)h]=114;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\theap[(int)h]=117;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\theap[(int)h]=101;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\tgoto " + etiquetastring1 + ";");
        metodo_nativo.push("\t" + etiquetastring1 + ":");
        metodo_nativo.push("\t" + temprecorridop + "=heap[(int)T1];");
        metodo_nativo.push("\theap[(int)h]="+temprecorridop + ";");
        metodo_nativo.push("\tT1=T1+1;")
        metodo_nativo.push("\th=h+1;")
        metodo_nativo.push("\t" + temprecorridop + "=heap[(int)T1];");
        metodo_nativo.push("\tif(" + temprecorridop + "!=-1) goto " + etiquetastring1 + ";");
        metodo_nativo.push("\tgoto " + etiquetasalida + ";");

        //salida
        metodo_nativo.push("\t" + etiquetasalida + ":");
        metodo_nativo.push("\theap[(int)h]=-1;");
        metodo_nativo.push("\th=h+1;");
        metodo_nativo.push("\treturn;");
        metodo_nativo.push("}");
        return metodo_nativo;
    } 

    public Metodo_potencia(etiqueta1 : string, etiqueta2 : string, etiquetasalida : string, etiqueta3 : string, etiqueta4 : string){
        let metodo_nativo : Array<string> = new Array();
        metodo_nativo.push("void nativa_potencia(){");
        metodo_nativo.push("\tif(T1==0) goto " + etiqueta1 + ";");//si la potencia es exponente 0
        metodo_nativo.push("\tgoto " + etiqueta2 + ";");
        metodo_nativo.push("\t" + etiqueta1 + ":");
        metodo_nativo.push("\tT2=1;");
        metodo_nativo.push("\tgoto " + etiquetasalida + ";");
        metodo_nativo.push("\t" + etiqueta2 + ":");
        metodo_nativo.push("\tT2=T0;");
        metodo_nativo.push("\tT1=T1-1;");
        metodo_nativo.push("\t" + etiqueta3 + ":");
        metodo_nativo.push("\tif(T1==0) goto " + etiquetasalida + ";");
        metodo_nativo.push("\tgoto " + etiqueta4 + ";");
        metodo_nativo.push("\t" + etiqueta4 + ":");
        metodo_nativo.push("\tT2=T2*T0;");
        metodo_nativo.push("\tT1=T1-1;");
        metodo_nativo.push("\tgoto " + etiqueta3 + ";");
        metodo_nativo.push("\t" + etiquetasalida + ":");
        metodo_nativo.push("\treturn;");
        metodo_nativo.push("}");
        return metodo_nativo;
    }
}