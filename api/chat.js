// v3
const { generate, providerNames, providerConfig } = require('./providers');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const prompt = String(body.prompt || '').trim();
    if (!prompt) return res.status(400).json({ error: 'أدخل وصف المشروع.' });

    const modes = {
      build: 'حوّل الفكرة إلى مشروع قابل للتنفيذ. ابدأ بمتطلبات وبنية ملفات، ثم ولّد الملفات الأساسية كاملة.',
      debug: 'شخّص المشكلة أولًا، ثم اقترح أقل إصلاح آمن.',
      plan: 'أنشئ مواصفات عملية: الهدف، المستخدمون، الوظائف، الشاشات، البيانات، المعمارية.',
      explain: 'اشرح المشروع أو الكود بالعربية بوضوح، مع التدفق والمخاطر والتحسينات.'
    };

    const instructions = `أنت CodePilot، وكيل متخصص في صناعة تطبيقات Android والويب وPWA.
وضع العمل: ${modes[body.mode] || modes.build}
المشروع: ${body.project || 'مشروعي'} | المنصة: ${body.platform || 'Web / PWA'} | التقنية: ${body.stack || 'HTML/CSS/JS'}`;

    const requested = String(body.provider || 'deepseek').toLowerCase();
    const provider = providerConfig(requested) ? requested : 'deepseek';
    const config = providerConfig(provider);
    const model = String(body.model || config.defaultModel);

    const result = await generate({ provider, model, instructions, input: prompt });

    if (!result.ok) return res.status(result.status || 502).json({ error: result.error, providers: providerNames() });
    return res.status(200).json({ text: result.text, provider: result.provider, model: result.model, providers: providerNames() });

  } catch (error) {
    return res.status(500).json({ error: error && error.message ? error.message : 'Server error' });
  }
};