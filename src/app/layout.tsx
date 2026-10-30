import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Poppins, Tajawal } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TabBar } from '@/components/TabBar';
import { Sheet } from '@/components/Sheet';
import { ToastHost } from '@/components/Toast';
import { Gestures } from '@/components/Gestures';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { AR } from '@/lib/ar';
import { EN } from '@/lib/en';
import type { Lang } from '@/lib/domain';

const tajawal = Tajawal({ subsets: ['arabic', 'latin'], weight: ['400', '500', '700', '800'], variable: '--font-tajawal', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' });

async function getLang(): Promise<Lang> {
  return (await cookies()).get('mawj.lang')?.value === 'en' ? 'en' : 'ar';
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = (await getLang()) === 'en' ? EN.meta : AR.meta;
  return { title: meta.title, description: meta.description };
}

export const viewport: Viewport = { themeColor: '#0A4D7A', viewportFit: 'cover', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`${tajawal.variable} ${poppins.variable}`}>
      <body>
        <AppProvider initialLang={lang}>
          <a href="#view" className="sr">Skip to content</a>
          <Header />
          <main id="view" className="view" tabIndex={-1}>{children}</main>
          <Footer />
          <TabBar />
          <WhatsAppFab />
          <Sheet />
          <ToastHost />
          <Gestures />
        </AppProvider>
      </body>
    </html>
  );
}
