/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
module.exports = grammar({
  name: 'openscad',

  rules: {
    type: $ => $.value,
    value: _ => "value",
  }
});
