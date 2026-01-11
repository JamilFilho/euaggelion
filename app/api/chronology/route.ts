import { readdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ler todos os arquivos da pasta content/chronology/bible
    const chronologyDir = join(process.cwd(), 'content', 'chronology', 'bible');
    const files = await readdir(chronologyDir);
    
    // Filtrar apenas arquivos .json e remover a extensão
    const datasets = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));

    return NextResponse.json({ datasets });
  } catch (error) {
    console.error('Erro ao listar datasets de cronologia:', error);
    return NextResponse.json(
      { error: 'Erro ao listar datasets' },
      { status: 500 }
    );
  }
}
