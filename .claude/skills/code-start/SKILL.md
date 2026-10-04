---
name: code-start
description: Start a Hutcheon Photo coding session — sync with GitHub, read the Session Log in the handoff doc, check for unfinished work, and brief Michael on where things stand and what's next. Use when Michael runs /code-start or asks "where did we leave this?" / "catch me up".
---

# code-start

Get Michael from "opening the project" to "ready to work" in one short briefing. Do the checks yourself; report only what matters.

**Handoff doc:** `../2026.06.28_Chat to Code Handoff/hutcheon-photo-context.md` (relative to the repo root). The `## Session Log` section near the top holds dated entries, newest first.

## Steps

1. **Sync with GitHub first.** The local checkout is often behind because Keystatic CMS saves and work from other machines commit straight to GitHub.
   - Run `git fetch origin` (needs the sandbox disabled, with `GIT_TERMINAL_PROMPT=0`).
   - Note your current branch and any uncommitted changes.
   - List commits on `origin/main` that aren't local: `git log HEAD..origin/main --format='%h %ad %an %s' --date=short`. Group them: "Update content/…" commits by `mhutcheon92` are CMS edits; the rest are code changes. Read the bodies of code commits.
   - If you're on `main` with no conflicting local changes, `git pull --ff-only`. Otherwise report the state and ask before touching anything.

2. **Read the Session Log.** Read the newest 1–2 entries in the handoff doc's `## Session Log`: what was done, decisions, open items, next steps. Treat the open items and next steps as the default agenda.
   - If GitHub has commits newer than the last log entry, call that out ("work happened since the last wrap that isn't logged") and summarize those commits.

3. **Check for unfinished work.**
   - Unmerged design branches: `git branch -r --no-merged origin/main` (anything `design/*` is a pending preview awaiting approval). Give its preview URL: `https://hutcheon-photo-git-<branch-slug>-455tsckdg4-2712s-projects.vercel.app`.
   - Uncommitted or untracked files, except `.claude/settings.local.json`, which is expected.
   - Whether the latest `main` commit deployed: check the `Vercel` status at `https://api.github.com/repos/mhutcheon92/hutcheon-photo/commits/<sha>/statuses`.
   - Environment: `which node`. If Node is still missing, note that local dev isn't available and you'll verify through preview deployments. If it's now present and `node_modules` is stale, offer `npm install`.

4. **Brief Michael.** Keep it short and scannable:
   - **Last session** (date): 2–4 bullets on what got done.
   - **Since then:** new commits, CMS edits, or "nothing new".
   - **Open / waiting on you:** unmerged previews, decisions, loose ends.
   - **Suggested next step:** one recommendation, plus 1–2 alternatives from the log.
   - End by asking what he wants to work on.

## Notes
- Don't re-read `AGENTS.md`/`CLAUDE.md`; they're already loaded. Read other sections of the handoff doc only if the agenda needs them.
- Don't start making changes during code-start. It's a briefing.
- If the Session Log is missing or empty, fall back to git history and say so.
