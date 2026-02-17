"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/auth/signin");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <p style={{ color: "var(--text-secondary)" }}>Loading DevMetrics...</p>
            </div>
        );
    }

    if (!session) return null;

    return <Dashboard />;
}
