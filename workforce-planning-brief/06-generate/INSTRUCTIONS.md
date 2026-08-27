# Phase 6 — Generate

## Goal

Produce the actual document from everything confirmed in the state file. By this point every section has already been drafted and gated — this phase is assembly and formatting, not new content creation. Resist the temptation to "improve" wording here that already passed its gate; if something looks off at this stage, that's a sign a gate upstream was rushed, and it's worth going back rather than patching silently at the finish line.

## If the user supplied a template

Fill it in place — read the existing `.docx`, identify the structural placeholders (section headers, table cells, labeled fields), and replace their content with the confirmed material from the state file, preserving the template's tables, styles, and layout exactly. Use the `docx` skill for the actual file mechanics (reading and editing `word/document.xml`, handling merged cells, preserving run formatting) rather than rebuilding the document from scratch — rebuilding risks losing exact fidelity to the original design, which defeats the purpose of having a template in the first place.

Distinguish, while filling: content that's structural (headers, labels, table shape) always stays; content that's illustrative example text gets replaced with the case-specific material from the audited draft; content that matches a canonical framework category (see `03-assumptions-risks`) keeps its category slot but gets case-specific wording.

## If no template was supplied

Build the document directly from the four-component structure (Scope; Assumptions & Constraints; Risks & Mitigations; Success Criteria), plus a short document-info header (prepared by, date, version, planning horizon, initiative name — pull these from intake and from the user directly if not already captured). Use the `docx` skill for construction.

## Language and tone

Match whatever language and register the user has been working in throughout the process (check `language` in the state file). Keep the tone the brief has had throughout — grounded in real figures from intake, specific rather than generic, written for a reader who will act on it (a Consejo, a leadership team, a People Strategy function) rather than for a training exercise.

## After generating

Set `phase: "done"` in the state file. Tell the user plainly what was produced and where gate decisions from the audit phase (Phase 5) ended up — if anything was accepted as a known limitation rather than fixed, that should be visible to whoever reads the final brief next, not buried.
