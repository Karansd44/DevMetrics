import { Star, Lock, Code2, ArrowUpRight } from 'lucide-react'

export default function RecentRepos({ recentRepos }) {
  return (
    <div id="repos-section" className="bento-4 card card-padded">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h2 className="section-title">Recent Repos</h2>
        <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
      </div>
      <div className="repo-list">
        {recentRepos.slice(0, 5).map((repo) => (
          <a
            key={repo.name}
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-list-item"
          >
            <div className="repo-list-icon">
              {repo.isPrivate ? <Lock size={15} /> : <Code2 size={15} />}
            </div>
            <div className="repo-list-info">
              <div className="repo-list-name">{repo.name}</div>
              {repo.description && (
                <div className="repo-list-desc">{repo.description}</div>
              )}
            </div>
            <div className="repo-list-meta">
              {repo.language && <span>{repo.language}</span>}
              <span><Star size={11} /> {repo.stars}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
