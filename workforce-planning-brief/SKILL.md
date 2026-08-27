---
name: workforce-planning-brief
description: Builds a Strategic Workforce Planning Brief (Scope, Assumptions & Constraints, Risks & Mitigations, Success Criteria) through a gated, sequential process — the Business Strategy → Required Capabilities → Workforce Plan bridge, the four canonical risk categories, SMART success criteria. Use whenever the user asks to create, draft, or fill in a workforce plan, a strategic workforce planning brief, a talent/people plan tied to a business initiative or transformation, or a workforce-planning template — even a bare "help me build a workforce plan" or "necesito armar un planning brief de fuerza laboral" with no case file attached. Also trigger on scope/assumptions/risks/success-criteria sections for a headcount or talent plan, or a business-case/scenario document attached alongside a planning template. Do NOT trigger for routine headcount tracking, a single job requisition, or a general HR policy question with no planning-document deliverable in view.
---

# Workforce Planning Brief

## Why this skill exists, and why it's gated

A workforce planning brief is easy to fill in badly: four sections, a handful of bullet points each, done in one pass. The problem is that a single-pass brief reliably misses two things that only show up under scrutiny — the business logic connecting the plan to the company's actual strategy, and full coverage of the standard categories a reviewer expects (every canonical risk type, every stated talent gap represented in a success criterion). Both are invisible from inside a single draft; they only surface when someone checks coverage against a list, and by then the brief is "done" and nobody checks.

So this skill is not "fill in four sections." It is a sequence of gates, each one closing off a specific way this kind of document goes wrong. Skipping a gate to save time reliably reproduces the exact gaps this skill exists to prevent — so don't skip them, even when the user seems to be in a hurry. If the user explicitly wants a fast, ungated single pass, say so out loud before doing it, so they know they're trading rigor for speed.

## The state file — how sequencing works

Before doing anything else, look for `workforce-plan-status.json` in the user's working directory (or wherever they're building this brief). This file is what lets the process be resumed out of order, across sessions, instead of forcing a rigid restart every time.

- **No file found** → this is a cold start. Go to `00-intake/INSTRUCTIONS.md`.
- **File found** → read it, see which phase it's on, and jump straight to that phase's folder. Don't re-run earlier phases whose gates are already marked `confirmed: true` — that would waste the user's time and re-litigate decisions they already made.
- **User states a phase explicitly** ("ya tengo el scope, ayúdame con riesgos") → honor it and jump to the matching folder, but if `bridge.confirmed` is not `true` in the state file, say so before proceeding — everything downstream depends on the bridge, and skipping it silently is exactly the kind of gap this skill is designed to prevent. Offer to run it quickly rather than block outright if the user insists on skipping.

Create/update the state file after every phase using this shape (add fields as phases complete; never delete history from earlier phases):

```json
{
  "brief_name": "string — short id for this brief, e.g. company + initiative",
  "language": "es | en | ...",
  "template_path": "path to a user-provided template, or null",
  "phase": "intake | bridge | scope | assumptions_risks | success_criteria | audit | generate | done",
  "intake": { "...": "the five intake blocks, see 00-intake" },
  "bridge": { "confirmed": false, "...": "..." },
  "scope": { "confirmed": false, "...": "..." },
  "assumptions_risks": { "confirmed": false, "...": "..." },
  "success_criteria": { "confirmed": false, "...": "..." },
  "audit": { "confirmed": false, "findings": [] }
}
```

## The phases, in order

Read each phase's `INSTRUCTIONS.md` only when you're actually in that phase — don't front-load all of them into context at once.

1. **`00-intake/`** — Get the minimum viable case data. Either extract it from an attached document or ask for it directly.
2. **`01-bridge/`** — Business Strategy → Required Capabilities → Workforce Plan. The single most important gate; nothing downstream should be drafted before this is confirmed.
3. **`02-scope/`** — Draft the Scope section.
4. **`03-assumptions-risks/`** — Assumptions, Constraints, Risks, and Mitigations — one combined phase with four sub-steps in order, matching how this is taught as a single unit.
5. **`04-success-criteria/`** — Success Criteria, one per capability gap, SMART-checked.
6. **`05-audit/`** — Coverage matrix + adversarial read + template-fidelity check, before generating anything.
7. **`06-generate/`** — Produce the actual document.

## The framework this skill enforces (keep this in mind across every phase)

- **Four components, always**: Scope; Assumptions & Constraints; Risks & Mitigations; Success Criteria. Nothing gets cut for brevity.
- **The bridge is not optional decoration.** Business Strategy → Required Capabilities → Workforce Plan is the mechanism that keeps the brief from turning into a generic HR wishlist disconnected from why the company needs any of this. Every subsequent section should trace back to it.
- **Four canonical risk categories exist for a reason**: talent scarcity, budget cuts, low technology adoption, unexpected attrition of key people. A brief that swaps one out for something scenario-specific is fine — swapping one out silently, without anyone noticing a canonical category went missing, is the failure mode to avoid. See `03-assumptions-risks/INSTRUCTIONS.md` for how to structure generation so this doesn't depend on memory.
- **Weak vs. strong criteria**: "Improve skills" is a slogan. "Reskill 150 agents with certification by end of Year 2" is a criterion. Every success criterion needs a number, a deadline, and a traceable link to a business goal.
- **AI drafts, a human personalizes with real data — as two separate, visible moves, not one.** Never quietly substitute a plausible-sounding number for a placeholder. Mark what's estimated, mark what's sourced, and make the user confirm the swap.
- **Template content is illustrative until proven otherwise.** If the user supplies a template with example text already filled in, treat it as a teaching example, not ground truth — except where it corresponds to one of the canonical categories above (e.g. a pre-filled "budget cuts" risk), in which case keep the category and rewrite the content to match the actual case.

## A note on effort calibration

Earlier drafts of this process tried to calibrate how many checkpoints each phase deserved based on how long a course exercise suggested it should take. Don't do that — time-on-task tells you nothing about error risk. Calibrate instead by blast radius: phases that everything else depends on (the bridge, Scope) and phases with a documented history of silent gaps (Risks, Success Criteria) get the full gate treatment every time, regardless of how "quick" the underlying task nominally is.

## Reference material

- `reference/prompts-base.md` — the original, unmodified prompts this process is built on top of. Use these as the literal starting point in each phase.
- `reference/prompts-amplified.md` — the structured, dimension-by-dimension versions that close the coverage gaps. Use these as the actual generation prompt; the base prompts are there so you (and the user) can see the delta, not to be used verbatim once the amplified version exists.
- `reference/framework-checklist.md` — the full theoretical framework as a single checklist, useful to re-read before the audit phase.

## Output

The final artifact is produced in `06-generate/`. If the user supplied a `.docx` template, fidelity to its structure (tables, headings, styles) is required — fill it in place rather than rebuilding it from scratch. If no template was supplied, use the four-component structure directly. Use the `docx` skill for the actual file mechanics (reading/writing `.docx` XML) rather than reinventing document generation here.
