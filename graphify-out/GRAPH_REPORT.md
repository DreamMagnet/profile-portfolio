# Graph Report - profile-portfolio  (2026-10-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 35 nodes · 34 edges · 5 communities (1 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c658d7b1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 2
- Community 3
- Community 4

## God Nodes (most connected - your core abstractions)
1. `ContactForm` - 3 edges
2. `send_email()` - 3 edges
3. `getCompletedExperience()` - 2 edges
4. `updateExperience()` - 2 edges
5. `test()` - 2 edges
6. `assert` - 1 edges
7. `context` - 1 edges
8. `{ readFileSync }` - 1 edges
9. `{ resolve }` - 1 edges
10. `{ runInNewContext }` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (5 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (6): assert, context, { readFileSync }, { resolve }, { runInNewContext }, { test }

## Knowledge Gaps
- **6 isolated node(s):** `assert`, `context`, `{ readFileSync }`, `{ resolve }`, `{ runInNewContext }` (+1 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 27 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ContactForm` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `send_email()` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `test()` connect `Community 4` to `Community 1`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `assert`, `context`, `{ readFileSync }` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._