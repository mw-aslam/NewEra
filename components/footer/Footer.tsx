'use client';

import React from 'react';
import Link from 'next/link';
import { Send, Instagram, Youtube, Twitter } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t, locale } = useI18n();

  const socialLinks = [
    { icon: <Send size={16} />, href: 'https://t.me/newera_trading', label: 'Telegram' },
    { icon: <Instagram size={16} />, href: '#', label: 'Instagram' },
    { icon: <Youtube size={16} />, href: '#', label: 'YouTube' },
    { icon: <Twitter size={16} />, href: '#', label: 'Twitter' },
  ];

  const platformLinks = [
    { label: t('footer.home'), href: '/' },
    { label: t('footer.standardCourse'), href: '/courses/standard' },
    { label: t('footer.proCourse'), href: '/courses/pro' },
  ];

  const navigationLinks = [
    { label: t('footer.courses'), href: '/courses' },
    { label: t('footer.about'), href: '/about' },
    { label: t('footer.reviews'), href: '/reviews' },
    { label: t('footer.faq'), href: '/faq' },
  ];

  const legalLinks = [
    { label: t('footer.terms'), href: '/terms' },
    { label: t('footer.privacy'), href: '/privacy' },
    { label: t('footer.riskDisclaimer'), href: '/terms' },
  ];

  return (
    <footer className="relative pt-16 pb-10 border-t border-white/10 bg-[#050505]">
      {/* Top subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[19px] font-black tracking-[0.16em] text-white uppercase font-mono">
                NEW<span className="text-white/40">.</span>ERA
              </span>
            </div>

            <p className="text-[14px] text-white/60 leading-relaxed max-w-[300px] mb-6 font-medium">
              {t('footer.brandDesc')}
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Tariflar */}
          <div>
            <h4 className="text-[11px] font-mono font-bold text-white/40 tracking-[0.15em] uppercase mb-4">
              {t('footer.tariffs')}
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/70 hover:text-white transition-colors duration-150 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigatsiya */}
          <div>
            <h4 className="text-[11px] font-mono font-bold text-white/40 tracking-[0.15em] uppercase mb-4">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2.5">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/70 hover:text-white transition-colors duration-150 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Huquqiy */}
          <div>
            <h4 className="text-[11px] font-mono font-bold text-white/40 tracking-[0.15em] uppercase mb-4">
              {t('footer.legalTitle')}
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/70 hover:text-white transition-colors duration-150 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Financial Disclaimer (Mandatory) */}
        <div className="p-6 rounded-2xl bg-black/60 border border-white/10 mb-10">
          <p className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider mb-2">
            {t('footer.disclaimerTitle')}
          </p>
          <p className="text-xs text-white/50 leading-relaxed">
            {t('footer.disclaimerBody')}
          </p>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-white/40">
          <p>{t('footer.rights')}</p>
          <p className="text-[11px]">{t('footer.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}



