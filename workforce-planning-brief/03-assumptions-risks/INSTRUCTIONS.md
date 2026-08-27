# Phase 3 — Assumptions, Constraints, Risks & Mitigations

## Why this is one phase, not four

The source course activity treats assumptions and risks as a single combined task with three sub-steps: generate assumptions, generate risks, then generate mitigations for those risks. That grouping is worth keeping as-is — these four things reason about the same underlying question (what has to be true, and what could go wrong) and treating them as one continuous pass, in this order, produces better cross-references between them than treating them as isolated sections. Constraints ride along inside this same phase, even though the source activity doesn't call it out as its own step, because a constraint is really an assumption's hard-edged cousin — a limitation you don't get to assume away.

Work through the four sub-steps below in order. Don't jump to risks before assumptions are drafted — the amplification in the risks sub-step depends on having assumptions to reference.

## Sub-step 1 — Assumptions

**Base prompt** (see `../reference/prompts-base.md`): generate 5–7 assumptions about workforce needs, talent availability, technology adoption, and reskilling, grounded in the case.

**Amplification**: every quantitative assumption must include a comparison point in the same sentence, not as a separate note — "attrition will run 12–15%, above the company-wide average" is a usable assumption; "attrition will run 12–15%" is a number floating with nothing to judge it against. If the intake data doesn't supply a baseline, say so explicitly ("no confirmed company-wide baseline — flagged for the user to provide") rather than inventing one that sounds plausible. Also make sure at least one assumption ties the plan to a **business outcome** the bridge identified (revenue, market share, customer retention) — not only execution assumptions about hiring and reskilling. A workforce plan with zero assumptions about the business result it's supposed to enable is a plan that's drifted from its own bridge.

## Sub-step 2 — Constraints

**Base prompt**: 2–3 real-world constraints — budget, timeline, talent-market availability.

**Amplification**: a constraint is a fact, not an inference — if the source material gives a budget figure and a deadline, use them as stated rather than a derived/invented tighter number, unless you explicitly label the tighter number as a planning estimate and say what it was derived from (e.g. "backward-calculated from the Q4 launch date, assuming an 8-week onboarding buffer"). Never present a derived number as if it were a stated fact from the source.

## Sub-step 3 — Risks (the coverage gate)

**Base prompt**: 3–5 major risks, typically prompted openly ("focusing on talent competition, change resistance, budget limitations...").

**This is the sub-step most worth amplifying**, because an open-ended risk prompt reliably produces 3 of the 4 canonical categories and drops the fourth without anyone noticing until an outside reviewer checks. Generate risks **one canonical category at a time**, in this fixed order, before adding anything else:

1. Talent scarcity
2. Budget cuts
3. Low technology/tool adoption (employee resistance to change)
4. Unexpected attrition of key people

Only after all four have a risk statement, add scenario-specific risks beyond this set if the case clearly calls for one (cap at one or two extra — this is a brief, not an exhaustive risk register). If you decide to fold a canonical category into a more specific scenario risk instead of stating it plainly (e.g. writing "technology rollout delays impacting staffing" instead of a generic adoption-resistance risk), that's a legitimate editorial choice — but say so explicitly to the user rather than letting the substitution happen silently. The failure mode isn't substitution, it's *silent, unnoticed* substitution.

**Cross-reference back to assumptions**: for each confirmed assumption, ask "if this turns out to be wrong, what risk does that create?" Any risk that surfaces this way and isn't already covered belongs in the list. This is what keeps assumptions and risks from reading like two unrelated lists.

## Sub-step 4 — Mitigations

**Base prompt**: for each risk, one practical mitigation strategy, 1–2 sentences.

**Amplification**: anchor each mitigation to a resource that's actually confirmed in `intake.resources_constraints` (an existing program, partnership, budget line) — or mark it explicitly as "requires a new resource, not currently budgeted." A mitigation that sounds sensible but isn't tied to anything the organization actually has is a mitigation nobody will execute. "Launch a reskilling program" is empty if a reskilling partnership already exists in the intake data and should have been named directly.

## Success checklist

- 5–7 distinct assumptions, each with a comparison point or an explicit flag that one is missing.
- At least one assumption ties to a business outcome from the bridge, not only execution.
- 2 constraints, each a stated fact (or a clearly labeled derived estimate).
- All 4 canonical risk categories addressed, with any substitution stated explicitly.
- Every risk has a mitigation, and every mitigation is anchored to a real resource or flagged as new.

## Before moving on

Write the confirmed content into `assumptions_risks` in the state file — include which canonical categories were kept as-is vs. substituted, so the audit phase doesn't have to re-derive this. Set `phase: "success_criteria"`. Move to `../04-success-criteria/INSTRUCTIONS.md`.
