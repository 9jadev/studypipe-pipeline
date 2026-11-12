# Direction script template

The direction script is what a human approves before anything is built. Keep it scannable: one table per chapter.

```markdown
# Direction Script: <Lesson / topic>

## Overview
<One sentence: what the video resolves and where it sits in the lesson.>

| Item | Decision |
| --- | --- |
| Running time | About N minutes, C chapters, L narration lines |
| Narrator | One teacher voice, Nigerian English |
| Level | <class>, WAEC / NECO / JAMB |
| Theme | Unit theme (default, follows the lesson) / or a named world: safari, vegetation, fiesta, classic |
| Kits used | <graph, circuit, ...> |

**Colour roles:** <table: symbol, meaning, colour>

**Accuracy notes:** <anything in the source that needed care>

## Chapter 1: <title> (<purpose>, about <m min s s>)
<One sentence on what this chapter achieves.>

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 1.1 | <exact words> | <board line in plain symbols; kit state change; 📷 shot, e.g. 📷 WIDE → voltmeter> | <hook / definition / step / check ...> |

... one section per chapter ...

## Build checks and kit gaps
<Table of every number and its expected value.>
<Kits used, and any KIT GAP blocks with the fallback.>
```

Narration in the script must be word-for-word what goes into `say`. Board lines may be written in plain symbols (3.6 / 3.0 = 1.2 Ω); the plan writes them in LaTeX.
