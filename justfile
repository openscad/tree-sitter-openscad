green := "\\033[32m"
yellow := "\\033[33m"
reset := "\\033[0m"

# regenerate tree-sitter bindings
regen:
    nu --commands "use ts.nu; ts regen"

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

# Lint all the things
lint:
    npx eslint grammar.js
    typos
    just --fmt --unstable --check

fmt:
    npx eslint --fix grammar.js
    ts_query_ls format ./queries
    # topiary fmt ./examples/*.wit
    just --fmt --unstable
    nixfmt flake.nix shell.nix

# show visual syntax graph
show-graph:
    tree-sitter test --debug-graph --open-log

# updates node package.json to latest available
update:
    pnpm outdated --format json | jq  'keys[]' | xargs pnpm update
    cargo upgrade --incompatible && cargo update

# updates node package.json to latest available
outdated:
    @printf '{{ yellow }}=={{ reset }}NPM{{ yellow }}=={{ reset }}\n'
    npx outdated -y || true # `npoutdated` returns exit code 1 on finding outdated stuff ?!
    @printf '{{ yellow }}={{ reset }}Cargo{{ yellow }}={{ reset }}\n'
    cargo outdated -d 1
    @printf '{{ yellow }}======={{ reset }}\n'
