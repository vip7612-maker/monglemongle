import { Admin } from './components/Admin';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Globe,
  Cpu,
  Users,
  User,
  ArrowRight,
  CheckCircle2,
  Info,
  Sparkles,
  ChevronRight,
  ChevronDown,
  MapPin,
  Calendar,
  BookOpen,
  Lock,
  LogOut,
  Trash2,
  RotateCcw,
  Presentation,
  Table,
  GraduationCap,
  FileText,
  HardDrive,
  Book,
  Code,
  Award,
  Copy,
  Check
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
import { Language, TRANSLATIONS } from './translations';
// --- Constants ---
const SPONSORS: { name: string; amount: number; date: string }[] = [];

const maskName = (name: string) => {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  const middle = Math.floor(name.length / 2);
  return name.substring(0, middle) + '*' + name.substring(middle + 1);
};


// --- Components ---

/**
 * Renders text with Google-inspired colors and rounded font.
 */
const MongleLogo = ({ text, className = "" }: { text: string, className?: string }) => {
  const googleColors = [
    'text-[#4285F4]', // Blue
    'text-[#EA4335]', // Red
    'text-[#FBBC05]', // Yellow
    'text-[#4285F4]', // Blue
    'text-[#34A853]', // Green
    'text-[#EA4335]'  // Red
  ];

  const chars = text.split('');
  let colorIndex = 0;

  return (
    <span className={`font-rounded font-bold ${className}`}>
      {chars.map((char, i) => {
        if (char === ' ') return <span key={i}> </span>;
        const colorClass = googleColors[colorIndex % googleColors.length];
        colorIndex++;
        return <span key={i} className={colorClass}>{char}</span>;
      })}
    </span>
  );
};

export default function App() {
  // --- State Management ---
  const [lang, setLang] = useState<Language>('ko');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [showHowToDonate, setShowHowToDonate] = useState(false);

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminTab, setAdminTab] = useState<'commitment' | 'one-time' | 'trash'>('commitment');
  const [submissions, setSubmissions] = useState<any[]>([]);

  const heroImages = [
    '/mongolia_green_steppe.png',
    '/mongolian_yurt_hills.png',
    '/mongolian_river_valley.png',
  ];
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Cross-fade every 5 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch('/api/submissions');
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data);
        }
      } catch (err) {
        console.error("Fetch submissions error:", err);
      }
    };
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Donation Modal State: 'idle' (closed), 'form' (input), 'success' (thank you)
  const [donationStep, setDonationStep] = useState<'idle' | 'form' | 'success'>('idle');
  // Donation Type: 'one-time' (flexible amount) or 'commitment' (recurring 50k)
  const [donationType, setDonationType] = useState<'one-time' | 'commitment'>('one-time');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Info toggle state for collapsible explanations
  const [showInfo, setShowInfo] = useState<'none' | 'commitment' | 'donation'>('none');

  // Form data for the donation process
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    target: '이다예린' as '이유빈' | '이다예린' | '',
    amount: 50000,
    message: ''
  });

  // AI-generated thank you message state
  const [aiMessage, setAiMessage] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [expandedCurriculum, setExpandedCurriculum] = useState<number | null>(null);

  const t = TRANSLATIONS[lang];

  // --- Logic & Helpers ---

  // Calculate D-Day for the Intensive Workshop (March 5, 2026)
  const today = new Date('2026-02-23');
  const targetDate = new Date('2026-03-05');
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const dDayLabel = diffDays > 0 ? `D-${diffDays}` : (diffDays === 0 ? 'D-Day' : `D+${Math.abs(diffDays)}`);



  /**
   * Handles the donation form submission.
   * Validates inputs and transitions to the success step.
   */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.target) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    if (donationType === 'one-time' && formData.amount < 50000) {
      alert("일시 후원은 50,000원부터 가능합니다.");
      return;
    }

    setDonationStep('success');
    setLoadingAi(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type: donationType
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmissions(prev => [data.submission, ...prev]);
        }
        setAiMessage(data.aiMessage);
      } else {
        setAiMessage("몽골의 미래를 위한 따뜻한 후원에 감사드립니다!");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setAiMessage("몽골의 미래를 위한 따뜻한 후원에 감사드립니다!");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === "1214319") {
      setIsAdminLoggedIn(true);
      setShowAdminLoginModal(false);
      setShowAdminDashboard(true);
      setAdminPasswordInput("");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const performAdminAction = async (type: string, id: number) => {
    try {
      const res = await fetch('/api/admin_action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error("Admin action error:", err);
    }
  };

  const handleDeleteSubmission = (id: number) => {
    performAdminAction('delete', id);
  };

  const handleRestoreSubmission = (id: number) => {
    if (confirm("복구하시겠습니까?")) {
      performAdminAction('restore', id);
    }
  };

  const handlePermanentDeleteSubmission = (id: number) => {
    if (confirm("영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      performAdminAction('permanent_delete', id);
    }
  };

  /**
   * Resets the donation modal state and form data.
   */
  const closeDonation = () => {
    setDonationStep('idle');
    setDonationType('one-time');
    setShowInfo('none');
    setFormData({ name: '', phone: '', target: '', amount: 50000, message: '' });
    setAiMessage("");
  };


  const bankInfo = {
    '이다예린': '토스뱅크 1001-1665-7239 (예금주: 이다예린)'
  };

  const allSponsors = submissions
    .filter(s => !s.isDeleted)
    .map(s => ({
      name: s.name,
      amount: s.amount,
      date: s.date.split(',')[0], // Extract date part
      timestamp: s.id // Use id as timestamp for sorting
    })).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a1a1a] font-sans selection:bg-[#5A5A40]/20">
      {/* Navigation: Sticky header with language selector and primary CTA */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#5A5A40]/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#5A5A40]/5 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#5A5A40]" />
            </div>
            <MongleLogo text="mongle mongle project" className="text-xl tracking-tight" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5A5A40]">
            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsAboutMenuOpen(true)}
              onMouseLeave={() => setIsAboutMenuOpen(false)}
            >
              <a href="#about" className="hover:opacity-70 transition-opacity flex items-center gap-1">
                {t.nav.about}
                <ChevronDown className="w-3 h-3" />
              </a>
              <AnimatePresence>
                {isAboutMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-48 bg-white border border-[#5A5A40]/10 rounded-2xl shadow-xl overflow-hidden"
                  >
                    <a
                      href="#schools"
                      className="block px-4 py-3 text-xs hover:bg-[#5A5A40]/5 transition-colors text-[#5A5A40]"
                      onClick={() => setIsAboutMenuOpen(false)}
                    >
                      {t.nav.schools}
                    </a>
                    <a
                      href="#about"
                      className="block px-4 py-3 text-xs hover:bg-[#5A5A40]/5 transition-colors text-[#5A5A40]"
                      onClick={() => setIsAboutMenuOpen(false)}
                    >
                      {t.nav.profiles}
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#curriculum" className="hover:opacity-70 transition-opacity">{t.nav.curriculum}</a>
            <a href="#sponsorship" className="hover:opacity-70 transition-opacity">{t.nav.sponsorship}</a>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 hover:opacity-70 transition-opacity"
              >
                <Globe className="w-4 h-4" />
                {t.nav.translate}
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-32 bg-white border border-[#5A5A40]/10 rounded-2xl shadow-xl overflow-hidden"
                  >
                    {(['ko', 'en', 'mn', 'ja', 'zh'] as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLang(l);
                          setIsLangMenuOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-xs hover:bg-[#5A5A40]/5 transition-colors",
                          lang === l ? "font-bold text-[#5A5A40]" : "text-[#5A5A40]/60"
                        )}
                      >
                        {l === 'ko' && '한국어'}
                        {l === 'en' && 'English'}
                        {l === 'mn' && 'Монгол'}
                        {l === 'ja' && '日本語'}
                        {l === 'zh' && '中文'}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => document.getElementById('sponsorship')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#5A5A40] text-white px-5 py-2 rounded-full hover:bg-[#4a4a35] transition-colors"
            >
              {t.nav.donate}
            </button>

            {/* Admin Button */}
            <button
              onClick={() => isAdminLoggedIn ? setShowAdminDashboard(true) : setShowAdminLoginModal(true)}
              className="flex items-center gap-1 hover:opacity-70 transition-opacity text-[#5A5A40]/40"
            >
              <Lock className="w-4 h-4" />
              {t.nav.admin}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section: Main value proposition and primary call to action */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A5A40]/5 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3 text-[#FBBC05]" />
              <MongleLogo text={t.hero.tag} />
            </div>
            <h1 className="font-serif text-6xl md:text-7xl leading-[1.1] mb-8">
              {t.hero.title}
            </h1>
            <p className="text-lg text-[#5A5A40]/80 leading-relaxed mb-10 max-w-xl whitespace-pre-line">
              {t.hero.desc}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('sponsorship')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#5A5A40] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-[#5A5A40]/20 transition-all"
              >
                {t.hero.donate} <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex -space-x-3 items-center">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    alt="Sponsor"
                    referrerPolicy="no-referrer"
                  />
                ))}
                <span className="ml-4 text-sm font-medium text-[#5A5A40]/60 underline underline-offset-4">
                  {lang === 'ko' ? `${allSponsors.length}명이 함께하고 있습니다` : `+${allSponsors.length} people are with us`}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative z-10 bg-[#5A5A40]/20">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={currentHeroImage}
                  src={heroImages[currentHeroImage]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Mongolia Landscape"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20" />
              <div className="absolute bottom-8 left-8 right-8 text-white z-30">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Ulaanbaatar, Mongolia</span>
                </div>
                <h3 className="text-2xl font-serif italic">"AI는 국경을 넘어 새로운 기회를 만듭니다."</h3>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5A5A40]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#5A5A40]/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section: Key metrics and D-Day counter */}
      <section className="bg-white py-20 border-y border-[#5A5A40]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl font-serif font-bold text-[#5A5A40] mb-2">200+</div>
              <div className="text-sm uppercase tracking-widest text-[#5A5A40]/60 font-bold">{t.stats.students}</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold text-[#5A5A40] mb-2">Google AI</div>
              <div className="text-sm uppercase tracking-widest text-[#5A5A40]/60 font-bold">{t.stats.focus}</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold text-[#5A5A40] mb-2">{t.stats.periodLabel}</div>
              <div className="text-sm uppercase tracking-widest text-[#5A5A40]/60 font-bold">{t.stats.periodValue}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Progress: Current sponsorship status and recent contributors */}
      <section className="py-24 bg-[#fdfcf8]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl mb-4">{t.funding.title}</h2>
            <p className="text-[#5A5A40]/60">{t.funding.desc}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#5A5A40]/10">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-[#fdfcf8] rounded-2xl border border-[#5A5A40]/5">
                <div className="text-xs text-[#5A5A40]/50 uppercase font-bold mb-1">{t.funding.sponsors}</div>
                <div className="text-xl font-serif">{allSponsors.length}{t.funding.unitPerson}</div>
              </div>
              <div className="p-4 bg-[#fdfcf8] rounded-2xl border border-[#5A5A40]/5">
                <div className="text-xs text-[#5A5A40]/50 uppercase font-bold mb-1">{t.funding.amount}</div>
                <div className="text-xl font-serif">
                  {allSponsors.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}{t.funding.unitWon}
                </div>
              </div>
            </div>

            {/* Goal Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="text-sm font-medium text-[#5A5A40]">
                  {t.funding.goalLabel}: <span className="font-bold">60{t.funding.goalUnit}</span>
                </div>
                <div className="text-xs font-bold text-[#5A5A40]/40 uppercase tracking-widest">
                  {Math.round((allSponsors.length / 60) * 100)}%
                </div>
              </div>
              <div className="h-4 bg-[#5A5A40]/5 rounded-full overflow-hidden border border-[#5A5A40]/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min((allSponsors.length / 60) * 100, 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#5A5A40] to-[#8A8A60] relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Recent Sponsors List */}
          <div className="mt-12">
            <h3 className="font-serif text-2xl mb-6 text-center">{t.funding.recentTitle}</h3>
            <div className="bg-white rounded-3xl border border-[#5A5A40]/10 overflow-hidden">
              <div className="divide-y divide-[#5A5A40]/5">
                {allSponsors.slice(0, 5).map((sponsor, idx) => (
                  <div key={idx} className="px-6 py-4 flex justify-between items-center hover:bg-[#fdfcf8] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#5A5A40]/5 flex items-center justify-center text-[#5A5A40] text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-medium">
                        {maskName(sponsor.name)} {lang === 'ko' ? '님' : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#5A5A40]">{sponsor.amount.toLocaleString()}원</div>
                      <div className="text-[10px] text-[#5A5A40]/40 uppercase tracking-widest">{sponsor.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[#fdfcf8] text-center">
                <button className="text-xs font-bold text-[#5A5A40]/60 hover:text-[#5A5A40] transition-colors uppercase tracking-widest">
                  {t.funding.viewAll}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schools & Projects Section: Detailed information about the target schools and specific initiatives */}
      <section id="schools" className="py-24 bg-[#fdfcf8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl mb-6">{t.schools.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[32px] border border-[#5A5A40]/10 shadow-sm"
            >
              <div className="w-12 h-12 bg-[#5A5A40]/10 rounded-2xl flex items-center justify-center text-[#5A5A40] mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-4">{t.schools.nest.name}</h3>
              <p className="text-[#5A5A40]/70 leading-relaxed text-sm">
                {t.schools.nest.desc}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[32px] border border-[#5A5A40]/10 shadow-sm"
            >
              <div className="w-12 h-12 bg-[#5A5A40]/10 rounded-2xl flex items-center justify-center text-[#5A5A40] mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-4">{t.schools.ubmk.name}</h3>
              <p className="text-[#5A5A40]/70 leading-relaxed text-sm">
                {t.schools.ubmk.desc}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[32px] border border-[#5A5A40]/10 shadow-sm"
            >
              <div className="w-12 h-12 bg-[#5A5A40]/10 rounded-2xl flex items-center justify-center text-[#5A5A40] mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-4">{t.schools.chromebook.name}</h3>
              <p className="text-[#5A5A40]/70 leading-relaxed text-sm">
                {t.schools.chromebook.desc}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curriculum Section: Detailed grid of tools and skills */}
      <section id="curriculum" className="py-24 bg-[#fdfcf8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl mb-6">{t.mission.curriculum.title}</h2>
            <p className="text-[#5A5A40]/70 max-w-2xl mx-auto leading-relaxed">
              {t.mission.curriculum.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.mission.curriculum.items.map((item: any, idx: number) => {
              const getIcon = (name: string) => {
                if (name.includes('Slides')) return <Presentation className="w-6 h-6" />;
                if (name.includes('Sheets')) return <Table className="w-6 h-6" />;
                if (name.includes('Classroom')) return <GraduationCap className="w-6 h-6" />;
                if (name.includes('Forms')) return <FileText className="w-6 h-6" />;
                if (name.includes('Drive')) return <HardDrive className="w-6 h-6" />;
                if (name.includes('Notebook')) return <Book className="w-6 h-6" />;
                if (name.includes('coding')) return <Code className="w-6 h-6" />;
                if (name.includes('Educator')) return <Award className="w-6 h-6" />;
                return <Sparkles className="w-6 h-6" />;
              };

              const isExpanded = expandedCurriculum === idx;

              return (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setExpandedCurriculum(isExpanded ? null : idx)}
                  className={cn(
                    "bg-white p-8 rounded-[32px] border border-[#5A5A40]/10 shadow-sm flex flex-col items-center text-center group transition-all cursor-pointer",
                    isExpanded ? "ring-2 ring-[#5A5A40]/20" : "hover:y-[-5px] hover:bg-[#5A5A40]/5"
                  )}
                >
                  <motion.div
                    layout
                    className="w-14 h-14 bg-[#5A5A40]/5 rounded-2xl flex items-center justify-center text-[#5A5A40] mb-6 group-hover:bg-[#5A5A40] group-hover:text-white transition-colors"
                  >
                    {getIcon(item.title)}
                  </motion.div>
                  <motion.h4 layout className="font-bold text-lg text-[#5A5A40] mb-2">{item.title}</motion.h4>

                  <AnimatePresence mode="wait">
                    {isExpanded ? (
                      <motion.p
                        key="desc"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-[#5A5A40]/70 leading-relaxed mt-2"
                      >
                        {item.desc}
                      </motion.p>
                    ) : (
                      <motion.div
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-[#5A5A40]/30 font-bold uppercase tracking-widest mt-2"
                      >
                        {lang === 'ko' ? '클릭하여 설명 보기' : 'Click to see description'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Details: Team introduction and curriculum overview */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://picsum.photos/seed/ai1/400/500" className="rounded-3xl shadow-lg" alt="AI Teaching" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/ai2/400/500" className="rounded-3xl shadow-lg mt-12" alt="Mongolia Students" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-5xl mb-8">{t.mission.title}</h2>

              {/* Team Profiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {t.mission.profiles.map((profile: any, idx: number) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="bg-[#fdfcf8] p-6 rounded-3xl border border-[#5A5A40]/10 shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{profile.name}</h4>
                        <p className="text-xs text-[#5A5A40]/60 font-medium uppercase tracking-wider">{profile.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-[#5A5A40]/70">
                      <div className="flex justify-between">
                        <span className="font-medium">{lang === 'ko' ? '나이' : 'Age'}:</span>
                        <span>{profile.age}</span>
                      </div>
                      <div className="pt-2 border-t border-[#5A5A40]/5">
                        <span className="font-medium block mb-1">{lang === 'ko' ? '자격증' : 'Certifications'}:</span>
                        <span className="text-xs leading-relaxed">{profile.certs}</span>
                      </div>
                      {profile.edu && (
                        <div className="pt-2 border-t border-[#5A5A40]/5">
                          <span className="text-xs leading-relaxed font-medium">{profile.edu}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{t.mission.team.title}</h4>
                    <p className="text-[#5A5A40]/70 leading-relaxed">
                      {t.mission.team.desc}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{t.mission.curriculum.title}</h4>
                    <p className="text-[#5A5A40]/70 leading-relaxed mb-2">
                      {t.mission.curriculum.desc}
                    </p>
                    <a href="#curriculum" className="text-xs font-bold text-[#5A5A40] underline underline-offset-4 hover:opacity-70 transition-opacity">
                      {lang === 'ko' ? '상세 커리큘럼 보기' : 'View Detailed Curriculum'} →
                    </a>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{t.mission.timeline.title}</h4>
                    <p className="text-[#5A5A40]/70 leading-relaxed">
                      {t.mission.timeline.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Section: Selection between Commitment (Recurring) and One-time donation */}
      <section id="sponsorship" className="py-32 bg-[#fdfcf8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl mb-6">{t.sponsorship.title}</h2>
            <p className="text-[#5A5A40]/60 max-w-2xl mx-auto mb-12 whitespace-pre-line">
              {t.sponsorship.desc}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <button
                onClick={() => {
                  setDonationType('commitment');
                  setDonationStep('form');
                }}
                className="group relative bg-[#5A5A40] text-white px-10 py-6 rounded-[32px] font-bold text-xl hover:shadow-2xl hover:shadow-[#5A5A40]/30 transition-all overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <Calendar className="w-6 h-6" /> {t.sponsorship.commitment}
                </div>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              <button
                onClick={() => {
                  setDonationType('one-time');
                  setDonationStep('form');
                }}
                className="group relative bg-white text-[#5A5A40] border-2 border-[#5A5A40] px-10 py-6 rounded-[32px] font-bold text-xl hover:bg-[#5A5A40] hover:text-white transition-all overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <Heart className="w-6 h-6" /> {t.sponsorship.oneTime}
                </div>
              </button>
            </div>

            <div className="flex flex-col items-center mt-12">
              <div className="max-w-2xl bg-[#5A5A40]/5 p-8 rounded-[40px] text-sm text-[#5A5A40]/70 leading-relaxed text-center border border-[#5A5A40]/10">
                <div className="flex items-center justify-center gap-2 mb-6 text-[#5A5A40] font-bold uppercase tracking-widest text-xs">
                  <Info className="w-4 h-4" /> {t.sponsorship.howTo}
                </div>
                <div className="mb-8 text-base whitespace-pre-line">{t.sponsorship.howToDesc}</div>
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <div className="bg-white p-6 rounded-3xl border border-[#5A5A40]/10 text-left shadow-sm group relative">
                    <div className="font-bold text-[#5A5A40] mb-1 text-lg">{lang === 'ko' ? '이다예린 (프로젝트 회계 담당)' : 'Lee Da-yerin (Project Treasurer)'}</div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-[#5A5A40]/80">
                        토스뱅크 1001-1665-7239 <br />
                        <span className="text-[10px] opacity-60">({lang === 'ko' ? '예금주:이다예린' : 'Account Holder: Lee Da-yerin'})</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('100116657239');
                          setCopiedId('yerin');
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="p-2 rounded-xl bg-[#5A5A40]/5 text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-all"
                        title="복사하기"
                      >
                        {copiedId === 'yerin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Modal: Multi-step process (Form -> Success/Thank You) */}
      <AnimatePresence>
        {donationStep !== 'idle' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDonation}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#5A5A40]" />

              {donationStep === 'form' ? (
                <div>
                  <div className="flex gap-2 mb-8">
                    <button
                      onClick={() => {
                        setDonationType('commitment');
                        setFormData(prev => ({ ...prev, amount: 50000 }));
                      }}
                      className={cn(
                        "flex-1 py-3 rounded-2xl font-bold text-sm transition-all",
                        donationType === 'commitment' ? "bg-[#5A5A40] text-white" : "bg-[#5A5A40]/5 text-[#5A5A40]"
                      )}
                    >
                      {t.sponsorship.commitment}
                    </button>
                    <button
                      onClick={() => setDonationType('one-time')}
                      className={cn(
                        "flex-1 py-3 rounded-2xl font-bold text-sm transition-all",
                        donationType === 'one-time' ? "bg-[#5A5A40] text-white" : "bg-[#5A5A40]/5 text-[#5A5A40]"
                      )}
                    >
                      {t.sponsorship.oneTime}
                    </button>
                  </div>

                  <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl mb-2">
                      {donationType === 'commitment' ? t.modal.commitmentTitle : t.modal.oneTimeTitle}
                    </h2>
                    <p className="text-sm text-[#5A5A40]/60">
                      {donationType === 'commitment' ? t.modal.commitmentDesc : t.modal.oneTimeDesc}
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50 mb-2">{t.modal.nameLabel}</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl border border-[#5A5A40]/10 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 bg-[#fdfcf8]"
                        placeholder={t.modal.namePlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50 mb-2">{t.modal.phoneLabel}</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl border border-[#5A5A40]/10 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 bg-[#fdfcf8]"
                        placeholder="010-0000-0000"
                      />
                    </div>

                    {donationType === 'one-time' && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50 mb-2">{t.modal.amountLabel}</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="50000"
                            step="10000"
                            required
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                            className="w-full px-5 py-3 rounded-2xl border border-[#5A5A40]/10 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 bg-[#fdfcf8]"
                          />
                          <span className="absolute right-5 top-3 text-[#5A5A40]/40">원</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50 mb-2">{t.modal.targetLabel}</label>
                      <div className="grid grid-cols-1 gap-4">
                        <div
                          className="py-4 rounded-2xl border font-medium bg-[#5A5A40] text-white border-[#5A5A40] text-center"
                        >
                          이유빈 & 이다예린
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50 mb-2">{t.modal.messageLabel}</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl border border-[#5A5A40]/10 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 bg-[#fdfcf8] min-h-[100px] resize-none"
                        placeholder={t.modal.messagePlaceholder}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-bold hover:bg-[#4a4a35] transition-colors mt-4"
                    >
                      {donationType === 'commitment' ? t.modal.submitCommitment : t.modal.submitOneTime}
                    </button>
                  </form>

                  <div className="mt-8 flex flex-col gap-2">
                    <button
                      onClick={() => setShowInfo(showInfo === 'commitment' ? 'none' : 'commitment')}
                      className="text-xs text-[#5A5A40]/40 hover:text-[#5A5A40] transition-colors flex items-center justify-center gap-1"
                    >
                      <Info className="w-3 h-3" /> {t.modal.infoCommitment}
                    </button>
                    {showInfo === 'commitment' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="text-[11px] text-[#5A5A40]/60 bg-[#5A5A40]/5 p-4 rounded-2xl leading-relaxed"
                      >
                        {t.modal.infoCommitmentDesc}
                      </motion.div>
                    )}
                    <button
                      onClick={() => setShowInfo(showInfo === 'donation' ? 'none' : 'donation')}
                      className="text-xs text-[#5A5A40]/40 hover:text-[#5A5A40] transition-colors flex items-center justify-center gap-1"
                    >
                      <Info className="w-3 h-3" /> {t.modal.infoDonation}
                    </button>
                    {showInfo === 'donation' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="text-[11px] text-[#5A5A40]/60 bg-[#5A5A40]/5 p-4 rounded-2xl leading-relaxed"
                      >
                        {t.modal.infoDonationDesc}
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#5A5A40]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Heart className="w-10 h-10 text-[#5A5A40] fill-[#5A5A40]" />
                  </div>
                  <h2 className="font-serif text-3xl mb-4">
                    {donationType === 'commitment' ? t.modal.successTitleCommitment : t.modal.successTitleOneTime}
                  </h2>

                  <div className="bg-[#fdfcf8] p-8 rounded-3xl border border-[#5A5A40]/10 mb-8 relative">
                    {loadingAi ? (
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-6 h-6 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-[#5A5A40]/40 uppercase tracking-widest font-bold">{t.modal.aiGenerating}</p>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[#5A5A40] leading-relaxed italic"
                      >
                        "{aiMessage}"
                      </motion.div>
                    )}
                    <div className="absolute -bottom-3 right-8 px-3 py-1 bg-white border border-[#5A5A40]/10 rounded-full text-[10px] font-bold text-[#5A5A40]/40 uppercase tracking-widest">
                      Generated by Google AI
                    </div>
                  </div>

                  <div className="bg-[#5A5A40] text-white p-6 rounded-3xl mb-8 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest font-bold opacity-60 mb-2">{t.modal.bankGuide}</div>
                      <div className="text-lg font-serif mb-1">{formData.target}{t.modal.targetAccount}</div>
                      <div className="text-xl font-bold">{bankInfo[formData.target as keyof typeof bankInfo]}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('100116657239');
                        setCopiedId('success');
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all flex-shrink-0"
                      title="복사하기"
                    >
                      {copiedId === 'success' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>

                  <p className="text-sm text-[#5A5A40]/60 mb-10">
                    {formData.name}{t.modal.thanksMsg}
                    {donationType === 'commitment' && <><br />{t.modal.monthlyMsg}</>}
                  </p>

                  <button
                    onClick={closeDonation}
                    className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-bold hover:bg-[#4a4a35] transition-colors"
                  >
                    {t.modal.close}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <Admin
        showAdminLoginModal={showAdminLoginModal} setShowAdminLoginModal={setShowAdminLoginModal}
        adminPasswordInput={adminPasswordInput} setAdminPasswordInput={setAdminPasswordInput}
        handleAdminLogin={handleAdminLogin}
        showAdminDashboard={showAdminDashboard} setShowAdminDashboard={setShowAdminDashboard}
        adminTab={adminTab} setAdminTab={setAdminTab} submissions={submissions}
        handleDeleteSubmission={handleDeleteSubmission} handleRestoreSubmission={handleRestoreSubmission}
        handlePermanentDeleteSubmission={handlePermanentDeleteSubmission}
        maskName={maskName}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

      {/* Footer: Legal links and copyright information */}
      <footer className="bg-white border-t border-[#5A5A40]/10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-semibold tracking-tight">Mongolia Google AI Project</span>
            </div>
            <div className="font-rounded text-2xl tracking-widest uppercase">
              <MongleLogo text="mongle mongle project" />
            </div>
            <div className="text-sm text-[#5A5A40]/40">
              {t.footer.rights}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
