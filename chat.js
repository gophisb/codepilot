const { generate, providerNames, providerConfig } = require('./providers');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { prompt, mode, project, platform, stack, provider: reqProvider, model: reqModel } = req.body;
    const promptStr = String(prompt || '').trim();
    if (!promptStr) return res.status(400).json({ error: 'أدخل وصف المشروع.' });

    const modes = {
      build: 'حوّل الفكرة إلى مشروع قابل للتنفيذ. ابدأ بمتطلبات وبنية ملفات، ثم ولّد الملفات الأساسية كاملة.',
      debug: 'شخّص المشكلة أولًا، ثم اقترح أقل إصلاح آمن.',
      plan: 'أنشئ مواصفات عملية: الهدف، المستخدمون، الوظائف، الشاشات، البيانات، المعمارية.',
      explain: 'اشرح المشروع أو الكود بالعربية بوضوح، مع التدفق والمخاطر والتحسينات.'
    };

    const instructions = `أنت CodePilot، وكيل متخصص في صناعة تطبيقات Android والويب وPWA.
وضع العمل: ${modes[mode] || modes.build}
المشروع: ${project || 'مشروعي'} | المنصة: ${platform || 'Web / PWA'} | التقنية: ${stack || 'HTML/CSS/JS'}`;

    const requested = String(reqProvider || process.env.AI_PROVIDER || 'openai').toLowerCase();
    const provider = providerConfig(requested) ? requested : 'openai';
    const model = String(reqModel || process.env.AI_MODEL || providerConfig(provider).defaultModel);
    const result = await generate({ provider, model, instructions, input: promptStr });

    if (!result.ok) return res.status(result.status || 502).json({ error: result.error, providers: providerNames() });
    return res.status(200).json({ text: result.text, provider: result.provider, model: result.model, providers: providerNames() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Server error' });
  }
};