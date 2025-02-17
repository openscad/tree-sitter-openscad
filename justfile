# compile dylib without CLI dependency
build_gcc:
  gcc -shared -o build/parser.so -I./src src/parser.c -Os

# tree-sitter is not needed to build dylibs but is easier for development
build_dev:
  tree-sitter build

test: gen
  tree-sitter test

gen:
  tree-sitter generate

# update test cases to reflect grammar.js changes
update-tests: gen
  tree-sitter test -u

lint:
  eslint grammar.js

fmt:
  eslint --fix grammar.js

# show visual syntax graph
show-graph:
  tree-sitter test --debug-graph --open-log
