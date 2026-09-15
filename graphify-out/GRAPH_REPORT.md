# Graph Report - profile-portfolio  (2026-09-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 13 nodes · 12 edges · 3 communities (1 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2aa565dd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 1
- Community 2

## God Nodes (most connected - your core abstractions)
1. `ContactForm` - 3 edges
2. `send_email()` - 3 edges
3. `test()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (3 total, 1 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.50
Nodes (4): ContactForm, send_email(), BaseModel, post

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ContactForm` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `send_email()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._