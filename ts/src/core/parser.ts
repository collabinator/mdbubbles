/**
 * Markdown ↔ MindMapNode serialization.
 *
 * Ported from Python: src/mdbub/core/mindmap.py
 * (parse_markdown_to_mindmap, mindmap_to_markdown, _parse_node_metadata)
 */

import { MindMapNode, MAX_NODE_LABEL_LENGTH } from "./mindmap.js";
import type { NodeMetadata } from "./types.js";

/** Maximum recursion depth for tree building. */
const MAX_DEPTH = 100;

/**
 * Parse inline metadata from a node's content string.
 *
 * Extracts:
 * - Tags: `#tag1 #tag2`
 * - Key-value pairs: `@key=value`
 *
 * Returns [cleanLabel, metadata].
 */
export function parseNodeMetadata(
  content: string,
): [string, NodeMetadata] {
  const metadata: NodeMetadata = {};

  // Extract tags (format: whitespace + #tag)
  const tagMatches = content.matchAll(/\s#([\w-]+)/g);
  const tags: string[] = [];
  for (const match of tagMatches) {
    tags.push(match[1]);
  }
  if (tags.length > 0) {
    metadata.tags = tags;
    // Remove tags from content
    for (const tag of tags) {
      content = content.replace(new RegExp(`\\s#${tag}\\b`), "");
    }
  }

  // Extract key-value pairs (format: whitespace + @key=value)
  const kvMatches = content.matchAll(/\s@([\w-]+)=([^\s]+)/g);
  for (const match of kvMatches) {
    const [, key, value] = match;
    metadata[key] = value;
    content = content.replace(new RegExp(`\\s@${key}=${value}\\b`), "");
  }

  return [content.trim(), metadata];
}

/**
 * Parse extended markdown into a MindMapNode tree.
 *
 * Supports:
 * - Nested list items (`- item`, `  - child`)
 * - Inline metadata (#tags, @key=value)
 */
export function parseMarkdownToMindmap(md: string): MindMapNode {
  const lines = md
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .filter((line) => line.trim() !== "" && !line.startsWith("<!-- mdbub-format"));

  type NodeTuple = [string, NodeMetadata, NodeTuple[], number];

  const topNodes: NodeTuple[] = [];
  const stack: NodeTuple[] = [];

  for (const line of lines) {
    if (!line.trimStart().startsWith("-")) continue;

    const indent = line.length - line.trimStart().length;
    const content = line.trimStart().slice(2).trim();
    const [label, metadata] = parseNodeMetadata(content);

    if (indent === 0) {
      const tuple: NodeTuple = [label, metadata, [], 0];
      topNodes.push(tuple);
      stack.length = 0;
      stack.push(tuple);
    } else {
      // Attach as child to closest parent with lower indent
      while (stack.length > 0 && stack[stack.length - 1][3] >= indent) {
        stack.pop();
      }
      if (stack.length > 0) {
        const tuple: NodeTuple = [label, metadata, [], indent];
        stack[stack.length - 1][2].push(tuple);
        stack.push(tuple);
      }
    }
  }

  function buildTree(nodeTuple: NodeTuple, depth = 0): MindMapNode {
    let [label, metadata, childrenTuples] = nodeTuple;

    if (label.length > MAX_NODE_LABEL_LENGTH) {
      label = label.slice(0, MAX_NODE_LABEL_LENGTH) + "... [truncated]";
    }
    if (depth > MAX_DEPTH) {
      return new MindMapNode(label, { metadata });
    }

    const node = new MindMapNode(label, { metadata });
    for (const childTuple of childrenTuples) {
      node.addChild(buildTree(childTuple, depth + 1));
    }
    return node;
  }

  if (topNodes.length === 1) {
    return buildTree(topNodes[0]);
  } else if (topNodes.length > 1) {
    const root = new MindMapNode("SYNTHETIC ROOT");
    for (const tuple of topNodes) {
      root.addChild(buildTree(tuple));
    }
    return root;
  }
  return new MindMapNode(""); // Empty mindmap
}

/**
 * Serialize a MindMapNode tree to markdown bullet list.
 */
export function mindmapToMarkdown(
  node: MindMapNode,
  level = 0,
): string {
  const indent = "  ".repeat(level);
  const lines: string[] = [];

  // Build node content with metadata
  let content = node.label;
  const labelLower = node.label.toLowerCase();

  // Add tags not already inline in the label
  if (node.metadata.tags && node.metadata.tags.length > 0) {
    for (const tag of node.metadata.tags) {
      if (!labelLower.includes(`#${tag.toLowerCase()}`)) {
        content += ` #${tag}`;
      }
    }
  }

  // Add metadata key-value pairs not already inline
  for (const [key, value] of Object.entries(node.metadata)) {
    if (key === "tags" || value == null) continue;
    if (typeof value === "object") continue; // Skip complex structures
    const metaStr = `@${key.toLowerCase()}=${String(value).toLowerCase()}`;
    if (!labelLower.includes(metaStr)) {
      content += ` @${key}=${value}`;
    }
  }

  lines.push(`${indent}- ${content}`);

  for (const child of node.children) {
    lines.push(mindmapToMarkdown(child, level + 1));
  }

  return lines.filter((line) => line).join("\n");
}
