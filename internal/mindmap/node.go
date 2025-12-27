package mindmap

import (
	"fmt"
	"strings"
)

const MaxNodeLabelLength = 2048

// Node represents a single node in the mindmap tree
type Node struct {
	Label    string
	Children []*Node
	Parent   *Node
	Color    string
	Icon     string
	Metadata map[string]interface{}
}

// NewNode creates a new mindmap node with the given label
func NewNode(label string) *Node {
	if len(label) > MaxNodeLabelLength {
		label = label[:MaxNodeLabelLength] + "... [truncated]"
	}
	return &Node{
		Label:    label,
		Children: make([]*Node, 0),
		Metadata: make(map[string]interface{}),
	}
}

// AddChild adds a child node to this node
func (n *Node) AddChild(child *Node) {
	n.Children = append(n.Children, child)
	child.Parent = n
}

// AddTag adds a tag to this node's metadata
func (n *Node) AddTag(tag string) {
	tags, ok := n.Metadata["tags"].([]string)
	if !ok {
		tags = make([]string, 0)
	}
	
	// Check if tag already exists
	for _, t := range tags {
		if t == tag {
			return
		}
	}
	
	tags = append(tags, tag)
	n.Metadata["tags"] = tags
}

// RemoveTag removes a tag from this node's metadata
func (n *Node) RemoveTag(tag string) {
	tags, ok := n.Metadata["tags"].([]string)
	if !ok {
		return
	}
	
	newTags := make([]string, 0)
	for _, t := range tags {
		if t != tag {
			newTags = append(newTags, t)
		}
	}
	
	if len(newTags) > 0 {
		n.Metadata["tags"] = newTags
	} else {
		delete(n.Metadata, "tags")
	}
}

// GetTags returns all tags associated with this node
func (n *Node) GetTags() []string {
	tags, ok := n.Metadata["tags"].([]string)
	if !ok {
		return []string{}
	}
	return tags
}

// SetMetadata sets a metadata key-value pair
func (n *Node) SetMetadata(key string, value interface{}) {
	n.Metadata[key] = value
}

// GetMetadata gets a metadata value by key
func (n *Node) GetMetadata(key string) (interface{}, bool) {
	val, ok := n.Metadata[key]
	return val, ok
}

// String returns a string representation of the node
func (n *Node) String() string {
	return n.Label
}

// DebugString returns a detailed string representation for debugging
func (n *Node) DebugString(indent int) string {
	var sb strings.Builder
	prefix := strings.Repeat("  ", indent)
	
	sb.WriteString(fmt.Sprintf("%s- %s", prefix, n.Label))
	if len(n.Metadata) > 0 {
		sb.WriteString(fmt.Sprintf(" (metadata: %v)", n.Metadata))
	}
	sb.WriteString("\n")
	
	for _, child := range n.Children {
		sb.WriteString(child.DebugString(indent + 1))
	}
	
	return sb.String()
}

// CountNodes returns the total number of nodes in the tree rooted at this node
func (n *Node) CountNodes() int {
	count := 1
	for _, child := range n.Children {
		count += child.CountNodes()
	}
	return count
}
