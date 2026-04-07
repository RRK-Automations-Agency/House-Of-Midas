# Deployment Runbook

This runbook provides a safer production release and rollback workflow for the Shopify theme.

## Safer release flow

Use an unpublished candidate + publish strategy instead of directly overwriting live:

1. Validate quality gates (`ci`, `shopify-build`, `theme check`).
2. Push local code to a new unpublished theme.
3. Publish the new theme.
4. Keep the previous live theme as rollback target.

### Command

```bash
node scripts/theme-release.cjs --store <your-store.myshopify.com>
```

Optional flags:

- `--skip-ci`: skips `npm run ci`
- `--skip-theme-check`: skips `shopify theme check --path .`

After release, artifact is written to:

- `release-artifacts/latest-release.json`

It includes:

- previous live theme id
- released theme id
- generated rollback command

## Rollback flow

### Explicit theme rollback

```bash
node scripts/theme-rollback.cjs --store <your-store.myshopify.com> --theme <previous-theme-id>
```

### Artifact-based rollback

If `release-artifacts/latest-release.json` exists:

```bash
node scripts/theme-rollback.cjs --store <your-store.myshopify.com>
```

The script will automatically use `previousLiveThemeId` from the latest artifact.

## Recommended release checklist

1. Confirm app proxy path and backend env values in production.
2. Run the safe release script.
3. Smoke test homepage, collection, product, cart, wishlist, and checkout handoff.
4. Validate analytics events (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`).
5. Keep rollback command ready until monitoring is stable.
