"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Github, ArrowLeft, Activity, Shield, Zap } from "lucide-react";

export default function SignInPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    if (status === "loading") {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
            </div>
        );
    }

    if (session) return null;

    return (
        <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 25%, #faf5ff 60%, #eff6ff 100%)",
        }}>
            {/* Animated CSS */}
            <style>{`
                @keyframes scroll-left {
                    0% { transform: translateX(50%); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(50%); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -20px) scale(1.05); }
                    66% { transform: translate(-20px, 15px) scale(0.95); }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.9); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.2; }
                    100% { transform: scale(0.9); opacity: 0.5; }
                }
                @keyframes card-enter {
                    0% { opacity: 0; transform: translateY(30px) scale(0.96); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .signin-github-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.2) !important;
                }
                .signin-back-link:hover {
                    color: #3b82f6 !important;
                }
            `}</style>

            {/* Scrolling background text - tilted */}
            <div style={{
                position: "absolute",
                inset: "-30%",
                overflow: "hidden",
                zIndex: 0,
                pointerEvents: "none",
                transform: "rotate(-6deg)",
            }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} style={{
                        position: "absolute",
                        top: `${i * 12}%`,
                        whiteSpace: "nowrap",
                        fontSize: "clamp(4rem, 8vw, 7rem)",
                        fontWeight: 900,
                        letterSpacing: "-0.04em",
                        color: "rgba(99,102,241,0.04)",
                        animation: `${i % 2 === 0 ? "scroll-left" : "scroll-right"} ${20 + i * 2}s linear infinite`,
                        userSelect: "none",
                    }}>
                        DevMetrics &nbsp;·&nbsp; DevMetrics &nbsp;·&nbsp; DevMetrics &nbsp;·&nbsp; DevMetrics &nbsp;·&nbsp; DevMetrics &nbsp;·&nbsp; DevMetrics &nbsp;·&nbsp; DevMetrics &nbsp;·&nbsp; DevMetrics
                    </div>
                ))}
            </div>

            {/* Floating gradient orbs */}
            <div style={{
                position: "absolute", top: "10%", left: "15%",
                width: "300px", height: "300px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
                filter: "blur(40px)", animation: "float-slow 12s ease-in-out infinite",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", bottom: "10%", right: "10%",
                width: "350px", height: "350px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
                filter: "blur(40px)", animation: "float-slow 15s ease-in-out infinite reverse",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", top: "50%", left: "60%",
                width: "200px", height: "200px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
                filter: "blur(40px)", animation: "float-slow 18s ease-in-out infinite",
                pointerEvents: "none",
            }} />

            {/* Main card */}
            <div style={{
                position: "relative",
                zIndex: 10,
                width: "100%",
                maxWidth: "440px",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: "24px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
                padding: "48px 40px",
                textAlign: "center" as const,
                animation: "card-enter 0.6s ease-out",
            }}>
                {/* Logo */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "8px",
                }}>
                    <div style={{
                        width: "42px", height: "42px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(59,130,246,0.25)",
                    }}>
                        <Activity size={22} color="white" />
                    </div>
                    <span style={{
                        fontSize: "1.8rem",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        DevMetrics
                    </span>
                </div>

                <p style={{
                    color: "#6b7280",
                    fontSize: "0.95rem",
                    marginBottom: "36px",
                    lineHeight: "1.6",
                }}>
                    Quick sign in, then we'll show you the good stuff
                </p>

                {/* Features */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "24px",
                    marginBottom: "32px",
                }}>
                    {[
                        { icon: <Zap size={16} />, label: "Live Stats" },
                        { icon: <Shield size={16} />, label: "Safe & Secure" },
                        { icon: <Activity size={16} />, label: "AI Insights" },
                    ].map((f) => (
                        <div key={f.label} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            color: "#9ca3af",
                        }}>
                            <span style={{ color: "#8b5cf6" }}>{f.icon}</span>
                            {f.label}
                        </div>
                    ))}
                </div>

                {/* GitHub button */}
                <button
                    onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                    className="signin-github-btn"
                    id="github-signin-btn"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        width: "100%",
                        padding: "16px 32px",
                        background: "#111827",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "1rem",
                        border: "none",
                        borderRadius: "14px",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                        fontFamily: "inherit",
                    }}
                >
                    <Github size={20} />
                    Continue with GitHub
                </button>

                {/* Divider */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    margin: "24px 0",
                    color: "#d1d5db",
                    fontSize: "0.75rem",
                }}>
                    <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.06)" }} />
                    <span>SECURE · PRIVATE · FAST</span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.06)" }} />
                </div>

                {/* Back link */}
                <a
                    href="/"
                    className="signin-back-link"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                        color: "#9ca3af",
                        textDecoration: "none",
                        fontWeight: 500,
                        transition: "color 0.2s",
                    }}
                >
                    <ArrowLeft size={14} />
                    Back to home
                </a>
            </div>
        </div>
    );
}
