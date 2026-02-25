# Debug Steps for Private Repos Issue

## The Problem
Private repos showing as 0 even though you have 1 private repo.

## Most Likely Cause
You authenticated BEFORE the `repo` scope was properly configured. Even though the OAuth scope includes `repo`, GitHub only grants permissions when you authenticate. Old sessions don't get new permissions automatically.

## Solution Steps

### Step 1: Clear Your Session (Sign Out)
1. Click your profile/logout button in the navbar
2. Or manually clear browser cookies for localhost:5173

### Step 2: Clear Server Cache
Visit this URL in your browser:
```
http://localhost:3001/api/github/clear-cache
```

You should see: `{"message":"Cache cleared","timestamp":...}`

### Step 3: Re-authenticate
1. Go back to http://localhost:5173
2. Click "Sign in with GitHub"
3. GitHub will ask for permissions again - **MAKE SURE TO GRANT ACCESS TO PRIVATE REPOS**
4. After signing in, check the dashboard

### Step 4: Check Server Logs
In your terminal where the Express server is running, you should now see:
```
[GitHub Stats] Fetching fresh data for: [username]
[GitHub Stats] Total repos fetched: X
[GitHub Stats] ALL repos: [list of repos with private:true/false]
[GitHub Stats] Found private repo: [repo-name]
[GitHub Stats] Final counts - Total: X Public: Y Private: 1
```

## Alternative: If Re-auth Doesn't Work

The issue could be the GitHub API query parameters. Try this alternative:

### Check OAuth App Settings
1. Go to https://github.com/settings/developers
2. Click on your OAuth App (DevMetrics)
3. Make sure the callback URL is correct
4. Check "Authorized OAuth Apps" - you might need to revoke DevMetrics and re-authorize

### GitHub API Endpoint
We're using:
```
/user/repos?per_page=100&sort=updated&type=all&affiliation=owner,collaborator
```

This should include:
- `type=all` - both public and private repos
- `affiliation=owner,collaborator` - repos you own or collaborate on

## Debugging Output
After following steps above, if it still shows 0, check the server logs for the `ALL repos` line. It will show exactly what GitHub is returning, including the `private` property for each repo.

## Common Issues
1. **Old OAuth token** - Re-authenticate fixes this
2. **GitHub not granting private repo access** - Check OAuth app permissions
3. **Wrong affiliation** - The query should include `affiliation=owner` at minimum
4. **Repo belongs to organization** - Add `affiliation=organization_member` if your private repo is in an org
