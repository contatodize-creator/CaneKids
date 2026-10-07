import { NextResponse } from 'next/server';

const systemPrompt = `Você é o assistente de marketing da CaneKids, uma loja brasileira de presentes e canecas personalizadas. Gere apenas JSON válido, sem markdown. O banner deve ser curto, comercial, elegante e emocional, sem inventar avaliações, vendas, descontos, prazos ou benefícios não informados. Campos obrigatórios: etiqueta, titulo, subtitulo, texto_botao, link_botao. etiqueta em caixa alta e curta. titulo até 70 caracteres. subtitulo até 150 caracteres. texto_botao até 24 caracteres. link_botao deve ser #vitrine, #qr ou /produto conforme a intenção.`;

export async function POST(request: Request) {
  try {
    const { tema } = await request.json();
    if (!tema || typeof tema !== 'string') return NextResponse.json({ error: 'Informe o tema da campanha.' }, { status: 400 });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'A integração ainda precisa da variável OPENAI_API_KEY no Vercel.' }, { status: 503 });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Crie um banner para esta campanha: ${tema}` }
        ],
        text: { format: { type: 'json_object' } }
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('OpenAI banner error', response.status, detail);
      return NextResponse.json({ error: 'Não foi possível gerar o banner agora.' }, { status: 502 });
    }

    const data = await response.json();
    const raw = data.output_text || data.output?.flatMap((o:any)=>o.content||[]).find((x:any)=>x.type==='output_text')?.text;
    if (!raw) return NextResponse.json({ error: 'A IA não retornou conteúdo.' }, { status: 502 });
    const banner = JSON.parse(raw);
    return NextResponse.json({ banner });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao processar a sugestão.' }, { status: 500 });
  }
}
