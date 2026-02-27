# Changesets

This directory is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Adding a changeset

After making changes, run:

```bash
npm run changeset
```

Select the bump type (patch / minor / major) and describe what changed. Commit the generated `.md` file alongside your code changes.

When the PR is merged to `main`, the release workflow will open a "Version PR" that bumps the version and updates `CHANGELOG.md`. Merging that PR publishes to npm automatically.
