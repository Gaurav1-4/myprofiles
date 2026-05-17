'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  UserCircle, 
  Layers, 
  Settings, 
  ExternalLink, 
  Edit, 
  TrendingUp, 
  ChevronRight,
  Eye,
  Share2,
  Bell,
  Sparkles,
  ArrowUpRight,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DashboardProps {
  profile: any;
  stats: {
    views7d: number;
    views30d: number;
    trend7d: string;
    trend30d: string;
  };
}

export function DashboardClient({ profile, stats }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const hasViews = stats.views30d > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black">
            <Layers className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-black tracking-tighter uppercase italic">MyProfiles</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-zinc-500"><Bell className="w-5 h-5" /></button>
          <div className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 overflow-hidden relative">
            <Image src={profile.avatar_url || '/placeholder-avatar.png'} alt="Profile" fill className="object-cover" />
          </div>
        </div>
      </header>

      <div className="flex max-w-[1440px] mx-auto relative z-10">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-[280px] fixed h-screen flex-col border-r border-white/5 px-8 py-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">MyProfiles</h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
              { id: 'edit', label: 'The Editor', icon: UserCircle, href: '/onboarding' },
              { id: 'templates', label: 'Templates', icon: Layers, href: '/onboarding?step=4' },
              { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
            ].map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300",
                  activeTab === item.id 
                    ? 'bg-white text-black shadow-2xl' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative group">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Platform Status</p>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <p className="text-xs font-bold text-white uppercase tracking-widest">v1.2.0 Active</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-[280px] p-6 md:p-12 pb-32 md:pb-12">
          
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Header Section (Desktop) */}
            <div className="hidden md:flex justify-between items-end">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-2 block">Control Panel</span>
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">DASHBOARD</h2>
              </div>
              <Link 
                href={`/${profile.username}`}
                target="_blank"
                className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all shadow-2xl active:scale-95"
              >
                <Share2 className="w-4 h-4" /> Live Site <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8">
              
              {/* Panel 1: Profile Spotlight */}
              <div className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center gap-8 relative z-10">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2rem] border border-white/10 overflow-hidden relative shadow-2xl">
                      <Image src={profile.avatar_url || '/placeholder-avatar.png'} alt={profile.full_name} fill className="object-cover" />
                    </div>
                    {profile.published && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-[#0a0a0a] flex items-center justify-center shadow-lg">
                         <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-3xl font-black tracking-tighter uppercase">{profile.full_name}</h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]",
                        profile.published ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"
                      )}>
                        {profile.published ? 'LIVE' : 'DRAFT'}
                      </span>
                    </div>
                    <Link href={`/${profile.username}`} target="_blank" className="flex items-center gap-2 text-zinc-500 font-bold text-sm hover:text-white transition-colors">
                      myprofiles.co.in/{profile.username} <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10">
                  <Link 
                    href="/onboarding"
                    className="flex-1 md:flex-none px-10 py-5 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Edit className="w-4 h-4" /> Edit Profile
                  </Link>
                </div>
              </div>

              {/* Grid for Analytics & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Panel 2: Analytics Summary */}
                <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 flex flex-col relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="font-black text-xs uppercase tracking-[0.3em] text-zinc-500 italic">Engagement</h3>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  
                  {hasViews ? (
                    <div className="flex flex-col gap-6">
                      <Metric label="Last 7 Days" value={stats.views7d} change={stats.trend7d} />
                      <Metric label="Last 30 Days" value={stats.views30d} change={stats.trend30d} />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 text-center space-y-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                        <Eye className="w-10 h-10 text-zinc-800" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-black text-xs uppercase tracking-[0.2em] text-white">Quiet Waters</p>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-600 max-w-[200px] leading-loose">No traffic detected yet. Share your link to start tracking.</p>
                      </div>
                      <button className="text-white font-black text-[9px] uppercase tracking-[0.4em] hover:text-purple-400 transition-colors">Copy URL</button>
                    </div>
                  )}
                </div>

                {/* Panel 3: Terminal Actions */}
                <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 flex flex-col">
                  <h3 className="font-black text-xs uppercase tracking-[0.3em] text-zinc-500 italic mb-10">Terminal</h3>
                  <div className="space-y-3">
                    <ActionItem icon={Edit} label="Rewrite Content" href="/onboarding" />
                    <ActionItem icon={Layers} label="Switch Interface" href="/onboarding?step=4" />
                    <ActionItem icon={Settings} label="Access Settings" href="/settings" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex justify-around items-center px-4 z-50 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard, href: '/dashboard' },
          { id: 'edit', label: 'Editor', icon: UserCircle, href: '/onboarding' },
          { id: 'templates', label: 'Themes', icon: Layers, href: '/onboarding?step=4' },
          { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
        ].map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              activeTab === item.id ? 'text-white scale-110' : 'text-zinc-600'
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
}

const Metric = ({ label, value, change }: { label: string; value: string | number; change?: string }) => (
  <div className="flex flex-col gap-3 p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex-1 hover:bg-white/[0.04] transition-colors">
    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">{label}</span>
    <div className="flex items-baseline gap-4">
      <span className="text-5xl font-black text-white leading-none tracking-tighter italic uppercase">{value}</span>
      {change && (
        <span className={cn(
          "text-[10px] font-black px-2 py-1 rounded-lg",
          change.startsWith('+') ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border border-amber-400/20"
        )}>
          {change}
        </span>
      )}
    </div>
    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Total Impressions</p>
  </div>
);

const ActionItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => (
  <Link href={href} className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/[0.01] hover:bg-white/5 border border-white/5 transition-all group">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-xl bg-zinc-900 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-500">
        <Icon className="w-5 h-5 transition-colors" />
      </div>
      <span className="font-bold text-zinc-400 group-hover:text-white transition-colors text-xs uppercase tracking-widest">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:translate-x-2 group-hover:text-white transition-all" />
  </Link>
);
