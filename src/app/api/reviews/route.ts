import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'productId parameter is required' }, { status: 400 });
    }

    const adminSupabase = getAdminSupabase();

    const { data: reviews, error } = await adminSupabase
      .from('reviews')
      .select('*, user:users(id, full_name, avatar_url, email)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalCount = reviews?.length || 0;
    const averageRating = totalCount > 0
      ? Number((reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalCount).toFixed(1))
      : 5.0;

    return NextResponse.json({
      reviews: reviews || [],
      totalCount,
      averageRating,
    });
  } catch (err: any) {
    console.error('Error in GET /api/reviews:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userId, customerId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'productId, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const adminSupabase = getAdminSupabase();

    // Determine user ID (or default/fallback user if not passed)
    let actualUserId = userId || customerId;
    if (!actualUserId) {
      const { data: anyUser } = await adminSupabase.from('users').select('id').limit(1).single();
      if (anyUser) {
        actualUserId = anyUser.id;
      }
    }

    if (!actualUserId) {
      return NextResponse.json({ error: 'Valid user account required to post review' }, { status: 401 });
    }

    // Insert into public.reviews
    const { data: newReview, error: insertErr } = await adminSupabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: actualUserId,
        rating: Math.round(rating),
        comment: comment.trim(),
      })
      .select('*, user:users(id, full_name, avatar_url, email)')
      .single();

    if (insertErr) {
      console.error('Error inserting review:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    // Recompute product ratings & review count
    const { data: allReviews } = await adminSupabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (allReviews && allReviews.length > 0) {
      const count = allReviews.length;
      const avg = Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1));

      await adminSupabase
        .from('products')
        .update({
          rating: avg,
          review_count: count,
        })
        .eq('id', productId);
    }

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (err: any) {
    console.error('Error in POST /api/reviews:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
