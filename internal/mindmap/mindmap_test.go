package mindmap

import (
	"testing"
)

func TestNew(t *testing.T) {
	mm := New()

	if mm.Root == nil {
		t.Error("Expected root node to be initialized")
	}

	if mm.Modified {
		t.Error("Expected new mindmap to not be modified")
	}

	if mm.CreatedAt.IsZero() {
		t.Error("Expected CreatedAt to be set")
	}
}

func TestMarkModified(t *testing.T) {
	mm := New()

	if mm.Modified {
		t.Error("Expected new mindmap to not be modified")
	}

	mm.MarkModified()

	if !mm.Modified {
		t.Error("Expected mindmap to be marked as modified")
	}
}

func TestFindNodeByID(t *testing.T) {
	mm := New()

	child1 := NewNode("Child 1")
	child1.SetMetadata("id", "child1")

	child2 := NewNode("Child 2")
	child2.SetMetadata("id", "child2")

	mm.Root.AddChild(child1)
	mm.Root.AddChild(child2)

	found := mm.FindNodeByID("child1")
	if found == nil {
		t.Error("Expected to find node with id 'child1'")
	}
	if found != nil && found.Label != "Child 1" {
		t.Errorf("Expected to find 'Child 1', got '%s'", found.Label)
	}

	notFound := mm.FindNodeByID("nonexistent")
	if notFound != nil {
		t.Error("Expected not to find node with id 'nonexistent'")
	}
}

func TestAllNodes(t *testing.T) {
	mm := New()

	child1 := NewNode("Child 1")
	child2 := NewNode("Child 2")
	grandchild := NewNode("Grandchild")

	mm.Root.AddChild(child1)
	mm.Root.AddChild(child2)
	child1.AddChild(grandchild)

	nodes := mm.AllNodes()

	// Should include root + 3 added nodes = 4 total
	if len(nodes) != 4 {
		t.Errorf("Expected 4 nodes, got %d", len(nodes))
	}
}

func TestCountNodes(t *testing.T) {
	mm := New()

	// Initially just root
	if mm.CountNodes() != 1 {
		t.Errorf("Expected 1 node (root), got %d", mm.CountNodes())
	}

	child1 := NewNode("Child 1")
	child2 := NewNode("Child 2")
	mm.Root.AddChild(child1)
	mm.Root.AddChild(child2)

	if mm.CountNodes() != 3 {
		t.Errorf("Expected 3 nodes, got %d", mm.CountNodes())
	}
}
