package parser

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strings"

	"github.com/collabinator/mdbubbles/internal/mindmap"
)

var (
	tagRegex  = regexp.MustCompile(`#([a-zA-Z0-9_-]+)`)
	kvRegex   = regexp.MustCompile(`@([a-zA-Z0-9_-]+):([^\s]+)`)
	idRegex   = regexp.MustCompile(`\[id:([^\]]+)\]`)
	linkRegex = regexp.MustCompile(`\[([^\]]+)\]\(([^\)]+)\)`)
)

// Parser handles parsing and serialization of mindmap files
type Parser struct{}

// NewParser creates a new parser instance
func NewParser() *Parser {
	return &Parser{}
}

// ParseFile parses a mindmap file and returns a MindMap
func (p *Parser) ParseFile(path string) (*mindmap.MindMap, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	mm := mindmap.New()
	mm.FilePath = path

	scanner := bufio.NewScanner(file)
	var currentNode *mindmap.Node = mm.Root
	var indentStack []*mindmap.Node = []*mindmap.Node{mm.Root}
	lastIndent := -1

	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) == "" {
			continue
		}

		indent := countLeadingSpaces(line)
		content := strings.TrimSpace(line)

		// Remove bullet points
		content = strings.TrimPrefix(content, "- ")
		content = strings.TrimPrefix(content, "* ")
		content = strings.TrimPrefix(content, "+ ")

		// Create new node
		node := mindmap.NewNode(content)

		// Parse inline metadata
		p.parseInlineMetadata(node, content)

		// Determine parent based on indentation
		if indent > lastIndent {
			// Child of current node
			currentNode.AddChild(node)
			indentStack = append(indentStack, currentNode)
		} else if indent == lastIndent {
			// Sibling of current node
			if len(indentStack) > 0 {
				parent := indentStack[len(indentStack)-1]
				parent.AddChild(node)
			}
		} else {
			// Go back up the tree
			for indent < lastIndent && len(indentStack) > 1 {
				indentStack = indentStack[:len(indentStack)-1]
				lastIndent -= 2
			}
			if len(indentStack) > 0 {
				parent := indentStack[len(indentStack)-1]
				parent.AddChild(node)
			}
		}

		currentNode = node
		lastIndent = indent
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("error reading file: %w", err)
	}

	return mm, nil
}

// parseInlineMetadata extracts tags, key-value pairs, and IDs from node content
func (p *Parser) parseInlineMetadata(node *mindmap.Node, content string) {
	// Extract tags
	tags := tagRegex.FindAllStringSubmatch(content, -1)
	for _, match := range tags {
		if len(match) > 1 {
			node.AddTag(match[1])
		}
	}

	// Extract key-value pairs
	kvPairs := kvRegex.FindAllStringSubmatch(content, -1)
	for _, match := range kvPairs {
		if len(match) > 2 {
			node.SetMetadata(match[1], match[2])
		}
	}

	// Extract ID
	ids := idRegex.FindAllStringSubmatch(content, -1)
	for _, match := range ids {
		if len(match) > 1 {
			node.SetMetadata("id", match[1])
		}
	}
}

// WriteFile writes a mindmap to a file
func (p *Parser) WriteFile(mm *mindmap.MindMap, path string) error {
	file, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("failed to create file: %w", err)
	}
	defer file.Close()

	writer := bufio.NewWriter(file)
	defer writer.Flush()

	// Write the tree starting from root's children
	for _, child := range mm.Root.Children {
		if err := p.writeNode(writer, child, 0); err != nil {
			return err
		}
	}

	return nil
}

func (p *Parser) writeNode(writer *bufio.Writer, node *mindmap.Node, depth int) error {
	indent := strings.Repeat("  ", depth)
	
	// Write the node label with bullet point
	line := fmt.Sprintf("%s- %s\n", indent, node.Label)
	if _, err := writer.WriteString(line); err != nil {
		return err
	}

	// Write children recursively
	for _, child := range node.Children {
		if err := p.writeNode(writer, child, depth+1); err != nil {
			return err
		}
	}

	return nil
}

func countLeadingSpaces(s string) int {
	count := 0
	for _, ch := range s {
		if ch == ' ' {
			count++
		} else {
			break
		}
	}
	return count
}

// ExtractTags returns all unique tags from a mindmap
func ExtractTags(mm *mindmap.MindMap) []string {
	tagSet := make(map[string]bool)
	nodes := mm.AllNodes()
	
	for _, node := range nodes {
		tags := node.GetTags()
		for _, tag := range tags {
			tagSet[tag] = true
		}
	}
	
	tags := make([]string, 0, len(tagSet))
	for tag := range tagSet {
		tags = append(tags, tag)
	}
	
	return tags
}

// ExtractLinks returns all links with IDs from a mindmap
func ExtractLinks(mm *mindmap.MindMap) map[string]*mindmap.Node {
	links := make(map[string]*mindmap.Node)
	nodes := mm.AllNodes()
	
	for _, node := range nodes {
		if id, ok := node.GetMetadata("id"); ok {
			if idStr, ok := id.(string); ok {
				links[idStr] = node
			}
		}
	}
	
	return links
}
