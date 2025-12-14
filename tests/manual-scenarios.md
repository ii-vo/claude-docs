# Manual Test Scenarios

Test agent routing behavior in Claude Code.

## Setup

```bash
# Create test environment with preserved directory
./test.sh --keep

# cd to the printed directory, then run scenarios below
```

## Scenarios

### 1. Codebase Locator
```
/research where is authentication?
```
**Expect:** Routes to @codebase-locator, returns `src/auth/login.ts`

### 2. Library Docs (Direct)
```
/research how do I use Next.js app router?
```
**Expect:** Routes to @research-nextjs (if synced), uses Context7

### 3. Feature Discovery
```
/research how does the API work?
```
**Expect:** @codebase-locator finds `src/api/`, then consults library docs

### 4. Pattern Finder
```
/research find function exports
```
**Expect:** Routes to @codebase-pattern-finder, shows code snippets

### 5. Web Search Fallback
```
/research best practices for API rate limiting
```
**Expect:** Routes to @web-search-researcher (general topic, no library)

### 6. Unknown Library
```
/research how do I use FakeLib?
```
**Expect:** Notes no agent exists, suggests `/sync-docs` or web search

## Failure Modes

| Symptom | Likely Cause |
|---------|--------------|
| "Agent not found" | `/sync-docs` not run |
| Context7 timeout | MCP server issue |
| Wrong routing | Router logic flaw |
| Hallucinated docs | Context7 not called |
