green := "\\033[32m"
yellow := "\\033[33m"
reset := "\\033[0m"

# compile dylib without CLI dependency
build-gcc:
    gcc -shared -o build/parser.so -I./src src/parser.c -Os

# tree-sitter is not needed to build dylibs but is easier for development
build-dev:
    tree-sitter build

test *args: gen
    tree-sitter test {{ args }}

gen:
    tree-sitter generate

# update test cases to reflect grammar.js changes
update-tests: gen
    tree-sitter test -u

lint:
    eslint grammar.js

fmt:
    eslint --fix grammar.js
    topiary fmt ./queries/*.scm
    topiary fmt ./examples/*.scad
    just --fmt --unstable

# show visual syntax graph
show-graph:
    tree-sitter test --debug-graph --open-log

# updates node package.json to latest available
dep-latest:
    npm outdated --parseable | awk -F: '{ printf("%s ", $4); }' | xargs npm install
    cargo upgrade && cargo update

# updates node package.json to latest available
dep-outdated:
    @printf '{{ yellow }}=={{ reset }}NPM{{ yellow }}=={{ reset }}\n'
    npm outdated || true # `npm outdated` returns exit code 1 on finding outdated stuff ?!
    @printf '{{ yellow }}={{ reset }}Cargo{{ yellow }}={{ reset }}\n'
    cargo outdated -d 1
    @printf '{{ yellow }}======={{ reset }}\n'
