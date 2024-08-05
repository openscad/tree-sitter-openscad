package tree_sitter_openscad_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-openscad"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_openscad.Language())
	if language == nil {
		t.Errorf("Error loading Openscad grammar")
	}
}
