# Phase 5 — Audit (before generating anything)

## Why this phase still exists, given everything upstream already has gates

The phase-level gates catch a lot, but they check each section against itself, not the document as a whole. Some problems only show up when you read the whole brief at once — a criterion that doesn't actually match the risk it's supposed to offset, a scope statement whose exclusions contradict something stated in assumptions, a document that's technically complete but reads as generic to a skeptical reader. This phase is a document-level pass, not a re-run of the earlier section-level checks.

Read `../reference/framework-checklist.md` before starting this phase — it's the full framework in one place, useful to hold in mind while reading the assembled draft.

## Three checks, in order

**1. Coverage matrix.** List every capability gap from the bridge down one side, and every brief section (Scope, Assumptions, Risks, Criteria) across the top. For each gap, mark which sections actually address it. Any gap with zero marks across the whole row is a real, reportable finding — not something to quietly patch by inventing a criterion at this stage. Bring it to the user's attention and let them decide whether to go back and add coverage or accept the gap knowingly.

**2. Common-mistakes check** (these three are the ones the source course activity calls out by name, so treat them as the minimum, not the ceiling):
- **Generic prompting residue**: does any section read like it could apply to almost any company, with no case-specific detail? That's a sign a base prompt was used without the amplification layer, or without real intake data.
- **Uncritiqued AI output**: is there a placeholder number, a bracket, or a suspiciously round figure that was never actually confirmed against intake data or explicitly marked as an estimate?
- **Vague success criteria**: does every criterion have a number and a date? A criterion without a number is a slogan, no matter how the rest of the document reads.

**3. Skeptical-reader pass.** Read the assembled draft once as a deliberately unconvinced board member would. Name the 2–3 weakest points — the ones most likely to draw a follow-up question or a "this feels generic" comment. This isn't about finding fault for its own sake; it's about surfacing what a careful reader would surface anyway, before they do.

**4. Template-fidelity check** (only if a template was supplied). Confirm the document preserves the template's structure — tables, headings, styles — and that any pre-filled example content was either replaced with case-specific material or, where it matched a canonical framework category, kept as a category with case-specific wording. Flag anything that's still template placeholder text that slipped through unnoticed.

## The gate

Present all findings from the three/four checks to the user together, as a short list — don't silently fix what you find and only show the final result. The user should see what was wrong before it's right; that's what makes this an audit rather than a second draft pass with extra steps. Let them decide what to fix now versus accept as a known limitation of this version.

## Before moving on

Write findings and the user's decisions into `audit` in the state file with `confirmed: true` once the user has responded. Set `phase: "generate"`. Move to `../06-generate/INSTRUCTIONS.md`.
