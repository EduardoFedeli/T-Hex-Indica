import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { produtoId, categoriaSlug } = body;

    // Validação básica para evitar lixo no banco
    if (!produtoId) {
      return NextResponse.json(
        { error: 'Parâmetro produtoId é obrigatório.' }, 
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Inserção assíncrona no Supabase
    const { error } = await supabase
      .from('clicks_produtos')
      .insert([
        { 
          produto_id: produtoId, 
          categoria_slug: categoriaSlug || 'sem-categoria' 
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Clique computado com sucesso.' });
  } catch (error) {
    console.error('[Analytics Error] Falha ao registrar clique:', error);
    // Retornamos 200 mesmo com erro interno para não quebrar a navegação do usuário no frontend
    return NextResponse.json({ success: false, error: 'Falha silenciosa' }, { status: 200 });
  }
}