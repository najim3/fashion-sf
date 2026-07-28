import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateCodeVerifier, generateCodeChallenge, generateAuthUrl, exchangeCodeForToken, refreshAccessToken } from '@/lib/shopify/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  
  if (route[0] === 'callback') {
    return handleCallback(request);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  
  if (route[0] === 'login') {
    return handleLogin(request);
  }
  if (route[0] === 'refresh') {
    return handleRefresh(request);
  }
  if (route[0] === 'logout') {
    return handleLogout(request);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

async function handleLogin(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const returnTo = body.returnTo || '/account/dashboard';

  const codeVerifier = await generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Create state to prevent CSRF
  const stateBuffer = new Uint8Array(16);
  crypto.getRandomValues(stateBuffer);
  const state = Array.from(stateBuffer, dec => ('0' + dec.toString(16)).slice(-2)).join('');

  // Save verifier and state in cookies
  const cookieStore = await cookies();
  cookieStore.set('oauth_verifier', codeVerifier, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 600 });
  cookieStore.set('oauth_state', state, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 600 });
  cookieStore.set('oauth_return_to', returnTo, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 600 });

  // Generate URL
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback`;
  const url = await generateAuthUrl(redirectUri, state, codeChallenge);

  return NextResponse.json({ url });
}

async function handleCallback(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/login?error=' + error, request.url));
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get('oauth_state')?.value;
  const verifier = cookieStore.get('oauth_verifier')?.value;
  const returnTo = cookieStore.get('oauth_return_to')?.value || '/account/dashboard';

  if (!state || state !== savedState || !verifier || !code) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', request.url));
  }

  try {
    const origin = new URL(request.url).origin;
    const redirectUri = `${origin}/api/auth/callback`;
    const tokens = await exchangeCodeForToken(code, verifier, redirectUri);

    // Save tokens in session
    cookieStore.set('customer_access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.expires_in,
    });
    
    if (tokens.refresh_token) {
      cookieStore.set('customer_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // e.g. 30 days
      });
    }

    // Clear oauth cookies
    cookieStore.delete('oauth_state');
    cookieStore.delete('oauth_verifier');
    cookieStore.delete('oauth_return_to');

    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (err) {
    console.error('Failed to exchange token', err);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}

async function handleRefresh(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('customer_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const tokens = await refreshAccessToken(refreshToken);
    cookieStore.set('customer_access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.expires_in,
    });
    
    if (tokens.refresh_token) {
      cookieStore.set('customer_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to refresh' }, { status: 401 });
  }
}

async function handleLogout(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete('customer_access_token');
  cookieStore.delete('customer_refresh_token');
  
  return NextResponse.json({ success: true });
}
