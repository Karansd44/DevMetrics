export function ProfileCardSkeleton() {
    return (
        <div className="glass-card profile-card" style={{ padding: "32px 24px" }}>
            <div className="skeleton" style={{ width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 16px" }} />
            <div className="skeleton" style={{ width: "120px", height: "20px", borderRadius: "6px", margin: "0 auto 8px" }} />
            <div className="skeleton" style={{ width: "80px", height: "14px", borderRadius: "4px", margin: "0 auto 12px" }} />
            <div className="skeleton" style={{ width: "100%", height: "40px", borderRadius: "6px", marginTop: "12px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                <div className="skeleton" style={{ width: "100%", height: "16px", borderRadius: "4px" }} />
                <div className="skeleton" style={{ width: "100%", height: "16px", borderRadius: "4px" }} />
                <div className="skeleton" style={{ width: "100%", height: "16px", borderRadius: "4px" }} />
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="glass-card stat-card" style={{ padding: "22px" }}>
            <div className="skeleton" style={{ width: "46px", height: "46px", borderRadius: "12px" }} />
            <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: "80px", height: "12px", borderRadius: "4px", marginBottom: "8px" }} />
                <div className="skeleton" style={{ width: "60px", height: "28px", borderRadius: "6px" }} />
            </div>
        </div>
    );
}

export function ChartCardSkeleton({ height = "280px" }: { height?: string }) {
    return (
        <div className="glass-card chart-card" style={{ padding: "28px" }}>
            <div className="skeleton" style={{ width: "160px", height: "18px", borderRadius: "6px", marginBottom: "20px" }} />
            <div className="skeleton" style={{ width: "100%", height, borderRadius: "12px" }} />
        </div>
    );
}

export function RepoCardSkeleton() {
    return (
        <div className="glass-card repo-card" style={{ padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div className="skeleton" style={{ width: "140px", height: "16px", borderRadius: "4px" }} />
                <div className="skeleton" style={{ width: "14px", height: "14px", borderRadius: "50%" }} />
            </div>
            <div className="skeleton" style={{ width: "100%", height: "32px", borderRadius: "6px", marginBottom: "14px" }} />
            <div style={{ display: "flex", gap: "14px" }}>
                <div className="skeleton" style={{ width: "60px", height: "12px", borderRadius: "4px" }} />
                <div className="skeleton" style={{ width: "40px", height: "12px", borderRadius: "4px" }} />
                <div className="skeleton" style={{ width: "40px", height: "12px", borderRadius: "4px" }} />
                <div className="skeleton" style={{ width: "50px", height: "12px", borderRadius: "4px" }} />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div style={{ paddingTop: "80px", padding: "32px", maxWidth: "1280px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: "36px" }}>
                <div className="skeleton" style={{ width: "200px", height: "32px", borderRadius: "8px", marginBottom: "8px" }} />
                <div className="skeleton" style={{ width: "280px", height: "16px", borderRadius: "4px" }} />
            </div>

            {/* Profile + Stats */}
            <div className="dashboard-top-row" style={{ marginBottom: "24px" }}>
                <ProfileCardSkeleton />
                <div className="stats-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => <StatCardSkeleton key={i} />)}
                </div>
            </div>

            {/* Activity Timeline */}
            <ChartCardSkeleton height="220px" />

            {/* Language Charts */}
            <div className="charts-row" style={{ marginTop: "24px" }}>
                <ChartCardSkeleton />
                <ChartCardSkeleton />
            </div>

            {/* Event + AI */}
            <div className="charts-row" style={{ marginTop: "24px" }}>
                <ChartCardSkeleton height="200px" />
                <ChartCardSkeleton height="200px" />
            </div>

            {/* Recent Repos */}
            <div style={{ marginTop: "24px" }}>
                <div className="skeleton" style={{ width: "180px", height: "20px", borderRadius: "6px", marginBottom: "20px" }} />
                <div className="repos-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => <RepoCardSkeleton key={i} />)}
                </div>
            </div>
        </div>
    );
}
