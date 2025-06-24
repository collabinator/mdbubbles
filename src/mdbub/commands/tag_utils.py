import re
from collections import defaultdict
from typing import Dict, Tuple


def extract_tags_from_file(
    filename: str,
) -> Tuple[Dict[str, int], Dict[str, list[int]]]:
    tag_pattern = re.compile(r"#(\w+)")
    tag_counts: Dict[str, int] = defaultdict(int)
    tag_lines = defaultdict(list)
    with open(filename, "r", encoding="utf-8") as f:
        for lineno, line in enumerate(f, 1):
            for match in tag_pattern.finditer(line):
                tag = match.group(1)
                tag_counts[tag] += 1
                tag_lines[tag].append(lineno)
    return tag_counts, tag_lines
