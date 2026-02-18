/**
 * Tests for MindMapNode — core tree data structure.
 */

import { describe, it, expect } from "vitest";
import { MindMapNode, MAX_NODE_LABEL_LENGTH } from "../src/core/mindmap.js";

describe("MindMapNode", () => {
  it("creates a node with a label", () => {
    const node = new MindMapNode("Root");
    expect(node.label).toBe("Root");
    expect(node.children).toEqual([]);
    expect(node.parent).toBeNull();
    expect(node.metadata).toEqual({});
  });

  it("truncates labels exceeding max length", () => {
    const longLabel = "x".repeat(MAX_NODE_LABEL_LENGTH + 100);
    const node = new MindMapNode(longLabel);
    expect(node.label.length).toBeLessThanOrEqual(
      MAX_NODE_LABEL_LENGTH + "... [truncated]".length,
    );
    expect(node.label).toContain("... [truncated]");
  });

  it("adds children with parent references", () => {
    const parent = new MindMapNode("Parent");
    const child = new MindMapNode("Child");
    parent.addChild(child);

    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toBe(child);
    expect(child.parent).toBe(parent);
  });

  it("manages tags", () => {
    const node = new MindMapNode("Task");

    node.addTag("urgent");
    expect(node.getTags()).toEqual(["urgent"]);

    node.addTag("bug");
    expect(node.getTags()).toEqual(["urgent", "bug"]);

    // No duplicates
    node.addTag("urgent");
    expect(node.getTags()).toEqual(["urgent", "bug"]);

    node.removeTag("urgent");
    expect(node.getTags()).toEqual(["bug"]);

    node.removeTag("bug");
    expect(node.getTags()).toEqual([]);
    expect(node.metadata.tags).toBeUndefined();
  });

  it("manages metadata key-value pairs", () => {
    const node = new MindMapNode("Task");
    node.setMetadata("priority", "high");
    expect(node.getMetadata("priority")).toBe("high");
    expect(node.getMetadata("missing", "default")).toBe("default");
  });

  it("serializes to and from dict", () => {
    const root = new MindMapNode("Root", { color: "blue", icon: "🧠" });
    root.addTag("project");
    root.setMetadata("status", "active");

    const child = new MindMapNode("Child");
    child.addTag("todo");
    root.addChild(child);

    const dict = root.toDict();
    expect(dict.label).toBe("Root");
    expect(dict.color).toBe("blue");
    expect(dict.icon).toBe("🧠");
    expect(dict.metadata?.tags).toEqual(["project"]);
    expect(dict.metadata?.status).toBe("active");
    expect(dict.children).toHaveLength(1);
    expect(dict.children[0].label).toBe("Child");

    const restored = MindMapNode.fromDict(dict);
    expect(restored.label).toBe("Root");
    expect(restored.color).toBe("blue");
    expect(restored.getTags()).toEqual(["project"]);
    expect(restored.children).toHaveLength(1);
    expect(restored.children[0].label).toBe("Child");
    expect(restored.children[0].parent).toBe(restored);
  });
});
