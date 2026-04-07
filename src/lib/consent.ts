export type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const CONSENT_STORAGE_KEY = 'hom-consent-v1';

function parseConsent(value: unknown): ConsentPreferences | null {
  if (!value || typeof value !== 'object') return null;
  const source = value as Record<string, unknown>;
  if (typeof source.analytics !== 'boolean' || typeof source.marketing !== 'boolean') return null;

  return {
    analytics: source.analytics,
    marketing: source.marketing,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : new Date().toISOString(),
  };
}

export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  if ((window as any).__HOM_CONSENT__) {
    const parsed = parseConsent((window as any).__HOM_CONSENT__);
    if (parsed) return parsed;
  }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseConsent(JSON.parse(raw));
    if (!parsed) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setConsentPreferences(next: Pick<ConsentPreferences, 'analytics' | 'marketing'>): ConsentPreferences {
  const value: ConsentPreferences = {
    analytics: next.analytics,
    marketing: next.marketing,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    (window as any).__HOM_CONSENT__ = value;
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Ignore storage errors in restricted contexts.
    }
    window.dispatchEvent(new CustomEvent('consent:updated', { detail: value }));
  }

  return value;
}

export function acceptAllConsent(): ConsentPreferences {
  return setConsentPreferences({ analytics: true, marketing: true });
}

export function acceptEssentialOnlyConsent(): ConsentPreferences {
  return setConsentPreferences({ analytics: false, marketing: false });
}

export function bootstrapConsentPreferences(): ConsentPreferences | null {
  const existing = getConsentPreferences();
  if (typeof window !== 'undefined') {
    (window as any).__HOM_CONSENT__ = existing;
  }
  return existing;
}

export function hasAnalyticsConsent(): boolean {
  const existing = getConsentPreferences();
  return Boolean(existing?.analytics);
}
