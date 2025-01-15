build_dylib:
  gcc -shared -o build/parser.so -I./src src/parser.c -Os

grammar_fmt:
  eslint --fix grammar.js
