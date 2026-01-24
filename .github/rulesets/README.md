# GitHub Branch Rulesets Configuration

This directory contains GitHub branch protection rulesets for the repository.

## Main Branch Protection

**File**: `main-branch-protection.json`

### Active Rules

The following protection rules are currently configured for the `main` branch:

#### 1. Pull Request Requirements
- **Required Approvals**: 1 approval required before merge
- **Dismiss Stale Reviews**: Yes - reviews are dismissed when new commits are pushed
- **Require Code Owner Review**: No
- **Require Last Push Approval**: No
- **Require Conversation Resolution**: Yes - all PR comments must be resolved

#### 2. Status Checks
- **Require Branches Up to Date**: Yes - branches must be up to date with main before merging
- **Required Status Checks**: None configured (can be added as needed)

#### 3. Branch Protections
- **Block Deletions**: Yes - main branch cannot be deleted
- **Block Force Pushes**: Yes - force pushes are not allowed
- **Require Linear History**: Yes - merge commits prevented, squash or rebase required

#### 4. Bypass Actors
- No bypass permissions configured - all rules apply to everyone

## Configuration Options

### Available Rule Types

You can customize the ruleset by adjusting these parameters:

#### Pull Request Settings
```json
{
  "type": "pull_request",
  "parameters": {
    "required_approving_review_count": 1,        // 0-6 approvals
    "dismiss_stale_reviews_on_push": true,       // true/false
    "require_code_owner_review": false,          // true/false
    "require_last_push_approval": false,         // true/false
    "required_review_thread_resolution": true    // true/false
  }
}
```

#### Status Checks
```json
{
  "type": "required_status_checks",
  "parameters": {
    "strict_required_status_checks_policy": true,  // Require branches up to date
    "required_status_checks": [
      // Add workflow check names here, e.g.:
      // "build",
      // "test",
      // "lint"
    ]
  }
}
```

#### Additional Protection Rules
- `"type": "deletion"` - Prevents branch deletion
- `"type": "non_fast_forward"` - Blocks force pushes
- `"type": "required_linear_history"` - Enforces linear history (no merge commits)
- `"type": "required_signatures"` - Requires signed commits (GPG/SSH)

#### Bypass Actors
```json
"bypass_actors": [
  {
    "actor_id": 1,              // GitHub user/team/app ID
    "actor_type": "OrganizationAdmin",  // OrganizationAdmin, RepositoryRole, Team, etc.
    "bypass_mode": "always"     // always or pull_request
  }
]
```

## How to Apply Rulesets

### Option 1: Via GitHub UI
1. Go to repository Settings
2. Navigate to Rules → Rulesets
3. Click "New ruleset" → "New branch ruleset"
4. Use the values from `main-branch-protection.json` to configure the rules
5. Save the ruleset

### Option 2: Via GitHub API
```bash
# Create ruleset via API (requires admin token)
curl -X POST \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/OWNER/REPO/rulesets \
  -d @.github/rulesets/main-branch-protection.json
```

### Option 3: GitHub CLI
```bash
gh api repos/OWNER/REPO/rulesets \
  --method POST \
  --input .github/rulesets/main-branch-protection.json
```

## Customization Guide

### For Small Teams (1-3 developers)
- Set `required_approving_review_count: 1`
- Enable `dismiss_stale_reviews_on_push: true`
- Enable `required_review_thread_resolution: true`

### For Larger Teams (4+ developers)
- Set `required_approving_review_count: 2`
- Enable `require_code_owner_review: true`
- Add required status checks for CI/CD

### For Open Source Projects
- Set `required_approving_review_count: 1-2`
- Enable all conversation resolution requirements
- Add comprehensive status checks
- Consider requiring signed commits

## Modifying the Configuration

To update the ruleset:

1. Edit the JSON file in this directory
2. Apply changes via GitHub UI, API, or CLI (see above)
3. Commit the updated configuration to track changes over time

## References

- [GitHub Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub API - Rulesets](https://docs.github.com/en/rest/repos/rules)
