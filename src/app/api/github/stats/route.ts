// src/app/api/github/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const headers = { Authorization: `Bearer ${session.accessToken}` };

    try {
        // 1. Fetch User Profile
        const userRes = await fetch("https://api.github.com/user", { headers });
        const userData = await userRes.json();

        // 2. Fetch Repos (limit to 100, sorted by recently updated)
        const reposRes = await fetch(
            `https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner`,
            { headers }
        );
        const repos = await reposRes.json();

        // 3. Fetch recent events for activity
        const eventsRes = await fetch(
            `https://api.github.com/users/${userData.login}/events?per_page=30`,
            { headers }
        );
        const events = await eventsRes.json();

        // 4. Calculate Metrics
        let totalStars = 0;
        let totalForks = 0;
        let totalWatchers = 0;
        let totalOpenIssues = 0;
        const languageMap: Record<string, number> = {};
        const languageSizeMap: Record<string, number> = {};

        repos.forEach((repo: any) => {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
            totalWatchers += repo.watchers_count;
            totalOpenIssues += repo.open_issues_count;

            if (repo.language) {
                languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
                languageSizeMap[repo.language] = (languageSizeMap[repo.language] || 0) + (repo.size || 0);
            }
        });

        // Convert language map to chart array
        const topLanguages = Object.keys(languageMap)
            .map((lang) => ({
                language: lang,
                count: languageMap[lang],
                size: languageSizeMap[lang],
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 7);

        // 5. Recent repos (top 6 most recently updated)
        const recentRepos = repos.slice(0, 6).map((repo: any) => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: repo.updated_at,
            htmlUrl: repo.html_url,
            isPrivate: repo.private,
        }));

        // 6. Activity timeline from events
        const activityMap: Record<string, number> = {};
        const eventTypes: Record<string, number> = {};
        if (Array.isArray(events)) {
            events.forEach((event: any) => {
                const date = new Date(event.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                activityMap[date] = (activityMap[date] || 0) + 1;
                const type = event.type?.replace("Event", "") || "Other";
                eventTypes[type] = (eventTypes[type] || 0) + 1;
            });
        }

        const activityTimeline = Object.entries(activityMap)
            .map(([date, count]) => ({ date, events: count }))
            .reverse()
            .slice(-14);

        return NextResponse.json({
            user: {
                login: userData.login,
                name: userData.name,
                avatarUrl: userData.avatar_url,
                bio: userData.bio,
                publicRepos: userData.public_repos,
                followers: userData.followers,
                following: userData.following,
                createdAt: userData.created_at,
                htmlUrl: userData.html_url,
            },
            stats: {
                totalStars,
                totalForks,
                totalRepos: repos.length,
                totalWatchers,
                totalOpenIssues,
                topLanguages,
            },
            recentRepos,
            activityTimeline,
            eventTypes: Object.entries(eventTypes)
                .map(([type, count]) => ({ type, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6),
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}