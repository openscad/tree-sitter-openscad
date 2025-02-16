package tree_sitter_openscad_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_openscad "github.com/bollian/tree-sitter-openscad/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_openscad.Language())
	if language == nil {
		t.Errorf("Error loading Openscad grammar")
	}
}
