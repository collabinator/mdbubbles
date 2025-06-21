# PLAN_session_restore.md

## Goal
Persist and restore the last opened mindmap file and the last selected node path in mdbub quick mode, using a session file (`session.json`) in the config directory. If the app is started without a filename, it should restore the last session and navigate to the last selected node.

## Steps

- [ ] 1. Define session file location and structure in `quickmode_config.py` (already partially present as `SESSION_FILENAME`).
- [ ] 2. Implement save_session(state, filename) and load_session() helpers in `quickmode_config.py`.
- [ ] 3. On every navigation or quit in `quick.py`, save the current file path and selected node path to the session file.
- [ ] 4. On startup in `quick.py`, if no filename is provided, check for `session.json` and load last file and node path.
- [ ] 5. Refactor `main` in `quick.py` to support launching from session if no file is given.
- [ ] 6. Add unit tests for session save/load (test_quickmode_open.py).
- [ ] 7. Update CLI help/docs to mention session restore.
- [ ] 8. Test full workflow: open, navigate, quit, restart with/without filename.

## Session JSON Example
```json
{
  "last_file": "/home/user/mindmaps/ideas.md",
  "last_node_path": [0, 2, 1]
}
```

## Notes
- Node path is a list of indices from root to the selected node.
- If the file does not exist, fallback to default/new mindmap.
- If the path is invalid, fallback to root node.
- Session save should be robust to errors and not crash the app.

---

- [ ] Initial plan written
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Docs updated
- [ ] Plan checked off after testing
