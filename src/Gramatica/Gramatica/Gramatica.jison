%{
    let auxnodo = null
    const { Nodo } = require('../Arbol/Nodo');
    const { Type } = require('../Retorno');
    const { Aritmetica, OpcionesAritmeticas } = require('../Expresiones/Aritmeticas');
    const { Literal } = require('../Expresiones/Literal')
    const { OpcionesLogicas, Logica} = require('../Expresiones/Logicas');
    const { Declaracion } = require('../Instrucciones/Declaracion');
    const { Variable } = require('../Expresiones/Variable');
    const { lerrores, _Error } = require("../Errores/Error");
    const { Imprimir } = require("../Instrucciones/Imprimir");
    const { Asignacion } = require("../Instrucciones/Asignacion");
%}
/* Definición Léxica */
%lex

%options case-sensitive
numero [0-9]+("."[0-9]+)?
cadena (\"[^\"]*\")|("`"[^"`"]*"`")|("'" [^"'"]* "'")

%%

/* Espacios en blanco */
[ \r\t]+                                {}
\n                                      {}
"//".*                                  {}
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     {} 

{numero}                                return 'NUMERO'
{cadena}                                return 'CADENA'

"let"                                   return 'LET'
"const"                                 return 'CONST'
"string"                                return 'STRING'
"number"                                return 'NUMBER'
"boolean"                               return 'BOOLEAN'
"void"                                  return 'VOID'
"type"                                  return 'TYPE'
"null"                                  return 'NULL'
"true"                                  return 'TRUE'
"false"                                 return 'FALSE'
"if"                                    return 'IF'
"else"                                  return 'ELSE'
"switch"                                return 'SWITCH'
"case"                                  return 'CASE'
"while"                                 return 'WHILE'
"do"                                    return 'DO'
"for"                                   return 'FOR'
"in"                                    return 'IN'
"of"                                    return 'OF'
"break"                                 return 'BREAK'
"continue"                              return 'CONTINUE'
"return"                                return 'RETURN'
"function"                              return 'FUNCTION'
"console"                               return 'CONSOLE'
"log"                                   return 'LOG'
"graficar_ts"                           return 'GRAFICAR_TS'
"default"                               return 'DEFAULT'
"Length"                                return 'LENGTH'
"CharAt"                                return 'CHARAT'
"ToLowerCase"                           return 'TOLOWERCASE'
"ToUpperCase"                           return 'TOUPPERCASE'
"Concat"                                return 'CONCAT'

"++"                                    return '++'
"--"                                    return '--'
"+="                                    return '+='
"-="                                    return '-='
"*="                                    return '*='
"/="                                    return '/='
"%="                                    return '%='
'**='                                   return '**='
":"                                     return ':'
";"                                     return ';'
"&&"                                    return '&&'
"||"                                    return '||'
'=='                                    return '=='
'!='                                    return '!='
"!"                                     return '!'
"%"                                     return '%'
"**"                                    return '**'
"<="                                    return '<='
">="                                    return '>='
'<'                                     return '<'
'>'                                     return '>'
"="                                     return '='
"+"                                     return '+'
"-"                                     return '-'
"*"                                     return '*'
"/"                                     return '/'
"."                                     return '.'
"("                                     return '('
")"                                     return ')'
","                                     return ','
"{"                                     return '{'
"}"                                     return '}'
"?"                                     return '?'
"["                                     return '['
"]"                                     return ']'

[_a-zA-Z][_a-zA-Z0-9]* return 'IDENTIFICADOR';
<<EOF>>                                 return 'EOF';

.                       { 
                            console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
                            lerrores.push(new _Error(yylloc.first_line, yylloc.first_column, "Lexico", "El simbolo: " + yytext + " no pertenece al lenguaje"))
                        }
/lex

/* Asociación de operadores y precedencia */
%right '+=' '-=' '*=' '/=' '%=' '**='
%right '?' ':'
%left '||'
%left '&&'
%left '==' '!='
%left '>=' '<=' '<' '>'
%left '-' '+'
%left '%' '/' '*'
%left '**'
%left NEGATIVO
%left '!'
%nonassoc '--'
%nonassoc '++'

%start ini

%% /* Definición de la gramática */

ini
	: Instrucciones EOF
    {
        
        $$ = {
            nodo : new Nodo("INICIO"),
            instruccion : $1.instruccion
        }
        $$.nodo.agregarHijo($1.nodo);
        //$1.nodo.addPadre($$.nodo)
        return $$;
    };

Instrucciones
    : Instrucciones Instruccion
    {
        $1.instruccion.push($2.instruccion);
        $$ = {
            instruccion : $1.instruccion,
            nodo : new Nodo("INST")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($2.nodo);
    }
    | Instruccion
    {
        $$ = {
            instruccion : [$1.instruccion],
            nodo : new Nodo("INST")
        };
        $$.nodo.agregarHijo($1.nodo);
    };

InstruccionesSentencia
    : '{' LInstruccionSentencia '}'
    {
        $$ = $2;
    }
    | '{' '}'
    {
        $$ = {
            nodo : null
        };
    };

LInstruccionSentencia
    : LInstruccionSentencia InstruccionSentencia{
        $1.instruccion.push($2.instruccion);
        $$ = {
            instruccion : $1.instruccion,
            nodo : new Nodo("Inst")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($2.nodo);
    }
    | InstruccionSentencia
    {
        $$ = {
            instruccion : [$1.instruccion],
            nodo : new Nodo("Inst")
        }
        $$.nodo.agregarHijo($1.nodo);
    };

Instruccion
    : Declaracion ';'
    {
        $$ = $1;
    }
    | Declaracion_type ';'
    {
        $$ = $1;
    }
    | Expresion ';'
    {
        $$ = $1;
    }
    | Asignacion
    {
        $$ = $1;
    }
    | Sentencias_control
    {
        $$ = $1;
    }
    | Funcion
    {
        $$ = $1;
    }
    | error ';';

InstruccionSentencia
    : Declaracion ';'
    {
        $$ = $1;
    }
    | Expresion ';'
    {
        $$ = $1;
    }
    | Asignacion
    {
        $$ = $1;
    }
    | Sentencias_control
    {
        $$ = $1
    }
    | error ';';

Sentencias_control
    : Sentencia_if{
        $$ = $1;
    }
    | Sentenciabreak{
        $$ = $1;
    }
    | Sentenciacontinue{
        $$ = $1;
    }
    | Sentenciadowhile{
        $$ = $1;
    }
    | Sentenciafor{
        $$ = $1;
    }
    | SentenciaReturn
    {
        $$ = $1;
    }
    | Sentenciaswitch
    {
        $$ = $1;
    }
    | SentenciaTernaria
    {
        $$ = $1
    }
    | Sentenciawhile
    {
        $$ = $1;
    };

Sentenciacontinue
    : CONTINUE ';'
    {
        $$ = {
            nodo : new Nodo("Continue")
        }
    };

Sentenciabreak
    : BREAK ';'
    {
        $$ = {
            nodo : new Nodo("Break")
        }
    };

SentenciaReturn
    : RETURN ';'
    {
        $$ = {
            nodo : new Nodo("Return")
        }
    }
    | RETURN Expresion ';'
    {
        $$ = {
            nodo : new Nodo("Return")
        }
        $$.nodo.agregarHijo($2.nodo);
    };

SentenciaTernaria
    : Expresion '?' Expresion ':' Expresion ';'
    {
        $$ = {
            nodo : new Nodo("Ternario")
        }
        auxnodo = new Nodo("Condicion");
        auxnodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo(auxnodo);
        $$.nodo.agregarHijo($3.nodo);
        $$.nodo.agregarHijo($5.nodo);
    };

Sentenciafor
    : FOR '(' LET IDENTIFICADOR '=' Expresion ';' Expresion ';' Aumento ')' InstruccionesSentencia
    {
        $$ = {
            nodo : new Nodo("For")
        };
        auxnodo = new Nodo('=');
        auxnodo.agregarHijo(new Nodo($4));
        auxnodo.agregarHijo($6.nodo);
        $$.nodo.agregarHijo(auxnodo);
        auxnodo = new Nodo("Condicion");
        auxnodo.agregarHijo($8.nodo);
        $$.nodo.agregarHijo(auxnodo);
        $$.nodo.agregarHijo($10.nodo);
        if($12.nodo != null){
            $$.nodo.agregarHijo($12.nodo)
        }
    }
    | FOR '(' IDENTIFICADOR '=' Expresion ';' Expresion ';' Aumento ')' InstruccionesSentencia
    {
        $$ = {
            nodo : new Nodo("For")
        }
        auxnodo = new Nodo('=');
        auxnodo.agregarHijo(new Nodo($3))
        auxnodo.agregarHijo($5.nodo);
        $$.nodo.agregarHijo(auxnodo);
        auxnodo = new Nodo("Condicion");
        auxnodo.agregarHijo($7.nodo);
        $$.nodo.agregarHijo(auxnodo);
        $$.nodo.agregarHijo($9.nodo)
        if($11.nodo != null){
            $$.nodo.agregarHijo($11.nodo);
        }
    };

Sentenciadowhile
    : DO InstruccionesSentencia WHILE '(' Expresion ')' ';'
    {
        $$ = {
            nodo : new Nodo("Do_while")
        }
        if($2.nodo != null)
        {
            $$.nodo.agregarHijo($2.nodo);
        }
        auxnodo = new Nodo("Condicion")
        auxnodo.agregarHijo($5.nodo);
        $$.nodo.agregarHijo(auxnodo);
    };

Sentenciawhile
    : WHILE '(' Expresion ')' InstruccionesSentencia
    {
        $$ = {
            nodo : new Nodo("While")
        }
        auxnodo = new Nodo("Condicion")
        auxnodo.agregarHijo($3.nodo);
        $$.nodo.agregarHijo(auxnodo);
        if($5.nodo != null)
        {
            $$.nodo.agregarHijo($5.nodo);
        }
    };

Sentenciaswitch
    : 'SWITCH' '(' Expresion ')' '{' Casos '}'
    {
        $$ = {
            nodo : new Nodo("Switch") 
        }
        auxnodo = new Nodo("Condicion");
        auxnodo.agregarHijo($3.nodo)
        $$.nodo.agregarHijo(auxnodo);
        $$.nodo.agregarHijo($6.nodo);
    }
    | 'SWITCH' '(' Expresion ')' '{' '}'
    {
        $$ = {
            nodo : new Nodo("Switch")
        }
        auxnodo = new Nodo("Condicion");
        auxnodo.agregarHijo($3.nodo)
        $$.nodo.agregarHijo(auxnodo)
    };

Casos
    : Casos 'CASE' Expresion ':' LInstruccionSentencia
    {
        $$ = {
            nodo : new Nodo("Caso")
        };
        $$.nodo.agregarHijo($1.nodo)
        $$.nodo.agregarHijo($3.nodo)
        $$.nodo.agregarHijo($5.nodo)
    }
    | Casos 'CASE' Expresion ':'
    {
        $$ = {
            nodo : new Nodo("Caso")
        }
        $$.nodo.agregarHijo($1.nodo)
        $$.nodo.agregarHijo($3.nodo)
    }
    | Casos 'DEFAULT' ':' LInstruccionSentencia
    {
        $$ = {
            nodo : new Nodo("Caso")
        };
        $$.nodo.agregarHijo($1.nodo)
        $$.nodo.agregarHijo(new Nodo("Default"))
        $$.nodo.agregarHijo($4.nodo)
    }
    | Casos 'DEFAULT' ':'
    {
        $$ = {
            nodo : new Nodo("Caso")
        };
        $$.nodo.agregarHijo($1.nodo)
        $$.nodo.agregarHijo(new Nodo("Default"))
    }
    | 'CASE' Expresion ':' LInstruccionSentencia
    {
        $$ = {
            nodo : new Nodo("Caso")
        }
        $$.nodo.agregarHijo($2.nodo);
        $$.nodo.agregarHijo($4.nodo)
    }
    | 'CASE' Expresion ':'
    {
        $$ = {
            nodo : new Nodo("Caso")
        }
        $$.nodo.agregarHijo($2.nodo)
    }
    | 'DEFAULT' ':' 
    {
        $$ = {
            nodo : new Nodo("Caso") 
        }
        $$.nodo.agregarHijo(new Nodo("Default"));
    }
    | DEFAULT ':' LInstruccionSentencia
    {
        $$ = {
            nodo : new Nodo("Caso")
        }
        $$.nodo.agregarHijo(new Nodo("Default"))
        $$.nodo.agregarHijo($3)
    };

Sentencia_if
    : IF '(' Expresion ')' InstruccionesSentencia
    {
        $$ = {
            nodo : new Nodo("IF")
        };
        auxnodo = new Nodo("Condicion");
        auxnodo.agregarHijo($3.nodo);
        $$.nodo.agregarHijo(auxnodo);
        if($5.nodo != null)
        {
            $$.nodo.agregarHijo($5.nodo)
        };
    }
    | IF '(' Expresion ')' InstruccionesSentencia Sentenciaelse
    {
        $$ = {
            nodo : new Nodo("IF")
        }
        auxnodo = new Nodo("Condicion");
        auxnodo.agregarHijo($3.nodo);
        $$.nodo.agregarHijo(auxnodo);
        if($5.nodo != null)
        {
            $$.nodo.agregarHijo($5.nodo)
        }
        $$.nodo.agregarHijo($6.nodo);
    };

Sentenciaelse
    : ELSE Sentencia_if
    {
        $$ = {
            nodo : new Nodo("ELSE")
        }
        $$.nodo.agregarHijo($2.nodo)
    }
    | ELSE InstruccionesSentencia
    {
        $$ = {
            nodo : new Nodo("ELSE")
        }
        if($2.nodo != null)
        {
            $$.nodo.agregarHijo($2.nodo)
        }
    };

Asignacion
    : IDENTIFICADOR Listaatributos '=' Expresion ';'
    {
        $$ = {
            nodo : new Nodo("Asignacion")
        }
        $$.nodo.agregarHijo(new Nodo($1));
        $$.nodo.agregarHijo($2.nodo)
        $$.nodo.agregarHijo($4.nodo)
    }
    | IDENTIFICADOR Listaatributos '=' '{' Lvalorestype '}' ';'
    {
        $$ = {
            nodo : new Nodo("Asignacion")
        }
        $$.nodo.agregarHijo(new Nodo($1))
        $$.nodo.agregarHijo($2.nodo)
        $$.nodo.agregarHijo($5.nodo)
    }
    | IDENTIFICADOR '=' '{' Lvalorestype '}' ';'
    {
        $$ = {
            nodo : new Nodo("Asignacion")
        }
        $$.nodo.agregarHijo(new Nodo($1));
        $$.nodo.agregarHijo($4.nodo)
    }
    | IDENTIFICADOR '=' Expresion ';'
    {
        $$ = {
            instruccion : new Asignacion($1, $3.instruccion, @1.first_line, @1.first_column),
            nodo : new Nodo("Asignacion")
        }
        $$.nodo.agregarHijo(new Nodo($1));
        $$.nodo.agregarHijo($3.nodo)
    };

Aumento
    : Expresion '++'
    {
        $$ = {
            nodo : new Nodo("Incremento")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo(new Nodo('++'));
        
    }
    | Expresion '--'
    {
        $$ = {
            nodo : new Nodo("Incremento")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo(new Nodo('--'));
    }
    | Expresion '+=' Expresion
    {
        $$ = {
            nodo : new Nodo("+=")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo)
    }
    | Expresion '-=' Expresion
    {
        $$ = {
            nodo : new Nodo("-=")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo)
    }
    | Expresion '*=' Expresion
    {
        $$ = {
            nodo : new Nodo("*=")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo)
    }
    | Expresion '/=' Expresion{
        $$ = {
            nodo : new Nodo("/=")
        }
        $$.nodo.agregarHijo($1.nodo)
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '%=' Expresion{
        $$ = {
            nodo : new Nodo('%=')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo)
    }
    | Expresion '**=' Expresion{
        $$ = {
            nodo : new Nodo('**=')
        }
        $$.nodo.agregarHijo($1.nodo)
        $$.nodo.agregarHijo($3.nodo);
    };

Declaracion_type
    : TYPE IDENTIFICADOR '=' '{' Latributostype '}'
    {
        $$ = {
            nodo : new Nodo("DECLARACION_TYPE")
        }
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo('='));
        $$.nodo.agregarHijo($5.nodo)
    };

Latributostype
    : Latributostype IDENTIFICADOR ':' TipoatributosType ','
    {
        $$ = {
            nodo : new Nodo("Valor")
        };
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo(new Nodo($2))
        $$.nodo.agregarHijo($4.nodo)
    }
    | Latributostype IDENTIFICADOR ':' TipoatributosType ';'
    {
        $$ = {
            nodo : new Nodo("Valor")
        }
        $$.nodo.agregarHijo($1.nodo)
        $$.nodo.agregarHijo(new Nodo($2))
        $$.nodo.agregarHijo($4.nodo)
    }
    | Latributostype IDENTIFICADOR ':' TipoatributosType
    {
        $$ = {
            nodo : new Nodo("Valor")
        };
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo($4.nodo)
    }
    | IDENTIFICADOR ':' TipoatributosType ','
    {
        $$ = {
            nodo : new Nodo("Valor") 
        };
        $$.nodo.agregarHijo(new Nodo($1));
        $$.nodo.agregarHijo($3.nodo);
    }
    | IDENTIFICADOR ':' TipoatributosType ';'
    {
        $$ = {
            nodo : new Nodo("Valor")
        }
        $$.nodo.agregarHijo(new Nodo($1));
        $$.nodo.agregarHijo($3.nodo);
    }
    | IDENTIFICADOR ':' TipoatributosType
    {
        $$ = {
            nodo : new Nodo("Valor")
        }
        $$.nodo.agregarHijo(new Nodo($1))
        $$.nodo.agregarHijo($3.nodo)
    };

Declaracion
    : LET IDENTIFICADOR ':' Tipo '=' Expresion
    {
        $$ = {
            instruccion : new Declaracion($2, $4, $6.instruccion, 0, @1.first_line, @1.first_column),
            nodo : new Nodo("Declaracion")
        }
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo(Type[$4]));
        $$.nodo.agregarHijo(new Nodo('='))
        $$.nodo.agregarHijo($6.nodo)
    }
    | LET IDENTIFICADOR ':' Tipo
    {
        $$ = {
            instruccion : new Declaracion($2, $4, null, 0, @1.first_line, @1.first_column),
            nodo : new Nodo("Declaracion")
        }
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo(Type[$4]));
    }
    | LET IDENTIFICADOR ':' IDENTIFICADOR '=' '{' Lvalorestype '}'
    {
        $$ = {
            nodo : new Nodo("Declaracion")
        }
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo($4));
        $$.nodo.agregarHijo(new Nodo('='));
        $$.nodo.agregarHijo($7.nodo)
    }
    | LET IDENTIFICADOR ':' IDENTIFICADOR '=' Expresion
    {
        $$ = {
            nodo : new Nodo("Declaracion")
        }
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo($4));
        $$.nodo.agregarHijo(new Nodo('='));
        $$.nodo.agregarHijo($6.nodo)
    }
    | LET IDENTIFICADOR ':' IDENTIFICADOR
    {
        $$ = {
            nodo : new Nodo("Declaracion")
        }
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo($3));
    }
    | CONST IDENTIFICADOR ':' Tipo '=' Expresion
    {
        $$ = {
            instruccion : new Declaracion($2, $4, $6.instruccion, 1, @1.first_line, @1.first_column),
            nodo : new Nodo("Declaracion")
        }
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo(Type[$4]))
        $$.nodo.agregarHijo(new Nodo('='));
        $$.nodo.agregarHijo($6.nodo);
    }
    | CONST IDENTIFICADOR ':' Tipo
    {
        $$ = {
            instruccion : new Declaracion($2, $4, null, 1, @1.first_line, @1.first_column),
            nodo : new Nodo("Declaracion")
        };
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo('='));
        $$.nodo.agregarHijo($4.nodo);
    }
    | CONST IDENTIFICADOR ':' IDENTIFICADOR '=' '{' Lvalorestype '}'
    {
        $$ = {
            nodo : new Nodo("Declaracion")
        }
        $$.nodo.agregarHijo(new Nodo($2)) ;
        $$.nodo.agregarHijo(new Nodo($4));
        $$.nodo.agregarHijo(new Nodo('='));
        $$.nodo.agregarHijo($7.nodo);
    }
    | CONST IDENTIFICADOR ':' IDENTIFICADOR '=' IDENTIFICADOR
    {
        $$ = {
            nodo : new Nodo("Declaracion")
        }
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo($4));
        $$.nodo.agregarHijo(new Nodo('='));
        $$.nodo.agregarHijo(new Nodo($6));
    };

Lvalorestype
    : Lvalorestype IDENTIFICADOR ':' Expresion ',' 
    {
        $$ = {
            nodo : new Nodo("Valores")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo(new Nodo($2))
        $$.nodo.agregarHijo($4.nodo)
    }
    | Lvalorestype IDENTIFICADOR ':' Expresion
    {
        $$ = { 
            nodo : new Nodo("Valores")
        };
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo($4.nodo)
    } 
    | IDENTIFICADOR ':' Expresion ','
    {
        $$ = {
            nodo : new Nodo("Valores")
        }
        $$.nodo.agregarHijo(new Nodo($1));
        $$.nodo.agregarHijo($3.nodo);
    }
    | IDENTIFICADOR ':' Expresion
    {
        $$ = {
            nodo : new Nodo("Valores")
        }
        $$.nodo.agregarHijo(new Nodo($1));
        $$.nodo.agregarHijo($3.nodo);
    };

Expresion
    : '!' Expresion
    {
        $$ = {
            instruccion : new Logica($2.instruccion, null, OpcionesLogicas.NOT, @1.first_line, @1.first_column),
            nodo : new Nodo('!')
        }
        $$.nodo.agregarHijo($2.nodo);
    }
    | Expresion '&&' Expresion
    {
        $$ = {
            instruccion : new Logica($1.instruccion, $3.instruccion, OpcionesLogicas.AND, @1.first_line, @1.first_column),
            nodo : new Nodo('&&')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '||' Expresion
    {
        $$ = {
            instruccion : new Logica($1.instruccion, $3.instruccion, OpcionesLogicas.OR, @1.first_line, @1.first_column),
            nodo : new Nodo('||') 
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '==' Expresion
    {
        $$ = {
            instruccion : new Logica($1.instruccion, $3.instruccion, OpcionesLogicas.IGUAL, @1.first_line, @1.first_column),
            nodo : new Nodo ('==')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '!=' Expresion
    {
        $$ = {
            instruccion : new Logica($1.instruccion, $3.instruccion, OpcionesLogicas.NOIGUAL, @1.first_line, @1.first_column),
            nodo : new Nodo('!=')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '<' Expresion
    {
        $$ = {
            instruccion : new Logica($1.instruccion, $3.instruccion, OpcionesLogicas.MENOR, @1.first_line, @1.first_column),
            nodo : new Nodo('<')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '>' Expresion
    {
        $$ = {
            instruccion : new Logica($1.instruccion, $3.instruccion, OpcionesLogicas.MAYOR, @1.first_line, @1.first_column),
            nodo : new Nodo('>')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '<=' Expresion
    {
        $$ = {
            instruccion : new Logica($1.instruccion, $3.instruccion, OpcionesLogicas.MENORIGUAL, @1.first_line, @1.first_column),
            nodo : new Nodo('<=')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '>=' Expresion
    {
        $$ = {
            instruccion : new Logica($1.instruccion, $3.instruccion, OpcionesLogicas.MAYORIGUAL, @1.first_line, @1.first_column),
            nodo : new Nodo('>=')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    |'-' Expresion %prec NEGATIVO
    {
        $$ = {
            instruccion : new Aritmetica($1.instruccion, null, OpcionesAritmeticas.NEGADO, @1.first_line, @1.first_column),
            nodo : new Nodo('-')
        }
        $$.nodo.agregarHijo($2.nodo);
    }
    | Expresion '+' Expresion
    {
        $$ = {
            instruccion : new Aritmetica($1.instruccion, $3.instruccion, OpcionesAritmeticas.MAS, @1.first_line, @1.first_column),
            nodo : new Nodo('+')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '-' Expresion
    {
        $$ = {
            instruccion : new Aritmetica($1.instruccion, $3.instruccion, OpcionesAritmeticas.MENOS, @1.first_line, @1.first_column),
            nodo : new Nodo('-')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo)
    }
    | Expresion '*' Expresion
    {
        $$ = {
            instruccion : new Aritmetica($1.instruccion, $3.instruccion, OpcionesAritmeticas.POR, @1.first_line, @1.first_column),
            nodo : new Nodo('*')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '/' Expresion
    {
        $$ = {
            instruccion : new Aritmetica($1.instruccion, $3.instruccion, OpcionesAritmeticas.DIVISION, @1.first_line, @1.first_column),
            nodo : new Nodo('/')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '%' Expresion
    {
        $$ = {
            instruccion : new Aritmetica($1.instruccion, $3.instruccion, OpcionesAritmeticas.MODULO, @1.first_line, @1.first_column), 
            nodo : new Nodo('%')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '**' Expresion
    {
        $$ = {
            instruccion : new Aritmetica($1.instruccion, $3.instruccion, OpcionesAritmeticas.POTENCIA, @1.first_line, @1.first_column),
            nodo : new Nodo('**')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | '(' Expresion ')'
    {
        $$ = $2;
    }
    | NUMERO
    {
        $$ = {
            instruccion : new Literal($1, Type.NUMERO, @1.first_line, @1.first_column),
            nodo : new Nodo($1)
        }
    }
    | CADENA
    {
        if($1.includes('\"'))
        {
            $$ = {
                instruccion : new Literal($1.replace(/['"]+/g, ''), Type.CADENA, @1.first_line, @1.first_column),
                nodo : new Nodo($1.replace(/['"]+/g, ''))
            }
        }
        else if($1.includes("'"))
        {
            $$ = {
                instruccion : new Literal($1.replace(/["'"]+/g, ''), Type.CADENA, @1.first_line, @1.first_column),
                nodo : new Nodo($1.replace(/["'"]+/g, ''))
            }
        }
        else
        {
            $$ = {
                nodo : new Nodo($1)
            }
        }
    }
    | TRUE
    {
        $$ = {
            instruccion : new Literal(true, Type.BOOLEANO, @1.first_line, @1.first_column),
            nodo : new Nodo($1)
        }
    }
    | FALSE
    {
        $$ = {
            instruccion : new Literal(false, Type.BOOLEANO, @1.first_line, @1.first_column),
            nodo : new Nodo($1)
        }
    }
    | IDENTIFICADOR
    {
        $$ = {
            instruccion : new Variable($1, @1.first_line, @1.first_column),
            nodo : new Nodo($1)
        }
    }
    | IDENTIFICADOR Listaatributos
    {
        $$ = {
            nodo : new Nodo('EXP')
        }
        $$.nodo.agregarHijo(new Nodo($1));
        $$.nodo.agregarHijo($2.nodo);
    }
    | Aumento
    {
        $$ = $1;
    }
    | Llamada
    {
        $$ = $1;
    }
    | NULL
    {
        $$ = {
            nodo : new Nodo($1)
        }
    };

Listaatributos
    : Listaatributos '.' IDENTIFICADOR 
    {
        $$ = {
            nodo : new Nodo('ATRIB')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo(new Nodo($3))
        $$ = $1;
    }
    | '.' IDENTIFICADOR
    {
        $$ = {
            nodo : new Nodo('ATRIB')
        }
        $$.nodo.agregarHijo(new Nodo($2));
    };

Llamada
    : IDENTIFICADOR '(' ')'
    {
        $$ = {
            nodo : new Nodo('Llamada')
        };
        $$.nodo.agregarHijo(new Nodo($1));
    }
    | IDENTIFICADOR '(' Listaparam ')'
    {
        $$ = {
            nodo : new Nodo("Llamada")
        }
        $$.nodo.agregarHijo(new Nodo($1));
        $$.nodo.agregarHijo($3.nodo);
    }
    | 'CONSOLE' '.' 'LOG' '(' ')'
    {
        $$ = {
            instruccion : new Imprimir(null, $1.first_line, $1.first_column),
            nodo : new Nodo("Imprimir")
        }
    }
    | 'CONSOLE' '.' 'LOG' '(' Listaparam ')'
    {
        $$ = {
            instruccion : new Imprimir($5.instruccion, $1.first_line, $1.first_column),
            nodo : new Nodo("Imprimir")

        }
        $$.nodo.agregarHijo($5.nodo);
    }
    | 'GRAFICAR_TS' '(' ')'
    {
        $$ = {
            nodo : new Nodo("GraficarTs")
        }
    };

Listaparam
    : Listaparam ',' Expresion 
    {
        $1.instruccion.push($3.instruccion)
        $$ = {
            instruccion : $1.instruccion,
            nodo : new Nodo("Parametro")
        };
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion{
        $$ = {
            instruccion : [$1.instruccion],
            nodo : new Nodo("Parametro")
        }
        $$.nodo.agregarHijo($1.nodo);
    };

Tipo
    : STRING
    {
        $$ = Type.CADENA;
    }
    | NUMBER
    {
        $$ = Type.NUMERO;
    }
    | BOOLEAN
    {
        $$ = Type.BOOLEANO
    }
    | VOID
    {
        $$ = Type.VOID;
    };

//inicia gramatica funciones
Funcion 
    : FUNCTION IDENTIFICADOR '(' Funcion1
    {
        if($4.parametros != null)
        {
            $$ = {
                //instrucciones : new Funcion($2, $4.instrucciones_f.instrucciones, $4.parametros.instrucciones, $4.tipo, @1.first_line, @1.first_column),
                nodo : new Nodo(null, "Funcion", null)
            }
            $$.nodo.agregarHijos(new Nodo($2, null, null));
            $$.nodo.agregarHijos($4.parametros.nodo);
            if(isNaN($4.tipo) == false)
            {
                $$.nodo.agregarHijos(new Nodo(Type[$4.tipo], null, null))
            }
            else
            {
                $$.nodo.agregarHijos(new Nodo($4.tipo, null, null))
            }
            if($4.instrucciones_f.nodo != null)
            {
                $$.nodo.agregarHijos($4.instrucciones_f.nodo)
            }
        }
        else
        {
            $$ = {
                //instrucciones : new Funcion($2, $4.instrucciones_f.instrucciones, new Array(), $4.tipo, @1.first_line, @1.first_column),
                nodo : new Nodo(null, "Funcion", null)
            }
            $$.nodo.agregarHijos(new Nodo($2, null, null));
            $$.nodo.agregarHijos(new Nodo(Type[$4.tipo], null, null))
            if($4.instrucciones_f.nodo != null)
            {
                $$.nodo.agregarHijos($4.instrucciones_f.nodo)
            }
        }
    };

Funcion1
    : Lparametrosfuncion ')' ':' Tipofuncion InstruccionesFuncion
    {
        $$ = {
            parametros : $1,
            tipo : $4,
            instrucciones_f : $5
        }
    }
    | ')' ':' Tipofuncion InstruccionesFuncion
    {
        $$ = {
            parametros : null,
            tipo : $3,
            instrucciones_f : $4
        }
    };

Tipofuncion
    : Tipo
    {
        $$ = $1
    }
    | IDENTIFICADOR
    {
        $$ = $1
    };

InstruccionesFuncion
    : '{' InstruccionesFuncion1
    {
        if($2.instrucciones != null)
        {
            $$ = {
                //instrucciones : new Cuerposentencia($2.instrucciones, @1.linea, @1.columna),
                nodo : $2.nodo
            }
        }
        else
        {
            $$ = $2;
        }
    };

InstruccionesFuncion1
    : Linstrucciones '}'
    {
        $$ = $1;
    }
    | '}'
    {
        $$ = {
            //instrucciones : null,
            nodo : null
        };
    };

Linstrucciones 
    : Instruccionfuncion Linstrucciones1
    {
        $$ = $2;
    };

Linstrucciones1
    : Linstrucciones
    {
        hermano = eval('$$');
        hermano[hermano.length - 1].instrucciones.unshift(hermano[hermano.length - 2].instrucciones);
        $$ = {
            //instrucciones : hermano[hermano.length - 1].instrucciones,
            nodo : new Nodo(null, "INST", null)
        }
        $$.nodo.agregarHijos(hermano[hermano.length - 2].nodo)
        $$.nodo.agregarHijos(hermano[hermano.length - 1].nodo);
    }
    | 
    {
        hermano = eval('$$');
        $$ = {
            //instrucciones : [hermano[hermano.length - 1].instrucciones],
            nodo : new Nodo(null, "INST", null)
        }
        $$.nodo.agregarHijos(hermano[hermano.length - 1].nodo)
    };

Instruccionfuncion
    : Expresionesfuncion Instruccionfuncion1 ';'
    {
        if($2.contenido.instrucciones != null)
        {
            if($2.estype == false)
            {
                $$ = {
                    //instrucciones : new Asignacion($1.instrucciones.nombre, $1.instrucciones.atributos, $2.contenido.instrucciones, $1.instrucciones.linea, $1.instrucciones.columna),
                    nodo : new Nodo("Asignacion", null, null)
                }
                $$.nodo.agregarHijos($1.nodo);
                $$.nodo.agregarHijos($2.contenido.nodo)
            }
            else
            {
                $$ = {
                    //instrucciones : new AsignacionVarType($1.instrucciones.nombre, $1.instrucciones.atributos, $2.contenido.instrucciones, $1.instrucciones.linea, $1.instrucciones.columna),
                    nodo : new Nodo("Asignacion", null, null)
                }
                $$.nodo.agregarHijos($1.nodo)
                $$.nodo.agregarHijos($2.contenido.nodo)
            }
        }
        else
        {
            $$ = $1;
        }
    }
    | Llamadas_funcion ';'
    {
        hermano = eval('$$');
        $$ = hermano[hermano.length - 2];
    }
    | LET IDENTIFICADOR Auxdeclaracion
    {
        if($3.estype == false){
            if($3.valor == null && $3.tipo == null)
            {
                $$ = {
                    //instrucciones : new Declaracion($2, null, null, TiposSimbolo.VAR, @1.first_line, @1.first_column),
                    nodo : new Nodo("Declaracion", null, null)
                }
                $$.nodo.agregarHijos(new Nodo($2, null, null))
            }
            else if($3.valor == null && $3.tipo != null)
            {
                $$ = {
                    //instrucciones : new Declaracion($2, null, $3.tipo, TiposSimbolo.VAR, @1.first_line, @1.first_column),
                    nodo : new Nodo("Declaracion", null, null)
                }
                $$.nodo.agregarHijos(new Nodo($2, null, null));
                if(isNaN($3.tipo) == false)
                {
                    $$.nodo.agregarHijos(new Nodo(Type[$3.tipo], null, null))
                }
                else
                {
                    $$.nodo.agregarHijos(new Nodo($3, null, null))
                }
            }
            else if($3.valor != null && $3.tipo != null)
            {
                $$ = {
                    //instrucciones : new Declaracion($2, $3.valor, $3.tipo, TiposSimbolo.VAR, @1.first_line, @1.first_column),
                    nodo : new Nodo("Declaracion", null, null)
                }
                $$.nodo.agregarHijos(new Nodo($2, null, null))
                if(isNaN($3.tipo) == false)
                {
                    $$.nodo.agregarHijos(new Nodo(Type[$3.tipo], null, null))
                }
                else
                {
                    $$.nodo.agregarHijos(new Nodo($3, null, null))
                }
                $$.nodo.agregarHijos(new Nodo('=', null, null))
                $$.nodo.agregarHijos($3.nodo)
            }
            else if($3.valor != null && $3.tipo == null)
            {
                $$ = {
                    //instrucciones : new Declaracion($2, $3.valor, null, TiposSimbolo.VAR, @1.first_line, @1.first_column),
                    nodo : new Nodo("Declaracion", null, null)
                }
                $$.nodo.agregarHijos(new Nodo($2, null, null));
                $$.nodo.agregarHijos(new Nodo('=', null, null));
                $$.nodo.agregarHijos($3.nodo)
            }
        }
        else
        {
            if($3.valor == null && $3.tipo != null)
            {
                $$ = {
                    //instrucciones : new Declaracion($2, null, $3.tipo, TiposSimbolo.VAR, @1.first_line, @1.first_column),
                    nodo : new Nodo(null, "Declaracion", null)
                }
                $$.nodo.agregarHijos(new Nodo($2, null, null))
                $$.nodo.agregarHijos(new Nodo($3.tipo, null, null))
            }
            else if($3.valor != null && $3.tipo != null)
            {
                $$ = {
                    //instrucciones : new Declaracion($2, $3.valor, $3.tipo, TiposSimbolo.VAR, @1.first_line, @1.first_column),
                    nodo : new Nodo(null, "Declaracion", null)
                }
                $$.nodo.agregarHijos(new Nodo($2, null, null))
                $$.nodo.agregarHijos(new Nodo($3.tipo, null, null))
                $$.nodo.agregarHijos(new Nodo('=', null, null))
                $$.nodo.agregarHijos($3.nodo)
            }
        }
    }
    | CONST IDENTIFICADOR Auxdeclaracion4
    {
        if($3.estype == false)
        {
            if($3.valor != null && $3.tipo == null)
            {
                $$ = {
                    //instrucciones : new Declaracion($2, $3.valor, null, TiposSimbolo.CONST, @1.first_line, @1.first_column),
                    nodo : new Nodo(null, "Declaracion", null)
                }
                $$.nodo.agregarHijos(new Nodo($2, null, null));
                $$.nodo.agregarHijos(new Nodo('=', null, null))
                $$.nodo.agregarHijos($3.nodo)
            }
            else
            {
                $$ = {
                    //instrucciones : new Declaracion($2, $3.valor, $3.tipo, TiposSimbolo.CONST, @1.first_line, @1.first_column),
                    nodo : new Nodo(null, "Declaracion", null)
                }
                $$.nodo.agregarHijos(new Nodo($2, null, null));
                $$.nodo.agregarHijos(new Nodo(Type[$3.tipo], null, null))
                $$.nodo.agregarHijos(new Nodo('=', null, null));
                $$.nodo.agregarHijos($3.nodo)
            }
        }
        else
        {
            $$ = {
                //instrucciones : new Declaracion($2, $3.valor, $3.tipo, TiposSimbolo.CONST, @1.first_line, @1.first_column),
                nodo : new Nodo(null, "Declaracion", null)
            }
            $$.nodo.agregarHijos(new Nodo($2, null, null))
            $$.nodo.agregarHijos(new Nodo($3.tipo, null, null))
            $$.nodo.agregarHijos(new Nodo('=', null, null))
            $$.nodo.agregarHijos($3.nodo)
        }
    }
    | sentencia_if
    {
        $$ = $1;
    }
    | sentencia_switch
    {
        $$ = $1;
    }
    | sentencia_while
    {
        $$ = $1;
    }
    | sentencia_dowhile
    {
        $$ = $1;
    }
    | sentencia_for
    {
        $$ = $1;
    }
    | sentencia_break
    {
        $$ = $1;
    }
    | sentencia_continue
    {
        $$ = $1;
    }
    | Sentencia_return
    {
        $$ = $1;
    }
    | error ';'
    | error '}';

Auxdeclaracion4
    : ':' Auxdeclaracion5
    {
        $$ = $2;
    };

Auxdeclaracion5
    : Tipo '=' Expresionesfuncion ';'
    {
        hermano = eval('$$');
        $$ = {
            estype : false,
            valor : hermano[hermano.length - 2].instrucciones,
            tipo : hermano[hermano.length - 4],
            nodo : hermano[hermano.length - 2].nodo
        }
    }
    | IDENTIFICADOR '=' Auxdeclaracion6
    {
        hermano = eval('$$');
        $$ = $3
    };

Auxdeclaracion
    : ':' Auxdeclaracion1
    {
        $$ = $2
    };

Auxdeclaracion1
    : Tipo Auxdeclaracion2
    {
        $$ = $2;
    }
    | IDENTIFICADOR Auxdeclaracion3
    {
        $$ = $2;
    };

Auxdeclaracion2
    : ';'
    {
        hermano = eval('$$');
        $$ = {
            estype : false,
            valor : null,
            tipo : hermano[hermano.length - 2]
        }
    }
    | '=' Expresionesfuncion ';'
    {
        hermano = eval('$$');
        $$ = {
            estype : false,
            valor : hermano[hermano.length - 2].instrucciones,
            tipo : hermano[hermano.length - 4],
            nodo : hermano[hermano.length - 2].nodo
        };
    };

Auxdeclaracion3
    : ';'
    {
        hermano = eval('$$');
        $$ = {
            estype : true,
            valor : null,
            tipo : hermano[hermano.length - 2]
        }
    }
    | '=' Auxdeclaracion6
    {
        $$ = $2;
    };
    
Auxdeclaracion6
    : '{' ValoresType '}' ';'
    {
        hermano = eval('$$');
        $$ = {
            estype : true,
            valor : hermano[hermano.length - 3].instrucciones,
            tipo : hermano[hermano.length - 6],
            nodo : hermano[hermano.length - 3].nodo
        }
    }
    | Expresionesfuncion ';'
    {
        hermano = eval('$$');
        $$ = {
            estype : true,
            valor : hermano[hermano.length - 2].instrucciones,
            tipo : hermano[hermano.length - 4],
            nodo : hermano[hermano.length - 2].nodo
        }
    };

Sentencia_return
    : RETURN Sentencia_return1
    {
        $$ = {
            //instrucciones : new SentenciaReturn($2.instrucciones, @1.first_line, @1.first_column),
            nodo : new Nodo("Return", null, null)
        }
        if($2.nodo != null)
        {
            $$.nodo.agregarHijos($2.nodo)
        }
    };

Sentencia_return1
    : Expresionesfuncion ';'
    {
        hermano = eval('$$');
        $$ = {
            //instrucciones : hermano[hermano.length - 2].instrucciones,
            nodo : hermano[hermano.length - 2].nodo
        };
    }
    | ';'
    {
        $$ = {
            //instrucciones : null,
            nodo : null
        }
    };

sentencia_break
    : BREAK ';'
    {
        $$ = {
            //instrucciones : new Break(@1.first_line, @1.first_column),
            nodo : new Nodo("Break", null, null)
        }
    };

sentencia_continue
    : CONTINUE ';'
    {
        $$ = {
            //instrucciones : new Continue(@1.first_line, @1.first_column),
            nodo : new Nodo("Continue", null, null)
        };
    };

sentencia_for
    : FOR '(' sentencia_for1
    {
        $$ = {
            //instrucciones : new SentenciaFor($3.declarado, $3.id, $3.valor_inicio.instrucciones, $3.condicion.instrucciones, $3.incremento.instrucciones, $3.instrucciones.instrucciones, @1.first_line, @1.first_column),
            nodo : new Nodo(null, "For", null)
        }
        instruccion = new Nodo("=", null, null)
        instruccion.agregarHijos(new Nodo($3.id, null, null))
        instruccion.agregarHijos($3.valor_inicio.nodo)
        $$.nodo.agregarHijos(instruccion);
        instruccion = new Nodo(null, "Condicion", null)
        instruccion.agregarHijos($3.condicion.nodo)
        $$.nodo.agregarHijos(instruccion)
        $$.nodo.agregarHijos($3.incremento.nodo)
        if($3.instrucciones.nodo != null)
        {
            $$.nodo.agregarHijos($3.instrucciones.nodo)
        }
    };

sentencia_for1
    : LET IDENTIFICADOR '=' Expresionesfuncion ';' Expresionesfuncion ';' Expresionesfuncion ')' InstruccionesFuncion
    {
        $$ = {
            id : $2,
            valor_inicio : $4,
            condicion : $6,
            incremento : $8,
            //instrucciones : $10,
            declarado : 1
        }
    }
    | Expresionesfuncion '=' Expresionesfuncion ';' Expresionesfuncion ';' Expresionesfuncion ')' InstruccionesFuncion
    {
        $$ = {
            id : $1,
            valor_inicio : $3,
            condicion : $5,
            incremento : $7,
            //instrucciones : $9,
            declarado : 0
        }
    };

sentencia_dowhile
    : DO InstruccionesFuncion WHILE '(' Expresionesfuncion ')' ';'
    {
        $$ = {
            //instrucciones : new SentenciaDowhile($5.instrucciones, $2.instrucciones, @1.first_line, @1.first_column),
            nodo : new Nodo(null, "Do_while", null)
        }
        instruccion = new Nodo(null, "Condicion", null)
        instruccion.agregarHijos($5.nodo)
        if($2.nodo != null)
        {
            $$.nodo.agregarHijos($2.nodo)
        }
        $$.nodo.agregarHijos(instruccion)
    };

sentencia_while
    : WHILE '(' Expresionesfuncion ')' InstruccionesFuncion
    {
        $$ = {
            //instrucciones : new SentenciaWhile($3.instrucciones, $5.instrucciones, @1.first_line, @1.first_column),
            nodo : new Nodo(null, "While", null)
        }
        instruccion = new Nodo(null, "Condicion", null);
        instruccion.agregarHijos($3.nodo)
        $$.nodo.agregarHijos(instruccion)
        if($5.nodo != null){
            $$.nodo.agregarHijos($5.nodo)
        }
    };

sentencia_switch
    : SWITCH '(' Expresionesfuncion ')' '{' Lcasosswitch
    {
        $$ = {
            //instrucciones : new SentenciaSwitch($3.instrucciones, $6.casos, @1.first_line, @1.first_column),
            nodo : new Nodo(null, "Switch", null)
        };
        instruccion = new Nodo(null, "Condicion", null)
        instruccion.agregarHijos($3.nodo)
        $$.nodo.agregarHijos(instruccion)
        if($6.casos != null)
        {
            $$.nodo.agregarHijos($6.nodo_casos)
        }
    };

Lcasosswitch 
    : Lcasos '}'
    {
        $$ = $1;
    }
    | '}'
    {
        $$ = {
            casos : null,
            nodo_casos : null
        };
    };

Lcasos
    : CASE Expresionesfuncion ':' Lcasos1
    {
        hermano = eval('$$');
        if(hermano[hermano.length - 1].casos == null)
        {
            $$ = {
                casos : [new Caso($2.instrucciones, hermano[hermano.length - 1].instrucciones, @1.first_line, @1.first_column)],
                nodo_casos : new Nodo(null, "Caso", null)
            }
            $$.nodo_casos.agregarHijos($2.nodo)
            if(hermano[hermano.length - 1].instrucciones != null)
            {
                $$.nodo_casos.agregarHijos(hermano[hermano.length - 1].nodo)
            }
        }
        else
        {
            hermano[hermano.length - 1].casos.unshift(new Caso($2.instrucciones, hermano[hermano.length - 1].instrucciones, @1.first_line, @1.first_column))
            $$ = {
                casos : hermano[hermano.length - 1].casos,
                nodo_casos : new Nodo(null, "Caso", null)
            }
            $$.nodo_casos.agregarHijos($2.nodo);
            if(hermano[hermano.length - 1].nodo != null)
            {
                $$.nodo_casos.agregarHijos(hermano[hermano.length - 1].nodo)
            }            
            $$.nodo_casos.agregarHijos(hermano[hermano.length - 1].nodo_casos)
        }
    }
    | DEFAULT ':' Lcasos1
    {
        hermano = eval('$$');
        if(hermano[hermano.length - 1].casos == null)
        {
            $$ = {
                casos : [new CasoDef(hermano[hermano.length - 1].instrucciones, @1.first_line, @1.first_column)],
                nodo_casos : new Nodo(null, "Caso", null)
            }
            $$.nodo_casos.agregarHijos(new Nodo("Default", null, null));
            if(hermano[hermano.length - 1].instrucciones != null)
            {
                $$.nodo_casos.agregarHijos(hermano[hermano.length - 1].nodo)
            }
        }
        else
        {
            hermano[hermano.length - 1].casos.unshift(new CasoDef(hermano[hermano.length - 1].instrucciones, @1.first_line, @1.first_column));
            $$ = {
                casos : hermano[hermano.length - 1].casos,
                nodo_casos : new Nodo(null, "Caso", null)
            }
            $$.nodo_casos.agregarHijos(new Nodo("Default", null, null))
            if(hermano[hermano.length - 1].nodo != null)
            {
                $$.nodo_casos.agregarHijos(hermano[hermano.length - 1].nodo)
            }
            $$.nodo_casos.agregarHijos(hermano[hermano.length - 1].nodo_casos)
        }
    };

Lcasos1
    : Linstrucciones Lcasos2
    {
        hermano = eval('$$')
        if(hermano[hermano.length - 1] == null)
        {
            $$ = {
                //instrucciones : hermano[hermano.length - 2].instrucciones,
                casos : null,
                nodo : hermano[hermano.length - 2].nodo,
                nodo_casos : null
            }
        }
        else
        {
            $$ = {
                //instrucciones : hermano[hermano.length - 2].instrucciones,
                casos : hermano[hermano.length - 1].casos,
                nodo : hermano[hermano.length - 2].nodo,
                nodo_casos : hermano[hermano.length - 1].nodo_casos
            }
        }
        
    }
    | Lcasos
    {
        hermano = eval('$$');
        $$ = {
            //instrucciones : null,
            casos : hermano[hermano.length - 1].casos,
            nodo : null,
            nodo_casos : hermano[hermano.length - 1].nodo_casos
        }
    }
    | 
    {
        $$ = {
            //instrucciones : null,
            casos : null,
            nodo : null,
            nodo_casos : null
        }
    };

Lcasos2
    : Lcasos
    {
        $$ = $1;
    }
    | 
    {
        $$ = null
    };

sentencia_if
    : IF '(' Expresionesfuncion ')' InstruccionesFuncion sentencia_else
    {
        $$ = {
            //instrucciones : new SentenciaIf($3.instrucciones, $5.instrucciones, $6.instrucciones, @1.first_line, @1.first_column),
            nodo : new Nodo(null, "IF", null)
        };
        instruccion = new Nodo(null, "Condicion", null)
        instruccion.agregarHijos($3.nodo);
        $$.nodo.agregarHijos(instruccion)
        if($5.nodo != null)
        {
            $$.nodo.agregarHijos($5.nodo)
        }

        if($6.nodo != null)
        {
            $$.nodo.agregarHijos($6.nodo)
        }
    };

sentencia_else
    : ELSE sentencia_else1
    {
        $$ = {
            //instrucciones : $2.instrucciones,
            nodo : new Nodo(null, "ELSE", null)
        }
        $$.nodo.agregarHijos($2.nodo)
    }
    | 
    {
        $$ = {
            //instrucciones : null,
            nodo : null
        }
    };

sentencia_else1
    : sentencia_if
    {
        $$ = $1;
    }
    | InstruccionesFuncion
    {
        $$ = $1;
    };

Instruccionfuncion1
    : '=' instruccionfuncion12
    {
        $$ = $2;
    }
    | {
        $$ = {
            contenido : {
                //instrucciones : null
            }
            ,
            nodo : null
        };
    };

instruccionfuncion12
    : Expresionesfuncion
    {
        $$ = {
            contenido : $1,
            estype : false
        }
    }
    | '{' ValoresType '}'
    {
        $$ = {
            contenido : $2,
            estype : true
        }
    };

Expresionesfuncion
    : '!' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Relacional($2.instrucciones, null, OperacionesLogicas.NEGADO, @1.first_line, @1.first_column),
            nodo : new Nodo('!', null, null)
        }
        $$.nodo.agregarHijos($2.nodo);
    }
    | Expresionesfuncion '&&' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Relacional($1.instrucciones, $3.instrucciones, OperacionesLogicas.'&&', @1.first_line, @1.first_column),
            nodo : new Nodo('&&', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '||' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Relacional($1.instrucciones, $3.instrucciones, OperacionesLogicas.OR, @1.first_line, @1.first_column),
            nodo : new Nodo('||', null, null) 
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '==' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Relacional($1.instrucciones, $3.instrucciones, OperacionesLogicas.IGUAL, @1.first_line, @1.first_column),
            nodo : new Nodo ('==', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '!=' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Relacional($1.instrucciones, $3.instrucciones, OperacionesLogicas.NOIGUAL, @1.first_line, @1.first_column),
            nodo : new Nodo('!=', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '<' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Relacional($1.instrucciones, $3.instrucciones, OperacionesLogicas.MENOR, @1.first_line, @1.first_column),
            nodo : new Nodo('<', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '>' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Relacional($1.instrucciones, $3.instrucciones, OperacionesLogicas.MAYOR, @1.first_line, @1.first_column),
            nodo : new Nodo('>', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '<=' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Relacional($1.instrucciones, $3.instrucciones, OperacionesLogicas.MENORIGUAL, @1.first_line, @1.first_column),
            nodo : new Nodo('<=', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '>=' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Relacional($1.instrucciones, $3.instrucciones, OperacionesLogicas.MAYORIGUAL, @1.first_line, @1.first_column),
            nodo : new Nodo('>=', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | '-' Expresionesfuncion %prec NEGATIVO
    {
        $$ = {
            //instrucciones : new Aritmeticas($2.instrucciones, null, OpcionesAritmeticas.NEGATIVO, @1.first_line, @1.first_column),
            nodo : new Nodo('-', null, null)
        }
        $$.nodo.agregarHijos($2.nodo);
    }
    | Expresionesfuncion '+' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Aritmeticas($1.instrucciones, $3.instrucciones, OpcionesAritmeticas.MAS, @1.first_line, @1.first_column),
            nodo : new Nodo('+', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '-' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Aritmeticas($1.instrucciones, $3.instrucciones, OpcionesAritmeticas.MENOS, @1.first_line, @1.first_column),
            nodo : new Nodo('-', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo)
    }
    | Expresionesfuncion '*' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Aritmeticas($1.instrucciones, $3.instrucciones, OpcionesAritmeticas.POR, @1.first_line, @1.first_column),
            nodo : new Nodo('*', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '/' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Aritmeticas($1.instrucciones, $3.instrucciones, OpcionesAritmeticas.DIV, @1.first_line, @1.first_column),
            nodo : new Nodo('/', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '%' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Aritmeticas($1.instrucciones, $3.instrucciones, OpcionesAritmeticas.MODULO, @1.first_line, @1.first_column),
            nodo : new Nodo('%', null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '**' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new Aritmeticas($1.instrucciones, $3.instrucciones, OpcionesAritmeticas.POTENCIA, @1.first_line, @1.first_column),
            nodo : new Nodo('**', null, null, null)
        }
        $$.nodo.agregarHijos($1.nodo);
        $$.nodo.agregarHijos($3.nodo);
    }
    | Expresionesfuncion '?' Expresionesfuncion ':' Expresionesfuncion
    {
        $$ = {
            //instrucciones : new SentenciaTernaria($1.instrucciones, $3.instrucciones, $5.instrucciones, @1.first_line, @1.first_column),
            nodo : new Nodo(null, "Ternaria", null)
        }
        instruccion = new Nodo(null, "Condicion", null);
        instruccion.agregarHijos($1.nodo);
        $$.nodo.agregarHijos(instruccion);
        $$.nodo.agregarHijos($3.nodo);
        $$.nodo.agregarHijos($5.nodo);
    }
    | NUMERO
    {
        $$ = {
            //instrucciones : new Literal($1, @1.first_line, @1.first_column, 0),
            nodo : new Nodo($1, null, null)
        }
    }
    | CADENA
    {
        if($1.includes('\"'))
        {
            $$ = {
                //instrucciones : new Literal($1.replace(/['"]+/g, ''), @1.first_line, @1.first_column, 1),
                nodo : new Nodo($1.replace(/['"]+/g, ''), null, null)
            }
        }
        else if($1.includes("'"))
        {
            $$ = {
                //instrucciones : new Literal($1.replace(/["'"]+/g, ''), @1.first_line, @1.first_column, 1),
                nodo : new Nodo($1.replace(/["'"]+/g, ''), null, null)
            }
        }
        else
        {
            $$ = {
                //instrucciones : new Literal($1, @1.first_line, @1.first_column, 1),
                nodo : new Nodo($1, null, null)
            }
        }
    }
    | IDENTIFICADOR
    {
        $$ = {
            //instrucciones : new Variable($1, null, 7, @1.first_line, @1.first_column),
            nodo : new Nodo($1, null, null)
        }
    }
    | IDENTIFICADOR Atributos
    {
        $$ = {
            nodo : new Nodo(null, 'EXP', null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        $$.nodo.agregarHijos($2.nodo);
    }
    | IDENTIFICADOR '(' Instruccionfuncion2
    {
        hermano = eval('$$');
        $$ = {
            nodo : new Nodo(null, "Llamada", null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        if(hermano[hermano.length - 1].nodo != null)
        {
            $$.nodo.agregarHijos(hermano[hermano.length - 1].nodo)
        }
    }
    }
    | TRUE
    {
        $$ = {
            nodo : new Nodo($1, null, null)
        }
    }
    | FALSE
    {
        $$ = {
            nodo : new Nodo($1, null, null)
        }
    }
    | NULL
    {
        $$ = {
            nodo : new Nodo($1, null, null)
        }
    }
    | '(' Expresionesfuncion ')'
    {
        $$ = $2;
    }
    | Aumento_funcion{
        $$ = $1;
    };

Aumento_funcion
    : IDENTIFICADOR '++'
    {
        $$ = {
            nodo : new Nodo(null, "Incremento", null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        $$.nodo.agregarHijos(new Nodo('++', null, null));
        
    }
    | IDENTIFICADOR '--'
    {
        $$ = {
            nodo : new Nodo(null, "Incremento", null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        $$.nodo.agregarHijos(new Nodo('--', null, null));
    }
    | IDENTIFICADOR '+=' Expresionesfuncion
    {
        $$ = {
            nodo : new Nodo("+=", null, null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        $$.nodo.agregarHijos($3.nodo)
    }
    | IDENTIFICADOR '-=' Expresionesfuncion
    {
        $$ = {
            nodo : new Nodo("-=", null, null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        $$.nodo.agregarHijos($3.nodo)
    }
    | IDENTIFICADOR '*=' Expresionesfuncion
    {
        $$ = {
            nodo : new Nodo("*=", null, null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        $$.nodo.agregarHijos($3.nodo)
    }
    | IDENTIFICADOR '/=' Expresionesfuncion{
        $$ = {
            nodo : new Nodo("/=", null, null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null))
        $$.nodo.agregarHijos($3.nodo);
    }
    | IDENTIFICADOR '%=' Expresionesfuncion{
        $$ = {
            nodo : new Nodo('%=', null, null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        $$.nodo.agregarHijos($3.nodo)
    }
    | IDENTIFICADOR '**=' Expresionesfuncion{
        $$ = {
            nodo : new Nodo('**=', null, null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null))
        $$.nodo.agregarHijos($3.nodo);
    };

Llamadas_funcion
    : CONSOLE '.' LOG '(' Instruccionfuncion2
    {
        hermano = eval('$$');
        $$ = {
            nodo : new Nodo(null, "Imprimir", null)
        }
        if(hermano[hermano.length - 1].nodo != null)
        {
            $$.nodo.agregarHijos(hermano[hermano.length - 1].nodo)
        }
    }
    | GRAFICAR_TS '(' ')'
    {
        $$ = {
            nodo : new Nodo(null, "GraficarTs", null)
        }
    };

Instruccionfuncion2
    : ')'
    {
        hermano = eval('$$');
        $$ = {
            nodo : null
        };
    }
    | Parametrosllamada ')'
    {
        $$ = $1;
    };

Atributos
    : Atributo Atributos1
    {
        $$ = $2;
    };

Atributo
    : '.' IDENTIFICADOR
    {
        $$ = {
            nodo : new Nodo(null, "ATRIB", null)
        }
        $$.nodo.agregarHijos(new Nodo($2, null, null));
    };

Atributos1
    : Atributos
    {
        hermano = eval('$$');
        $$ = {
            nodo : hermano[hermano.length - 2].nodo
        }
        $$.nodo.agregarHijos(hermano[hermano.length - 1].nodo)
    }
    | 
    {
        hermano = eval('$$');
        $$ = {
            nodo : hermano[hermano.length - 1].nodo
        }
    };

Parametrosllamada
    : Parametrollamada Parametrosllamada1
    {
        $$ = $2;
    };

Parametrollamada
    : Expresionesfuncion
    {
        $$ = {
            nodo : new Nodo(null, "Parametro", null)
        }
        $$.nodo.agregarHijos($1.nodo)
    };

Parametrosllamada1
    : ',' Parametrosllamada
    {
        hermano = eval('$$');
        $$ = {
            nodo : hermano[hermano.length - 3].nodo
        }
        $$.nodo.agregarHijos(hermano[hermano.length - 1].nodo);
    }
    | 
    {
        hermano = eval('$$');
        $$ = {
            nodo : hermano[hermano.length - 1].nodo
        }
    };

ValoresType
    : Valortype ValoresType1
    {
        $$ = $2;
    };

Valortype
    : IDENTIFICADOR ':' Expresionesfuncion
    {
        $$ = {
            nodo : new Nodo("Valores", null, null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        $$.nodo.agregarHijos($3.nodo)
    };

ValoresType1
    : ',' ValoresType
    {
        hermano = eval('$$');
        $$ = {
            nodo : hermano[hermano.length-3].nodo
        }
        $$.nodo.agregarHijos(hermano[hermano.length - 1].nodo);
    }
    | ValoresType
    {
        hermano = eval('$$');
        $$ = {
            nodo : hermano[hermano.length -2].nodo
        }
        $$.nodo.agregarHijos(hermano[hermano.length - 1].nodo)
    }
    | 
    {
        hermano = eval('$$');
        $$ = {
            nodo : hermano[hermano.length - 1].nodo
        }
    };

Lparametrosfuncion
    : Parametro Auxparametros
    {
        $$ = $2
    };

Parametro
    : IDENTIFICADOR ':' Tipo
    {
        $$ = {
            nodo : new Nodo(null, "Parametro", null) 
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null));
        $$.nodo.agregarHijos(new Nodo(Type[$3], null, null));
    }
    | IDENTIFICADOR ':' IDENTIFICADOR
    {
        $$ = {
            nodo : new Nodo(null, "Parametro", null)
        }
        $$.nodo.agregarHijos(new Nodo($1, null, null))
        $$.nodo.agregarHijos(new Nodo($3, null, null))
    };

Auxparametros 
    : ',' Lparametrosfuncion
    {
        hermano = eval('$$');
        $$ = {
            nodo : hermano[hermano.length - 3].nodo
        }
        $$.nodo.agregarHijos(hermano[hermano.length - 1].nodo);
    }
    | 
    {
        hermano = eval('$$');
        $$ = {
            nodo : hermano[hermano.length - 1].nodo
        }
    };

%%