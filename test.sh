#!/bin/bash

# claude-docs test suite
# Usage:
#   ./test.sh          Run all tests, cleanup after
#   ./test.sh --keep   Run tests, keep test directory for manual testing

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEST_DIR="/tmp/claude-docs-test-$$"
KEEP_DIR=false

[[ "$1" == "--keep" ]] && KEEP_DIR=true

# Cleanup function - runs on exit (success or failure)
cleanup() {
  if [[ "$KEEP_DIR" == true ]]; then
    echo ""
    echo -e "${YELLOW}Test directory preserved:${NC} $TEST_DIR"
    echo ""
    echo "Manual test commands:"
    echo "  cd $TEST_DIR"
    echo "  claude \"/research where is authentication?\""
    echo "  claude \"/research Next.js app router\""
    echo ""
    echo "Cleanup when done: rm -rf $TEST_DIR"
  else
    rm -rf "$TEST_DIR" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Expected files (single source of truth)
EXPECTED_COMMANDS=("sync-docs.md" "research.md")
EXPECTED_AGENTS=("codebase-locator.md" "codebase-analyzer.md" "codebase-pattern-finder.md" "web-search-researcher.md")

echo "=== claude-docs test suite ==="
echo ""

# Phase 1: Build
echo "[1/4] Building..."
npm run build --silent
echo -e "${GREEN}[ok]${NC} Build succeeded"

# Phase 2: Setup test directory
echo ""
echo "[2/4] Creating test project..."
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Create a realistic test project
cat > package.json << 'EOF'
{
  "name": "test-project",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0"
  }
}
EOF

mkdir -p src/auth src/api
echo 'export function login() { return true; }' > src/auth/login.ts
echo 'export function handler() { return "ok"; }' > src/api/route.ts
echo 'export default function App() { return null; }' > src/index.tsx

echo -e "${GREEN}[ok]${NC} Test project created"

# Phase 3: Run CLI
echo ""
echo "[3/4] Running claude-docs..."
node "$SCRIPT_DIR/dist/index.js" --skip-mcp

# Phase 4: Verify outputs
echo ""
echo "[4/4] Verifying outputs..."

fail() {
  echo -e "${RED}[FAIL]${NC} $1"
  exit 1
}

pass() {
  echo -e "${GREEN}[ok]${NC} $1"
}

# Check all expected files exist and have content
for cmd in "${EXPECTED_COMMANDS[@]}"; do
  file=".claude/commands/$cmd"
  [[ -f "$file" ]] || fail "$file missing"
  [[ -s "$file" ]] || fail "$file is empty"
  pass "$file"
done

for agent in "${EXPECTED_AGENTS[@]}"; do
  file=".claude/agents/$agent"
  [[ -f "$file" ]] || fail "$file missing"
  [[ -s "$file" ]] || fail "$file is empty"
  # Check frontmatter
  grep -q "^---" "$file" || fail "$file missing frontmatter"
  pass "$file"
done

# Verify research.md has key sections
grep -q "Routing Strategy" ".claude/commands/research.md" || fail "research.md missing routing strategy"
grep -q "@codebase-locator" ".claude/commands/research.md" || fail "research.md missing agent references"
pass "research.md has required sections"

# Test idempotency
echo ""
echo "Testing idempotency..."
node "$SCRIPT_DIR/dist/index.js" --skip-mcp > /dev/null 2>&1
pass "Second run succeeded"

echo ""
echo -e "${GREEN}=== All tests passed ===${NC}"
