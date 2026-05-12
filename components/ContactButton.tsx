import { useState, useRef, useEffect } from 'react';

import { CONTACT_EMAIL } from '../lib/site';

interface ContactButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function ContactButton({ className, children }: ContactButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(CONTACT_EMAIL).catch(() => {});
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2500);
  };

  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className={className}
      onClick={handleClick}
      aria-label={
        copied
          ? `Email address ${CONTACT_EMAIL} copied to clipboard`
          : undefined
      }
    >
      {copied ? (
        <span className="whitespace-nowrap">{CONTACT_EMAIL} — Copied!</span>
      ) : (
        children
      )}
    </a>
  );
}
