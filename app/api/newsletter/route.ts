// app/api/newsletter/route.ts
import  MailerLite from '@mailerlite/mailerlite-nodejs';
import { NextRequest, NextResponse } from 'next/server';

const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_API_KEY!
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validação básica
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Verificar se já está inscrito
    const existingSubscriber = await mailerlite.subscribers
      .find(email)
      .catch(() => null);

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Este email já está inscrito' },
        { status: 409 }
      );
    }

    // Adicionar ao grupo
    const params = {
      email: email,
      groups: [process.env.MAILERLITE_GROUP_ID!],
      status: 'active' as const,
    };

    await mailerlite.subscribers.createOrUpdate(params);

    return NextResponse.json(
      { message: 'Inscrição realizada com sucesso!' },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Erro ao inscrever:', error);
    
    return NextResponse.json(
      { error: 'Erro ao processar inscrição. Tente novamente.' },
      { status: 500 }
    );
  }
}