/**
 * Shared TypeScript interfaces for mdbub.
 */

/** Metadata dictionary for a mindmap node. */
export interface NodeMetadata {
  tags?: string[];
  [key: string]: unknown;
}

/** Serialized representation of a MindMapNode (for JSON export). */
export interface MindMapNodeData {
  label: string;
  children: MindMapNodeData[];
  color?: string;
  icon?: string;
  metadata?: NodeMetadata;
}
