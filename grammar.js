/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * Creates a rule to match one or more of the rules separated by the separator
 * and optionally adds a trailing separator (default is false).
 *
 * @param {Rule} rule
 * @param {string} separator - The separator to use.
 * @param {boolean?} trailing_separator - The trailing separator to use.
 *
 * @returns {SeqRule}
 */
const listSeq = (rule, separator, trailing_separator = false) =>
  trailing_separator ?
    seq(rule, repeat(seq(separator, rule)), optional(separator)) :
    seq(rule, repeat(seq(separator, rule)));

/**
 * Creates a rule to match one or more of the rules separated by a comma
 * and optionally adds a trailing separator (default is false).
 *
 * @param {Rule} rule
 * @param {boolean?} trailing_separator - The trailing separator to use.
 *
 * @returns {SeqRule}
 */
function commaSep1(rule, trailing_separator = false) {
  // return seq(rule, repeat(seq(',', rule)))
  return listSeq(rule, ',', trailing_separator);
}

/**
 * Creates a rule to optionally match one or more of the rules separated
 * by a comma and optionally adds a trailing separator (default is false).
 *
 * @param {Rule} rule
 * @param {boolean?} trailing_separator - The trailing separator to use.
 *
 * @returns {ChoiceRule}
 */
function commaSep(rule, trailing_separator = false) {
  return optional(commaSep1(rule, trailing_separator));
}

/**
 * This callback should take a rule and places it in between a group (e.g. parentheses).
 *
 * @callback GroupingCallback
 * @param {Rule} rule
 *
 * @returns {SeqRule}
 */

/**
 * Creates a rule that accepts another rule with optional grouping symbols.
 *
 * @param {GroupingCallback} grouping
 * @param {Rule} rule
 *
 * @returns {ChoiceRule}
 */
function opt_grouping(grouping, rule) {
  return choice(grouping(rule), rule);
}

/**
 * Creates a rule to match a rule surrounded by parentheses.
 *
 * @param {Rule} rule
 *
 * @returns {SeqRule}
 */
function parens(rule) {
  return seq('(', rule, ')');
}

/**
 * Creates a rule to match a rule surrounded by brackets.
 *
 * @param {Rule} rule
 *
 * @returns {SeqRule}
 */
function brackets(rule) {
  return seq('[', rule, ']');
}

/**
 * Creates a rule that matches a keyword followed by its "effect",
 * and then a block.
 *
 * @param {string} keyword
 * @param {Rule} effect
 * @param {Rule} block
 *
 * @returns {SeqRule}
 */
function bodied_block(keyword, effect, block) {
  return seq(keyword, effect, field('body', block));
}

/**
 * Creates a rule that matches a binary operator in between two rules.
 * The two rules are then assigned field names left and right respectively.
 *
 * @param {string} operator
 * @param {Rule} rule
 *
 * @returns {SeqRule}
 */
function binary_operator(operator, rule) {
  return seq(field('left', rule), operator, field('right', rule));
}

module.exports = grammar({
  name: 'openscad',

  extras: $ => [
    $.block_comment,
    $.line_comment,
    /\s/,
  ],

  supertypes: $ => [
    $.literal,
    $.expression,
    $.number,
    $.statement,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat(choice($.use_statement, $._item)),

    // expressions are syntax trees that result in values (not objects)
    expression: $ => choice(
      $.parenthesized_expression,
      $.unary_expression,
      $.binary_expression,
      $.ternary_expression,
      $.let_expression,
      $.function_call,
      $.index_expression,
      $.dot_index_expression,
      $.assert_expression,
      $.literal,
      $._variable_name,
    ),

    // statements are language constructs that can create objects
    statement: $ => choice(
      $.for_block,
      $.intersection_for_block,
      $.if_block,
      $.let_block,
      $.assign_block,
      $.union_block,
      $.modifier_chain,
      $.transform_chain,
      $.include_statement,
      $.assert_statement,
      ';',
    ),
    _item: $ => choice(
      $.var_declaration,
      $.statement,
      $.module_item,
      $.function_item,
    ),

    // TODO: segment assignment so that parameters can have the LHS highlighted as @parameter
    // and the RHS as either @variable or @constant
    parameter: $ => choice(
      $._variable_name,
      $.assignment,
    ),

    parameters: $ => seq(
      '(',
      sepBy(',', $.parameter),
      optional(','),
      ')',
    ),

    // variable declaration
    var_declaration: $ =>
      seq($.assignment, ';'),

    // modules
    module_item: $ => seq(
      'module',
      field('name', $.identifier),
      field('parameters', $.parameters),
      field('body', $.statement),
    ),

    // function_item diffeers from  $.function_lit which defines anonymous functions/ function literals:
    // https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/User-Defined_Functions_and_Modules#Function_literals
    function_item: $ => seq(
      'function',
      field('name', $.identifier),
      field('parameters', $.parameters),
      '=', $.expression,
      ';',
    ),


    // use/include statements
    // These are called statements, but use statements aren't included in
    // $.statement because they can't be used in all the same places as other
    // statements
    include_statement: $ => seq('include', $.include_path),
    use_statement: $ => seq('use', $.include_path),
    include_path: _ => /<[^>]*>/,
    assignment: $ => seq(
      field('name', $._variable_name),
      '=',
      field('value', $.expression),
    ),
    union_block: $ => seq(
      '{',
      repeat($._item),
      '}',
    ),

    // control-flow blocks
    for_block: $ => bodied_block(
      'for',
      $.assignments,
      $.statement,
    ),
    intersection_for_block: $ => bodied_block(
      'intersection_for',
      $.assignments,
      $.statement,
    ),
    let_block: $ => bodied_block(
      'let',
      $.assignments,
      $.statement,
    ),
    assign_block: $ => bodied_block(
      'assign',
      $.assignments,
      $.statement,
    ),
    if_block: $ => prec.right(seq(
      'if',
      field('condition', $.parenthesized_expression),
      field('consequence', $.statement),
      optional(field('alternative', seq('else', $.statement))),
    )),

    // function calls
    modifier_chain: $ => seq($.modifier, $.statement),
    modifier: _ => choice('*', '!', '#', '%'),
    transform_chain: $ => seq($.module_call, $.statement),
    module_call: $ => seq(
      field('name', $.identifier),
      field('arguments', $.arguments),
    ),
    arguments: $ => parens(commaSep(choice($.expression, $.assignment), true)),

    assignments: $ => seq('(', sepBy(',', $.assignment), ')'),
    parenthesized_expression: $ => parens($.expression),
    condition_update_clause: $ => parens(seq(
      field('initializer', commaSep($.assignment)), ';',
      field('condition', $.expression), ';',
      field('update', commaSep($.assignment)),
    )),

    let_expression: $ => bodied_block('let', $.assignments, $.expression),

    // atoms that create immediate values
    literal: $ => choice(
      $.string,
      $.number,
      $.boolean,
      $.undef,
      $.function_lit,
      $.range,
      $.list,
    ),

    // compound atoms that are still literals
    function_lit: $ => seq(
      'function',
      field('parameters', $.parameters),
      field('body', $.expression),
    ),
    range: $ => seq(
      '[',
      field('start', $.expression),
      optional(seq(':', field('increment', $.expression))),
      ':', field('end', $.expression),
      ']',
    ),

    list: $ => brackets(seq(commaSep($._list_cell, true))),
    _list_cell: $ => choice($.expression, $.each, $.list_comprehension),
    _comprehension_cell: $ => choice(
      $.expression,
      opt_grouping(parens, $.each),
      opt_grouping(parens, $.list_comprehension),
    ),
    each: $ => seq('each', choice($.expression, $.list_comprehension)),

    list_comprehension: $ => seq(
      choice($.for_clause, $.if_clause),
    ),
    for_clause: $ => seq('for',
      choice($.assignments, $.condition_update_clause),
      $._comprehension_cell,
    ),
    if_clause: $ => prec.right(seq(
      'if',
      field('condition', $.parenthesized_expression),
      field('consequence', $._comprehension_cell),
      optional(
        seq('else', field('alternative', $._comprehension_cell)),
      ),
    )),

    // operations on expressions
    function_call: $ => prec(10,
      seq(
        field('name', $.expression),
        field('arguments', $.arguments),
      )),
    index_expression: $ => prec(10, seq(
      field('value', $.expression),
      seq('[', $.expression, ']'),
    )),
    dot_index_expression: $ => prec(10, seq(
      field('value', $.expression), '.',
      field('index', $.identifier),
    )),
    unary_expression: $ => choice(
      prec(9, seq('!', $.expression)),
      prec.left(6, seq('-', $.expression)),
      prec.left(6, seq('+', $.expression)),
    ),
    binary_expression: $ => choice(
      prec.left(2, binary_operator('||', $.expression)),
      prec.left(3, binary_operator('&&', $.expression)),
      prec.left(4, binary_operator('==', $.expression)),
      prec.left(4, binary_operator('!=', $.expression)),
      prec.left(5, binary_operator('<', $.expression)),
      prec.left(5, binary_operator('>', $.expression)),
      prec.left(5, binary_operator('<=', $.expression)),
      prec.left(5, binary_operator('>=', $.expression)),
      prec.left(6, binary_operator('+', $.expression)),
      prec.left(6, binary_operator('-', $.expression)),
      prec.left(7, binary_operator('*', $.expression)),
      prec.left(7, binary_operator('/', $.expression)),
      prec.left(7, binary_operator('%', $.expression)),
      prec.left(8, binary_operator('^', $.expression)),
    ),
    ternary_expression: ($) => prec.right(1, seq(
      field('condition', $.expression), '?',
      field('consequence', $.expression), ':',
      field('alternative', $.expression),
    )),

    // Asserts are unusual in that they can be inserted into both statements and
    // expressions. We want to treat these two cases differently: assertions in
    // the middle of a statement can only be followed by a statement, and the
    // same applies to expressions. So, this creates two parsers for the two
    // distinct conditions, but uses a shared parser for the text of the assert
    // clause itself.
    _assert_clause: $ => seq('assert', parens(
      optional(seq(field('condition', $.expression),
        optional(seq(',', field('message', $.expression),
          optional(seq(',', field('trailing_args', commaSep1($.expression)))),
        )),
      )),
    )),
    assert_statement: $ => seq($._assert_clause, $.statement),
    assert_expression: $ => seq($._assert_clause, $.expression),

    // valid names for variables, functions, and modules
    identifier: _ => /[a-zA-Z_]\w*/,
    special_variable: $ => seq('$', $.identifier),
    _variable_name: $ => choice($.identifier, $.special_variable),
    // https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/General#Strings
    // const ESCAPE_SEQUENCE = token(/\\([nrt"\\]|(\r?\n))/);
    escape_sequence: _ => token.immediate(
      seq('\\',
        choice(
          /[^xu]/,
          /[nrt"\\]/,
          /u[0-9a-fA-F]{4}/,
          /u\{[0-9a-fA-F]+\}/,
          /x[0-9a-fA-F]{2}/,
        ),
      )),


    string: $ => seq(
      '"',
      repeat(choice(
        token.immediate(prec(1, /[^"\\]+/)),
        $.escape_sequence,
      )),
      '"',
    ),

    number: $ => choice($.decimal, $.float),
    decimal: _ => token(/-?\d+/),
    float: _ => token(/-?(\d+(\.\d+)?|\.\d+)(e-?\d+)?/),
    boolean: _ => choice('true', 'false'),
    undef: _ => 'undef',

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    block_comment: _ =>
      token(
        seq(
          '/*',
          /[^*]*\*+([^/*][^*]*\*+)*/,
          '/',
        )),
    line_comment: $ => seq('//', /.*/),
  },
});

/**
 * Creates a rule to match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @returns {SeqRule}
 */
function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}


/**
 * Creates a rule to optionally match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @returns {ChoiceRule}
 */
function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule));
}
