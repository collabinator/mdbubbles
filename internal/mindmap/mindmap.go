package mindmap

import (
	"fmt"
	"time"
)

// MindMap represents a complete mindmap structure
type MindMap struct {
	Root      *Node
	FilePath  string
	Modified  bool
	CreatedAt time.Time
	UpdatedAt time.Time
}

// New creates a new empty mindmap
func New() *MindMap {
	now := time.Now()
	return &MindMap{
		Root:      NewNode("Root"),
		Modified:  false,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// NewFromFile creates a mindmap by loading from a file
func NewFromFile(path string) (*MindMap, error) {
	// TODO: Implement file loading
	mm := New()
	mm.FilePath = path
	return mm, nil
}

// Save saves the mindmap to its file path
func (m *MindMap) Save() error {
	if m.FilePath == "" {
		return fmt.Errorf("no file path specified")
	}
	// TODO: Implement saving
	m.Modified = false
	m.UpdatedAt = time.Now()
	return nil
}

// SaveAs saves the mindmap to a specific file path
func (m *MindMap) SaveAs(path string) error {
	m.FilePath = path
	return m.Save()
}

// MarkModified marks the mindmap as modified
func (m *MindMap) MarkModified() {
	m.Modified = true
	m.UpdatedAt = time.Now()
}

// FindNodeByID finds a node by its ID in the metadata
func (m *MindMap) FindNodeByID(id string) *Node {
	return m.findNodeByIDRecursive(m.Root, id)
}

func (m *MindMap) findNodeByIDRecursive(node *Node, id string) *Node {
	if nodeID, ok := node.GetMetadata("id"); ok {
		if nodeID == id {
			return node
		}
	}
	
	for _, child := range node.Children {
		if found := m.findNodeByIDRecursive(child, id); found != nil {
			return found
		}
	}
	
	return nil
}

// AllNodes returns all nodes in the mindmap as a flat list
func (m *MindMap) AllNodes() []*Node {
	nodes := make([]*Node, 0)
	m.collectNodesRecursive(m.Root, &nodes)
	return nodes
}

func (m *MindMap) collectNodesRecursive(node *Node, nodes *[]*Node) {
	*nodes = append(*nodes, node)
	for _, child := range node.Children {
		m.collectNodesRecursive(child, nodes)
	}
}

// CountNodes returns the total number of nodes in the mindmap
func (m *MindMap) CountNodes() int {
	return m.Root.CountNodes()
}

// String returns a string representation of the mindmap
func (m *MindMap) String() string {
	return m.Root.DebugString(0)
}
