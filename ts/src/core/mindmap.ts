/**
 * MindMapNode — Core tree data structure for mdbub mindmaps.
 *
 * Ported from Python: src/mdbub/core/mindmap.py
 */

import type { MindMapNodeData, NodeMetadata } from "./types.js";

/** Maximum allowed characters for a node label. */
export const MAX_NODE_LABEL_LENGTH = 2048;

export class MindMapNode {
  label: string;
  children: MindMapNode[];
  color: string | null;
  icon: string | null;
  metadata: NodeMetadata;
  parent: MindMapNode | null;

  constructor(
    label: string,
    options: {
      children?: MindMapNode[];
      color?: string | null;
      icon?: string | null;
      metadata?: NodeMetadata;
    } = {},
  ) {
    if (label.length > MAX_NODE_LABEL_LENGTH) {
      label = label.slice(0, MAX_NODE_LABEL_LENGTH) + "... [truncated]";
    }
    this.label = label;
    this.children = options.children ?? [];
    this.color = options.color ?? null;
    this.icon = options.icon ?? null;
    this.metadata = options.metadata ?? {};
    this.parent = null;
  }

  /** Add a child node and set its parent reference. */
  addChild(child: MindMapNode): void {
    this.children.push(child);
    child.parent = this;
  }

  /** Add a tag to this node's metadata. */
  addTag(tag: string): void {
    if (!this.metadata.tags) {
      this.metadata.tags = [];
    }
    if (!this.metadata.tags.includes(tag)) {
      this.metadata.tags.push(tag);
    }
  }

  /** Remove a tag from this node's metadata. */
  removeTag(tag: string): void {
    if (this.metadata.tags) {
      this.metadata.tags = this.metadata.tags.filter((t) => t !== tag);
      if (this.metadata.tags.length === 0) {
        delete this.metadata.tags;
      }
    }
  }

  /** Get all tags for this node. */
  getTags(): string[] {
    return this.metadata.tags ?? [];
  }

  /** Set a metadata key-value pair. */
  setMetadata(key: string, value: unknown): void {
    this.metadata[key] = value;
  }

  /** Get a metadata value by key. */
  getMetadata(key: string, defaultValue: unknown = undefined): unknown {
    return this.metadata[key] ?? defaultValue;
  }

  /** Serialize to a plain object (for JSON export). */
  toDict(): MindMapNodeData {
    const result: MindMapNodeData = {
      label: this.label,
      children: this.children.map((child) => child.toDict()),
    };
    if (this.color) result.color = this.color;
    if (this.icon) result.icon = this.icon;
    if (Object.keys(this.metadata).length > 0) result.metadata = this.metadata;
    return result;
  }

  /** Deserialize from a plain object. */
  static fromDict(data: MindMapNodeData): MindMapNode {
    const node = new MindMapNode(data.label, {
      color: data.color,
      icon: data.icon,
      metadata: data.metadata ?? {},
    });
    for (const childData of data.children ?? []) {
      node.addChild(MindMapNode.fromDict(childData));
    }
    return node;
  }
}
