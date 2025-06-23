import logging
import time
from typing import Any, Dict, List, Optional

MAX_NODE_LABEL_LENGTH = 2048  # Maximum allowed characters for a node label


class MindMapNode:
    def __init__(
        self,
        label: str,
        children: Optional[List["MindMapNode"]] = None,
        color: Optional[str] = None,
        icon: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        if len(label) > MAX_NODE_LABEL_LENGTH:
            logging.warning(
                f"[mdbub] Node label exceeded {MAX_NODE_LABEL_LENGTH} chars and was truncated."
            )
            label = label[:MAX_NODE_LABEL_LENGTH] + "... [truncated]"
        self.label = label
        self.children = children or []
        self.color = color
        self.icon = icon
        self.metadata = metadata or {}
        self.parent = None  # Reference to parent node, useful for navigation

    def add_child(self, child: "MindMapNode"):
        self.children.append(child)
        child.parent = self  # Set parent reference

    def add_tag(self, tag: str):
        """Add a tag to this node's metadata."""
        if "tags" not in self.metadata:
            self.metadata["tags"] = []
        if isinstance(self.metadata["tags"], list) and tag not in self.metadata["tags"]:
            self.metadata["tags"].append(tag)

    def remove_tag(self, tag: str):
        """Remove a tag from this node's metadata."""
        if "tags" in self.metadata and isinstance(self.metadata["tags"], list):
            if tag in self.metadata["tags"]:
                self.metadata["tags"].remove(tag)
                # Clean up empty tags list
                if not self.metadata["tags"]:
                    del self.metadata["tags"]

    def get_tags(self) -> List[str]:
        """Get all tags for this node."""
        if "tags" in self.metadata and isinstance(self.metadata["tags"], list):
            return self.metadata["tags"]
        return []

    def set_metadata(self, key: str, value: Any):
        """Set a metadata key-value pair."""
        self.metadata[key] = value

    def get_metadata(self, key: str, default: Any = None) -> Any:
        """Get a metadata value by key."""
        return self.metadata.get(key, default)

    def to_dict(self):
        result = {
            "label": self.label,
            "children": [child.to_dict() for child in self.children],
        }
        # Only include non-empty values
        if self.color:
            result["color"] = self.color
        if self.icon:
            result["icon"] = self.icon
        if self.metadata:
            result["metadata"] = self.metadata
        return result

    @staticmethod
    def from_dict(data):
        node = MindMapNode(
            label=data["label"],
            color=data.get("color"),
            icon=data.get("icon"),
            metadata=data.get("metadata", {}),
        )
        for child_data in data.get("children", []):
            child = MindMapNode.from_dict(child_data)
            node.add_child(child)
        return node


def parse_markdown_to_mindmap(md: str):
    """Parse extended markdown into a MindMapNode tree with metadata.

    Metadata format supports:
    - Tags in the format: #tag1 #tag2
    - Key-value pairs: @key=value
    """
    start_time = time.time()
    lines = [
        line.rstrip()
        for line in md.splitlines()
        if line.strip() and not line.startswith("<!-- mdbub-format")
    ]
    top_nodes = []  # List of (label, metadata, children_lines, indent)
    stack = []
    # prev_indent = None  # Removed unused variable

    logging.info(f"[mdbub] Parsing {len(lines)} lines from markdown...")
    for line in lines:
        if not line.lstrip().startswith("-"):
            continue

        indent = len(line) - len(line.lstrip())
        content = line.lstrip()[2:].strip()

        # Parse metadata from the label
        label, metadata = _parse_node_metadata(content)

        if indent == 0:
            top_nodes.append((label, metadata, [], 0))
            stack = [top_nodes[-1]]
        else:
            # Attach as child to closest parent with lower indent
            while stack and stack[-1][3] >= indent:
                stack.pop()
            if stack:
                stack[-1][2].append((label, metadata, [], indent))
                stack.append(stack[-1][2][-1])

    def build_tree(node_tuple, depth=0):
        label, metadata, children_tuples, _ = node_tuple
        if len(label) > MAX_NODE_LABEL_LENGTH:
            logging.warning(
                f"[mdbub] Node label exceeded {MAX_NODE_LABEL_LENGTH} chars and was truncated during parsing."
            )
            label = label[:MAX_NODE_LABEL_LENGTH] + "... [truncated]"
        if depth > 100:
            logging.error(f"[mdbub] Maximum recursion depth reached at node '{label}'")
            return MindMapNode(label, metadata=metadata)

        node = MindMapNode(label, metadata=metadata)

        # Process tags if present
        if "tags" in metadata:
            # Tags are already in the metadata dictionary
            pass

        for child_tuple in children_tuples:
            node.add_child(build_tree(child_tuple, depth=depth + 1))
        return node

    if len(top_nodes) == 1:
        result = build_tree(top_nodes[0])
    elif len(top_nodes) > 1:
        root = MindMapNode("SYNTHETIC ROOT")
        for node_tuple in top_nodes:
            root.add_child(build_tree(node_tuple))
        root._multi_root_warning = True  # Custom attribute to signal warning
        result = root
    else:
        result = MindMapNode("")  # Empty mindmap
    elapsed = time.time() - start_time
    logging.info(f"[mdbub] Mindmap parse complete in {elapsed:.3f} seconds.")
    return result


def _parse_node_metadata(content: str):
    """Parse node metadata from content string.

    Returns:
        tuple: (label, metadata_dict)
    """
    import re

    # Initialize metadata dictionary
    metadata = {}

    # Extract tags (format: #tag)
    tags = re.findall(r"\s#([\w-]+)", content)
    if tags:
        metadata["tags"] = tags
        # Remove tags from content
        for tag in tags:
            content = re.sub(r"\s#" + tag + "\b", "", content)

    # Extract key-value pairs (format: @key=value)
    kv_pairs = re.findall(r"\s@([\w-]+)=([^\s]+)", content)
    for key, value in kv_pairs:
        metadata[key] = value
        # Remove key-value pair from content
        content = re.sub(r"\s@" + key + "=" + value + "\b", "", content)

    # Clean up any extra whitespace
    label = content.strip()

    return label, metadata


def mindmap_to_markdown(node: MindMapNode, level=0) -> str:
    """Serialize MindMapNode tree to markdown bullets with metadata."""
    indent = "  " * level
    lines = []
    # Build node content with metadata
    content = node.label

    # Only add tags that are NOT already inline in the label
    label_lower = node.label.lower()
    if "tags" in node.metadata and node.metadata["tags"]:
        tags = node.metadata["tags"]
        for tag in tags:
            tag_str = f"#{tag.lower()}"
            if tag_str not in label_lower:
                content += f" #{tag}"

    # Only add metadata that is NOT already inline in the label
    for key, value in node.metadata.items():
        if key != "tags" and value is not None:
            if isinstance(value, (list, dict)):
                continue  # Skip complex structures for now
            meta_str = f"@{key.lower()}={str(value).lower()}"
            if meta_str not in label_lower:
                content += f" @{key}={value}"

    # Emit the current node with its metadata
    lines.append(f"{indent}- {content}")

    # Process all children recursively
    for child in node.children:
        lines.append(mindmap_to_markdown(child, level + 1))

    return "\n".join([line for line in lines if line])
