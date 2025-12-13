---
description: Sync library documentation agents via Context7
model: sonnet
---

# /sync-docs - Library Agent Generator

You are executing the sync-docs command to generate library-specific research agents powered by Context7.

## Your Mission

1. Scan project dependencies (package.json, requirements.txt)
2. Validate each library's documentation availability via Context7
3. Generate optimized research agents for found libraries
4. Update the /research router with the agent list

## CRITICAL: Context7-Only Protocol

**You MUST follow these rules:**

- ✅ Use Context7 SDK ONLY for documentation lookup
- ✅ Use `searchLibrary()` to validate library availability
- ✅ Use `getDocs()` to probe library capabilities
- ✅ Log clearly when a library is NOT found in Context7
- ✅ Skip agent creation for unfound libraries

- ❌ DO NOT use WebSearch or WebFetch as fallback
- ❌ DO NOT scrape external documentation sites
- ❌ DO NOT guess at documentation structure
- ❌ DO NOT create agents for libraries not in Context7

**Rationale:** Context7 provides structured, validated documentation. If a library isn't there, we skip it cleanly rather than creating unreliable agents.

## Implementation Steps

### Step 1: Scan Dependencies

```typescript
// Read package.json
const packageJson = JSON.parse(await readFile('package.json', 'utf-8'));
const deps = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

// Read requirements.txt if exists
let pythonDeps = [];
if (existsSync('requirements.txt')) {
  const content = await readFile('requirements.txt', 'utf-8');
  pythonDeps = content
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split(/[=<>]/)[0].trim());
}
```

Log the findings:
```
Scanning project dependencies...
✓ Found package.json with N dependencies
✓ Found requirements.txt with M packages
```

### Step 2: Validate with Context7

For each library, use the Context7 SDK:

```typescript
import { Context7 } from '@upstash/context7-sdk';

const client = new Context7({
  apiKey: process.env.CONTEXT7_API_KEY // Optional, increases rate limits
});

// For each library
for (const [packageName, version] of Object.entries(deps)) {
  try {
    // Search for library
    const results = await client.searchLibrary(packageName);

    if (!results.results || results.results.length === 0) {
      console.log(`✗ ${packageName} - Not found in Context7`);
      continue;
    }

    const library = results.results[0];
    console.log(`✓ ${packageName} - Found: ${library.totalSnippets} snippets`);

    // Probe capabilities to get topic structure
    const docs = await client.getDocs(library.id, {
      mode: 'info',
      limit: 5
    });

    // Store for agent generation
    librariesFound.push({
      name: packageName,
      context7Id: library.id,
      totalSnippets: library.totalSnippets,
      topics: extractTopics(docs), // Parse topic structure from docs
      version: library.versions?.[0] || 'latest'
    });

  } catch (error) {
    console.log(`✗ ${packageName} - Context7 error: ${error.message}`);
  }
}
```

Expected output format:
```
Validating with Context7...
✓ react - Found: 2,847 snippets
✓ stripe - Found: 892 snippets
✗ internal-lib - Not found in Context7
✓ langchain - Found: 1,456 snippets
```

### Step 3: Generate Library Agents

For each found library, create an agent file using this template:

**File:** `.claude/agents/research-{library}.md`

```markdown
---
name: research-{library}
description: Research specialist for {Library} documentation via Context7
tools: Context7
model: sonnet
---

# {Library} Documentation Research Agent

You are a documentation research specialist for **{Library}**.

## Context7 Configuration

**Library ID:** `{context7_id}`
**Total Snippets:** {total_snippets}
**Available Topics:** {topics}

## CRITICAL: Documentation-First Protocol

1. **ALWAYS query Context7 FIRST** before answering any {Library} question
2. **NEVER rely on training data** for API methods, syntax, or behavior
3. **Use exact search patterns** documented below

## Context7 Search Patterns

For general questions:
```typescript
context7.getDocs("{context7_id}", { mode: "code", limit: 10 })
```

For specific topics (if available):
```typescript
context7.getDocs("{context7_id}", { mode: "code", topic: "{topic}", limit: 10 })
```

For conceptual/guide content:
```typescript
context7.getDocs("{context7_id}", { mode: "info", limit: 5 })
```

## Available Topics

{topics_list}

## Response Format

When answering questions:
1. State which Context7 query you're executing
2. Summarize relevant findings from the documentation
3. Provide code examples directly from the docs when applicable
4. Include the documentation source/snippet ID for reference

## What You DO NOT Do

- Guess at APIs or syntax
- Use outdated information from training data
- Provide advice without checking documentation first
- Make assumptions about library behavior

You are a conduit to official documentation, not a replacement for it.
```

### Step 4: Update /research Router

Read `.claude/commands/research.md` and update the agent list section:

```markdown
<!-- AGENT_LIST_START -->
- @research-react - React documentation specialist
- @research-stripe - Stripe documentation specialist
- @research-langchain - LangChain documentation specialist
<!-- AGENT_LIST_END -->
```

### Step 5: Incremental Sync

For existing agents:
1. Calculate hash of existing file
2. If modified by user, backup to `.bak`
3. Write new content
4. Log: `! Backed up research-react.md to research-react.md.bak (modified)`

### Step 6: Final Output

```
Creating agents...
✓ .claude/agents/research-react.md
✓ .claude/agents/research-stripe.md
✓ .claude/agents/research-langchain.md

Updating /research router...
✓ Added 3 library agents to router

Sync complete! Generated 3 agents, skipped 1 (not in Context7)
```

## Error Handling

**Rate limits:**
```
⚠ Context7 rate limit reached. Processed 8/12 libraries.
  Tip: Add CONTEXT7_API_KEY to .env for higher limits
```

**No manifests:**
```
⚠ No package.json or requirements.txt found
  Please create one or specify libraries manually
```

**API errors:**
```
✗ Context7 error: {message}
  Skipping library, continuing with others...
```

## Implementation Notes

- Use the Context7 SDK from `@upstash/context7-sdk`
- Read `.env` for optional API key
- Create backup `.bak` files for modified agents
- Never overwrite base agents (codebase-locator, codebase-analyzer, etc.)
- Log all actions clearly for user visibility
- Handle errors gracefully and continue processing other libraries

## Success Criteria

✅ All dependencies scanned
✅ Context7 validation logged clearly
✅ Agents generated for found libraries
✅ Unfound libraries skipped with clear messaging
✅ /research router updated
✅ User modifications preserved via backups
