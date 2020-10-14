%{
    let auxnodo = null
    const { Nodo } = require('../Arbol/Nodo');
    const { Type } = require('../Retorno');
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
                            errores.push(new _Error(yylloc.first_line, yylloc.first_column, "Lexico", "El simbolo: " + yytext + " no pertenece al lenguaje"))
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
            nodo : new Nodo("INICIO")
        }
        $$.nodo.agregarHijo($1.nodo);
        //$1.nodo.addPadre($$.nodo)
        return $$;
    };

Instrucciones
    : Instrucciones Instruccion
    {
        $$ = {
            nodo : new Nodo("INST")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($2.nodo);
    }
    | Instruccion
    {
        $$ = {
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
        $$ = {
            nodo : new Nodo("Inst")
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($2.nodo);
    }
    | InstruccionSentencia
    {
        $$ = {
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
            nodo : new Nodo("Declaracion")
        }
        $$.nodo.agregarHijo(new Nodo($2));
        $$.nodo.agregarHijo(new Nodo(Type[$4]))
        $$.nodo.agregarHijo(new Nodo('='));
        $$.nodo.agregarHijo($6.nodo);
    }
    | CONST IDENTIFICADOR '=' Expresion
    {
        $$ = {
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
            nodo : new Nodo('!')
        }
        $$.nodo.agregarHijo($2.nodo);
    }
    | Expresion '&&' Expresion
    {
        $$ = {
            nodo : new Nodo('&&')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '||' Expresion
    {
        $$ = {
            nodo : new Nodo('||') 
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '==' Expresion
    {
        $$ = {
            nodo : new Nodo ('==')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '!=' Expresion
    {
        $$ = {
            nodo : new Nodo('!=')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '<' Expresion
    {
        $$ = {
            nodo : new Nodo('<')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '>' Expresion
    {
        $$ = {
            nodo : new Nodo('>')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '<=' Expresion
    {
        $$ = {
            nodo : new Nodo('<=')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '>=' Expresion
    {
        $$ = {
            nodo : new Nodo('>=')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    |'-' Expresion %prec NEGATIVO
    {
        $$ = {
            nodo : new Nodo('-')
        }
        $$.nodo.agregarHijo($2.nodo);
    }
    | Expresion '+' Expresion
    {
        $$ = {
            nodo : new Nodo('+')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '-' Expresion
    {
        $$ = {
            nodo : new Nodo('-')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo)
    }
    | Expresion '*' Expresion
    {
        $$ = {
            nodo : new Nodo('*')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '/' Expresion
    {
        $$ = {
            nodo : new Nodo('/')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '%' Expresion
    {
        $$ = {
            nodo : new Nodo('%')
        }
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion '**' Expresion
    {
        $$ = {
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
            nodo : new Nodo($1)
        }
    }
    | CADENA
    {
        if($1.includes('\"'))
        {
            $$ = {
                nodo : new Nodo($1.replace(/['"]+/g, ''))
            }
        }
        else if($1.includes("'"))
        {
            $$ = {
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
            nodo : new Nodo($1)
        }
    }
    | FALSE
    {
        $$ = {
            nodo : new Nodo($1)
        }
    }
    | IDENTIFICADOR
    {
        $$ = {
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
            nodo : new Nodo("Imprimir")
        }
    }
    | 'CONSOLE' '.' 'LOG' '(' Listaparam ')'
    {
        $$ = {
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
        $$ = {
            nodo : new Nodo("Parametro")
        };
        $$.nodo.agregarHijo($1.nodo);
        $$.nodo.agregarHijo($3.nodo);
    }
    | Expresion{
        $$ = {
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