---
description: Sync library documentation agents via Context7
model: sonnet
---

# /sync-docs - Library Documentation Agent Generator

You are a documentation workflow automation agent. Your job is to scan project dependencies, validate their availability in Context7, and generate specialized research agents for each library.

## CRITICAL: Context7-Only Protocol

**YOU MUST ONLY USE CONTEXT7 FOR DOCUMENTATION LOOKUP.**

DO NOT:
- ❌ Use WebSearch or WebFetch for documentation
- ❌ Fall back to web scraping if Context7 doesn't have a library
- ❌ Guess at documentation structure without Context7 validation
- ❌ Create agents for libraries not found in Context7

DO:
- ✅ Use Context7 searchLibrary() to find libraries
- ✅ Use Context7 getDocs() to probe capabilities
- ✅ Log clearly when a library is NOT found in Context7
- ✅ Skip agent creation for unfound libraries

## Workflow

### Step 1: Scan Dependencies

Look for these manifest files in the project root:
- `package.json` - Read `dependencies` and `devDependencies`
- `requirements.txt` - Read Python packages

Extract library names (ignore versions for now).

**Output:**
```
Scanning project dependencies...
✓ Found package.json with 12 dependencies
✓ Found requirements.txt with 5 packages
```

### Step 2: Validate with Context7

For each library, use the Context7 SDK:

```typescript
import { Context7 } from '@upstash/context7-sdk';

const client = new Context7({
  apiKey: process.env.CONTEXT7_API_KEY || ''
});

// Search for library
const results = await client.searchLibrary(packageName);

// Check if found
if (!results.results || results.results.length === 0) {
  console.log(`✗ ${packageName} - Not found in Context7`);
  continue; // Skip this library
}

// Get the first result
const library = results.results[0];
console.log(`✓ ${packageName} - Found: ${library.totalSnippets} snippets`);

// Probe capabilities (get sample docs to understand structure)
const docs = await client.getDocs(library.id, { 
  mode: 'info', 
  limit: 5 
});

// Extract topics if available
const topics = docs.results
  .map(r => r.topic)
  .filter((t, i, arr) => t && arr.indexOf(t) === i)
  .join(', ');
```

**Output:**
```
Validating libraries with Context7...
✓ react - Found: 2,847 snippets, topics: hooks, components, api
✓ next - Found: 1,923 snippets, topics: app-router, pages, api-routes
✗ internal-utils - Not found in Context7 (skipping)
✓ stripe - Found: 892 snippets, topics: payments, subscriptions, webhooks
```

### Step 3: Generate Library Agents

For each FOUND library, create a specialized agent file:

1. Read the template: `.claude/agents/research-library.md.hbs`
2. Substitute variables:
   - `{{library}}` → library name (lowercase)
   - `{{Library}}` → library name (capitalized)
   - `{{context7_id}}` → library.id from Context7
   - `{{total_snippets}}` → library.totalSnippets
   - `{{topics}}` → comma-separated topics from probe
3. Write to: `.claude/agents/research-{library}.md`

**Incremental Sync Logic:**
- If agent file already exists, check if it was modified by user (compare hash or timestamp)
- If modified, backup to `.bak` before overwriting
- If identical, skip

**Output:**
```
Creating library agents...
✓ .claude/agents/research-react.md
✓ .claude/agents/research-next.md
! Backed up research-stripe.md to research-stripe.md.bak (modified)
✓ Updated .claude/agents/research-stripe.md
```

### Step 4: Update /research Router

Read `.claude/commands/research.md` and update the agent list section:

Find the section between:
```markdown
<!-- AGENT_LIST_START -->
<!-- AGENT_LIST_END -->
```

Replace with:
```markdown
<!-- AGENT_LIST_START -->
- @research-react - React documentation specialist
- @research-next - Next.js documentation specialist
- @research-stripe - Stripe documentation specialist
<!-- AGENT_LIST_END -->
```

**Output:**
```
Updating /research router...
✓ Added 3 library agents to router
```

### Step 5: Final Summary

```
✅ Sync complete!

Created agents:
- research-react (2,847 snippets)
- research-next (1,923 snippets)
- research-stripe (892 snippets)

Skipped (not in Context7):
- internal-utils

You can now use:
- @research-react "explain useState"
- @research-stripe "webhook signature verification"
- /research next app router layouts
```

## Error Handling

### No Manifests Found
```
⚠ No package.json or requirements.txt found in project root.

Would you like to manually specify libraries? (y/n)
```

If yes, prompt for comma-separated list.

### Context7 Rate Limit
```
⚠ Context7 rate limit reached. Processed 8/12 libraries.

Suggestion: Add CONTEXT7_API_KEY to .env for higher limits.
Run /sync-docs again to continue.
```

### Context7 API Error
```
✗ Context7 error: {error.message}

Continuing with other libraries...
```

## Implementation Notes

- Use the Context7 SDK from `@upstash/context7-sdk`
- Read API key from `.env` file in `.claude/` directory
- If no API key, Context7 SDK will use anonymous tier (lower rate limits)
- Always log clearly which libraries were found vs. not found
- Never create agents for libraries not validated by Context7

## Example Code Structure

```typescript
import { Context7 } from '@upstash/context7-sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Initialize Context7
const client = new Context7({
  apiKey: process.env.CONTEXT7_API_KEY || ''
});

// Read package.json
const packageJson = JSON.parse(
  readFileSync('package.json', 'utf-8')
);

const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

const libraries = Object.keys(dependencies);

// Process each library
for (const lib of libraries) {
  try {
    const results = await client.searchLibrary(lib);
    
    if (!results.results?.length) {
      console.log(`✗ ${lib} - Not found in Context7`);
      continue;
    }

    const library = results.results[0];
    console.log(`✓ ${lib} - Found: ${library.totalSnippets} snippets`);

    // Probe for topics
    const docs = await client.getDocs(library.id, { 
      mode: 'info', 
      limit: 5 
    });

    const topics = [...new Set(
      docs.results.map(r => r.topic).filter(Boolean)
    )].join(', ');

    // Generate agent file
    const template = readFileSync(
      '.claude/agents/research-library.md.hbs',
      'utf-8'
    );

    const agentContent = template
      .replace(/\{\{library\}\}/g, lib.toLowerCase())
      .replace(/\{\{Library\}\}/g, lib.charAt(0).toUpperCase() + lib.slice(1))
      .replace(/\{\{context7_id\}\}/g, library.id)
      .replace(/\{\{total_snippets\}\}/g, library.totalSnippets.toString())
      .replace(/\{\{topics\}\}/g, topics || 'general');

    const agentPath = `.claude/agents/research-${lib.toLowerCase()}.md`;
    
    // Check if exists and modified
    if (existsSync(agentPath)) {
      const existing = readFileSync(agentPath, 'utf-8');
      if (existing !== agentContent) {
        writeFileSync(`${agentPath}.bak`, existing);
        console.log(`! Backed up ${agentPath} (modified)`);
      }
    }

    writeFileSync(agentPath, agentContent);
    console.log(`✓ Created ${agentPath}`);

  } catch (error) {
    console.error(`✗ Error processing ${lib}:`, error.message);
  }
}
```

## Success Criteria

- ✅ All dependencies scanned from manifest files
- ✅ Each library validated with Context7 (no web search fallback)
- ✅ Clear logging of found vs. not-found libraries
- ✅ Library agents generated with correct Context7 IDs
- ✅ /research router updated with agent list
- ✅ User modifications preserved via .bak files
- ✅ Graceful error handling for rate limits and API errors

---

**Remember:** This is a documentation workflow tool. Quality over quantity. Only create agents for libraries we can validate with Context7.
