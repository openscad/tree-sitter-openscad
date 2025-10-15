# Regenerates tree-sitter bindings and generated manifests
export def regen [] {
    # remove all top level files as defined below:
    # https://github.com/tree-sitter/tree-sitter/blob/v0.25.9/docs/src/cli/init.md#binding-files
    (
      rm --force
        # C/C++
        Makefile
        CMakeLists.txt
        bindings/c/tree_sitter/tree-sitter-language.h
        bindings/c/tree-sitter-language.pc
        # Go
        go.mod
        bindings/go/binding.go
        bindings/go/binding_test.go
        # Node
        binding.gyp
        package.json
        bindings/node/binding.cc
        bindings/node/index.js
        bindings/node/index.d.ts
        bindings/node/binding_test.js
        # Python
        pyproject.toml
        setup.py
        bindings/python/tree_sitter_language/binding.c
        bindings/python/tree_sitter_language/__init__.py
        bindings/python/tree_sitter_language/__init__.pyi
        bindings/python/tree_sitter_language/py.typed
        bindings/python/tests/test_binding.py

        # Rust
        Cargo.toml
        bindings/rust/lib.rs
        bindings/rust/build.rs
        # Swift
        Package.swift
        bindings/swift/TreeSitterLanguage/language.h
        bindings/swift/TreeSitterLanguageTests/TreeSitterLanguageTests.swift
    )
    tree-sitter init --update
    return
}
