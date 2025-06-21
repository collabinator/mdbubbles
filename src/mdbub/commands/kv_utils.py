import re
from collections import defaultdict


def extract_kv_metadata_from_file(filename):
    kv_pattern = re.compile(r"@(\w+):([^\s]+)")
    node_kvs = []  # List of dicts: {line, label, kvs: {k:v}}
    all_keys = set()
    value_counts = defaultdict(lambda: defaultdict(int))  # key -> value -> count
    with open(filename, "r", encoding="utf-8") as f:
        for lineno, line in enumerate(f, 1):
            kvs = {}
            for match in kv_pattern.finditer(line):
                key = match.group(1)
                value = match.group(2)
                kvs[key] = value
                all_keys.add(key)
                value_counts[key][value] += 1
            if kvs:
                label = line.strip().split("@", 1)[0].strip()
                node_kvs.append({"line": lineno, "label": label, "kvs": kvs})
    return node_kvs, sorted(all_keys), value_counts
