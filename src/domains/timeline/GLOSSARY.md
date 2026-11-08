# Timeline

The Person's Facts in time order, exactly as their Records state them. The single owner of Facts for every downstream context.

## Language

**Fact**:
One statement lifted from one Record: its value, the date it refers to, and where in the Record it came from. Never edited after extraction.
_Avoid_: Data point, entry, finding, result

**Fact Kind**:
The fixed vocabulary a Fact belongs to: Measurement, Medication, Appointment, Referral, Stated Diagnosis, Procedure, or Statement as the fallback.
_Avoid_: Fact type, category

**Stated Diagnosis**:
A diagnosis a Record states in its own words. Named to make clear Health Hub never infers one.
_Avoid_: Diagnosis, condition

**Undated**:
A Fact with no date of its own. Placed on the Timeline by its Record's date, then upload date as a last resort, and labelled as undated.
_Avoid_: Unknown date, approximate

**Source**:
The citation on a Fact: which Record and where in it (page, region) the Fact was lifted from. When the Record is a Person Statement the Source reads as stated by the Person on a date.
_Avoid_: Reference, origin, provenance

**Person's Account**:
The mark shown on any Fact whose Source is a Person Statement, so it is never mistaken for something a clinician wrote.
_Avoid_: Self-reported, user-entered

**Disputed**:
A mark a Person puts on a Fact they believe is wrong, with a note. The Fact stays visible and unchanged.
_Avoid_: Rejected, corrected, hidden
