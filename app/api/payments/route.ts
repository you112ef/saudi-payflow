import { NextRequest, NextResponse } from 'next/server'
import { generateUUID, generateOrderId } from '@/lib/utils/uuid'
import { serverStorage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, amount, currency, customer_name, customer_email, customer_phone, customer_address, order_id } = body

    if (!provider || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const uuid = generateUUID()
    const finalOrderId = order_id || generateOrderId(provider)
    const paymentLink = `${request.nextUrl.origin}/pay/${uuid}`

    const payment = {
      id: uuid,
      provider,
      amount: parseFloat(amount),
      currency,
      status: 'pending' as const,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      order_id: finalOrderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      payment_url: paymentLink
    }

    serverStorage.setPayment(payment)

    return NextResponse.json({ success: true, data: payment })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let payments = serverStorage.getAllPayments()

    if (provider) {
      payments = payments.filter(p => p.provider === provider)
    }

    if (status) {
      payments = payments.filter(p => p.status === status)
    }

    if (search) {
      payments = payments.filter(p =>
        (p.customer_name && p.customer_name.includes(search)) ||
        (p.customer_email && p.customer_email.includes(search)) ||
        (p.order_id && p.order_id.includes(search))
      )
    }

    // Sort by created_at desc
    payments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ success: true, data: payments })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
