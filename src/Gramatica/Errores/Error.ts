export class _Error{
    constructor(private tipo : string, private mensaje : string, linea : number, columna : number){}
}

export let lerrores : Array<_Error> = new Array();