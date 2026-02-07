
import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url)
        console.log(`[Auth Callback] Processing request: ${request.url}`);
        
        const code = requestUrl.searchParams.get('code')
        const next = requestUrl.searchParams.get('next') ?? '/'

        const siteUrl = 'https://tulanh.online';

        if (code) {
            console.log('[Auth Callback] Code found, creating client...');
            const supabase = await createClient()
            
            console.log('[Auth Callback] Exchanging code...');
            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (!error) {
                console.log('[Auth Callback] Exchange success, redirecting...');
                return NextResponse.redirect(`${siteUrl}${next}`)
            } else {
                console.error('[Auth Callback] Exchange error:', error)
            }
        } else {
            console.log('[Auth Callback] No code found');
        }

        return NextResponse.redirect(`${siteUrl}/auth?error=auth_code_error`)
    } catch (e) {
        console.error('[Auth Callback] CRITICAL UNCAUGHT ERROR:', e);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
