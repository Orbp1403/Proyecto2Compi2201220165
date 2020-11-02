import { Component, OnInit } from '@angular/core';
import { lerrores } from 'src/Gramatica/Errores/Error';
import * as go from 'gojs';
import { Nodo } from 'src/Gramatica/Arbol/Nodo';
import { Generador } from 'src/Gramatica/Generador/Generador';
import { Expresion } from 'src/Gramatica/Expresiones/Expresion';
import { Entorno } from 'src/Gramatica/Entorno/Entorno';
import { Declaracion } from 'src/Gramatica/Instrucciones/Declaracion';
import { Type } from 'src/Gramatica/Retorno';
import { Variable } from 'src/Gramatica/Expresiones/Variable';
import { Imprimir } from 'src/Gramatica/Instrucciones/Imprimir';
import { Asignacion } from 'src/Gramatica/Instrucciones/Asignacion';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-cuerpo',
  templateUrl: './cuerpo.component.html',
  styleUrls: ['./cuerpo.component.css']
})
export class CuerpoComponent implements OnInit {

  OptionsCode: any = {
    theme: 'lucario',
    mode: 'application/typescript',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: [
      'CodeMirror-linenumbers',
      'CodeMirror-foldgutter',
      'CodeMirror-lint-markers',
    ],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
    autofocus: true,
  };

  code;
  terminal;
  codigo3d;
  hayarbol : boolean = false;
  hayerrores : boolean = false;
  mostrararbol : boolean = false;
  errores : any;
  raiz : Nodo;
  public diagrama : go.Diagram = null;
  arbol : any = null;
  relaciones : any = null;
  clave : number;

  OptionsTerminal : any = {
    theme : 'lucario',
    mode : 'text',
    lineNumbers : false,
    lineWrapping : true,
    editable : false,
    readOnly : true
  }

  Options3D : any = {
    theme : 'lucario',
    mode : 'text',
    linenumbers : true,
    editable : false,
    readOnly : true
  }

  constructor() { }

  ngOnInit(): void {
    document.getElementById('contenedor').style.display = 'none';
    document.getElementById('salida3d').style.display = 'none';
  }

  async ejecutar(){
    this.terminal = "";
    this.codigo3d = "";
    document.getElementById('contenedor').style.display = 'none';
    document.getElementById('salida3d').style.display = 'none';
    this.hayarbol = false;
    this.hayerrores = false;
    lerrores.splice(0, lerrores.length - 1);
    const parser = require('src/Gramatica/Gramatica/Gramatica');
    const ast = parser.parse(this.code);
    const generador = Generador.getInstance();
    let entorno : Entorno = new Entorno(null, "global");
    generador.iniciarGenerador();
    if(lerrores.length != 0){
      this.hayerrores = true;
      let contador = 1;
      for(let i = 0;  i < lerrores.length; i++){
        lerrores[i].setNumero(i);
        contador++;
      }
      this.errores = lerrores
    }
    if(this.hayerrores){
      console.log(this.errores);
      this.hayerrores = true;
      this.terminal = "Existen " + this.errores.length + " errores en el codigo."
    }else{
      this.hayarbol = true;
      if(this.diagrama != null){
        this.diagrama.div = null;
      }
      this.raiz = ast.nodo;
      this.sacarvariables(ast.instruccion, entorno);
      this.ejecutar_expresiones(ast.instruccion, entorno);
      if(lerrores.length != 0){
          this.hayarbol = false;
          this.hayerrores = true;
          let contador = 1;
          for(let i = 0; i < lerrores.length; i++){
            lerrores[i].setNumero(contador);
            contador++;
          }
          //this.errores = lerrores;
      }else{
        for(let i = 0; i < ast.instruccion.length; i++){
          try{
            let instruccion = ast.instruccion[i];
            if(instruccion instanceof Imprimir){
              instruccion.generar(entorno);
            }else if(instruccion instanceof Asignacion){
              instruccion.generar(entorno);
            }
          }catch(error){
            lerrores.push(error);
          }
        }
        document.getElementById('salida3d').style.display = 'block';
        generador.juntarcodigo();
        let codigog = generador.getCode();
        this.codigo3d = codigog.join('\n');
        this.terminal = "Codigo ejecutado correctamente.";
      }
    }
  }

  async sacarvariables(instrucciones : any, entorno : Entorno){
    for(let i = 0; i < instrucciones.length; i++){
      let instruccion = instrucciones[i];
      if(instruccion instanceof Declaracion){
        try{
          instruccion.generar(entorno);
        }catch(error){
          lerrores.push(error);
        }
      }
    }
  }

  async ejecutar_expresiones(instrucciones : any, entorno : Entorno){
    for(let i = 0; i < instrucciones.length; i++){
      let instruccion = instrucciones[i];
      console.log("instruccion", instruccion);
      if(instruccion instanceof Expresion){
        try{
          let auxval = instruccion.generar(entorno);
          console.log(auxval);
        }catch(error){
          lerrores.push(error);
        }
      }else if(instruccion instanceof Variable){
        try{
          instruccion.generar(entorno);
        }catch(error){
          lerrores.push(error);
        }
      }
    }
  }

  async dibujar(){
    document.getElementById('contenedor').style.display = 'block';
    this.volverarbol(this.raiz);
    this.diagrama = $(go.Diagram, "arboldiv",
                    {
                      layout : $(go.TreeLayout,
                        {angle : 90})
                    });
    this.diagrama.nodeTemplate = 
    $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "name"))
    );
    this.diagrama.model = new go.GraphLinksModel(
      this.arbol,
      this.relaciones);
  }

  async volverarbol(raiz : Nodo){
    this.arbol = new Array();
    this.relaciones = new Array();
    this.clave = 1;
    this.graficarnodos(raiz);
    this.clave = 1;
    this.relacionarnodos(raiz, this.clave);
  }

  async graficarnodos(raiz : Nodo){
    if(raiz != null)
    {
      //let retorno = new ValoresRetorno(clave.toString(), raiz.getValor());
      this.arbol.push({key : "\"" + this.clave + "\"", name : raiz.getValor(), color : "lightblue"});
      if(raiz.getHijos() == null)
      {
        return;
      }
      for(var i = 0; i < raiz.getHijos().length; i++)
      {
        let hijo : Nodo = raiz.getHijos()[i];
        this.clave += 1
        this.graficarnodos(hijo);
      }
      return;
    }
  }

  async relacionarnodos(raiz : Nodo, clavepadre : number)
  {
    if(raiz != null)
    {
      if(raiz.getHijos() == null)
      {
        return;
      }
      for(var i = 0; i < raiz.getHijos().length; i++)
      {
        let hijo : Nodo = raiz.getHijos()[i];
        this.clave += 1;
        this.relaciones.push({from : "\"" + clavepadre + "\"", to: "\"" + this.clave + "\""})
        this.relacionarnodos(hijo, this.clave);
      }
    }
  }
}
