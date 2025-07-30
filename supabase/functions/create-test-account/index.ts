import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateTestAccountRequest {
  email: string;
  password: string;
  full_name: string;
  role: 'client' | 'admin';
  company?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the requesting user as admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Check if requesting user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error("Unauthorized: Admin access required");
    }

    const { email, password, full_name, role, company }: CreateTestAccountRequest = await req.json();

    // Create the user account
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name,
        role,
        company
      },
      email_confirm: true // Auto-confirm email for test accounts
    });

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    console.log(`Test account created: ${email} (${role})`);

    return new Response(JSON.stringify({ 
      success: true,
      user_id: newUser.user?.id,
      email: newUser.user?.email,
      role 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error in create-test-account function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Une erreur est survenue lors de la création du compte.'
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});