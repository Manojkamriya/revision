import React, { useEffect, useState } from 'react';
import {
  Shield,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import './EmailValidatorHero.css';

export default function EmailValidatorHero() {
  const [stats, setStats] = useState({
    genuine: 0,
    temporary: 0,
    suspicious: 0,
    revenue: 0,
    users: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        genuine: 78.5,
        temporary: 12.3,
        suspicious: 9.2,
        revenue: 24680,
        users: 15420
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ icon: Icon, label, value, color, prefix = '', suffix = '' }) => (
    <div className="evh-stat-card">
      <div className={`evh-icon ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="evh-label">{label}</p>
        <p className="evh-value">
          {prefix}
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix}
        </p>
      </div>
    </div>
  );

  return (
    <div className="evh-container">
      {/* Left Section */}
      <div className="evh-left">
        <div className="evh-badge">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span>Trusted by 10,000+ businesses</span>
        </div>

        <h1 className="evh-title">Email Validation Simplified</h1>
        <p className="evh-subtitle">Fast. Secure. Data-driven accuracy.</p>

        <p className="evh-desc">
          Validate your emails with confidence. Detect <strong>invalid</strong>,
          <strong> disposable</strong>, and <strong>spam-trap</strong> addresses before
          they impact your campaigns. Reduce bounce rates and protect your
          sender reputation effortlessly.
        </p>

        <div className="evh-buttons">
          <button className="evh-btn-primary">
            Start Validating <CheckCircle className="w-5 h-5" />
          </button>
          <button className="evh-btn-secondary">View Demo</button>
        </div>

        <div className="evh-rating">
          <div className="evh-avatars">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="evh-avatar"></div>
            ))}
          </div>
          <div>
            <div className="evh-stars">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="evh-review">Rated 4.9/5 from 2,000+ reviews</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="evh-right">
        <div className="evh-dashboard">
          <div className="evh-piechart">
            <div className="evh-pie evh-genuine" style={{ '--p': `${stats.genuine}` }}></div>
            <div className="evh-pie evh-temporary" style={{ '--p': `${stats.temporary}` }}></div>
            <div className="evh-pie evh-suspicious" style={{ '--p': `${stats.suspicious}` }}></div>
            <div className="evh-center-text">
              <span>78.5%</span>
              <p>Genuine</p>
            </div>
          </div>

          <div className="evh-grid">
            <StatCard
              icon={DollarSign}
              label="Revenue Saved"
              value={stats.revenue}
              color="bg-green"
              prefix="$"
            />
            <StatCard
              icon={Users}
              label="Active Users"
              value={stats.users}
              color="bg-blue"
            />
          </div>

          <div className="evh-progress">
            <div className="evh-bar">
              <CheckCircle className="text-green-500 w-4 h-4" />
              <div style={{ width: `${stats.genuine}%` }} className="evh-bar-fill green"></div>
              <span>Genuine: {stats.genuine}%</span>
            </div>
            <div className="evh-bar">
              <AlertTriangle className="text-orange-500 w-4 h-4" />
              <div style={{ width: `${stats.temporary}%` }} className="evh-bar-fill orange"></div>
              <span>Temporary: {stats.temporary}%</span>
            </div>
            <div className="evh-bar">
              <XCircle className="text-red-500 w-4 h-4" />
              <div style={{ width: `${stats.suspicious}%` }} className="evh-bar-fill red"></div>
              <span>Suspicious: {stats.suspicious}%</span>
            </div>
          </div>

          <div className="evh-live">
            <div className="evh-dot"></div>
            <span>Live updating</span>
          </div>
        </div>

        <div className="evh-badge-floating">
          <TrendingUp className="text-green-500 w-6 h-6" />
          <p>+156% Accuracy Growth</p>
        </div>
      </div>
    </div>
  );
}
