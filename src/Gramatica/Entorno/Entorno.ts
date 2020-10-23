export class Entorno{
    constructor(private anterior : Entorno | null, private nombre : string){}

    public verificar_entorno_global(){
        let entorno : Entorno | null = this;
        while(entorno != null){
            if(entorno.nombre == "global"){
                return true;
            }else if(entorno.nombre == "funcion"){
                return false;
            }
            entorno = entorno.anterior;
        }
    }
}