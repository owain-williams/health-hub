# Extraction

Turning one Record into a set of candidate Facts. Where AI models are applied and compared.

## Language

**Extraction Run**:
One attempt to extract Facts from one Record, with a given model and configuration. A Record can have many Runs.
_Avoid_: Job, parse, scan, analysis

**Current Run**:
The one Run per Record whose Facts the Timeline uses. The newest non-Failed Run becomes Current automatically; a Pinned Run overrides that.
_Avoid_: Active run, latest run

**Pinned**:
A Run held as Current by hand, regardless of newer Runs. Used during model evaluation.
_Avoid_: Locked, frozen

**Completed**:
A Run that read every page of its Record.

**Partial**:
A Run that read some pages but produced nothing from others. Records which pages were unreadable. Can be Current.
_Avoid_: Incomplete, degraded

**Failed**:
A Run that produced no Facts. Can never be Current.
_Avoid_: Errored, aborted

**Candidate Fact**:
A Fact as produced by a Run. Becomes a Timeline Fact the moment its Run becomes Current; there is no review step.
_Avoid_: Extraction result, finding

**Comparison**:
Two or more Runs over the same Record viewed side by side to judge models. Developer-facing; never shown to a Person.
_Avoid_: Evaluation, benchmark, A/B
