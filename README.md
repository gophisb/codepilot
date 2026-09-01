# CodePilot — App Builder

نسخة خفيفة مهيأة لـ GitHub + Vercel، وتحتوي على طبقة مزودي AI وCI/CD.

## ما تم بناؤه
- `index.html`: واجهة App Builder خفيفة.
- `api/chat.js`: نقطة API آمنة.
- `api/providers.js`: Provider Adapter Hub مع OpenAI وOpenRouter وDeepSeek، مع fallback اختياري.
- `.github/workflows/ci.yml`: تحقق تلقائي من JavaScript وHTML والملفات الأساسية.
- `CODEPILOT_ENGINEERING_CONSTITUTION.md`: الدستور الهندسي للمشروع.

## Environment Variables في Vercel
- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY` (اختياري)
- `DEEPSEEK_API_KEY` (اختياري)
- `AI_PROVIDER` (اختياري، الافتراضي openai)
- `AI_MODEL` (اختياري)
- `AI_FALLBACK_PROVIDERS` (اختياري، مثال: `openrouter,deepseek`)

لا تضع أي مفتاح API في `index.html` أو GitHub.

## النشر
1. ارفع محتويات هذا المجلد إلى مستودع GitHub جديد.
2. اربط المستودع بـ Vercel.
3. أضف Environment Variables.
4. Deploy.
5. كل Push/PR يشغّل CI للتحقق الأساسي.

## ملاحظة
CI الحالي يتحقق من سلامة البنية والـsyntax. اختبارات التطبيق الفعلية وبناء Android وGitHub auto-commit/PR تأتي في مراحل لاحقة.
