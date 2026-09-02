// api/chat.js
const { generate, providerNames, providerConfig } = require('./providers');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const body =
      req.body && typeof req.body === 'object'
        ? req.body
        : JSON.parse(req.body || '{}');

    const prompt = String(body.prompt || '').trim();

    if (!prompt) {
      return res.status(400).json({
        error: 'أدخل وصف المشروع.'
      });
    }

    const modes = {
      build:
        'حوّل الفكرة إلى مشروع قابل للتنفيذ. ابدأ بمتطلبات وبنية ملفات، ثم ولّد الملفات الأساسية كاملة. لكل ملف استخدم كتلة مستقلة: ```language filename=path/to/file.ext ثم الكود ثم ```. لا تستخدم ملفات وهمية أو أجزاء ناقصة.',

      debug:
        'شخّص المشكلة أولًا، ثم اقترح أقل إصلاح آمن. لا تعِد الهيكلة ولا تحذف ميزات سليمة دون ضرورة.',

      plan:
        'أنشئ مواصفات عملية: الهدف، المستخدمون، الوظائف، الشاشات، البيانات، المعمارية، الملفات، مراحل التنفيذ والاختبارات.',

      explain:
        'اشرح المشروع أو الكود بالعربية بوضوح، مع التدفق والمخاطر والتحسينات.'
    };

    const instructions = `
أنت CodePilot، وكيل متخصص في صناعة تطبيقات Android والويب وPWA.

قواعد الدستور:
- لا تدّع اختبارًا لم يتم تشغيله.
- لا تكشف الأسرار أو مفاتيح API.
- لا تكسر ميزة سليمة.
- استخدم أقل تغيير آمن.
- اهتم بالأمان وRTL والاستجابة والأداء.
- الكود المولد غير موثوق حتى يمر بالتحقق والاختبار والبناء.

وضع العمل:
${modes[body.mode] || modes.build}

المشروع:
${body.project || 'مشروعي'}

المنصة:
${body.platform || 'Web / PWA'}

التقنية:
${body.stack || 'HTML/CSS/JS'}
`;

    const requested = String(
      body.provider || process.env.AI_PROVIDER || 'openai'
    ).toLowerCase();

    const provider = providerConfig(requested)
      ? requested
      : 'openai';

    const config = providerConfig(provider);

    const model = String(
      body.model ||
      process.env.AI_MODEL ||
      config.defaultModel
    );

    const result = await generate({
      provider,
      model,
      instructions,
      input: prompt
    });

    if (!result.ok) {
      return res.status(result.status || 502).json({
        error: result.error,
        providers: providerNames()
      });
    }

    return res.status(200).json({
      text: result.text,
      provider: result.provider,
      model: result.model,
      providers: providerNames()
    });

  } catch (error) {
    return res.status(500).json({
      error: error && error.message
        ? error.message
        : 'Server error'
    });
  }
};