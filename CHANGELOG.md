## Version 0.6.1

- [#4](https://github.com/openscad/tree-sitter-openscad/pull/4) handled floats with a trailing period

## Version 0.6.0

### Grammar Changes

- handled distinction between `line_comment`s and `block_comment`s
- handled support for E notation in `float`s
- handled known escape sequences in `strings` with `escape_sequence` token
- added optional trailing semicolon to `include_statement` and `use_statement` node captures
- added `var_declaration` node to support `assignment`s that end in a semicolon: `x = true;`
- added `echo_expression` handling for cases where an echo statement is included in an echo expression:
  `x = echo("foo") true;`
- added `let_prefix` node to support let expressions in list comprehension contexts
- removed `modifier_chain` node
- `parameters_declaration` -> `parameters`
- `module_declaration` -> `module_item`

### Queries

- extended support for [highlight captures](https://github.com/nvim-treesitter/nvim-treesitter/blob/master/CONTRIBUTING.md#highlights
) in `module_item` and `module_call` as `@function.method`
- improved support for `modifier` highlighting with `@keyword.modifier` tag
- added highlighting for string escape sequences as `@string.escape`
- added `@variable.parameter` highlighting
- `dot_index_expression` property now uses the `@variable.member` tag

### Other
- added `justfile` for task running
- added `eslint-config-treesitter` for formatting `grammar.js`
- added support for tree-sitter 0.24.7
- added support for nix flakes

## Version 0.5.1

Bugfixes:
- allow trailing commas in module and function invocations (8af3261)

## Version 0.5.0

Features / Behavior Changes:
- different float and decimal (integer) nodes, now under supertype number
- expressions now have a public supertype node, called expression
- literals now have a public supertype node, called literal
- special variables (e.g. $preview) now use an inner identifier node to store their name
- function parameters now have their own node type to support certain syntax
  highlighting patterns

Bugfixes:
- stopped accepting backslash line continuations
