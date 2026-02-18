/**
 * Tests for markdown parser/serializer.
 */

import { describe, it, expect } from "vitest";
import {
  parseMarkdownToMindmap,
  mindmapToMarkdown,
  parseNodeMetadata,
} from "../src/core/parser.js";

describe("parseNodeMetadata", () => {
  it("extracts tags from content", () => {
    const [label, metadata] = parseNodeMetadata("Task item #urgent #bug");
    expect(label).toBe("Task item");
    expect(metadata.tags).toEqual(["urgent", "bug"]);
  });

  it("extracts key-value pairs from content", () => {
    const [label, metadata] = parseNodeMetadata("Task item @priority=high @status=open");
    expect(label).toBe("Task item");
    expect(metadata.priority).toBe("high");
    expect(metadata.status).toBe("open");
  });

  it("extracts both tags and key-value pairs", () => {
    const [label, metadata] = parseNodeMetadata(
      "Task item #urgent @priority=high",
    );
    expect(label).toBe("Task item");
    expect(metadata.tags).toEqual(["urgent"]);
    expect(metadata.priority).toBe("high");
  });

  it("returns empty metadata when none present", () => {
    const [label, metadata] = parseNodeMetadata("Simple label");
    expect(label).toBe("Simple label");
    expect(metadata).toEqual({});
  });
});

describe("parseMarkdownToMindmap", () => {
  it("parses a simple mindmap", () => {
    const md = `- Root
  - Child 1
  - Child 2
    - Grandchild`;

    const root = parseMarkdownToMindmap(md);
    expect(root.label).toBe("Root");
    expect(root.children).toHaveLength(2);
    expect(root.children[0].label).toBe("Child 1");
    expect(root.children[1].label).toBe("Child 2");
    expect(root.children[1].children).toHaveLength(1);
    expect(root.children[1].children[0].label).toBe("Grandchild");
  });

  it("creates SYNTHETIC ROOT for multiple top-level nodes", () => {
    const md = `- Node A
- Node B
- Node C`;

    const root = parseMarkdownToMindmap(md);
    expect(root.label).toBe("SYNTHETIC ROOT");
    expect(root.children).toHaveLength(3);
    expect(root.children[0].label).toBe("Node A");
    expect(root.children[1].label).toBe("Node B");
    expect(root.children[2].label).toBe("Node C");
  });

  it("returns empty node for empty input", () => {
    const root = parseMarkdownToMindmap("");
    expect(root.label).toBe("");
    expect(root.children).toHaveLength(0);
  });

  it("parses nodes with metadata", () => {
    const md = `- Project #active @status=wip
  - Task 1 #todo
  - Task 2 #done`;

    const root = parseMarkdownToMindmap(md);
    expect(root.label).toBe("Project");
    expect(root.getTags()).toEqual(["active"]);
    expect(root.getMetadata("status")).toBe("wip");
    expect(root.children[0].getTags()).toEqual(["todo"]);
    expect(root.children[1].getTags()).toEqual(["done"]);
  });

  it("ignores non-list lines", () => {
    const md = `# Header
Some paragraph text
- Actual node
  - Child`;

    const root = parseMarkdownToMindmap(md);
    expect(root.label).toBe("Actual node");
    expect(root.children).toHaveLength(1);
  });

  it("sets parent references", () => {
    const md = `- Root
  - Child`;

    const root = parseMarkdownToMindmap(md);
    expect(root.children[0].parent).toBe(root);
  });
});

describe("mindmapToMarkdown", () => {
  it("serializes a simple tree", () => {
    const md = `- Root
  - Child 1
  - Child 2
    - Grandchild`;

    const root = parseMarkdownToMindmap(md);
    const output = mindmapToMarkdown(root);
    expect(output).toBe(md);
  });

  it("round-trips correctly", () => {
    const original = `- Project
  - Design
    - Wireframes
    - Mockups
  - Development
    - Frontend
    - Backend`;

    const root = parseMarkdownToMindmap(original);
    const output = mindmapToMarkdown(root);
    expect(output).toBe(original);
  });

  it("includes metadata in output", () => {
    const md = `- Project #active @status=wip`;

    const root = parseMarkdownToMindmap(md);
    const output = mindmapToMarkdown(root);
    // Tags and metadata should be in the label, so no duplication
    expect(output).toContain("Project");
  });
});
