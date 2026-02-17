"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart3, Code2, Sparkles, ArrowRight, Github } from "lucide-react";

export default function LandingPage() {
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

  if (session) return null; // Will redirect

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="gradient-text">DevMetrics</span>
        </div>
        <div className="navbar-links">
          <a href="#features" className="navbar-link">Features</a>
          <a href="/auth/signin" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.9rem" }}>
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        {/* Animated Orbs */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        <h1>
          See Your Code, <br />
          <span className="gradient-text">Differently</span>
        </h1>

        <p>
          Your GitHub stats in one place. Beautiful charts, clear insights, and
          a touch of AI to help you grow as a developer.
        </p>

        <div className="hero-buttons">
          <a href="/auth/signin" className="btn-primary">
            <Github size={20} />
            Get Started with GitHub
            <ArrowRight size={18} />
          </a>
          <a href="#features" className="btn-secondary">
            Learn More
          </a>
        </div>
      </section>

      <section className="features-section" id="features">
        <h2>
          What you'll <span className="gradient-text">get</span>
        </h2>
        <p className="subtitle">
          Simple tools that actually help you understand your coding habits
        </p>

        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon blue">
              <BarChart3 size={26} />
            </div>
            <h3>GitHub Stats</h3>
            <p>
              Stars, forks, repos — all your GitHub metrics in one clean dashboard.
              No spreadsheets, just clarity.
            </p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon purple">
              <Code2 size={26} />
            </div>
            <h3>Language Breakdown</h3>
            <p>
              See which languages you use most. Great for updating your résumé
              or just knowing where you're spending your time.
            </p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon emerald">
              <Sparkles size={26} />
            </div>
            <h3>Quick AI Tips</h3>
            <p>
              Get personalized suggestions based on your coding patterns.
              Think of it as a friendly nudge in the right direction.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>DevMetrics · Made for developers who love data</p>
      </footer>
    </>
  );
}