import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dataset: string }> }
) {
  try {
    const { dataset } = await params;
    
    // Validar o nome do dataset para evitar path traversal
    if (!dataset || dataset.includes('..') || dataset.includes('/')) {
      return NextResponse.json(
        { error: 'Dataset inválido' },
        { status: 400 }
      );
    }

    // Ler o arquivo JSON
    const filePath = join(
      process.cwd(),
      'content',
      'chronology',
      'bible',
      `${dataset}.json`
    );

    const data = await readFile(filePath, 'utf-8');
    const json = JSON.parse(data);

    return NextResponse.json(json);
  } catch (error) {
    console.error(`Erro ao carregar dataset:`, error);
    return NextResponse.json(
      { error: 'Dataset não encontrado' },
      { status: 404 }
    );
  }
}
