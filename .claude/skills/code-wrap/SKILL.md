---
name: code-wrap
description: Wrap up a Hutcheon Photo coding session — recap what changed, log it in the handoff doc's Session Log (done, decisions, open items, next steps), refresh AGENTS.md / the reference doc if how things work changed, and commit the docs. Use when Michael runs /code-wrap or says he's done for the session.
---

# code-wrap

Leave the project so the next `/code-start` can pick up without guesswork. Base the log on what actually happened, verified against git, not just on memory of the conversation.

**Handoff doc:** `../2026.06.28_Chat to Code Handoff/hutcheon-photo-context.md` (relative to the repo root; outside git, in iCloud Drive).
**Agent rules:** `AGENTS.md` in the repo (`CLAUDE.md` is a symlink to it).

## Steps

1. **Gather the facts.**
   - Run `git fetch origin` (sandbox disabled, `GIT_TERMINAL_PROMPT=0`).
   - Find this session's commits. Use the session's start sha if you know it; otherwise use commits since the last Session Log entry's date: `git log --all --since=<date> --format='%h %ad %an [%D] %s' --date=short`.
   - Classify each change:
     - **Live:** merged to `main` and deployed. Confirm via the live site's `/_astro/*.css`, or the Vercel commit status for docs-only changes.
     - **On preview:** pushed `design/*` branch, not merged. Include its preview URL.
     - **Local only:** committed but not pushed, or uncommitted.
   - Look back through the conversation for **decisions** Michael made and the reasons, rejected options worth remembering, and open questions.

2. **Check loose ends with Michael before logging.** If anything is uncommitted, unpushed, or sitting on an unmerged preview, list it. Ask whether to commit, push, merge, or leave it. Don't merge or push to `main` without his OK.

3. **Write the Session Log entry.** Insert it at the top of `## Session Log` in the handoff doc (newest first), in this format:

   ```markdown
   ### YYYY-MM-DD — <short title>
   **Done**
   - <change> — <live | preview: URL | local>
   **Decisions**
   - <decision> — <why>
   **Open / loose ends**
   - <item>
   **Next steps**
   - <most likely next task first>
   ```

   - Keep each bullet to one line, written in plain language Michael would recognize. Mention files or commits only when they help.
   - Leave out sections that are empty.
   - Update the `> Last updated:` date in the doc header.

4. **Refresh the reference docs when how something works changed** (new token, field, component, workflow, gotcha, or loose end resolved):
   - `AGENTS.md`: short-form rules that load every session.
   - Matching sections of the handoff doc: Design System, CMS Schema, Known Gotchas, File Locations, and so on.
   - Skip this when the session only changed content or values that the docs don't mention.

5. **Commit and report.**
   - If `AGENTS.md` changed: `git pull --ff-only`, commit (`git add AGENTS.md`), and push to `main`. It's docs-only, so it's safe to push. The handoff doc lives outside git and needs no commit.
   - Then give Michael a short recap: what's live, what's waiting on a preview, the top next step, and confirmation that the log is updated.

## Notes
- Never delete or rewrite older Session Log entries. If one was wrong, add a correction in the new entry.
- If the session made no changes (discussion only), still log decisions and next steps. Skip anything with nothing to say.
