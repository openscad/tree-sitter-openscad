green := "\\033[32m"
yellow := "\\033[33m"
reset := "\\033[0m"

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

# updates node package.json to latest available
dep-latest:
  npm outdated --parseable | awk -F: '{ printf("%s ", $4); }' | xargs npm install
  cargo upgrade && cargo update

# updates node package.json to latest available
dep-outdated:
  @printf '{{yellow}}=={{reset}}NPM{{yellow}}=={{reset}}\n'
  @npm outdated
  @printf '{{yellow}}={{reset}}Cargo{{yellow}}={{reset}}\n'
  @cargo outdated -d 1
  @printf '{{yellow}}======={{reset}}\n'
