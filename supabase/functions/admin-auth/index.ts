import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, password, newPassword } = await req.json()
    console.log(`Admin auth action: ${action}`)

    if (action === 'verify') {
      // Verify password
      const { data, error } = await supabase
        .from('admin_settings')
        .select('password_hash')
        .eq('id', 'admin_password')
        .single()

      if (error) {
        console.error('Error fetching admin password:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Erreur de vérification' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      const isValid = data.password_hash === password
      console.log(`Password verification: ${isValid ? 'success' : 'failed'}`)

      return new Response(
        JSON.stringify({ success: isValid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'change') {
      // First verify current password
      const { data: currentData, error: fetchError } = await supabase
        .from('admin_settings')
        .select('password_hash')
        .eq('id', 'admin_password')
        .single()

      if (fetchError) {
        console.error('Error fetching current password:', fetchError)
        return new Response(
          JSON.stringify({ success: false, error: 'Erreur de vérification' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      if (currentData.password_hash !== password) {
        console.log('Current password verification failed')
        return new Response(
          JSON.stringify({ success: false, error: 'Mot de passe actuel incorrect' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      // Update to new password
      const { error: updateError } = await supabase
        .from('admin_settings')
        .update({ password_hash: newPassword })
        .eq('id', 'admin_password')

      if (updateError) {
        console.error('Error updating password:', updateError)
        return new Response(
          JSON.stringify({ success: false, error: 'Erreur lors de la mise à jour' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      console.log('Password updated successfully')
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Action non reconnue' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Admin auth error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Erreur serveur' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})