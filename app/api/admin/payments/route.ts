import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi, apiError } from '@/lib/permissions';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

/** GET /api/admin/payments?status=&q= — the verification queue (TZ §22.8). */
export async function GET(request: NextRequest) {
  try {
    await requireAdminApi();
    await db.expireStalePayments();

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'all';
    const query = (url.searchParams.get('q') || '').trim().toLowerCase();

    let payments = await db.getPayments();

    if (status !== 'all') {
      payments = payments.filter((p) => p.status === status);
    }

    if (query) {
      payments = payments.filter((p) => {
        const haystack = [
          p.order_id,
          p.first_name,
          p.last_name,
          p.phone,
          p.profiles?.email,
          p.profiles?.full_name,
          p.courses?.title,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    const all = await db.getPayments();

    return NextResponse.json({
      success: true,
      payments,
      counts: {
        all: all.length,
        pending: all.filter((p) => p.status === 'pending').length,
        receipt_submitted: all.filter((p) => p.status === 'receipt_submitted').length,
        approved: all.filter((p) => p.status === 'approved').length,
        rejected: all.filter((p) => p.status === 'rejected').length,
        expired: all.filter((p) => p.status === 'expired').length,
        cancelled: all.filter((p) => p.status === 'cancelled').length,
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
