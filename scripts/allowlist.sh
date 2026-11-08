#!/usr/bin/env bash
# Manage the Allowlist: the email addresses permitted to create an Account while sign-up is closed.
#
#   scripts/allowlist.sh list            [--remote]
#   scripts/allowlist.sh add <email>     [--remote]
#   scripts/allowlist.sh remove <email>  [--remote]
#
# --remote targets the deployed database (needs DATABASE_URL in your shell for direct Cloudflare deploys).
set -euo pipefail
cd "$(dirname "$0")/.."

usage() { sed -n 2,8p "$0" | sed 's/^# \{0,1\}//'; exit 1; }

command="${1:-}"; shift || true
email=""; remote=()
for arg in "$@"; do
  case "$arg" in
    --remote) remote=(--remote) ;;
    *) email="$arg" ;;
  esac
done

normalise() {
  local value
  value="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
  # Strict shape check: also keeps the value safe to place inside a SQL string literal.
  if ! [[ "$value" =~ ^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$ ]]; then
    echo "Not an email address: $1" >&2; exit 1
  fi
  printf '%s' "$value"
}

case "$command" in
  list)
    pnpm exec void db execute ${remote[@]+"${remote[@]}"} "select email, added_at from allowlist order by added_at" ;;
  add)
    [[ -n "$email" ]] || usage
    e="$(normalise "$email")"
    pnpm exec void db execute ${remote[@]+"${remote[@]}"} "insert into allowlist (email) values ('$e') on conflict (email) do nothing"
    echo "Added $e" ;;
  remove)
    [[ -n "$email" ]] || usage
    e="$(normalise "$email")"
    pnpm exec void db execute ${remote[@]+"${remote[@]}"} "delete from allowlist where email = '$e'"
    echo "Removed $e" ;;
  *) usage ;;
esac
