'use client';

import React, { useState, useEffect } from 'react';
import { Users, Star, MapPin, Briefcase, Award, Send, CheckCircle, ShieldCheck, DollarSign, Clock, ArrowUpRight } from 'lucide-react';

interface Lawyer {
  id: number;
  name: string;
  bar_number: string;
  firm_name: string;
  location: string;
  specialties: string;
  hourly_rate: number;
  bio: string;
  years_experience: number;
  avatar_url?: string;
  verified: boolean;
  rating: number;
}

interface Referral {
  id: number;
  client_matter: string;
  practice_area: string;
  jurisdiction: string;
  estimated_value: string;
  status: string;
  created_at: string;
}

export const CoCounselMatcher: React.FC = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // Referral Modal State
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [matterTitle, setMatterTitle] = useState('');
  const [practiceArea, setPracticeArea] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('$15,000 - $30,000');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [referralSuccess, setReferralSuccess] = useState(false);

  const specialties = [
    'All',
    'Intellectual Property',
    'Corporate',
    'Employment',
    'Commercial Litigation',
    'Healthcare'
  ];

  const apiFetch = async (path: string, options?: RequestInit) => {
    try {
      const res = await fetch(path, options);
      if (res.ok) return res;
    } catch (err) {
      // Fallback
    }
    return await fetch(`http://127.0.0.1:8000${path}`, options);
  };

  const fetchLawyers = async (spec = 'All') => {
    setLoading(true);
    try {
      const url = spec === 'All'
        ? '/api/lawyers'
        : `/api/lawyers?specialty=${encodeURIComponent(spec)}`;
      const res = await apiFetch(url);
      if (res.ok) {
        const data = await res.json();
        setLawyers(data);
      }
    } catch (err) {
      console.error('Failed to fetch lawyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferrals = async () => {
    try {
      const res = await apiFetch('/api/referrals');
      if (res.ok) {
        const data = await res.json();
        setReferrals(data);
      }
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    }
  };

  useEffect(() => {
    fetchLawyers(specialtyFilter);
    fetchReferrals();
  }, [specialtyFilter]);

  const handleOpenReferral = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    const primarySpec = lawyer.specialties.split(',')[0].trim();
    setPracticeArea(primarySpec);
    setMatterTitle('');
    setNotes('');
    setReferralSuccess(false);
  };

  const handleSendReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLawyer) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_matter: matterTitle,
          practice_area: practiceArea,
          jurisdiction: selectedLawyer.location,
          estimated_value: estimatedValue,
          notes,
          target_lawyer_id: selectedLawyer.id
        })
      });

      if (res.ok) {
        setReferralSuccess(true);
        fetchReferrals();
        setTimeout(() => {
          setSelectedLawyer(null);
          setReferralSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Error submitting referral:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <Users className="w-3.5 h-3.5" />
              <span>HeyCounsel Co-Counsel Network</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Lawyer-to-Lawyer Matching & Referrals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Connect with vetted independent attorneys in San Diego and across California to co-counsel complex matters, cross-refer overflow cases, or retain local trial counsel.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs text-slate-500 font-medium">Active Referrals</div>
              <div className="text-lg font-bold text-slate-900">{referrals.length} in pipeline</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold uppercase">Practice Area:</span>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecialtyFilter(spec)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                specialtyFilter === spec
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Lawyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lawyers.map((lawyer) => (
          <div
            key={lawyer.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-amber-400"
          >
            <div className="p-5 space-y-4">
              {/* Card top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={lawyer.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                    alt={lawyer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {lawyer.name}
                      </h3>
                      {lawyer.verified && (
                        <span title="Verified State Bar Member">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {lawyer.firm_name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {lawyer.bar_number}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{lawyer.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Location & Experience */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium">{lawyer.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lawyer.years_experience} yrs exp</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {lawyer.bio}
              </p>

              {/* Specialties Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {lawyer.specialties.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Rate: </span>
                <span className="text-sm font-bold text-slate-900">${lawyer.hourly_rate}</span>
                <span className="text-xs text-slate-500">/hr</span>
              </div>
              <button
                onClick={() => handleOpenReferral(lawyer)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <span>Refer / Co-Counsel</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Referral Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-amber-400 font-bold tracking-wider">
                  Co-Counsel Referral Dispatch
                </div>
                <h3 className="text-lg font-bold">
                  Refer Case to {selectedLawyer.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLawyer(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendReferral} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Client / Matter Description
                </label>
                <input
                  type="text"
                  required
                  value={matterTitle}
                  onChange={(e) => setMatterTitle(e.target.value)}
                  placeholder="e.g. San Diego Tech Co Series A Preferred Stock Financing"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Practice Specialty
                  </label>
                  <input
                    type="text"
                    value={practiceArea}
                    onChange={(e) => setPracticeArea(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Estimated Fee Value
                  </label>
                  <select
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                  >
                    <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                    <option value="$15,000 - $30,000">$15,000 - $30,000</option>
                    <option value="$30,000 - $75,000">$30,000 - $75,000</option>
                    <option value="$75,000+">$75,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Co-Counsel Notes & Conflicts Check Info
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Include context: client timeline, trial dates, or whether you are seeking full referral or joint co-counseling."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedLawyer(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || referralSuccess}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  {referralSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-800" />
                      <span>Referral Dispatched!</span>
                    </>
                  ) : submitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Referral Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
