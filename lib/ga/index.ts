type AnalyticsEventInput = {
  action: string;
  params?: Record<string, unknown>;
};

const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS?.trim();

function gtag(..._args: unknown[]) {
  if (!measurementId || typeof window === 'undefined' || !Array.isArray(window.dataLayer)) {
    return;
  }

  window.dataLayer.push(arguments);
}

export const pageview = (url: string) => {
  if (measurementId && typeof window !== 'undefined') {
    gtag('config', measurementId, {
      page_path: url,
    });
  }
};

export const event = ({ action, params }: AnalyticsEventInput) => {
  if (measurementId && typeof window !== 'undefined') {
    gtag('event', action, params);
  }
};