build_dylib:
  gcc -shared -o build/parser.so -I./src src/parser.c -Os

fmt:
  eslint --fix grammar.js

test: gen
  tree-sitter test

gen:
  tree-sitter generate
