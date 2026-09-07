# Phase 0 — Intake

## Goal

Get the five blocks of case data that any real workforce-planning engagement has at kickoff, before drafting a single word of the brief. These five blocks mirror what a real internal case document for this kind of project actually contains — company background, the strategic driver, the current workforce snapshot, known talent gaps, and available resources/budget. If any of these is missing, everything drafted downstream is a guess dressed up as analysis.

## Two entry modes

**A document is attached** (a scenario PDF, a business case, a kickoff deck, meeting notes). Read it and extract the five blocks below. Do not ask the user to re-type anything that's already in the document — that's disrespectful of their time and it's exactly the kind of redundant question that makes people distrust a "guided" process. Only ask about what's genuinely missing or ambiguous after extraction.

**Nothing is attached — a bare request like "help me build a workforce plan."** Ask for the five blocks directly. Use a small set of grouped questions rather than five separate back-and-forth turns — if the environment has a multiple-choice/clarifying-question tool, use it; otherwise ask in one message with the blocks clearly separated. Make it easy to answer "I don't know yet" for anything that's genuinely undecided — flag those as open items to resolve before Phase 1 rather than silently inventing them.

## The five blocks

1. **Company background** — industry, rough size (revenue and/or headcount), and enough context to know what "normal" looks like for this organization. This is what lets later assumptions be judged as realistic or not.
2. **The strategic driver** — the specific initiative, transformation, or change that is *why* this plan needs to exist right now. Not "we want to grow" in the abstract — the actual thing happening (a digital transformation, a new market entry, an M&A integration, a product launch). This single block is what Phase 1's bridge is built from, so push for specificity here rather than accepting something generic.
3. **Current workforce snapshot** — headcount by function/department, at whatever granularity is available. Doesn't need to be exact; approximate is fine and should be marked as approximate.
4. **Known talent gaps** — if the organization has already identified specific gaps (roles, headcounts, skill areas), capture them as given. If not, say explicitly that gaps haven't been identified yet and that Phase 1 will help derive them from the strategic driver — don't fabricate a gaps list at this stage.
5. **Resources and constraints already in play** — budget envelope (even a rough one), any programs, partnerships, or internal mobility initiatives already approved or in motion, and any hard deadlines already known.

## What "done" looks like

You can state, in a few sentences, what the company does, what's driving this plan, roughly who works there today, what's already known to be missing, and what resources/constraints are already on the table. If you can't state all five without guessing, the phase isn't done — go back and ask rather than filling gaps with plausible-sounding assumptions. An assumption that should have been a question is exactly the failure mode Phase 3 exists to catch downstream, but it's cheaper to just ask now.

## Before moving on

Write the five blocks into `intake` in the state file. Set `phase: "bridge"`. Move to `../01-bridge/INSTRUCTIONS.md`.
