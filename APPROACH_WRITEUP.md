# Voice Command Shopping Assistant — Technical Approach

To build a responsive, voice-first shopping assistant, I designed a zero-latency hybrid architecture combining the Web Speech API (SpeechRecognition & SpeechSynthesis), Web Audio API for synthesized acoustic feedback, and a modular client-side NLP Engine with zero external dependencies.

The NLP pipeline uses tokenization, multi-lingual keyword mappings (English, Spanish, French, German, Hindi), and entity extraction to parse actions (`ADD`, `REMOVE`, `MODIFY_QTY`, `SEARCH`, `SUBSTITUTE`), numeric/word quantities, volume units, and price caps (`under $5`). Items are automatically classified across 9 categories using catalog indexing and semantic heuristics.

The Smart Suggestions engine runs proactive predictive algorithms analyzing purchase intervals to highlight overdue staples ("running low on bread"), matches seasonal peak produce discounts, and dynamically recommends plant-based/dietary substitutes (e.g., oat/almond milk for dairy). 

For UX, the app offers dual view modes: a modern categorized dashboard and a high-contrast hands-free Kitchen Mode with audio waveforms, real-time interim transcript badges, sound cues, and responsive state persistence via LocalStorage. Strict TypeScript typing, automated Vitest coverage, and clean Tailwind styling ensure production readiness and seamless multi-device accessibility.
