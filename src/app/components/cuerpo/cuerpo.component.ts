import { Component, OnInit } from '@angular/core';
import { lerrores } from 'src/Gramatica/Errores/Error';
import * as go from 'gojs';
import { Nodo } from 'src/Gramatica/Arbol/Nodo';

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

  constructor() { }

  ngOnInit(): void {
    document.getElementById('contenedor').style.display = 'none';
  }

  async ejecutar(){
    document.getElementById('contenedor').style.display = 'none';
    this.hayarbol = false;
    this.hayerrores = false;
    lerrores.splice(0, lerrores.length - 1);
    const parser = require('src/Gramatica/Gramatica/Gramatica');
    const ast = parser.parse(this.code);
    this.errores = lerrores;
    if(this.errores.length > 0){
      this.hayerrores = true;
    }else{
      this.hayarbol = true;
      if(this.diagrama != null){
        this.diagrama.div = null;
      }
      this.raiz = ast.nodo;
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
