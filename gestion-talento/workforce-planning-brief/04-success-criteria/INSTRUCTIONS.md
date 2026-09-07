# Phase 4 — Success Criteria

## Goal

Define what "done" looks like, in terms specific enough to be objectively true or false at a given date. "Improve skills" is a slogan. "Reskill 150 customer service agents with certification by end of Year 2" is a criterion.

## Base prompt (see `../reference/prompts-base.md`)

Generate success criteria tied to hiring speed for key digital roles, upskilling targets, and the impact on the main launch/initiative.

## Amplification — generate one criterion per capability gap, not "N criteria" in the open

The base prompt asks for a fixed count (3 or 4) without reference to how many capability gaps the bridge actually identified. That's how a real gap goes unmeasured — if the bridge names five capability gaps and the prompt asks for four criteria, whichever gap doesn't fit the four slots the model happens to reach for silently drops out, and nobody notices because "4 criteria" was technically satisfied.

Instead: list every capability gap from the confirmed bridge first, then draft one criterion per gap. If there are more gaps than feels reasonable for a brief (more than ~5), that's a real tradeoff to put in front of the user explicitly — "these are the gaps without a success criterion; do you want to add one, or accept that this brief doesn't measure them" — rather than a decision made silently by the model.

Every criterion must follow this shape, in the same sentence: **baseline (if one exists) → target number or percentage → deadline → the business goal it's tied to.** "Reduce time-to-hire for senior engineers to under 45 days by end of Year 1, down from a baseline of 70+ days" is stronger than the same sentence without the baseline — showing the delta is what makes a criterion persuasive to a reviewer, not just correct.

## The most important step (the source course activity says this explicitly — treat it as a hard requirement, not a suggestion)

A first AI-generated pass at success criteria will often still contain soft language or generic placeholders. The single most valuable move in this whole phase is manually tightening that draft: adding the specific number, percentage, and deadline where the first pass left something vague. Do this pass explicitly and show the before/after to the user rather than presenting only the final tightened version — that visibility is what teaches the user to do this themselves next time, which is the actual point of a "planning brief" exercise, not just the document it produces.

## Success checklist

- At least one criterion per capability gap identified in the bridge (or an explicit, user-acknowledged decision to leave a gap unmeasured).
- Every criterion has a number or percentage.
- Every criterion has a deadline.
- Every criterion is traceable to a business goal from the bridge, not just to an HR activity.

## Before moving on

Write the confirmed criteria into `success_criteria` in the state file, including the gap-coverage list (which gaps got a criterion, which didn't and why). Set `phase: "audit"`. Move to `../05-audit/INSTRUCTIONS.md`.
