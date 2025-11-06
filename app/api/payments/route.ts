import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { generateUUID, generateOrderId } from '@/lib/utils/uuid'

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
    const paymentLink = `${request.nextUrl.origin}/payment/${provider}/${uuid}/details`

    const { data, error } = await supabaseServer
      .from('payments')
      .insert([
        {
          id: uuid,
          provider,
          amount,
          currency,
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          order_id: finalOrderId,
          payment_link: paymentLink,
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create payment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
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

    let query = supabaseServer
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (provider) {
      query = query.eq('provider', provider)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,order_id.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
