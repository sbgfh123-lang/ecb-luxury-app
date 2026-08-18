import { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════════════════════════
   DESIGN TOKENS
   Ivory museum walls · charcoal ink · one bronze accent line ·
   the logo's own red/green/blue used ONLY as tiny signal dots
═══════════════════════════════════════════════════════════ */
const C = {
  ivory: "#F7F7EE",
  ivoryDim: "#EFEFE3",
  paper: "#FBFBF4",
  ink: "#292919",
  inkSoft: "rgba(41,41,25,0.6)",
  inkFaint: "rgba(41,41,25,0.32)",
  inkHair: "rgba(41,41,25,0.12)",
  navy: "#1B2A47",
  navyDeep: "#11192C",
  bronze: "#A8874F",
  bronzeSoft: "rgba(168,135,79,0.35)",
  red: "#B23A2E",
  green: "#3E6B47",
  blue: "#2C5A8C",
  cream: "#F1EFE2",
};

const SERIF = "'Cormorant Garamond', Georgia, serif";
const ARABIC = "'Noto Naskh Arabic', 'IBM Plex Sans Arabic', serif";
const SANS = "'Space Grotesk', sans-serif";

const FONTS = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

/* ════════════════════════════════════════════════════════════
   COPY / i18n — small dictionary covering chrome + labels.
   Long editorial passages are written once in Arabic (primary
   audience) with an English condensed variant.
═══════════════════════════════════════════════════════════ */
const T = {
  ar: {
    dir: "rtl",
    bureauAr: "المكتب الاستشاري الهندسي",
    bureauEn: "ENGINEERING CONSULTING BUREAU",
    uni: "كلية الهندسة — جامعة ذي قار",
    enter: "دخول",
    discover: "اكتشف المكتب",
    tagline: "نبني المعرفة... ونحوّلها إلى واقع.",
    nav: { home: "الرئيسية", about: "المكتب", services: "الخدمات", projects: "المشاريع", lab: "المختبر" },
    more: { team: "الفريق الهندسي", university: "الجامعة", tests: "دليل الفحوصات", philosophy: "فلسفتنا", news: "الأخبار", contact: "تواصل معنا", settings: "الإعدادات" },
    menuTitle: "المزيد",
    swipeHint: "اسحب لأعلى لتبدأ الرحلة",
    stages: ["رسم أولي", "مخطط هندسي", "نموذج CAD", "مجسّم ثلاثي الأبعاد", "مبنى منجز", "داخل المختبر"],
    aboutEyebrow: "عن المكتب",
    aboutH1: "الهندسة ليست",
    aboutH2: "خطوطًا على الورق.",
    aboutBody: "إنها قرار، دقة، مسؤولية، ومستقبل. منذ تأسيسه ضمن كلية الهندسة بجامعة ذي قار، يجمع المكتب بين العمق الأكاديمي والخبرة الميدانية في مسار واحد يخدم القطاعين العام والخاص.",
    aboutStats: [["+1000", "فحص مختبري منجز"], ["+100", "مشروع هندسي"], ["+50", "جهة مستفيدة"], ["+15", "سنة خبرة تراكمية"]],
    aboutFields: [
      ["01", "الاستشارات الهندسية", "دراسات أولية وتقييم فني شامل"],
      ["02", "الفحوصات المختبرية", "تربة، خرسانة، طرق، مواد إنشائية"],
      ["03", "الإشراف الهندسي", "متابعة ميدانية دقيقة للتنفيذ"],
      ["04", "الكادر الهندسي", "مهندسون وفنيون معتمدون"],
    ],
    servicesEyebrow: "خدماتنا",
    servicesTitle: "ماذا نقدّم",
    servicesHint: "المس خدمة لعرض المشهد المرتبط بها",
    services: [
      { n: "01", ar: "الاستشارات الهندسية", en: "ENGINEERING CONSULTANCY", d: "تقييم فني ودراسات جدوى أولية لأي مشروع هندسي.", scene: "consult" },
      { n: "02", ar: "الدراسات والتصاميم", en: "STUDIES & DESIGN", d: "تصاميم إنشائية ومعمارية مدروسة بدقة.", scene: "design" },
      { n: "03", ar: "الإشراف الهندسي", en: "SITE SUPERVISION", d: "متابعة ميدانية لضمان مطابقة التنفيذ للمخططات.", scene: "supervision" },
      { n: "04", ar: "الفحوصات المختبرية", en: "LABORATORY TESTING", d: "فحوصات شاملة وفق معايير دولية معتمدة.", scene: "lab" },
      { n: "05", ar: "فحوصات التربة", en: "SOIL TESTING", d: "تحليل طبقات التربة وقدرتها التحميلية.", scene: "soil" },
      { n: "06", ar: "فحوصات الخرسانة", en: "CONCRETE TESTING", d: "قياس المقاومة والجودة لعينات الخرسانة.", scene: "concrete" },
      { n: "07", ar: "فحوصات الطرق", en: "ROAD TESTING", d: "تقييم طبقات الأسفلت والقاعدة الترابية.", scene: "road" },
      { n: "08", ar: "فحوصات المواد الإنشائية", en: "MATERIALS TESTING", d: "حديد، طابوق، أسمنت، ومواد بناء متنوعة.", scene: "materials" },
      { n: "09", ar: "تقييم المنشآت", en: "STRUCTURAL ASSESSMENT", d: "فحص وتقييم سلامة المباني القائمة.", scene: "assessment" },
      { n: "10", ar: "الدراسات الإنشائية", en: "STRUCTURAL STUDIES", d: "تحليل الأحمال والسلوك الإنشائي للمنشآت.", scene: "structural" },
      { n: "11", ar: "الدراسات الجيوتقنية", en: "GEOTECHNICAL STUDIES", d: "دراسة خواص التربة قبل التأسيس.", scene: "geo" },
    ],
    labEyebrow: "المختبر",
    labH1: "هنا...",
    labH2: "الأرقام تتحدث.",
    labSub: "لأن القرار الهندسي يبدأ من نتيجة دقيقة.",
    equipment: [
      { name: "جهاز ضغط الخرسانة", en: "CONCRETE COMPRESSION MACHINE", fn: "قياس أقصى حمل تتحمله عينة الخرسانة قبل الانهيار.", tests: "مقاومة الضغط، مقاومة الانحناء", spec: "2000 kN · IQS / ASTM C39" },
      { name: "أجهزة فحص التربة", en: "SOIL TESTING EQUIPMENT", fn: "تحديد الخواص الفيزيائية والميكانيكية للتربة.", tests: "بروكتور، حدود أتربرغ، CBR", spec: "ASTM D1557 / D4318" },
      { name: "جهاز مارشال", en: "MARSHALL TESTING MACHINE", fn: "تقييم استقرارية وانسياب الخلطات الإسفلتية.", tests: "استقرارية مارشال، الانسياب", spec: "ASTM D6927" },
      { name: "جهاز CBR", en: "CBR APPARATUS", fn: "قياس نسبة تحمل كاليفورنيا لطبقات الطريق.", tests: "CBR مختبري وحقلي", spec: "ASTM D1883" },
      { name: "منخل التحليل الحبيبي", en: "SIEVE ANALYSIS SET", fn: "تصنيف حبيبات التربة والركام حسب الحجم.", tests: "التدرج الحبيبي", spec: "ASTM C136" },
      { name: "محطة المساحة الشاملة", en: "TOTAL STATION", fn: "قياسات زاوية ومسافة عالية الدقة للمواقع.", tests: "رفع مساحي، تخطيط مواقع", spec: "دقة 2 ثانية" },
      { name: "جهاز فحص الحديد", en: "STEEL TENSILE TESTER", fn: "قياس مقاومة الشد وقابلية الانثناء لحديد التسليح.", tests: "الشد، الانثناء، الخضوع", spec: "ASTM A615" },
      { name: "جهاز فحص النفاذية", en: "PERMEABILITY APPARATUS", fn: "قياس مقاومة الخرسانة والتربة لتسرب الماء.", tests: "نفاذية الماء", spec: "BS EN 12390-8" },
    ],
    testsNav: "دليل الفحوصات",
    testsEyebrow: "الفحوصات",
    testsTitle: "دليل الفحوصات",
    testCats: ["التربة", "الخرسانة", "الطرق", "المواد الإنشائية"],
    tests: {
      "التربة": [
        { name: "تحليل حبيبي", sample: "عينة تربة مضطربة", unit: "لكل عينة", price: "45,000 د.ع" },
        { name: "حدود أتربرغ", sample: "عينة تربة ناعمة", unit: "لكل عينة", price: "35,000 د.ع" },
        { name: "فحص بروكتور", sample: "عينة تربة مبعثرة", unit: "لكل عينة", price: "60,000 د.ع" },
      ],
      "الخرسانة": [
        { name: "مقاومة الضغط", sample: "مكعب خرسانة 15سم", unit: "لكل مكعب", price: "25,000 د.ع" },
        { name: "فحص الانهيار", sample: "خرسانة طازجة", unit: "لكل اختبار", price: "15,000 د.ع" },
        { name: "نفاذية الماء", sample: "عينة أسطوانية", unit: "لكل عينة", price: "40,000 د.ع" },
      ],
      "الطرق": [
        { name: "CBR حقلي", sample: "طبقة أساس", unit: "لكل موقع", price: "120,000 د.ع" },
        { name: "استقرارية مارشال", sample: "عينة أسفلتية", unit: "لكل عينة", price: "90,000 د.ع" },
      ],
      "المواد الإنشائية": [
        { name: "فحص الحديد", sample: "قضيب تسليح", unit: "لكل عينة", price: "55,000 د.ع" },
        { name: "فحص الطابوق", sample: "طابوقة عشوائية", unit: "لكل عينة", price: "30,000 د.ع" },
      ],
    },
    projectsEyebrow: "المشاريع",
    projectsTitle: "أعمالنا",
    projectsHint: "اسحب أفقيًا لاستكشاف المعرض",
    projects: [
      { n: "01", name: "منشأة تعليمية جامعية", type: "مبنى تعليمي", loc: "الناصرية، ذي قار", year: "2023", scope: "دراسة إنشائية + إشراف هندسي", desc: "تصميم وإشراف هندسي كامل على إنشاء مبنى تعليمي متعدد الطوابق ضمن الحرم الجامعي، شمل دراسات التربة والفحوصات المختبرية لكامل مراحل التنفيذ." },
      { n: "02", name: "مجمع سكني الفرات", type: "مبنى سكني", loc: "الناصرية، ذي قار", year: "2022", scope: "فحوصات خرسانة + حديد", desc: "إجراء الفحوصات المختبرية الشاملة لمجمع سكني متكامل، شملت اختبارات مقاومة الخرسانة وجودة حديد التسليح." },
      { n: "03", name: "طريق الربط الإقليمي", type: "طرق وبنية تحتية", loc: "ذي قار — البصرة", year: "2023", scope: "دراسة جيوتقنية + CBR", desc: "دراسة جيوتقنية كاملة وفحوصات CBR الحقلية لتحديد سماكة طبقات الرصف على طول الطريق." },
      { n: "04", name: "جسر وادي الشط", type: "جسور", loc: "ذي قار", year: "2021", scope: "فحوصات تربة + تقييم إنشائي", desc: "دراسة التربة الأساسية وتقييم السلامة الإنشائية لأساسات الجسر قبل مرحلة التنفيذ." },
      { n: "05", name: "منشآت المرحلة الصناعية", type: "بنية تحتية", loc: "الناصرية، ذي قار", year: "2024", scope: "فحوصات مواد إنشائية شاملة", desc: "إشراف فني وفحوصات دورية لمواد البناء المستخدمة في منشآت صناعية متعددة." },
    ],
    teamEyebrow: "الفريق الهندسي",
    teamTitle: "من يقف خلف كل تقرير",
    team: [
      { name: "أ.د. محمد العلوي", pos: "رئيس المكتب", spec: "الهندسة الإنشائية" },
      { name: "م.م. سارة الخفاجي", pos: "مديرة المختبرات", spec: "فحوصات المواد" },
      { name: "م. أحمد الزبيدي", pos: "مهندس جيوتقني", spec: "دراسات التربة" },
      { name: "م.م. فاطمة الكعبي", pos: "مهندسة إنشائية", spec: "التصميم الإنشائي" },
      { name: "م. علي حسين", pos: "مشرف ميداني", spec: "الإشراف الهندسي" },
      { name: "م.م. زينب صالح", pos: "مهندسة طرق", spec: "فحوصات الطرق" },
    ],
    uniEyebrow: "الانتماء الأكاديمي",
    uniH1: "من جامعة ذي قار...",
    uniH2: "...إلى ميادين العمل.",
    uniBody: "شراكة راسخة بين المعرفة الأكاديمية والتطبيق الميداني. يعمل المكتب تحت مظلة كلية الهندسة، محوّلًا الخبرة البحثية إلى حلول هندسية تخدم المجتمع العراقي.",
    philTitle: "فلسفتنا",
    philWords: ["الدقة", "المعرفة", "الابتكار", "المسؤولية", "الجودة"],
    philFinal: "الهندسة التي تصنع فرقًا.",
    philHint: "اضغط للمتابعة",
    newsEyebrow: "الأخبار",
    newsTitle: "آخر المستجدات",
    news: [
      { date: "12 مارس 2024", cat: "المشاريع", title: "انطلاق فحوصات مجمع الفرات السكني", body: "بدأ المكتب هذا الأسبوع بإجراء الفحوصات المختبرية الأولية لمجمع الفرات السكني الجديد، والتي تشمل فحوصات شاملة للتربة والخرسانة على مدى الأشهر المقبلة." },
      { date: "28 فبراير 2024", cat: "المختبر", title: "تحديث أجهزة فحص الخرسانة", body: "تم تزويد المختبر بجهاز ضغط خرسانة جديد بسعة 2000 كيلونيوتن، مما يرفع من دقة وكفاءة فحوصات المقاومة." },
      { date: "15 يناير 2024", cat: "الجامعة", title: "زيارة وفد أكاديمي للمختبرات", body: "استقبل المكتب وفدًا من كلية الهندسة للاطلاع على أحدث معدات الفحص المختبري وآليات العمل الميداني." },
    ],
    contactEyebrow: "لنبدأ",
    contactTitle1: "لنبنِ",
    contactTitle2: "المستقبل معًا.",
    startProject: "ابدأ مشروعك",
    contactUs: "تواصل مع المكتب",
    contactDetails: [
      ["الهاتف", "+964 780 000 0000"],
      ["البريد الإلكتروني", "ecb@utq.edu.iq"],
      ["الموقع", "الناصرية، ذي قار، العراق"],
    ],
    settingsTitle: "الإعدادات",
    language: "اللغة",
    resetIntro: "إعادة عرض الشاشة الافتتاحية",
    version: "الإصدار 1.0.0",
  },
  en: {
    dir: "ltr",
    bureauAr: "ENGINEERING CONSULTING BUREAU",
    bureauEn: "ENGINEERING CONSULTING BUREAU",
    uni: "College of Engineering — University of Thi-Qar",
    enter: "ENTER",
    discover: "Discover the Bureau",
    tagline: "We build knowledge... and turn it into reality.",
    nav: { home: "Home", about: "Office", services: "Services", projects: "Projects", lab: "Lab" },
    more: { team: "Engineering Team", university: "University", tests: "Test Directory", philosophy: "Philosophy", news: "News", contact: "Contact", settings: "Settings" },
    menuTitle: "More",
    swipeHint: "Swipe up to begin the journey",
    stages: ["Sketch", "Blueprint", "CAD Model", "3D Model", "Finished Building", "Inside the Lab"],
    aboutEyebrow: "About the Bureau",
    aboutH1: "Engineering is not",
    aboutH2: "lines on paper.",
    aboutBody: "It is a decision, a precision, a responsibility, a future. Founded within the College of Engineering at the University of Thi-Qar, the Bureau merges academic depth with field expertise for both public and private sectors.",
    aboutStats: [["1000+", "Lab tests completed"], ["100+", "Engineering projects"], ["50+", "Clients served"], ["15+", "Years of expertise"]],
    aboutFields: [
      ["01", "Engineering Consultancy", "Preliminary studies & technical assessment"],
      ["02", "Laboratory Testing", "Soil, concrete, roads, materials"],
      ["03", "Site Supervision", "Precise on-site execution monitoring"],
      ["04", "Engineering Team", "Certified engineers & technicians"],
    ],
    servicesEyebrow: "Services",
    servicesTitle: "What We Offer",
    servicesHint: "Tap a service to reveal its scene",
    services: [
      { n: "01", ar: "Engineering Consultancy", en: "ENGINEERING CONSULTANCY", d: "Technical assessment & feasibility for any project.", scene: "consult" },
      { n: "02", ar: "Studies & Design", en: "STUDIES & DESIGN", d: "Precise structural and architectural design.", scene: "design" },
      { n: "03", ar: "Site Supervision", en: "SITE SUPERVISION", d: "Field monitoring to ensure design compliance.", scene: "supervision" },
      { n: "04", ar: "Laboratory Testing", en: "LABORATORY TESTING", d: "Comprehensive tests to international standards.", scene: "lab" },
      { n: "05", ar: "Soil Testing", en: "SOIL TESTING", d: "Analysis of soil layers and bearing capacity.", scene: "soil" },
      { n: "06", ar: "Concrete Testing", en: "CONCRETE TESTING", d: "Strength and quality measurement of concrete.", scene: "concrete" },
      { n: "07", ar: "Road Testing", en: "ROAD TESTING", d: "Assessment of asphalt and base layers.", scene: "road" },
      { n: "08", ar: "Materials Testing", en: "MATERIALS TESTING", d: "Steel, brick, cement and building materials.", scene: "materials" },
      { n: "09", ar: "Structural Assessment", en: "STRUCTURAL ASSESSMENT", d: "Safety evaluation of existing structures.", scene: "assessment" },
      { n: "10", ar: "Structural Studies", en: "STRUCTURAL STUDIES", d: "Load analysis and structural behavior.", scene: "structural" },
      { n: "11", ar: "Geotechnical Studies", en: "GEOTECHNICAL STUDIES", d: "Soil properties before foundation work.", scene: "geo" },
    ],
    labEyebrow: "Laboratory",
    labH1: "Here...",
    labH2: "numbers speak.",
    labSub: "Because every engineering decision starts with an accurate result.",
    equipment: [
      { name: "Concrete Compression Machine", en: "CONCRETE COMPRESSION MACHINE", fn: "Measures the maximum load a concrete sample withstands before failure.", tests: "Compressive & flexural strength", spec: "2000 kN · IQS / ASTM C39" },
      { name: "Soil Testing Equipment", en: "SOIL TESTING EQUIPMENT", fn: "Determines physical and mechanical soil properties.", tests: "Proctor, Atterberg limits, CBR", spec: "ASTM D1557 / D4318" },
      { name: "Marshall Testing Machine", en: "MARSHALL TESTING MACHINE", fn: "Evaluates stability and flow of asphalt mixes.", tests: "Marshall stability, flow", spec: "ASTM D6927" },
      { name: "CBR Apparatus", en: "CBR APPARATUS", fn: "Measures California Bearing Ratio for road layers.", tests: "Lab & field CBR", spec: "ASTM D1883" },
      { name: "Sieve Analysis Set", en: "SIEVE ANALYSIS SET", fn: "Classifies soil and aggregate particles by size.", tests: "Grain size distribution", spec: "ASTM C136" },
      { name: "Total Station", en: "TOTAL STATION", fn: "High-precision angle and distance measurement.", tests: "Site surveying & layout", spec: "2\" accuracy" },
      { name: "Steel Tensile Tester", en: "STEEL TENSILE TESTER", fn: "Measures tensile strength and ductility of rebar.", tests: "Tensile, bending, yield", spec: "ASTM A615" },
      { name: "Permeability Apparatus", en: "PERMEABILITY APPARATUS", fn: "Measures water resistance of concrete and soil.", tests: "Water permeability", spec: "BS EN 12390-8" },
    ],
    testsEyebrow: "Tests",
    testsTitle: "Test Directory",
    testCats: ["Soil", "Concrete", "Roads", "Materials"],
    tests: {
      "Soil": [
        { name: "Grain Size Analysis", sample: "Disturbed soil sample", unit: "per sample", price: "45,000 IQD" },
        { name: "Atterberg Limits", sample: "Fine soil sample", unit: "per sample", price: "35,000 IQD" },
        { name: "Proctor Test", sample: "Bulk soil sample", unit: "per sample", price: "60,000 IQD" },
      ],
      "Concrete": [
        { name: "Compressive Strength", sample: "15cm concrete cube", unit: "per cube", price: "25,000 IQD" },
        { name: "Slump Test", sample: "Fresh concrete", unit: "per test", price: "15,000 IQD" },
        { name: "Permeability", sample: "Cylindrical sample", unit: "per sample", price: "40,000 IQD" },
      ],
      "Roads": [
        { name: "Field CBR", sample: "Base layer", unit: "per site", price: "120,000 IQD" },
        { name: "Marshall Stability", sample: "Asphalt sample", unit: "per sample", price: "90,000 IQD" },
      ],
      "Materials": [
        { name: "Steel Testing", sample: "Rebar rod", unit: "per sample", price: "55,000 IQD" },
        { name: "Brick Testing", sample: "Random brick", unit: "per sample", price: "30,000 IQD" },
      ],
    },
    projectsEyebrow: "Projects",
    projectsTitle: "Our Work",
    projectsHint: "Swipe to explore the gallery",
    projects: [
      { n: "01", name: "University Academic Facility", type: "Educational Building", loc: "Nasiriyah, Thi-Qar", year: "2023", scope: "Structural study + supervision", desc: "Complete design and engineering supervision of a multi-story academic building within the campus, including soil studies and lab testing throughout execution." },
      { n: "02", name: "Al-Furat Residential Complex", type: "Residential", loc: "Nasiriyah, Thi-Qar", year: "2022", scope: "Concrete + steel testing", desc: "Comprehensive laboratory testing for an integrated residential complex, including concrete strength and rebar quality tests." },
      { n: "03", name: "Regional Connector Road", type: "Roads & Infrastructure", loc: "Thi-Qar — Basra", year: "2023", scope: "Geotechnical study + CBR", desc: "Full geotechnical study and field CBR testing to determine pavement layer thickness along the route." },
      { n: "04", name: "Wadi Al-Shatt Bridge", type: "Bridges", loc: "Thi-Qar", year: "2021", scope: "Soil testing + structural review", desc: "Foundation soil study and structural safety assessment of the bridge foundations prior to construction." },
      { n: "05", name: "Industrial Phase Facilities", type: "Infrastructure", loc: "Nasiriyah, Thi-Qar", year: "2024", scope: "Full materials testing", desc: "Technical supervision and periodic testing of building materials used across multiple industrial facilities." },
    ],
    teamEyebrow: "Engineering Team",
    teamTitle: "Behind every report",
    team: [
      { name: "Prof. Mohammed Al-Alawi", pos: "Bureau Director", spec: "Structural Engineering" },
      { name: "Eng. Sarah Al-Khafaji", pos: "Lab Director", spec: "Materials Testing" },
      { name: "Eng. Ahmed Al-Zubaidi", pos: "Geotechnical Engineer", spec: "Soil Studies" },
      { name: "Eng. Fatima Al-Kaabi", pos: "Structural Engineer", spec: "Structural Design" },
      { name: "Eng. Ali Hussein", pos: "Field Supervisor", spec: "Site Supervision" },
      { name: "Eng. Zainab Saleh", pos: "Road Engineer", spec: "Road Testing" },
    ],
    uniEyebrow: "Academic Affiliation",
    uniH1: "From the University of Thi-Qar...",
    uniH2: "...to the field.",
    uniBody: "A firm partnership between academic knowledge and field application. The Bureau operates under the College of Engineering, turning research expertise into engineering solutions for Iraqi society.",
    philTitle: "Our Philosophy",
    philWords: ["Precision", "Knowledge", "Innovation", "Responsibility", "Quality"],
    philFinal: "Engineering that makes a difference.",
    philHint: "Tap to continue",
    newsEyebrow: "News",
    newsTitle: "Latest Updates",
    news: [
      { date: "March 12, 2024", cat: "Projects", title: "Al-Furat Complex Testing Begins", body: "This week the Bureau began initial laboratory testing for the new Al-Furat residential complex, covering comprehensive soil and concrete tests over the coming months." },
      { date: "February 28, 2024", cat: "Laboratory", title: "Concrete Testing Equipment Upgrade", body: "The lab was equipped with a new 2000 kN concrete compression machine, raising the accuracy and efficiency of strength testing." },
      { date: "January 15, 2024", cat: "University", title: "Academic Delegation Lab Visit", body: "The Bureau hosted a delegation from the College of Engineering to review the latest lab testing equipment and field procedures." },
    ],
    contactEyebrow: "Let's Begin",
    contactTitle1: "Let's build",
    contactTitle2: "the future together.",
    startProject: "Start Your Project",
    contactUs: "Contact the Bureau",
    contactDetails: [
      ["Phone", "+964 780 000 0000"],
      ["Email", "ecb@utq.edu.iq"],
      ["Location", "Nasiriyah, Thi-Qar, Iraq"],
    ],
    settingsTitle: "Settings",
    language: "Language",
    resetIntro: "Replay intro screen",
    version: "Version 1.0.0",
  },
};

/* ════════════════════════════════════════════════════════════
   LOGO — faithful monochrome-navy shield recreation of the
   uploaded crest. Shape / proportions / wording preserved.
═══════════════════════════════════════════════════════════ */
function Logo({ size = 64, tone = "navy", draw = false }) {
  const stroke = tone === "ivory" ? C.ivory : C.navy;
  const fill = tone === "ivory" ? "rgba(247,247,238,0.06)" : "rgba(27,42,71,0.04)";
  const id = useRef(Math.random().toString(36).slice(2)).current;
  return (
    <svg width={size} height={(size * 118) / 100} viewBox="0 0 200 236" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ornate shield outline */}
      <path
        d="M14 16 C14 12 17 9 21 9 H179 C183 9 186 12 186 16 V150 C186 158 183 165 177 170 L104 224 C101 226 99 226 96 224 L23 170 C17 165 14 158 14 150 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.4"
        strokeDasharray={draw ? 900 : 0}
        strokeDashoffset={draw ? 900 : 0}
        style={draw ? { animation: `${id}draw 2.1s cubic-bezier(.4,0,.2,1) forwards` } : {}}
      />
      <path
        d="M22 20 H178 V149 C178 155 175 160 170 164 L100 213 L30 164 C25 160 22 155 22 149 Z"
        fill="none" stroke={stroke} strokeOpacity="0.55" strokeWidth="1"
      />
      {/* header band */}
      <rect x="14" y="9" width="172" height="46" fill={stroke} opacity={draw ? 0 : 0.94}
        style={draw ? { animation: `${id}fade .6s 1.5s ease forwards` } : {}} />
      <text x="100" y="30" textAnchor="middle" fontFamily="'Noto Naskh Arabic',serif" fontSize="13" fill={tone === "ivory" ? C.navy : C.ivory} opacity={draw ? 0 : 1} style={draw ? { animation: `${id}fade .5s 1.7s ease forwards` } : {}}>المكتب الإستشاري الهندسي</text>
      <text x="100" y="46" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="7.5" letterSpacing="1" fontWeight="600" fill={tone === "ivory" ? C.navy : C.ivory} opacity={draw ? 0 : 1} style={draw ? { animation: `${id}fade .5s 1.8s ease forwards` } : {}}>ENGINEERING CONSULTING BUREAU</text>
      {/* monogram — interlocking E/B forms, single tone */}
      <g opacity={draw ? 0 : 1} style={draw ? { animation: `${id}fade .7s 1.9s ease forwards` } : {}}>
        <path d="M62 76 A32 32 0 1 0 62 140" stroke={stroke} strokeWidth="15" strokeLinecap="round" fill="none" />
        <line x1="62" y1="108" x2="98" y2="108" stroke={stroke} strokeWidth="9" strokeLinecap="round" />
        <path d="M108 76 A32 32 0 0 1 108 140" stroke={stroke} strokeWidth="15" strokeLinecap="round" fill="none" />
        <path d="M108 76 A19 19 0 0 1 108 108" stroke={stroke} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M108 108 A19 19 0 0 1 108 140" stroke={stroke} strokeWidth="9" strokeLinecap="round" fill="none" />
      </g>
      {/* university ring text (simplified arc) */}
      <path id={`${id}arc`} d="M118 68 A46 46 0 0 1 158 108" fill="none" />
      <text fontFamily="'Space Grotesk',sans-serif" fontSize="6.4" letterSpacing="1.4" fill={stroke} opacity={draw ? 0 : 0.8} style={draw ? { animation: `${id}fade .5s 2s ease forwards` } : {}}>
        <textPath href={`#${id}arc`} startOffset="2">UNIVERSITY OF THI-QAR</textPath>
      </text>
      {/* footer text */}
      <text x="100" y="196" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="6.5" letterSpacing=".6" fill={stroke} opacity={draw ? 0 : 0.75} style={draw ? { animation: `${id}fade .5s 2.1s ease forwards` } : {}}>ENGINEERING CONSULTING BUREAU</text>
      <text x="100" y="207" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="6.5" letterSpacing=".6" fill={stroke} opacity={draw ? 0 : 0.75} style={draw ? { animation: `${id}fade .5s 2.15s ease forwards` } : {}}>UNIVERSITY OF THI-QAR</text>
      <style>{`
        @keyframes ${id}draw{to{stroke-dashoffset:0;}}
        @keyframes ${id}fade{to{opacity:1;}}
      `}</style>
    </svg>
  );
}

/* Small university seal placeholder (kept distinct from ECB logo, unaltered stance) */
function UniSeal({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke={C.ivory} strokeOpacity="0.4" strokeWidth="1.5" fill="rgba(247,247,238,0.04)" />
      <circle cx="50" cy="50" r="37" stroke={C.ivory} strokeOpacity="0.25" strokeWidth="1" />
      <text x="50" y="46" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="9" letterSpacing="1" fill={C.ivory} opacity="0.7">UTQ</text>
      <text x="50" y="60" textAnchor="middle" fontFamily="'Noto Naskh Arabic',serif" fontSize="8" fill={C.ivory} opacity="0.55">جامعة ذي قار</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   SCENE SVGs — for the sketch→blueprint→cad→3d→building→lab
   home journey, and the per-service backdrop panels.
═══════════════════════════════════════════════════════════ */
function SceneSketch() {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "78%" }}>
      <g stroke={C.ink} fill="none" opacity="0.55">
        <rect x="120" y="120" width="160" height="160" strokeWidth="1.4" strokeDasharray="5,4" />
        <line x1="120" y1="180" x2="280" y2="180" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="60" y1="340" x2="340" y2="340" strokeWidth="1.6" strokeDasharray="7,4" />
        <circle cx="200" cy="90" r="30" strokeWidth="1.2" strokeDasharray="4,3" />
        <path d="M150 300 L200 240 L250 300" strokeWidth="1.2" strokeDasharray="4,3" />
      </g>
      <text x="200" y="368" textAnchor="middle" fontFamily={SANS} fontSize="8" letterSpacing="3" fill={C.inkFaint}>CONCEPT SKETCH</text>
    </svg>
  );
}
function SceneBlueprint() {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "80%" }}>
      <rect x="60" y="60" width="280" height="280" fill="#16233d" opacity="0.9" />
      <defs>
        <pattern id="bpgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#5b86c4" strokeOpacity="0.25" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="60" y="60" width="280" height="280" fill="url(#bpgrid)" />
      <rect x="110" y="110" width="180" height="160" fill="none" stroke="#8fb4e8" strokeWidth="1.2" />
      <line x1="110" y1="190" x2="290" y2="190" stroke="#8fb4e8" strokeWidth="0.8" opacity="0.7" />
      <rect x="130" y="130" width="45" height="45" fill="rgba(143,180,232,0.12)" stroke="#8fb4e8" strokeWidth="0.7" />
      <rect x="200" y="130" width="60" height="45" fill="rgba(143,180,232,0.12)" stroke="#8fb4e8" strokeWidth="0.7" />
      <text x="200" y="298" textAnchor="middle" fontFamily={SANS} fontSize="8" letterSpacing="3" fill="#8fb4e8">FLOOR PLAN — 1:100</text>
    </svg>
  );
}
function SceneCAD() {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "80%" }}>
      <g stroke={C.blue} fill="none" strokeWidth="1">
        <polygon points="200,90 300,150 300,280 200,340 100,280 100,150" opacity="0.85" />
        <line x1="200" y1="90" x2="200" y2="340" opacity="0.3" />
        <line x1="100" y1="150" x2="300" y2="280" opacity="0.3" />
        <line x1="300" y1="150" x2="100" y2="280" opacity="0.3" />
      </g>
      <text x="200" y="368" textAnchor="middle" fontFamily={SANS} fontSize="8" letterSpacing="3" fill={C.blue} opacity="0.7">CAD WIREFRAME</text>
    </svg>
  );
}
function Scene3D() {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "80%" }}>
      <polygon points="200,70 300,130 300,290 200,350 100,290 100,130" fill="#E7E3D2" stroke={C.ink} strokeWidth="1.4" />
      <polygon points="200,70 300,130 200,190 100,130" fill="#D9D4BE" stroke={C.ink} strokeWidth="1" />
      <polygon points="300,130 300,290 200,350 200,190" fill="#C6C0A6" stroke={C.ink} strokeWidth="1" />
      <rect x="150" y="160" width="16" height="20" fill="#7c8fa8" opacity="0.6" />
      <rect x="180" y="160" width="16" height="20" fill="#7c8fa8" opacity="0.6" />
      <rect x="150" y="200" width="16" height="20" fill="#7c8fa8" opacity="0.6" />
    </svg>
  );
}
function SceneBuilding() {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "88%" }}>
      <rect x="90" y="110" width="220" height="240" fill="#EAE6D6" />
      <rect x="100" y="110" width="10" height="240" fill="#DAD4BF" />
      <rect x="290" y="110" width="10" height="240" fill="#DAD4BF" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <rect key={`${row}-${col}`} x={130 + col * 55} y={130 + row * 55} width="35" height="30" fill="#7c8fa8" opacity="0.55" />
        ))
      )}
      <rect x="170" y="310" width="60" height="40" fill="#5a6c82" opacity="0.6" />
      <rect x="70" y="348" width="260" height="10" fill="#DDD8C4" />
      <text x="200" y="378" textAnchor="middle" fontFamily={SANS} fontSize="8" letterSpacing="3" fill={C.inkFaint}>ENGINEERING CONSULTING BUREAU</text>
    </svg>
  );
}
function SceneLab() {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "84%" }}>
      <rect x="60" y="220" width="280" height="18" fill="#3a3a2c" />
      {[[90, "#6b5a3a"], [180, "#4a5a4a"], [260, "#5a4a3a"]].map(([x, col], i) => (
        <g key={i}>
          <rect x={x} y={150} width="50" height="70" fill={col} opacity="0.75" stroke={C.ivory} strokeOpacity="0.15" />
          <circle cx={x + 25} cy={150} r="5" fill={C.bronze} opacity="0.8" />
        </g>
      ))}
      <text x="200" y="266" textAnchor="middle" fontFamily={SANS} fontSize="8" letterSpacing="3" fill={C.ivory} opacity="0.4">INSIDE THE LABORATORY</text>
    </svg>
  );
}

const SCENE_STEPS = [SceneSketch, SceneBlueprint, SceneCAD, Scene3D, SceneBuilding, SceneLab];

/* Service-specific mini backdrop icons (simple, consistent line style) */
function ServiceScene({ type }) {
  const common = { fill: "none", stroke: C.ivory, strokeOpacity: 0.5, strokeWidth: 1.3 };
  const svgs = {
    consult: (
      <>
        <circle cx="200" cy="150" r="60" {...common} />
        <path d="M170 150h60M200 120v60" {...common} />
      </>
    ),
    design: (
      <>
        <rect x="140" y="100" width="120" height="100" {...common} />
        <line x1="140" y1="130" x2="260" y2="130" {...common} />
        <line x1="170" y1="100" x2="170" y2="200" {...common} />
      </>
    ),
    supervision: (
      <>
        <path d="M140 200 L200 110 L260 200 Z" {...common} />
        <circle cx="200" cy="150" r="10" {...common} />
      </>
    ),
    lab: (
      <>
        <rect x="170" y="90" width="20" height="60" {...common} />
        <path d="M160 150 L120 210 H260 L220 150 Z" {...common} />
      </>
    ),
    soil: (
      <>
        {[0, 1, 2, 3].map((i) => <line key={i} x1="120" y1={110 + i * 25} x2="280" y2={110 + i * 25} {...common} />)}
      </>
    ),
    concrete: (
      <>
        <rect x="160" y="120" width="80" height="80" {...common} />
        <line x1="200" y1="90" x2="200" y2="120" {...common} />
        <line x1="180" y1="90" x2="220" y2="90" {...common} />
      </>
    ),
    road: (
      <>
        <path d="M100 200 L180 100 H220 L300 200 Z" {...common} />
        <line x1="130" y1="180" x2="270" y2="180" strokeDasharray="6,6" {...common} />
      </>
    ),
    materials: (
      <>
        <rect x="150" y="120" width="40" height="70" {...common} />
        <rect x="210" y="120" width="40" height="70" {...common} />
      </>
    ),
    assessment: (
      <>
        <rect x="150" y="100" width="100" height="110" {...common} />
        <path d="M175 155 l15 15 35-35" {...common} />
      </>
    ),
    structural: (
      <>
        <line x1="140" y1="200" x2="260" y2="100" {...common} />
        <line x1="140" y1="100" x2="260" y2="200" {...common} />
        <rect x="140" y="100" width="120" height="100" {...common} />
      </>
    ),
    geo: (
      <>
        <path d="M120 200 Q200 120 280 200" {...common} />
        <circle cx="200" cy="165" r="6" fill={C.ivory} opacity="0.5" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 400 300" style={{ width: "70%" }}>
      {svgs[type] || svgs.consult}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   SHARED UI PARTS
═══════════════════════════════════════════════════════════ */
function TopBar({ title, onBack, tone = "light" }) {
  const dark = tone === "dark";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "18px 20px 14px", position: "sticky", top: 0, zIndex: 20,
      background: dark ? C.navyDeep : C.ivory,
      borderBottom: `1px solid ${dark ? "rgba(247,247,238,0.08)" : C.inkHair}`,
    }}>
      <button onClick={onBack} style={{
        width: 34, height: 34, borderRadius: "50%", border: `1px solid ${dark ? "rgba(247,247,238,0.25)" : C.inkHair}`,
        background: "transparent", color: dark ? C.ivory : C.ink, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0,
      }}>→</button>
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: 3, color: dark ? "rgba(247,247,238,0.55)" : C.inkSoft, textTransform: "uppercase" }}>{title}</span>
    </div>
  );
}

function Eyebrow({ children, dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 26, height: 1, background: C.bronze }} />
      <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 4, color: dark ? "rgba(247,247,238,0.45)" : C.inkFaint }}>{children}</span>
    </div>
  );
}

function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(18px)",
      transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}s, transform .8s cubic-bezier(.16,1,.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

/* ════════════════════════════════════════════════════════════
   SPLASH SCREEN
═══════════════════════════════════════════════════════════ */
function Splash({ t, onEnter }) {
  const [phase, setPhase] = useState(0); // 0 drawing, 1 text, 2 button
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2200);
    const t2 = setTimeout(() => setPhase(2), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, background: C.ivory, zIndex: 500,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 26, padding: 24,
    }}>
      <Logo size={110} draw />
      <div style={{
        fontFamily: SANS, fontSize: 10, letterSpacing: 4, color: C.inkFaint,
        opacity: phase >= 1 ? 1 : 0, transition: "opacity .8s ease",
      }}>{t.bureauEn}</div>
      <div style={{
        fontFamily: ARABIC, fontSize: 15, color: C.inkSoft, fontWeight: 500,
        opacity: phase >= 1 ? 1 : 0, transition: "opacity .8s ease .15s",
      }}>{t.bureauAr}</div>
      <button onClick={onEnter} style={{
        marginTop: 8, fontFamily: SANS, fontSize: 11, letterSpacing: 4, color: C.ink,
        background: "transparent", border: `1px solid ${C.inkHair}`, padding: "13px 40px", cursor: "pointer",
        opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(8px)",
        transition: "opacity .7s ease, transform .7s ease, background .3s, color .3s",
      }}
        onMouseDown={(e) => { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.ivory; }}
      >{t.enter}</button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   HOME — hero + tap-through cinematic journey
═══════════════════════════════════════════════════════════ */
function Home({ t, lang, onDiscover }) {
  const [step, setStep] = useState(-1); // -1 = hero, 0..5 journey
  const journeyBg = ["#F7F7EE", "#101a2e", "#0e1c33", "#F2EFE3", "#F2EFE3", "#0c0f14"];
  const isDark = step >= 1;

  const advance = () => setStep((s) => Math.min(s + 1, SCENE_STEPS.length - 1));
  const retreat = () => setStep((s) => Math.max(s - 1, -1));

  if (step === -1) {
    return (
      <div style={{
        minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "60px 28px 40px", textAlign: "center", position: "relative", overflow: "hidden", background: C.ivory,
      }}>
        {/* faint architectural backdrop */}
        <svg viewBox="0 0 400 700" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
          <defs>
            <pattern id="homegrid" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M26 0H0V26" fill="none" stroke={C.ink} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="700" fill="url(#homegrid)" />
          <line x1="0" y1="500" x2="400" y2="500" stroke={C.ink} strokeWidth="0.6" />
          <path d="M40 500 L200 260 L360 500" fill="none" stroke={C.ink} strokeWidth="0.8" />
        </svg>

        <div style={{ position: "relative", zIndex: 1 }}>
          <Logo size={78} />
          <div style={{ marginTop: 30, fontFamily: ARABIC, fontSize: 22, fontWeight: 600, color: C.ink, lineHeight: 1.5 }}>
            {t.bureauAr}
          </div>
          <div style={{ marginTop: 6, fontFamily: SANS, fontSize: 10.5, letterSpacing: 3, color: C.inkFaint }}>{t.bureauEn}</div>
          <div style={{ marginTop: 22, fontFamily: SERIF, fontSize: 18, fontStyle: "italic", color: C.inkSoft, maxWidth: 260 }}>
            {t.tagline}
          </div>
          <button onClick={advance} style={{
            marginTop: 40, fontFamily: SANS, fontSize: 11, letterSpacing: 3, color: C.ink,
            background: "transparent", border: `1px solid ${C.inkHair}`, padding: "14px 34px", cursor: "pointer",
          }}>{t.discover}</button>
          <div style={{ marginTop: 22, fontFamily: SANS, fontSize: 9, letterSpacing: 2, color: C.inkFaint, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span>{t.swipeHint}</span>
            <div style={{ width: 1, height: 30, background: `linear-gradient(${C.ink},transparent)` }} />
          </div>
        </div>
      </div>
    );
  }

  const Scene = SCENE_STEPS[step];
  return (
    <div onClick={advance} style={{
      minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", textAlign: "center", background: journeyBg[step], transition: "background 1s ease", cursor: "pointer", position: "relative",
    }}>
      <button onClick={(e) => { e.stopPropagation(); retreat(); }} style={{
        position: "absolute", top: 18, [lang === "ar" ? "right" : "left"]: 18,
        width: 32, height: 32, borderRadius: "50%", border: `1px solid ${isDark ? "rgba(247,247,238,0.25)" : C.inkHair}`,
        background: "transparent", color: isDark ? C.ivory : C.ink, fontSize: 13, cursor: "pointer",
      }}>{lang === "ar" ? "←" : "→"}</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 260 }}>
        <Scene />
      </div>
      <div style={{
        marginTop: 20, fontFamily: SANS, fontSize: 10, letterSpacing: 4,
        color: isDark ? "rgba(247,247,238,0.5)" : C.inkFaint,
      }}>{String(step + 1).padStart(2, "0")} / {SCENE_STEPS.length} — {t.stages[step]}</div>

      {step < SCENE_STEPS.length - 1 ? (
        <div style={{ marginTop: 30, fontFamily: SANS, fontSize: 9.5, letterSpacing: 2, color: isDark ? "rgba(247,247,238,0.35)" : C.inkFaint }}>
          {lang === "ar" ? "المس للمتابعة" : "Tap to continue"}
        </div>
      ) : (
        <button onClick={(e) => { e.stopPropagation(); onDiscover(); }} style={{
          marginTop: 30, fontFamily: SANS, fontSize: 11, letterSpacing: 3, color: C.ivory,
          background: "transparent", border: "1px solid rgba(247,247,238,0.3)", padding: "13px 32px", cursor: "pointer",
        }}>{t.nav.lab} ↗</button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ABOUT SCREEN
═══════════════════════════════════════════════════════════ */
function About({ t }) {
  return (
    <div style={{ padding: "8px 24px 60px" }}>
      <Reveal><Eyebrow>{t.aboutEyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.08}>
        <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 40, lineHeight: 1.08, color: C.ink, margin: 0 }}>
          {t.aboutH1}
        </h1>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontStyle: "italic", fontSize: 40, lineHeight: 1.08, color: C.bronze, margin: 0 }}>
          {t.aboutH2}
        </h1>
      </Reveal>
      <Reveal delay={0.18}>
        <p style={{ marginTop: 26, fontFamily: ARABIC, fontSize: 15, lineHeight: 1.95, color: C.inkSoft, fontWeight: 300 }}>
          {t.aboutBody}
        </p>
      </Reveal>

      <div style={{ marginTop: 44, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {t.aboutStats.map(([num, lbl], i) => (
          <Reveal key={lbl} delay={0.05 * i}>
            <div style={{ fontFamily: SANS, fontSize: 32, fontWeight: 300, color: C.ink }}>{num}</div>
            <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: C.inkFaint, marginTop: 4 }}>{lbl}</div>
            <div style={{ width: 22, height: 1, background: C.bronze, marginTop: 12 }} />
          </Reveal>
        ))}
      </div>

      <div style={{ marginTop: 52 }}>
        {t.aboutFields.map(([n, name, desc], i) => (
          <Reveal key={n} delay={0.05 * i}>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "20px 0", borderTop: `1px solid ${C.inkHair}` }}>
              <span style={{ fontFamily: SANS, fontSize: 11, color: C.bronze, minWidth: 22 }}>{n}</span>
              <div>
                <div style={{ fontFamily: ARABIC, fontSize: 15, fontWeight: 500, color: C.ink }}>{name}</div>
                <div style={{ fontFamily: ARABIC, fontSize: 12.5, color: C.inkFaint, marginTop: 4 }}>{desc}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SERVICES SCREEN
═══════════════════════════════════════════════════════════ */
function Services({ t }) {
  const [active, setActive] = useState(0);
  const svc = t.services[active];
  return (
    <div>
      <div style={{
        height: 210, background: C.navyDeep, display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", transition: "background .5s",
      }}>
        <ServiceScene type={svc.scene} />
        <div style={{ position: "absolute", bottom: 16, insetInline: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 2, color: "rgba(247,247,238,0.45)" }}>{svc.en}</span>
          <span style={{ fontFamily: SANS, fontSize: 22, color: "rgba(247,247,238,0.2)" }}>{svc.n}</span>
        </div>
      </div>
      <div style={{ padding: "26px 24px 60px" }}>
        <Eyebrow>{t.servicesEyebrow}</Eyebrow>
        <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 34, color: C.ink, margin: "0 0 6px" }}>{t.servicesTitle}</h1>
        <p style={{ fontFamily: ARABIC, fontSize: 12, color: C.inkFaint, marginBottom: 30 }}>{t.servicesHint}</p>

        {t.services.map((s, i) => (
          <div key={s.n} onClick={() => setActive(i)} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "16px 4px",
            borderTop: `1px solid ${C.inkHair}`, cursor: "pointer",
            background: active === i ? "rgba(168,135,79,0.06)" : "transparent",
            transition: "background .3s",
          }}>
            <span style={{ fontFamily: SANS, fontSize: 11, color: active === i ? C.bronze : C.inkFaint, minWidth: 20 }}>{s.n}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: ARABIC, fontSize: 14.5, fontWeight: active === i ? 600 : 400, color: C.ink }}>{s.ar}</div>
              {active === i && (
                <div style={{ fontFamily: ARABIC, fontSize: 12, color: C.inkFaint, marginTop: 6, lineHeight: 1.7 }}>{s.d}</div>
              )}
            </div>
            <span style={{ fontSize: 15, color: active === i ? C.bronze : C.inkFaint, transform: active === i ? "rotate(45deg)" : "none", transition: "transform .3s" }}>↗</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   LAB SCREEN + EQUIPMENT DETAIL MODAL
═══════════════════════════════════════════════════════════ */
function Lab({ t, onOpen }) {
  return (
    <div style={{ background: C.navyDeep, minHeight: "100%", color: C.ivory, paddingBottom: 60 }}>
      <div style={{ padding: "30px 24px 8px" }}>
        <Eyebrow dark>{t.labEyebrow}</Eyebrow>
        <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 38, margin: 0, lineHeight: 1.1 }}>{t.labH1}</h1>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontStyle: "italic", fontSize: 38, margin: 0, color: C.bronze, lineHeight: 1.1 }}>{t.labH2}</h1>
        <p style={{ fontFamily: ARABIC, fontSize: 13, color: "rgba(247,247,238,0.45)", marginTop: 16, lineHeight: 1.8, maxWidth: 280 }}>{t.labSub}</p>
      </div>
      <div style={{ padding: "26px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        {t.equipment.map((e, i) => (
          <div key={e.name} onClick={() => onOpen(e)} style={{
            background: "rgba(247,247,238,0.03)", border: "1px solid rgba(247,247,238,0.06)",
            padding: "24px 16px", cursor: "pointer",
          }}>
            <div style={{ fontFamily: ARABIC, fontSize: 13, fontWeight: 500, color: C.ivory, lineHeight: 1.5, minHeight: 40 }}>{e.name}</div>
            <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 1, color: C.bronze, marginTop: 12 }}>{e.spec.split("·")[0].trim()}</div>
            <div style={{ marginTop: 14, fontFamily: SANS, fontSize: 9.5, letterSpacing: 2, color: "rgba(247,247,238,0.3)" }}>DETAILS →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EquipmentModal({ item, t, onClose }) {
  if (!item) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,6,0.7)", zIndex: 300,
      display: "flex", alignItems: "flex-end",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", background: C.navyDeep, color: C.ivory, borderRadius: "22px 22px 0 0",
        padding: "10px 24px 40px", maxHeight: "82%", overflowY: "auto",
        animation: "slideUp .4s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ width: 36, height: 3, background: "rgba(247,247,238,0.2)", borderRadius: 2, margin: "10px auto 24px" }} />
        <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, background: "rgba(247,247,238,0.03)" }}>
          <span style={{ fontSize: 40, opacity: 0.5 }}>⚙</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 3, color: C.bronze, marginBottom: 10 }}>{item.en}</div>
        <h2 style={{ fontFamily: ARABIC, fontSize: 20, fontWeight: 600, margin: "0 0 18px" }}>{item.name}</h2>
        {[["الوظيفة", item.fn], ["الفحوصات المرتبطة", item.tests], ["المواصفات", item.spec]].map(([lbl, val]) => (
          <div key={lbl} style={{ padding: "14px 0", borderTop: "1px solid rgba(247,247,238,0.08)" }}>
            <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 2, color: "rgba(247,247,238,0.4)", marginBottom: 6 }}>{lbl.toUpperCase()}</div>
            <div style={{ fontFamily: ARABIC, fontSize: 13.5, color: "rgba(247,247,238,0.85)", lineHeight: 1.7 }}>{val}</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TESTS SCREEN
═══════════════════════════════════════════════════════════ */
function Tests({ t }) {
  const [cat, setCat] = useState(t.testCats[0]);
  return (
    <div style={{ padding: "10px 24px 60px" }}>
      <Eyebrow>{t.testsEyebrow}</Eyebrow>
      <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 32, color: C.ink, margin: "0 0 22px" }}>{t.testsTitle}</h1>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 22 }}>
        {t.testCats.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            flexShrink: 0, fontFamily: SANS, fontSize: 11, letterSpacing: 1, padding: "9px 18px",
            border: `1px solid ${cat === c ? C.ink : C.inkHair}`, background: cat === c ? C.ink : "transparent",
            color: cat === c ? C.ivory : C.inkSoft, cursor: "pointer",
          }}>{c}</button>
        ))}
      </div>
      {(t.tests[cat] || []).map((tst, i) => (
        <Reveal key={tst.name} delay={0.04 * i}>
          <div style={{ padding: "18px 0", borderTop: `1px solid ${C.inkHair}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: ARABIC, fontSize: 15, fontWeight: 500, color: C.ink }}>{tst.name}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.bronze }}>{tst.price}</span>
            </div>
            <div style={{ fontFamily: ARABIC, fontSize: 12, color: C.inkFaint, marginTop: 6 }}>{tst.sample} · {tst.unit}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PROJECTS SCREEN — horizontal cinematic gallery + detail
═══════════════════════════════════════════════════════════ */
function Projects({ t, onOpen }) {
  const trackRef = useRef(null);
  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ padding: "10px 24px 20px" }}>
        <Eyebrow>{t.projectsEyebrow}</Eyebrow>
        <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 34, color: C.ink, margin: "0 0 6px" }}>{t.projectsTitle}</h1>
        <p style={{ fontFamily: ARABIC, fontSize: 12, color: C.inkFaint }}>{t.projectsHint}</p>
      </div>
      <div ref={trackRef} style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 24px 8px", scrollSnapType: "x mandatory" }}>
        {t.projects.map((p) => (
          <div key={p.n} onClick={() => onOpen(p)} style={{
            flexShrink: 0, width: 270, height: 360, scrollSnapAlign: "start", cursor: "pointer",
            background: C.navy, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.15 }}>
              <svg viewBox="0 0 200 200" style={{ width: "80%" }}>
                <rect x="40" y="40" width="120" height="120" fill="none" stroke={C.ivory} strokeWidth="1.4" />
                <line x1="40" y1="80" x2="160" y2="80" stroke={C.ivory} strokeWidth="0.8" />
                <line x1="40" y1="120" x2="160" y2="120" stroke={C.ivory} strokeWidth="0.8" />
              </svg>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,4,0.88), transparent 55%)" }} />
            <div style={{ position: "absolute", bottom: 20, insetInline: 20, color: C.ivory }}>
              <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 3, color: "rgba(247,247,238,0.5)", marginBottom: 10 }}>PROJECT {p.n}</div>
              <div style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 400 }}>{p.name}</div>
              <div style={{ fontFamily: SANS, fontSize: 10.5, color: "rgba(247,247,238,0.45)", marginTop: 6 }}>{p.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectModal({ item, t, onClose }) {
  if (!item) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,10,6,0.7)", zIndex: 300,
      display: "flex", alignItems: "flex-end",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", background: C.ivory, borderRadius: "22px 22px 0 0",
        padding: "10px 24px 44px", maxHeight: "85%", overflowY: "auto",
        animation: "slideUp .4s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ width: 36, height: 3, background: C.inkHair, borderRadius: 2, margin: "10px auto 22px" }} />
        <div style={{ height: 150, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
          <span style={{ fontFamily: SANS, fontSize: 30, color: "rgba(247,247,238,0.25)" }}>{item.n}</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 3, color: C.bronze, marginBottom: 8 }}>PROJECT {item.n}</div>
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 26, margin: "0 0 20px", color: C.ink }}>{item.name}</h2>
        {[["النوع", item.type], ["الموقع", item.loc], ["السنة", item.year], ["نطاق العمل", item.scope]].map(([lbl, val]) => (
          <div key={lbl} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: `1px solid ${C.inkHair}` }}>
            <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: C.inkFaint }}>{lbl}</span>
            <span style={{ fontFamily: ARABIC, fontSize: 13, color: C.ink, textAlign: "left" }}>{val}</span>
          </div>
        ))}
        <p style={{ marginTop: 20, fontFamily: ARABIC, fontSize: 13.5, lineHeight: 1.9, color: C.inkSoft }}>{item.desc}</p>
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TEAM
═══════════════════════════════════════════════════════════ */
function Team({ t }) {
  const palette = [C.navy, "#3a3226", "#26332e", "#332628", "#26303a", "#332a26"];
  return (
    <div style={{ padding: "10px 0 60px" }}>
      <div style={{ padding: "0 24px" }}>
        <Eyebrow>{t.teamEyebrow}</Eyebrow>
        <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 30, color: C.ink, margin: "0 0 28px" }}>{t.teamTitle}</h1>
      </div>
      {t.team.map((m, i) => (
        <Reveal key={m.name} delay={0.05 * i} style={{ marginBottom: 28, padding: "0 24px" }}>
          <div style={{
            height: 300, background: palette[i % palette.length],
            display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
          }}>
            <span style={{ fontSize: 52, opacity: 0.25 }}>◈</span>
            <div style={{ position: "absolute", bottom: 18, left: 20, right: 20, color: C.ivory }}>
              <div style={{ fontFamily: ARABIC, fontSize: 17, fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontFamily: ARABIC, fontSize: 12.5, opacity: 0.65, marginTop: 3 }}>{m.pos}</div>
              <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 2, opacity: 0.45, marginTop: 5 }}>{m.spec.toUpperCase()}</div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   UNIVERSITY
═══════════════════════════════════════════════════════════ */
function University({ t }) {
  return (
    <div style={{ minHeight: "100%", background: C.navy, color: C.ivory, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
        <Logo size={54} tone="ivory" />
        <div style={{ width: 1, height: 44, background: "rgba(247,247,238,0.2)" }} />
        <UniSeal size={54} />
      </div>
      <Eyebrow dark>{t.uniEyebrow}</Eyebrow>
      <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 27, lineHeight: 1.4, margin: 0 }}>
        {t.uniH1}<br /><span style={{ opacity: 0.5, fontStyle: "italic" }}>{t.uniH2}</span>
      </h1>
      <p style={{ marginTop: 22, fontFamily: ARABIC, fontSize: 13.5, lineHeight: 1.9, color: "rgba(247,247,238,0.55)", maxWidth: 300 }}>
        {t.uniBody}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PHILOSOPHY — tap-through word reveal
═══════════════════════════════════════════════════════════ */
function Philosophy({ t }) {
  const [idx, setIdx] = useState(0);
  const total = t.philWords.length;
  const isFinal = idx >= total;
  return (
    <div onClick={() => setIdx((i) => Math.min(i + 1, total))} style={{
      minHeight: "100%", background: C.ink, color: C.ivory, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer", padding: 28,
    }}>
      {!isFinal ? (
        <div key={idx} style={{ animation: "philIn .7s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 4, color: "rgba(247,247,238,0.3)", marginBottom: 20 }}>
            {String(idx + 1).padStart(2, "0")} / {total}
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 58, color: C.ivory }}>{t.philWords[idx]}.</div>
        </div>
      ) : (
        <div style={{ animation: "philIn .9s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 400, fontStyle: "italic", fontSize: 30, color: C.bronze, lineHeight: 1.5 }}>{t.philFinal}</div>
        </div>
      )}
      {!isFinal && (
        <div style={{ marginTop: 34, fontFamily: SANS, fontSize: 9.5, letterSpacing: 2, color: "rgba(247,247,238,0.3)" }}>{t.philHint}</div>
      )}
      <style>{`@keyframes philIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   NEWS
═══════════════════════════════════════════════════════════ */
function News({ t, onOpen }) {
  return (
    <div style={{ padding: "10px 24px 60px" }}>
      <Eyebrow>{t.newsEyebrow}</Eyebrow>
      <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 32, color: C.ink, margin: "0 0 26px" }}>{t.newsTitle}</h1>
      {t.news.map((n, i) => (
        <Reveal key={n.title} delay={0.06 * i}>
          <div onClick={() => onOpen(n)} style={{ padding: "20px 0", borderTop: `1px solid ${C.inkHair}`, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 9.5, letterSpacing: 1.5, color: C.bronze, marginBottom: 10 }}>
              <span>{n.cat.toUpperCase()}</span><span>{n.date}</span>
            </div>
            <div style={{ fontFamily: ARABIC, fontSize: 16, fontWeight: 500, color: C.ink, lineHeight: 1.5 }}>{n.title}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function NewsModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,10,6,0.7)", zIndex: 300, display: "flex", alignItems: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", background: C.ivory, borderRadius: "22px 22px 0 0", padding: "10px 24px 44px",
        maxHeight: "82%", overflowY: "auto", animation: "slideUp .4s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ width: 36, height: 3, background: C.inkHair, borderRadius: 2, margin: "10px auto 22px" }} />
        <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 2, color: C.bronze, marginBottom: 8 }}>{item.cat.toUpperCase()} · {item.date}</div>
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 23, margin: "0 0 18px", color: C.ink, lineHeight: 1.4 }}>{item.title}</h2>
        <div style={{ height: 130, background: C.navy, marginBottom: 18 }} />
        <p style={{ fontFamily: ARABIC, fontSize: 14, lineHeight: 1.95, color: C.inkSoft }}>{item.body}</p>
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CONTACT — final cinematic scene
═══════════════════════════════════════════════════════════ */
function Contact({ t }) {
  return (
    <div style={{ minHeight: "100%", background: "#0a0d12", color: C.ivory, position: "relative", overflow: "hidden" }}>
      <svg viewBox="0 0 400 500" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}>
        <defs>
          <pattern id="ctagrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke={C.ivory} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="500" fill="url(#ctagrid)" />
        <polygon points="200,150 280,210 280,340 200,400 120,340 120,210" fill="none" stroke={C.bronze} strokeWidth="1" opacity="0.5" />
      </svg>
      <div style={{ position: "relative", zIndex: 1, padding: "56px 26px 60px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Logo size={56} tone="ivory" />
        <div style={{ marginTop: 30 }}>
          <Eyebrow dark>{t.contactEyebrow}</Eyebrow>
        </div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 42, lineHeight: 1.1, margin: 0 }}>{t.contactTitle1}</h1>
        <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontStyle: "italic", fontSize: 42, lineHeight: 1.1, margin: 0, color: C.bronze }}>{t.contactTitle2}</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 40, width: "100%", maxWidth: 300 }}>
          <button style={{ fontFamily: SANS, fontSize: 12, letterSpacing: 2, color: C.ink, background: C.ivory, border: "none", padding: "16px", cursor: "pointer" }}>{t.startProject}</button>
          <button style={{ fontFamily: SANS, fontSize: 12, letterSpacing: 2, color: C.ivory, background: "transparent", border: "1px solid rgba(247,247,238,0.25)", padding: "16px", cursor: "pointer" }}>{t.contactUs}</button>
        </div>

        <div style={{ marginTop: 48, width: "100%", maxWidth: 300 }}>
          {t.contactDetails.map(([lbl, val]) => (
            <div key={lbl} style={{ display: "flex", justifyContent: "space-between", padding: "13px 0", borderTop: "1px solid rgba(247,247,238,0.08)" }}>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 1, color: "rgba(247,247,238,0.35)" }}>{lbl.toUpperCase()}</span>
              <span style={{ fontFamily: SANS, fontSize: 12, color: "rgba(247,247,238,0.75)" }}>{val}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
          {["◐", "▢", "✎"].map((s, i) => (
            <div key={i} style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(247,247,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "rgba(247,247,238,0.6)" }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════════════════ */
function Settings({ t, lang, setLang, onReplayIntro }) {
  return (
    <div style={{ padding: "10px 24px 60px" }}>
      <Eyebrow>{t.settingsTitle}</Eyebrow>
      <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 30, color: C.ink, margin: "0 0 30px" }}>{t.settingsTitle}</h1>

      <div style={{ padding: "18px 0", borderTop: `1px solid ${C.inkHair}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: ARABIC, fontSize: 14, color: C.ink }}>{t.language}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {["ar", "en"].map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              fontFamily: SANS, fontSize: 11, letterSpacing: 1, padding: "8px 16px",
              border: `1px solid ${lang === l ? C.ink : C.inkHair}`, background: lang === l ? C.ink : "transparent",
              color: lang === l ? C.ivory : C.inkSoft, cursor: "pointer",
            }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div onClick={onReplayIntro} style={{ padding: "18px 0", borderTop: `1px solid ${C.inkHair}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: ARABIC, fontSize: 14, color: C.ink }}>{t.resetIntro}</span>
        <span style={{ color: C.inkFaint }}>↻</span>
      </div>

      <div style={{ marginTop: 60, textAlign: "center", fontFamily: SANS, fontSize: 10, color: C.inkFaint, letterSpacing: 1 }}>{t.version}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   BOTTOM NAV + SIDE MENU
═══════════════════════════════════════════════════════════ */
function BottomNav({ t, screen, go, onMenu, dark }) {
  const items = [
    ["home", "⌂"], ["about", "▤"], ["services", "◈"], ["projects", "▦"], ["lab", "⚗"],
  ];
  return (
    <div style={{
      position: "sticky", bottom: 0, background: dark ? C.navyDeep : C.paper,
      borderTop: `1px solid ${dark ? "rgba(247,247,238,0.08)" : C.inkHair}`,
      display: "flex", padding: "10px 6px 8px", zIndex: 50,
    }}>
      {items.map(([key, icon]) => (
        <button key={key} onClick={() => go(key)} style={{
          flex: 1, background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "4px 0",
        }}>
          <span style={{ fontSize: 17, color: screen === key ? C.bronze : (dark ? "rgba(247,247,238,0.4)" : C.inkFaint) }}>{icon}</span>
          <span style={{ fontFamily: SANS, fontSize: 8.5, letterSpacing: 0.4, color: screen === key ? (dark ? C.ivory : C.ink) : (dark ? "rgba(247,247,238,0.35)" : C.inkFaint) }}>{t.nav[key]}</span>
        </button>
      ))}
      <button onClick={onMenu} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "4px 0",
      }}>
        <span style={{ fontSize: 17, color: dark ? "rgba(247,247,238,0.4)" : C.inkFaint }}>≡</span>
        <span style={{ fontFamily: SANS, fontSize: 8.5, color: dark ? "rgba(247,247,238,0.35)" : C.inkFaint }}>{t.menuTitle}</span>
      </button>
    </div>
  );
}

function SideMenu({ t, open, onClose, go }) {
  const items = ["team", "university", "tests", "philosophy", "news", "contact", "settings"];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400, pointerEvents: open ? "auto" : "none",
    }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(10,10,6,0.5)",
        opacity: open ? 1 : 0, transition: "opacity .4s",
      }} />
      <div style={{
        position: "absolute", top: 0, bottom: 0, insetInlineEnd: 0, width: "78%", maxWidth: 320,
        background: C.ink, color: C.ivory, padding: "50px 30px",
        transform: open ? "translateX(0)" : "translateX(105%)", transition: "transform .5s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ marginBottom: 40 }}><Logo size={42} tone="ivory" /></div>
        {items.map((key) => (
          <div key={key} onClick={() => { go(key); onClose(); }} style={{
            padding: "16px 0", borderTop: "1px solid rgba(247,247,238,0.1)", cursor: "pointer",
            fontFamily: ARABIC, fontSize: 16, color: "rgba(247,247,238,0.85)",
          }}>{t.more[key]}</div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [entered, setEntered] = useState(false);
  const [lang, setLang] = useState("ar");
  const [screen, setScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [equipModal, setEquipModal] = useState(null);
  const [projModal, setProjModal] = useState(null);
  const [newsModal, setNewsModal] = useState(null);
  const t = T[lang];

  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollTo(0, 0); }, [screen]);

  const darkScreens = ["lab", "university", "philosophy", "contact"];
  const isDark = darkScreens.includes(screen);

  const go = (s) => setScreen(s);

  return (
    <div style={{
      fontFamily: ARABIC, direction: t.dir, maxWidth: 430, margin: "0 auto",
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: isDark ? (screen === "philosophy" ? C.ink : screen === "contact" ? "#0a0d12" : C.navyDeep) : C.ivory,
      position: "relative", overflow: "hidden",
    }}>
      <FONTS />

      {!entered && <Splash t={t} onEnter={() => setEntered(true)} />}

      {entered && (
        <>
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto" }}>
            {screen === "home" && <Home t={t} lang={lang} onDiscover={() => go("lab")} />}
            {screen === "about" && <About t={t} />}
            {screen === "services" && <Services t={t} />}
            {screen === "lab" && <Lab t={t} onOpen={setEquipModal} />}
            {screen === "tests" && <Tests t={t} />}
            {screen === "projects" && <Projects t={t} onOpen={setProjModal} />}
            {screen === "team" && <Team t={t} />}
            {screen === "university" && <University t={t} />}
            {screen === "philosophy" && <Philosophy t={t} />}
            {screen === "news" && <News t={t} onOpen={setNewsModal} />}
            {screen === "contact" && <Contact t={t} />}
            {screen === "settings" && <Settings t={t} lang={lang} setLang={setLang} onReplayIntro={() => setEntered(false)} />}
          </div>

          <BottomNav t={t} screen={screen} go={go} onMenu={() => setMenuOpen(true)} dark={isDark} />
          <SideMenu t={t} open={menuOpen} onClose={() => setMenuOpen(false)} go={go} />

          <EquipmentModal item={equipModal} t={t} onClose={() => setEquipModal(null)} />
          <ProjectModal item={projModal} t={t} onClose={() => setProjModal(null)} />
          <NewsModal item={newsModal} onClose={() => setNewsModal(null)} />
        </>
      )}
    </div>
  );
}
