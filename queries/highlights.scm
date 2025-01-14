; Includes
(identifier) @variable

"include" @keyword.import

(include_path) @string.special.path

; Functions

(function_item
  (identifier) @function
)
(function_item
  parameters: (parameters (parameter (assignment value: (_) @constant)))
)
(function_call name: (identifier) @function.call)
(function_call
  arguments: (arguments (assignment name: _ @variable.parameter))
)
; for the puroposes of distintion since modules are "coloured" impure functions, we will treat them as methods
(module_item (identifier) @function.method)
(module_item
  parameters: (parameters (parameter (assignment value: (_) @constant)))
)
(module_call name: (identifier) @function.method.call)
(module_call
  arguments: (arguments (assignment name: _ @variable.parameter))
)

; Variables
(parameter
  [_ @variable.parameter (assignment name: _ @variable.parameter)]
)
(special_variable) @variable.builtin

; TODO: Types/Properties/

; Keywords
[
  "module"
  "function"
  "let"
  "assign"
  "use"
  "each"
] @keyword

; Operators
[
  "||"
  "&&"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "+"
  "-"
  "*"
  "/"
  "%"
  "^"
  "!"
  ":"
  "="
] @operator

; Builtins
(module_call
  name: (identifier) @function.builtin
  (#any-of? @function.builtin
    "union"
    "difference"
    "intersection"
    "circle"
    "square"
    "polygon"
    "text"
    "projection"
    "sphere"
    "cube"
    "cylinder"
    "polyhedron"
    "linear_extrude"
    "rotate_extrude"
    "surface"
    "translate"
    "rotate"
    "scale"
    "resize"
    "mirror"
    "multmatrix"
    "color"
    "offset"
    "hull"
    "minkowski"
  )
)
(
  (identifier) @identifier
  (#eq? @identifier "PI")
) @constant.builtin

; Conditionals
[
  "if"
  "else"
] @keyword.conditional
(ternary_expression
  ["?" ":"] @keyword.conditional.ternary
)

; Repeats
[
  "for"
  "intersection_for"
] @keyword.repeat

; Literals
(decimal) @number
(float) @number.float
(string) @string
(escape_sequence) @string.escape
(boolean) @boolean

; Misc
[
  "#"
] @punctuation.special
["{" "}"] @punctuation.bracket
["(" ")"] @punctuation.bracket
["[" "]"] @punctuation.bracket
[
  ";"
  ","
  "."
] @punctuation.delimiter

; Comments
[(line_comment) (block_comment)] @comment @spell
