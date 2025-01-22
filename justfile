build_gcc:
  gcc -shared -o build/parser.so -I./src src/parser.c -Os

# tree-sitter is not needed to build dylibs but is easier for developMent
build_dev:
  tree-sitter build

fmt:
  eslint --fix grammar.js

test: gen
  tree-sitter test

gen:
  tree-sitter generate

# update test cases to reflect grammar.js changes
update-corpus: gen
  tree-sitter test -u

lint:
  eslint grammar.js
