import React from 'react';
import { acceptAllConsent, acceptEssentialOnlyConsent, getConsentPreferences } from '@/lib/consent';

const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const current = getConsentPreferences();
    setVisible(!current);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1400] border-t border-[#1a0509]/15 bg-[#fff8ef]/95 backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="max-w-3xl">
          <p className="font-jost text-[10px] uppercase tracking-[0.25em] text-[#5c0d1a]">Cookie Preferences</p>
          <p className="mt-1 font-jost text-sm text-[#1a0509]/80">
            We use essential cookies to keep the site secure and optional analytics cookies to improve shopping experience.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              acceptEssentialOnlyConsent();
              setVisible(false);
            }}
            className="h-10 rounded-full border border-[#1a0509]/20 px-4 text-[10px] uppercase tracking-[0.22em] text-[#1a0509] transition-colors hover:bg-[#1a0509]/5"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => {
              acceptAllConsent();
              setVisible(false);
            }}
            className="h-10 rounded-full bg-[#1a0509] px-5 text-[10px] uppercase tracking-[0.22em] text-[#f0cc6e] transition-colors hover:bg-[#2a080e]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
