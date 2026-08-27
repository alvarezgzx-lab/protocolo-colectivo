# Phase 2 — Scope

## Goal

Define the boundaries of the plan: what's in, what's explicitly out, over what timeframe. A scope without stated exclusions invites "boiling the ocean" — trying to plan for the whole organization instead of the part that actually needs planning right now.

## Base prompt (starting point — see `../reference/prompts-base.md` for the unmodified original)

Draft a Scope section for the plan using: the company name, the planning horizon, the business goal from the bridge, and the departments/geography in scope.

## Amplification layer (what to add on top, not instead of)

The base prompt produces a solid first paragraph. Two additions raise it further, without changing what the base prompt already does well:

- **Justify each exclusion in one clause, not just name it.** "Excludes in-store retail operations" is a fact; "excludes in-store retail operations, which are being addressed in a later phase of the workforce transformation pillar" is a decision the reader can evaluate. This costs almost nothing and materially changes how the section reads to a reviewer.
- **Ground the scope in real headcount from intake**, not just department names — "Marketing, IT, and Customer Service (~180, ~320, and ~640 employees respectively)" is more useful to a planner than the department names alone.

## Success checklist (from the source course activity — treat as the exit gate for this phase)

- The timeframe is stated explicitly.
- The departments and geography in scope are listed explicitly.
- What's out of scope is stated explicitly, with a reason.

If any of these three is missing, the phase isn't done — don't move on with a partial scope statement hoping it gets fixed in review.

## Before moving on

Write the scope text into `scope` in the state file with `confirmed: true` once the user has seen it and hasn't flagged a problem (an explicit "looks good" isn't required here the way it is for the bridge — this phase is lower blast-radius — but give the user the chance to react before moving on). Set `phase: "assumptions_risks"`. Move to `../03-assumptions-risks/INSTRUCTIONS.md`.
