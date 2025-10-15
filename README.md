# tree-sitter-openscad

[![npm][npm]](https://www.npmjs.com/package/@openscad/tree-sitter-openscad)
[![crates][crates]](https://crates.io/crates/tree-sitter-openscad-ng)
<!-- [![pypi][pypi]](https://pypi.org/project/tree-sitter-openscad/) -->

OpenSCAD grammar for the tree-sitter parsing library

## Developer quickstart

Most development of tree-sitter parsers is done using nodejs and npm. You can find the instructions on how to set that up here: https://tree-sitter.github.io/tree-sitter/creating-parsers

The TLDR would be:

1. Ensure you have `npm` and `just` installed.
1. Install `npm` (there are many ways, pick your poison)
1. From the source directory, run `npm install` to get all the dependencies
1. Get the [`tree-sitter` CLI executable](https://github.com/tree-sitter/tree-sitter/blob/master/cli/README.md)
1. `tree-sitter generate`/`just gen` to build your changes
1. `tree-sitter test`/`just test` to make sure you didn't unintentionally break any of the existing test cases
1. Add a new test case covering your change (instructions here: https://tree-sitter.github.io/tree-sitter/creating-parsers#command-test)

[npm]: https://img.shields.io/npm/v/%40openscad%2Ftree-sitter-openscad?logo=npm
[crates]: https://img.shields.io/crates/v/tree-sitter-openscad-ng?logo=rust
<!-- [pypi]: https://img.shields.io/pypi/v/tree-sitter-openscad?logo=pypi&logoColor=ffd242 -->
