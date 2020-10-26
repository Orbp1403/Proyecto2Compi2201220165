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
        metodo_nativo.push("\treturn ;");
        metodo_nativo.push("}");
        return metodo_nativo;
    }
}