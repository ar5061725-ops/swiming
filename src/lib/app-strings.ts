export const APP = {
  ar: {
    tabs: { home: 'الرئيسية', programs: 'البرامج', enroll: 'اشترك', account: 'حسابي', admin: 'الإدارة' },
    share: 'مشاركة', shareText: 'موج — سباحة آمنة لأطفالك من ٦ إلى ١٨ سنة', linkCopied: 'نسخنا الرابط — الصقه في واتساب أو أي مكان', shareFallback: 'انسخ الرابط من شريط العنوان لمشاركته',
    pull: 'اسحب للتحديث', release: 'أفلت للتحديث', refreshing: 'جارٍ التحديث…', refreshed: 'تم التحديث الآن',
    demoTools: 'أدوات العرض', demoTitle: 'محاكاة الحالات', demoLead: 'جرّب حالات التحميل والخطأ دون خادم حقيقي.',
    demoNetFail: 'فشل تحميل البيانات في المحاولة الأولى', demoPayFail: 'رفض الدفع في المحاولة الأولى', demoShortHold: 'مدة حجز قصيرة (٣٠ ثانية)', done: 'تم',
    toastCalendar: 'أضفنا موعد البدء إلى تقويمك (تجريبي)', toastInvoice: 'فتحنا الفاتورة PDF (تجريبي)', toastMakeup: 'أرسلنا طلب الحصة التعويضية للإدارة',
    toastFreeze: 'أرسلنا طلب التجميد — أرفق تقرير طبي من حسابك', toastExport: 'جهّزنا ملف Excel (تجريبي)', toastPolicy: 'تُنشر هذه الصفحة بعد اعتماد النص القانوني',
    toastLogin: 'تسجيل الدخول برمز يصل لجوالك — في النسخة التالية', toastWaitlist: 'أضفناك لقائمة الانتظار وسنُعلمك فورًا', toastWaitlistOff: 'أزلناك من قائمة الانتظار',
    toastDeleted: 'حُذف الإشعار', undo: 'تراجع', toastRead: 'علّمنا كل الإشعارات كمقروءة', toastCodeOn: 'فعّلنا الكود {code}', toastCodeOff: 'أوقفنا الكود {code}',
    toastWhatsapp: 'واتساب: [+965 XXXX XXXX]', toastNotify: 'سنُعلمك عند فتح التسجيل', toastSection: 'هذا القسم ضمن المرحلة القادمة من لوحة الإدارة',
    toastSubscribed: 'تم الاشتراك في النشرة', toastPicked: 'اخترنا {name} — أكمل الخطوات', toastHelp: 'مركز المساعدة يُضاف في النسخة التالية', toastSaved: 'حُفظ', toastAbsence: 'تم تسجيل الغياب وأُبلغ المدرب',
    toastRenewed: 'أُعيد حجز المقاعد ١٠ دقائق', toastAdded: 'أضفنا طفلًا — اختر برنامجه', toastRemoved: 'أزلنا الطفل من الطلب', toastAligned: 'وحّدنا الفترة حيث توفرت المقاعد',
    badges: 'الشارات', badgeLocked: 'لم تُفتح بعد — ', dragClose: 'اسحب للأسفل أو اضغط خارجها للإغلاق', sampleNames: true,
    theme: 'المظهر', backSwipe: 'اسحب من حافة الشاشة للرجوع'
  },
  en: {
    tabs: { home: 'Home', programs: 'Programs', enroll: 'Enroll', account: 'Account', admin: 'Admin' },
    share: 'Share', shareText: 'MAWJ — safe swimming for kids aged 6 to 18', linkCopied: 'Link copied — paste it in WhatsApp or anywhere', shareFallback: 'Copy the link from the address bar to share it',
    pull: 'Pull to refresh', release: 'Release to refresh', refreshing: 'Refreshing…', refreshed: 'Updated just now',
    demoTools: 'Demo tools', demoTitle: 'Simulate states', demoLead: 'Try loading and error states without a real server.',
    demoNetFail: 'Data fails to load on the first try', demoPayFail: 'Payment declined on the first try', demoShortHold: 'Short seat hold (30 seconds)', done: 'Done',
    toastCalendar: 'Start date added to your calendar (demo)', toastInvoice: 'Opened the PDF invoice (demo)', toastMakeup: 'Make-up class request sent to the club',
    toastFreeze: 'Freeze request sent — attach a medical report from your account', toastExport: 'Excel file prepared (demo)', toastPolicy: 'This page is published once the legal text is approved',
    toastLogin: 'Log in with a code sent to your phone — coming in the next release', toastWaitlist: 'You’re on the waitlist — we’ll notify you right away', toastWaitlistOff: 'Removed from the waitlist',
    toastDeleted: 'Notification deleted', undo: 'Undo', toastRead: 'All notifications marked as read', toastCodeOn: 'Code {code} activated', toastCodeOff: 'Code {code} paused',
    toastWhatsapp: 'WhatsApp: [+965 XXXX XXXX]', toastNotify: 'We’ll notify you when registration opens', toastSection: 'This section is part of the next admin release',
    toastSubscribed: 'Subscribed to the newsletter', toastPicked: '{name} picked — finish the steps', toastHelp: 'The help center arrives in the next release', toastSaved: 'Saved', toastAbsence: 'Absence recorded and the coach notified',
    toastRenewed: 'Seats held again for 10 minutes', toastAdded: 'Child added — pick their program', toastRemoved: 'Child removed from the order', toastAligned: 'Shifts matched where seats allow',
    badges: 'Badges', badgeLocked: 'Not unlocked yet — ', dragClose: 'Drag down or tap outside to close', sampleNames: true,
    theme: 'Theme', backSwipe: 'Swipe from the screen edge to go back'
  }
};

export type AppStrings = typeof APP.ar;
