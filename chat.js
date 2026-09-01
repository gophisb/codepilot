import { generate, providerNames, providerConfig } from './providers.js';

export default async function handler(req) {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  try {
    const body = await req.json();
    const prompt = String(body.prompt || '').trim();
    if (!prompt) return Response.json({ error: 'أدخل وصف المشروع.' }, { status: 400 });

    const modes = {
      build: 'حوّل الفكرة إلى مشروع قابل للتنفيذ. ابدأ بمتطلبات وبنية ملفات، ثم ولّد الملفات الأساسية كاملة. لكل ملف استخدم كتلة مستقلة: ```language filename=path/to/file.ext ثم الكود ثم ```. لا تستخدم ملفات وهمية أو أجزاء ناقصة.',
      debug: 'شخّص المشكلة أولًا، ثم اقترح أقل إصلاح آمن. لا تعِد الهيكلة ولا تحذف ميزات سليمة دون ضرورة.',
      plan: 'أنشئ مواصفات عملية: الهدف، المستخدمون، الوظائف، الشاشات، البيانات، المعمارية، الملفات، مراحل التنفيذ والاختبارات.',
      explain: 'اشرح المشروع أو الكود بالعربية بوضوح، مع التدفق والمخاطر والتحسينات.'
    };
    const instructions = `أنت CodePilot، وكيل متخصص في صناعة تطبيقات Android والويب وPWA.
قواعد الدستور: لا تدّع اختبارًا لم يتم تشغيله؛ لا تكشف أسرارًا؛ لا تكسر ميزة سليمة؛ أقل تغيير آمن؛ اهتم بالأمان وRTL والاستجابة والأداء؛ الكود المولد غير موثوق حتى يمر بالتحقق والاختبار.
وضع العمل: ${modes[body.mode] || modes.build}
المشروع: ${body.project || 'مشروعي'} | المنصة: ${body.platform || 'Web / PWA'} | التقنية: ${body.stack || 'HTML/CSS/JS'}`;

    const requested = String(body.provider || process.env.AI_PROVIDER || 'openai').toLowerCase();
    const provider = providerConfig(requested) ? requested : 'openai';
    const model = String(body.model || process.env.AI_MODEL || providerConfig(provider).defaultModel);
    const result = await generate({ provider, model, instructions, input: prompt });
    if (!result.ok) return Response.json({ error: result.error, providers: providerNames() }, { status: result.status || 502 });
    return Response.json({ text: result.text, provider: result.provider, model: result.model, providers: providerNames() });
  } catch (error) {
    return Response.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
