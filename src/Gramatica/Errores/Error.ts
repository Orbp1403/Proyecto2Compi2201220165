export class _Error{
    constructor(private tipo : string, private mensaje : string, linea : number, columna : number){}
    private numero : number;

    public setNumero(numero : number){
        this.numero = numero;
    }
}

export let lerrores : Array<_Error> = new Array();