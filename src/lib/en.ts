import type { Dict } from './ar';

export const EN: Dict = {
  meta: { title: 'MAWJ — Swimming club for ages 6–18', description: 'Safe, joyful swimming for kids in Kuwait: certified coaches, small groups and five-step enrollment.' },
  brand: { name: 'MAWJ', latin: 'موج', tagline: 'Learn. Swim. Excel.' },
  nav: { home: 'Home', programs: 'Programs', pricing: 'Pricing', safety: 'Safety', faq: 'FAQ', account: 'My account', admin: 'Admin', enroll: 'Enroll', switchLang: 'ع', switchLangLabel: 'التبديل إلى العربية', mainMenu: 'Main menu', backToTop: 'Back to top' },
  common: {
    kwd: 'KWD', years: 'years', retry: 'Try again', loading: 'Loading…', close: 'Close', optional: 'optional', required: 'required',
    sampleData: 'Sample data', placeholderDate: '[date]', placeholderTime: '[time]', fromTo: '[from – to]', next: 'Next', back: 'Back', swipeHint: 'Swipe for more'
  },
  alert: { text: 'Notice: [emergency announcement — e.g. pool closed for maintenance]', dismiss: 'Dismiss notice' },
  hero: {
    title: 'Safe, joyful swimming for kids aged 6 to 18',
    lead: 'Certified coaches, small groups and a lifeguard on every shift. Enroll in five steps and follow your child’s progress — parents always know everything.',
    cta: 'Enroll now', secondary: 'Browse programs', from: 'Courses from', duration: '2 weeks', hours: '4 hours per shift', noHidden: 'No hidden fees',
    nextCourse: 'Next course', starts: 'Starts', seatsLeft: 'Seats left', seatsOf: '{left} of {cap}', fill: 'Course capacity filled'
  },
  features: ['Certified coaches', 'Small groups', 'Certified lifeguard every shift', 'Clear prices from the start'],
  steps: {
    title: 'Enroll in five steps', lead: 'From browsing to payment in under 6 taps, with your child’s seat held for 10 minutes.', progressLabel: 'Enrollment steps', stepOf: 'Step {n} of 5',
    items: [
      { title: 'Browse', text: 'Filter programs by age, shift and level.' },
      { title: 'Pick', text: 'Shift and start date — seat held for you.' },
      { title: 'Enroll', text: 'A short form for you and your child.' },
      { title: 'Discount', text: 'Sibling discount applied as a reward.' },
      { title: 'Pay', text: 'KNET, card or Apple Pay, securely.' }
    ]
  },
  ages: {
    title: 'A program for every age', lead: 'We place your child automatically from the date of birth. Age counts in completed years on the course start date; boundary ages move up (an 8-year-old joins 8–10).',
    ratio: 'One coach per {n} kids',
    groups: {
      a1: { name: 'Little Dolphins', range: '6–8', focus: 'Water confidence, floating and breathing.' },
      a2: { name: 'Starfish', range: '8–10', focus: 'Freestyle, backstroke and safe jumps.' },
      a3: { name: 'Brave Turtles', range: '10–12', focus: 'Better technique and breaststroke.' },
      a4: { name: 'Swift Sharks', range: '12–14', focus: 'Endurance, speed and all strokes.' },
      a5: { name: 'Junior Lifeguards', range: '14–18', focus: 'Competitive track and rescue skills.' }
    }
  },
  shifts: {
    title: 'Three shifts to fit your day', lead: 'Each shift is 4 hours: warm-up, training, a snack break, then play. Separate shifts for boys and girls.',
    names: { morning: 'Morning', evening: 'Evening', night: 'Night' },
    long: { morning: 'Morning shift', evening: 'Evening shift', night: 'Night shift' },
    notes: { morning: 'Ideal for the summer break.', evening: 'Right after school.', night: 'For teens, away from the summer heat.' }
  },
  gender: { boys: 'Boys', girls: 'Girls' },
  program: {
    shift: 'Shift', starts: 'Starts', duration: 'Duration', durationValue: '2 weeks · 4 hrs', price: 'Price', seats: 'Seats', seatsLeft: '{left} of {cap} left', noSeats: 'No seats',
    round: 'Course {n}', choose: 'Choose this program', pick: 'Pick', picked: 'Picked', waitlist: 'Join the waitlist', waitlisted: 'You’re on the waitlist — we’ll notify you',
    badges: { new: 'New', popular: 'Most popular', almostFull: 'Almost full', full: 'Full' }, fillLabel: 'Group capacity filled'
  },
  upcoming: { title: 'Courses starting soon', all: 'All programs' },
  family: { title: 'Bring the family, save more', lead: 'Sibling discount is applied automatically at the discount step — no codes needed.', two: 'Two kids: 10% off', three: 'Three or more: 15% off', example: 'Example: two kids, one course', sibling: 'Sibling discount 10%', total: 'Total' },
  safety: {
    title: 'Safety first, always', lead: 'Every decision at the club starts with one question: is this safe for your child?', policy: 'Read our safety and child-protection policy',
    items: ['Certified lifeguards on every shift', 'Daily water-quality checks, published', 'No coach is ever alone with a child', 'QR-verified pick-up by authorized adults only', 'Instant arrival and pick-up notifications', 'AED and first aid on site']
  },
  voices: { title: 'What parents say', placeholder: '[A real parent review — published with their consent]', who: '[Name · child’s group]' },
  faq: {
    title: 'FAQ',
    items: [
      { q: 'How do I know the right group for my child?', a: 'Enter the date of birth when you sign up and we place your child automatically. Boundary ages move up.' },
      { q: 'What does the 120 KWD price include?', a: 'A two-week course, 4 hours per shift, with a certified coach and a lifeguard on every shift. [Complete: inclusions and exclusions]' },
      { q: 'How does the sibling discount work?', a: 'It is applied automatically: 10% for two kids and 15% for three or more. When several discounts apply, the highest one wins.' },
      { q: 'Which payment methods do you accept?', a: 'KNET, Visa and Mastercard, Apple Pay and Google Pay. We never store card details on our servers.' },
      { q: 'What should my child bring on day one?', a: 'Swimsuit, goggles, swim cap, towel and a water bottle.' },
      { q: 'Can I cancel or freeze?', a: '[Complete: cancellation, refund and freeze policy in plain language]' }
    ]
  },
  cta: { title: 'Your child’s seat is waiting', lead: 'You see the final price before paying, and nothing is binding until you pay.' },
  footer: {
    about: 'Swimming club for ages 6–18. Safety, professionalism, fun.', newsletter: 'Newsletter', emailPlaceholder: 'Your email', subscribe: 'Subscribe',
    newsletterInvalid: 'Enter a valid email, like name@mail.com', newsletterLoading: 'Subscribing…', newsletterDone: 'Done! You’ll get course news and offers.',
    club: 'Club', account: 'Account', policies: 'Policies', login: 'Log in', help: 'Help center', contact: 'Contact us',
    terms: 'Terms & conditions', privacy: 'Privacy policy', refunds: 'Cancellations & refunds', childProtection: 'Child protection',
    rights: '© MAWJ [year]. All rights reserved.', contactLine: '[Address] · [Phone +965] · [Opening hours]', whatsapp: 'Chat with us on WhatsApp'
  },
  programs: {
    breadcrumb: 'Breadcrumb', title: 'Find the right program', lead: 'Every course is 2 weeks, 4 hours per shift, 120 KWD. Browse without logging in.',
    filters: 'Filters', age: 'Age', allAges: 'All ages', shift: 'Shift', all: 'All', group: 'Group', sort: 'Sort',
    sortSoon: 'Starting soonest', sortPopular: 'Most popular', sortSeats: 'Most seats available', count: '{n} programs available', loadingCount: 'Loading programs…', clear: 'Clear filters',
    errorTitle: 'Couldn’t load programs', errorText: 'Check your internet connection and try again. Your filters are kept.',
    emptyTitle: 'No program matches these filters yet', emptyText: 'Try another shift, or turn on “Notify me when registration opens”.'
  },
  enroll: {
    hold: 'Your seats are held for {time}', holdExpired: 'The seat hold expired and the seats were released. Your choices are still saved.', renewHold: 'Hold the seats again',
    pickTitle: 'Pick the program and shift', pickLead: 'Nothing is binding until you pay. Unavailable options stay visible, disabled, with the reason.',
    child: 'Child {n}', removeChild: 'Remove this child', ageGroup: 'Age group', group: 'Group', startDate: 'Start date', shiftLabel: 'Shift (4 hours)',
    shiftUnavailable: 'Not offered for this age', shiftFull: 'Full — waitlist', shiftSeats: '{n} seats left', shiftFew: 'Only {n} seats left',
    siblingShiftHint: 'Tip: the same shift for siblings makes drop-off and pick-up easier.', alignShifts: 'Match shifts where possible', addChild: '+ Add another child to this order',
    backToPrograms: 'Back to programs', nextDetails: 'Next: your details', nextDiscount: 'Next: discount', nextPay: 'Next: payment',
    detailsTitle: 'Your details', detailsLead: 'Your data is encrypted. We only ask for what keeps your child safe.', errorSummary: 'Please review {n} fields highlighted in red.',
    parent: 'Parent', fullName: 'Full name', mobile: 'Mobile number', mobileHint: 'We send your verification code and course messages here', email: 'Email', emailHint: 'For invoices only',
    emergencyName: 'Emergency contact', emergencyNamePh: 'Name and relationship', emergencyPhone: 'Emergency mobile',
    childName: 'Child’s full name', dob: 'Date of birth', dobHint: 'We set the age group from the date of birth', dobDetected: 'Age {age} → group {range}',
    level: 'Current swimming level', levels: { beginner: 'Beginner — can’t swim yet', intermediate: 'Intermediate — swims a short distance', advanced: 'Advanced — swims confidently' },
    mismatch: 'Based on the date of birth, the right group is {range} ({name}).', fixGroup: 'Move to the right group',
    fear: 'My child is afraid of water — we’ll tell the coach to start gently', health: 'Allergies or health conditions the coach should know', healthHint: 'Visible only to the assigned coach',
    consents: 'Consents', terms: 'I agree to the terms and cancellation policy and confirm the health details are accurate.', photo: 'I allow photos of my child for their private progress file only (optional — you can change this later)',
    discountTitle: 'Discount', discountLead: 'We apply the highest discount you qualify for — discounts don’t stack.', saved: 'You saved {amount}',
    noDiscount: 'No automatic discount this time', siblingReward: 'Because your family is with us: {pct}% sibling discount on {n} kids.', promoReward: 'Code {code} applied.',
    noDiscountText: 'Sibling discount starts at two kids (10%). Have a code? Enter it below.', suggestThird: 'Add a third child to raise the discount to 15%.', suggestSecond: 'Add a brother or sister and get 10% off.', addChildShort: 'Add a child',
    promoLabel: 'Have a discount code?', apply: 'Apply', promoHint: 'Try WELCOME for the demo', promoEmpty: 'Enter a code first.', promoChecking: 'Checking the code…', promoInvalid: 'This code is invalid or expired.',
    promoValid: 'Code {code} applied: {pct}% off', promoLower: 'The code works, but your sibling discount is higher, so we applied that.', promoError: 'Couldn’t check the code right now. Try again.',
    payTitle: 'Payment', payLead: 'Secure payment through a licensed gateway with 3D Secure. We never store your card.', method: 'Payment method',
    methods: { knet: 'KNET', card: 'Visa / Mastercard', apple: 'Apple Pay', google: 'Google Pay' },
    pay: 'Pay {amount}', paying: 'Processing… don’t close this page', payRetry: 'Try again · {amount}', payFailedTitle: 'Payment didn’t go through',
    payDeclined: 'Your bank declined the payment. Check your balance or try another method — nothing was charged and your order is saved.', payNetwork: 'The connection dropped before confirmation. Nothing was charged — try again.',
    successTitle: 'You’re enrolled!', successLead: 'Seats confirmed. We sent the receipt by WhatsApp and email.', orderRef: 'Order number:', whenWhere: 'When and where?', whenWhereValue: '[Start date and time] · [Branch name and address]',
    bring: 'What to bring?', bringValue: 'Swimsuit, goggles, swim cap, towel, water bottle.', addCalendar: 'Add to calendar', goAccount: 'Go to my account', discountLater: 'Sibling discount is calculated automatically at step 4.'
  },
  summary: { title: 'Order summary', empty: 'You haven’t picked a program yet.', subtotal: 'Subtotal', sibling: 'Sibling discount {pct}%', promo: 'Code {code} {pct}%', total: 'Total', saved: 'You saved {amount}', note: 'Prices in Kuwaiti dinars, all fees included. Seats are confirmed only after payment.' },
  errors: {
    nameRequired: 'Enter your full name.', phoneInvalid: 'An 8-digit Kuwaiti number starting with 5, 6 or 9.', emailInvalid: 'Enter a valid email, like name@mail.com', emergencyRequired: 'We need someone to call in an emergency.',
    childNameRequired: 'Enter the child’s name.', dobRequired: 'Date of birth is needed to set the group.', ageOutOfRange: 'Our programs are for ages 6 to 18.', ageGroupMismatch: 'The age doesn’t match the chosen group — use the move button below.', termsRequired: 'Please accept the terms to continue.'
  },
  account: {
    hello: 'Hello, [parent name]', lead: 'Everything about your kids in one place.', newEnrollment: '+ New enrollment', sections: 'Account sections',
    tabs: { overview: 'Overview', payments: 'Payments', notifications: 'Notifications' }, swipeTabs: 'Swipe left or right to switch sections',
    errorTitle: 'Couldn’t load your account', errorText: 'We can’t reach your data right now. Try again in a moment.', emptyTitle: 'No children added yet', emptyText: 'Pick a program and enroll in five simple steps.',
    qr: 'Attendance code', qrAlt: 'QR code for attendance and pick-up', qrText: 'Show it at reception for check-in and pick-up. Works offline.', nextSession: 'Next session', coach: 'Coach', attendance: 'Attendance', status: 'Subscription',
    progress: 'Level progress: {level}', skills: '{done} of {total} skills', coachNote: 'Coach’s note: {note}',
    reportAbsence: 'Report absence', makeup: 'Make-up class', freeze: 'Freeze', renew: 'Renew', absenceReason: 'Reason for absence', chooseReason: 'Choose a reason',
    reasons: { sick: 'Illness', travel: 'Travel', school: 'School commitment', other: 'Other' }, absenceHint: 'The coach is notified automatically.', absenceInvalid: 'Choose a reason.', sending: 'Sending…', send: 'Send', absenceDone: 'Absence recorded. You can request a make-up class.',
    paymentsTitle: 'Payment history', colRef: 'Order', colDetails: 'Details', colAmount: 'Amount', colStatus: 'Status', invoice: 'Download PDF', paid: 'Paid', failed: 'Failed — not charged',
    markAll: 'Mark all as read', unread: '(unread)', swipeDelete: 'Swipe a notification sideways to delete it.', deleteNotif: 'Delete notification', noNotifs: 'No new notifications. All good.'
  },
  admin: {
    title: 'Admin', menu: 'Admin menu', role: 'Role: manager · 2FA on', updated: 'Sample data · updated a minute ago',
    kpiRevenue: 'Revenue today', kpiSignups: 'Sign-ups today', kpiOccupancy: 'Shift occupancy', kpiWaitlist: 'Waitlist',
    occupancy: 'Shift occupancy', occupancyHint: 'The night shift is nearly full — consider opening another group.', funnel: 'Conversion funnel · last 7 days', funnelHint: 'Biggest drop-off: from “Enroll” to “Discount”.',
    registrations: 'Latest registrations', search: 'Search by name or order number', allStatuses: 'All statuses', paid: 'Paid', pending: 'Awaiting payment', failed: 'Payment failed', export: 'Export Excel',
    noRows: 'No matching registrations. Try another search.', colOrder: 'Order', colParent: 'Parent', colKids: 'Kids', colProgram: 'Program', colAmount: 'Amount', colStatus: 'Status',
    emergency: 'Emergency closure', emergencyTitle: 'Emergency closure and broadcast', scope: 'Scope', scopeAll: 'All shifts today', message: 'Message to parents',
    defaultMessage: 'Sorry, the pool is closed today for maintenance. A make-up class has been added for your child automatically.', messageTooShort: 'Write a clear message to parents (at least 10 characters).',
    willNotify: '{n} parents will be notified.', confirm: 'Confirm closure and notify', cancel: 'Cancel', closureDone: 'Closed. {n} parents were notified and make-up classes were added automatically.', closureError: 'Sending failed. Nothing was closed — try again.',
    codes: 'Discounts and codes', active: 'Active', inactive: 'Paused'
  },
  notFound: { title: 'Looks like you swam too far!', text: 'This page doesn’t exist. Let’s get you back to shore.', home: 'Home' }
};
