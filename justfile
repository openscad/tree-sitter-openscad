build_dylib:
  gcc -shared -o build/parser.so -I./src src/parser.c -Os
