# Phase 1 — The Bridge: Business Strategy → Required Capabilities → Workforce Plan

## Why this phase exists, and why it comes before anything else

Every downstream section of the brief — Scope, Assumptions, Risks, Success Criteria — is easy to write in a way that's internally coherent but disconnected from the actual reason the company needs this plan. The tell is usually a plan that reads like generic HR best practice: reasonable-sounding assumptions about attrition and hiring speed that could apply to almost any company, risks that could apply to almost any transformation, criteria that measure activity instead of business impact. The fix isn't writing better assumptions — it's writing them *from* something, and that something is this bridge.

This is a three-step chain, and it should be built and shown to the user as a table before any other section is drafted:

| Step | What it is | Example |
|---|---|---|
| 1. Business Strategy | The one-sentence, highest-level business goal driving this plan | "Recover comparable-store sales and traffic by shifting to an omnichannel model" |
| 2. Required Capabilities | The critical capabilities that goal demands — not roles yet, capabilities | Software Engineering, Data Science, Digital Marketing, UX/Product, Digital Customer Service |
| 3. Workforce Plan | What each capability translates into as a concrete personnel action | "Hire 60–80 software engineers", "reskill 200–250 CS agents for omnichannel support" |

## How to build it

Pull step 1 directly from the `intake.strategic_driver` block — if intake did its job, this should already be close to a one-sentence answer. If it's still vague, that's a sign to go back to intake rather than paper over it here.

For step 2, derive capabilities from the gap between where the organization is today (`intake.workforce_snapshot`) and what the strategic goal requires. If `intake.known_gaps` already lists these, use them as the starting point but sanity-check them against the strategy statement — a gap that doesn't trace back to the strategy in step 1 either belongs in a different plan or needs its own justification.

For step 3, translate each capability into one concrete action with a number where the intake data supports one, and mark it clearly as an estimate where it doesn't yet.

## The gate

Show this table to the user before proceeding. This is not a formality — errors here propagate into every other section, and it's far cheaper to catch a wrong capability list now than to redo four sections later. Explicitly ask: does this capture the real strategic goal, are the capabilities right, is anything missing or wrong? Do not proceed to Scope until the user confirms or corrects this table.

If the user pushes back and wants to skip this ("just give me a draft, I'll fix it later") — that's their call, but say plainly that skipping this step is exactly what produced the missing-business-context gap that this whole process is designed to prevent, and offer to keep it quick (a single confirmation message) rather than skip it outright.

## Before moving on

Write the confirmed table into `bridge` in the state file with `confirmed: true`. Set `phase: "scope"`. Move to `../02-scope/INSTRUCTIONS.md`.
