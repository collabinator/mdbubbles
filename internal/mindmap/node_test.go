package mindmap

import (
	"testing"
)

func TestNewNode(t *testing.T) {
	node := NewNode("Test Node")

	if node.Label != "Test Node" {
		t.Errorf("Expected label 'Test Node', got '%s'", node.Label)
	}

	if len(node.Children) != 0 {
		t.Errorf("Expected 0 children, got %d", len(node.Children))
	}

	if node.Parent != nil {
		t.Error("Expected parent to be nil")
	}
}

func TestAddChild(t *testing.T) {
	parent := NewNode("Parent")
	child := NewNode("Child")

	parent.AddChild(child)

	if len(parent.Children) != 1 {
		t.Errorf("Expected 1 child, got %d", len(parent.Children))
	}

	if child.Parent != parent {
		t.Error("Expected child's parent to be set")
	}
}

func TestAddTag(t *testing.T) {
	node := NewNode("Test Node")

	node.AddTag("important")
	node.AddTag("work")

	tags := node.GetTags()
	if len(tags) != 2 {
		t.Errorf("Expected 2 tags, got %d", len(tags))
	}

	// Test duplicate tag
	node.AddTag("important")
	tags = node.GetTags()
	if len(tags) != 2 {
		t.Errorf("Expected 2 tags after duplicate, got %d", len(tags))
	}
}

func TestRemoveTag(t *testing.T) {
	node := NewNode("Test Node")

	node.AddTag("tag1")
	node.AddTag("tag2")
	node.AddTag("tag3")

	node.RemoveTag("tag2")

	tags := node.GetTags()
	if len(tags) != 2 {
		t.Errorf("Expected 2 tags after removal, got %d", len(tags))
	}

	for _, tag := range tags {
		if tag == "tag2" {
			t.Error("Tag 'tag2' should have been removed")
		}
	}
}

func TestSetGetMetadata(t *testing.T) {
	node := NewNode("Test Node")

	node.SetMetadata("priority", "high")
	node.SetMetadata("status", "active")

	val, ok := node.GetMetadata("priority")
	if !ok {
		t.Error("Expected to find 'priority' metadata")
	}
	if val != "high" {
		t.Errorf("Expected 'high', got '%v'", val)
	}

	_, ok = node.GetMetadata("nonexistent")
	if ok {
		t.Error("Expected not to find 'nonexistent' metadata")
	}
}

func TestNodeCountNodes(t *testing.T) {
	root := NewNode("Root")
	child1 := NewNode("Child 1")
	child2 := NewNode("Child 2")
	grandchild := NewNode("Grandchild")

	root.AddChild(child1)
	root.AddChild(child2)
	child1.AddChild(grandchild)

	count := root.CountNodes()
	if count != 4 {
		t.Errorf("Expected 4 nodes, got %d", count)
	}
}

func TestNodeLabelTruncation(t *testing.T) {
	longLabel := make([]byte, MaxNodeLabelLength+100)
	for i := range longLabel {
		longLabel[i] = 'a'
	}

	node := NewNode(string(longLabel))

	if len(node.Label) > MaxNodeLabelLength+20 { // Allow for truncation message
		t.Errorf("Expected label to be truncated, got length %d", len(node.Label))
	}
}
