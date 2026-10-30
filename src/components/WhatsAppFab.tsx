'use client';

import { Icon } from './Icon';
import { useApp } from '@/context/AppContext';

export function WhatsAppFab() {
  const { t, a, showToast } = useApp();
  return (
    <button type="button" className="fab tap" onClick={() => showToast(a.toastWhatsapp)} aria-label={t.footer.whatsapp}>
      <Icon name="chat" size={26} />
    </button>
  );
}
