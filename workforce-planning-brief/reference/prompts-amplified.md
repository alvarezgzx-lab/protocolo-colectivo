# Amplified prompts

Same intent as `prompts-base.md`, restructured so that coverage is guaranteed by the shape of the prompt rather than left to hope that the model happens to think of everything. Use these as the actual generation prompt once intake and the bridge are done — the base prompts exist so the delta is visible and explainable, not so both get run.

## Bridge (Phase 1 — has no base-prompt equivalent; this step doesn't exist in the source course activity)

> Before drafting any section, build a 3-step bridge for [Company] / [Initiative]: (1) Business Strategy — state the single highest-level business goal in one sentence; (2) Required Capabilities — list the critical capabilities that goal demands; (3) Workforce Plan — for each capability, one concrete personnel action with a number where the case data supports one. Present this as a table before anything else.

## Scope (Phase 2)

> [base Scope prompt] — additionally: for each excluded area, add one clause stating why it's excluded and when it will be addressed instead. Ground department mentions in actual headcount figures from intake where available, not just department names.

## Assumptions (Phase 3, sub-step 1)

> [base Assumptions prompt] — additionally: every quantitative assumption must include a comparison point in the same sentence (a stated baseline, a company average, or an explicit "no confirmed baseline" flag). Include at least one assumption that ties the plan to a business outcome from the bridge (revenue, market share, retention), not only execution assumptions about hiring and reskilling.

## Constraints (Phase 3, sub-step 2)

> [base Constraints prompt] — additionally: state each constraint as a fact traceable to the source case data. If a tighter, derived number is more operationally useful than the literal source figure, include it but label it explicitly as derived and state what it was calculated from.

## Risks (Phase 3, sub-step 3)

> Generate one risk statement for each of these four categories, in this order, before adding anything else: (1) talent scarcity, (2) budget cuts, (3) low technology/tool adoption, (4) unexpected attrition of key people. Only after all four exist, add up to two scenario-specific risks if the case clearly calls for them. If any canonical category is folded into a more specific scenario risk instead of stated plainly, say so explicitly rather than substituting silently. Then, for each already-confirmed assumption, ask: if this assumption turns out false, what risk does that create? Add any risk this surfaces that isn't already covered.

## Mitigations (Phase 3, sub-step 4)

> [base Mitigations prompt] — additionally: anchor each mitigation to a resource already confirmed in intake (an existing program, partnership, or budget line), naming it directly. If no matching resource exists, mark the mitigation explicitly as "requires a new resource, not currently budgeted" rather than writing something that sounds actionable but isn't tied to anything real.

## Success Criteria (Phase 4)

> List every capability gap identified in the confirmed bridge. Draft one success criterion per gap — not a fixed count decided in advance. Each criterion must state, in one sentence: the baseline (if one exists) → the target number or percentage → the deadline → the business goal it's tied to. If there are more gaps than reasonably fit in a concise brief, present the uncovered gaps to the user explicitly and let them decide whether to add a criterion or knowingly accept the gap — don't drop one silently to hit a round number.
