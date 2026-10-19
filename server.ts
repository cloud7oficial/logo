import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface LogoGenerationRequest {
  companyName: string;
  tagline?: string;
  description: string;
  industry?: string;
  style?: string;
  colorPreference?: string;
  symbolPreference?: string;
  count?: number;
}

// Endpoint to generate professional SVG vector logos
app.post('/api/generate-logo', async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      tagline = '',
      description,
      industry = 'Geral',
      style = 'minimalist',
      colorPreference = 'Automático / Cores Modernas',
      symbolPreference = '',
      count = 3,
    } = req.body as LogoGenerationRequest;

    if (!companyName || !companyName.trim()) {
      return res.status(400).json({ error: 'O nome da empresa é obrigatório.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'A descrição da empresa é obrigatória.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor. Verifique o painel Secrets.',
      });
    }

    const systemPrompt = `Você é um diretor de arte e designer sênior de marcas de renome internacional, especializado em identidade visual, tipografia moderna e criação de logotipos vetoriais SVG de altíssimo padrão estético.
Sua missão é gerar conceitos de logotipos profissionais em formato SVG puro, vetorial, escalável e pronto para animação e exportação em alta resolução (4K/redes sociais).

DIRETRIZES TÉCNICAS E ESTÉTICAS:
1. O SVG deve ser 100% autônomo, limpo e válido para renderização direta em HTML.
2. Dimensões padrão do viewBox: "0 0 500 500".
3. NÃO use tags <img> nem fontes externas remotas nos nós SVG. Use apenas elementos SVG nativos: <path>, <circle>, <rect>, <polygon>, <polyline>, <text>, <g>, <defs>, <linearGradient>, <stop>, <filter>.
4. O SVG DEVE incluir:
   - <defs> contendo gradientes luxuosos e modernos com ids únicos baseados no id do conceito (ex: id="grad-concept-1-primary").
   - <g id="symbol"> contendo a marca gráfica / ícone desenhado com paths geométricos elegantes, curvas Bezier precisas, ou formas estilizadas relacionadas à essência da empresa.
   - <g id="typography"> contendo o nome da marca em elemento <text x="250" y="..." text-anchor="middle" font-family="'Plus Jakarta Sans', 'Outfit', 'Montserrat', 'Cinzel', 'Space Grotesk', sans-serif" font-weight="700" font-size="...">.
   - <g id="tagline"> (se houver slogan) com <text x="250" y="..." text-anchor="middle" font-size="..." letter-spacing="3" opacity="0.8">.
5. Em "symbolSvgOnly", retorne o símbolo/ícone isolado sem o texto principal dentro de um <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">...</svg>, perfeito para Favicons, Apps e Avatares redondos.
6. A paleta de cores deve conter códigos hexadecimais vívidos e elegantes (#RRGGBB).
7. Em "recommendedAnimation", escolha a animação que melhor valoriza o conceito:
   - 'construct': Para logos geométricos ou desenhados por traços contínuos.
   - 'pulse': Para marcas orgânicas, bem-estar, inovação fluida.
   - 'spin': Para símbolos circulares, vórtices, engrenagens, orbes tecnológicos.
   - 'neon': Para estética cyberpunk, tecnologia de ponta, games ou baladas.
   - 'bounce': Para marcas joviais, criativas, amigáveis, infantis ou esportivas.
   - 'cinematic': Para marcas de luxo, consultorias de elite, arquitetura, joias ou finanças.`;

    const userPrompt = `Crie ${count} conceitos distintos e refinados de logotipo para a seguinte empresa:
- Nome da Empresa: "${companyName}"
- Slogan/Tagline: "${tagline || '(sem slogan)'}"
- Ramo de Atuação: "${industry}"
- Descrição da Empresa: "${description}"
- Estilo Visual Desejado: "${style}"
- Preferência de Cores: "${colorPreference}"
- Preferência de Símbolo/Motivo: "${symbolPreference || 'Livre para inovação criativa de acordo com a descrição'}"

Retorne o array JSON com os ${count} conceitos completos e ricos.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'Lista de conceitos de logotipo gerados',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: 'Identificador único, ex: concept-1' },
              conceptName: { type: Type.STRING, description: 'Nome do conceito criativo (ex: Ícone Geométrico Futura)' },
              rationale: { type: Type.STRING, description: 'Explicação detalhada do conceito, psicologia das formas e cores' },
              brandName: { type: Type.STRING, description: 'Nome da marca no logo' },
              tagline: { type: Type.STRING, description: 'Slogan da marca' },
              colors: {
                type: Type.OBJECT,
                description: 'Paleta de cores em formato hexadecimal',
                properties: {
                  primary: { type: Type.STRING, description: 'Cor primária (#RRGGBB)' },
                  secondary: { type: Type.STRING, description: 'Cor secundária (#RRGGBB)' },
                  accent: { type: Type.STRING, description: 'Cor de destaque (#RRGGBB)' },
                  backgroundDark: { type: Type.STRING, description: 'Cor para fundo escuro (#090D16)' },
                  backgroundLight: { type: Type.STRING, description: 'Cor para fundo claro (#F8FAFC)' },
                  textColor: { type: Type.STRING, description: 'Cor recomendada para o texto (#FFFFFF)' },
                },
                required: ['primary', 'secondary', 'accent', 'backgroundDark', 'backgroundLight', 'textColor'],
              },
              fontFamily: { type: Type.STRING, description: 'Fonte recomendada (ex: Plus Jakarta Sans, Cinzel, Montserrat, Outfit)' },
              recommendedAnimation: {
                type: Type.STRING,
                description: 'Preset de animação recomendado: construct, pulse, spin, neon, bounce, cinematic',
              },
              svgMarkup: {
                type: Type.STRING,
                description: 'Código SVG completo e válido (<svg viewBox="0 0 500 500" ...>...</svg>)',
              },
              symbolSvgOnly: {
                type: Type.STRING,
                description: 'Símbolo isolado (<svg viewBox="0 0 200 200" ...>...</svg>) para app icon e favicon',
              },
              styleKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Palavras-chave de estilo',
              },
            },
            required: [
              'id',
              'conceptName',
              'rationale',
              'brandName',
              'colors',
              'fontFamily',
              'recommendedAnimation',
              'svgMarkup',
              'symbolSvgOnly',
              'styleKeywords',
            ],
          },
        },
      },
    });

    const text = response.text || '[]';
    const logos = JSON.parse(text);

    return res.json({
      success: true,
      companyName,
      tagline,
      logos,
    });
  } catch (error: any) {
    console.error('Erro ao gerar logos com Gemini:', error);
    return res.status(500).json({
      error: error?.message || 'Falha ao gerar os logotipos. Tente novamente em instantes.',
    });
  }
});

// Endpoint to refine or adjust an existing logo based on feedback
app.post('/api/refine-logo', async (req: Request, res: Response) => {
  try {
    const { currentLogo, instruction } = req.body;

    if (!currentLogo || !instruction) {
      return res.status(400).json({ error: 'Logo atual e instrução de ajuste são obrigatórios.' });
    }

    const systemPrompt = `Você é um diretor de arte sênior especialista em SVG e branding.
O usuário quer aprimorar um logotipo SVG existente com base em uma instrução em português (ex: "torne as cores mais douradas", "deixe o símbolo mais minimalista", "mude o slogan").
Mantenha a alta qualidade técnica do SVG, viewBox 0 0 500 500, gradientes e grupos semânticos.
Retorne o objeto do logo atualizado em formato JSON.`;

    const userPrompt = `Logo atual:
${JSON.stringify(currentLogo, null, 2)}

Instrução de ajuste do cliente:
"${instruction}"

Retorne o conceito atualizado em JSON compatível.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            conceptName: { type: Type.STRING },
            rationale: { type: Type.STRING },
            brandName: { type: Type.STRING },
            tagline: { type: Type.STRING },
            colors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                accent: { type: Type.STRING },
                backgroundDark: { type: Type.STRING },
                backgroundLight: { type: Type.STRING },
                textColor: { type: Type.STRING },
              },
              required: ['primary', 'secondary', 'accent', 'backgroundDark', 'backgroundLight', 'textColor'],
            },
            fontFamily: { type: Type.STRING },
            recommendedAnimation: { type: Type.STRING },
            svgMarkup: { type: Type.STRING },
            symbolSvgOnly: { type: Type.STRING },
            styleKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'id',
            'conceptName',
            'rationale',
            'brandName',
            'colors',
            'fontFamily',
            'recommendedAnimation',
            'svgMarkup',
            'symbolSvgOnly',
            'styleKeywords',
          ],
        },
      },
    });

    const refined = JSON.parse(response.text || '{}');
    return res.json({ success: true, logo: refined });
  } catch (error: any) {
    console.error('Erro ao refinar logo:', error);
    return res.status(500).json({ error: error?.message || 'Falha ao refinar o logotipo.' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
