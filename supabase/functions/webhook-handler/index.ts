import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  platform: string;
  integration_id: string;
  event_type: string;
  data: any;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: WebhookPayload = await req.json();
    console.log('Webhook received:', JSON.stringify(payload, null, 2));

    // Vérifier que l'intégration existe et est active
    const { data: integration, error: integrationError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('id', payload.integration_id)
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      console.error('Integration not found or inactive:', integrationError);
      return new Response(
        JSON.stringify({ error: 'Integration not found or inactive' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Traitement selon la plateforme
    let result;
    switch (payload.platform.toLowerCase()) {
      case 'zapier':
        result = await handleZapierWebhook(supabaseClient, integration, payload);
        break;
      case 'make':
        result = await handleMakeWebhook(supabaseClient, integration, payload);
        break;
      case 'salesforce':
        result = await handleSalesforceWebhook(supabaseClient, integration, payload);
        break;
      default:
        console.error('Unsupported platform:', payload.platform);
        return new Response(
          JSON.stringify({ error: 'Unsupported platform' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    // Mettre à jour la dernière synchronisation
    await supabaseClient
      .from('integrations')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', payload.integration_id);

    // Log de l'activité
    await supabaseClient
      .from('user_activities')
      .insert({
        user_id: integration.user_id,
        activity_type: 'integration_webhook',
        description: `Webhook reçu de ${payload.platform}`,
        metadata: {
          platform: payload.platform,
          event_type: payload.event_type,
          integration_id: payload.integration_id
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        result 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleZapierWebhook(supabaseClient: any, integration: any, payload: WebhookPayload) {
  console.log('Processing Zapier webhook...');
  
  // Exemple: déclencher une automatisation email basée sur les données Zapier
  if (payload.event_type === 'new_lead' || payload.event_type === 'new_contact') {
    // Rechercher une automatisation avec trigger "zapier_webhook"
    const { data: automations } = await supabaseClient
      .from('email_automations')
      .select('*')
      .eq('user_id', integration.user_id)
      .eq('trigger_type', 'webhook')
      .eq('status', 'active')
      .contains('integration_triggers', [{ platform: 'zapier', event_type: payload.event_type }]);

    if (automations && automations.length > 0) {
      for (const automation of automations) {
        console.log(`Triggering automation: ${automation.name}`);
        
        // Ici vous pourriez déclencher l'envoi d'email
        // ou ajouter à une queue de traitement
        
        // Pour l'instant, on log juste l'événement
        await supabaseClient
          .from('email_logs')
          .insert({
            automation_id: automation.id,
            recipient_email: payload.data.email || 'unknown@email.com',
            status: 'triggered_by_webhook',
            subject: `Automation triggered by ${payload.platform}`,
            sent_at: new Date().toISOString()
          });
      }
    }
  }

  return { processed: true, triggered_automations: automations?.length || 0 };
}

async function handleMakeWebhook(supabaseClient: any, integration: any, payload: WebhookPayload) {
  console.log('Processing Make.com webhook...');
  
  // Logique similaire à Zapier mais adaptée à Make.com
  // Make.com peut envoyer des données plus structurées
  
  if (payload.data && payload.data.trigger_automation) {
    const automationName = payload.data.automation_name;
    
    const { data: automation } = await supabaseClient
      .from('email_automations')
      .select('*')
      .eq('user_id', integration.user_id)
      .eq('name', automationName)
      .eq('status', 'active')
      .single();

    if (automation) {
      console.log(`Make.com triggered automation: ${automation.name}`);
      
      // Incrémenter le compteur d'envoi
      await supabaseClient
        .from('email_automations')
        .update({ 
          send_count: automation.send_count + 1,
          last_run: new Date().toISOString()
        })
        .eq('id', automation.id);
    }
  }

  return { processed: true, make_scenario: payload.data?.scenario_name };
}

async function handleSalesforceWebhook(supabaseClient: any, integration: any, payload: WebhookPayload) {
  console.log('Processing Salesforce webhook...');
  
  // Salesforce peut envoyer des notifications sur les leads, opportunités, etc.
  if (payload.event_type === 'lead_created' || payload.event_type === 'opportunity_updated') {
    
    // Extraire les informations du lead/opportunité
    const contactEmail = payload.data?.Email || payload.data?.email;
    const contactName = payload.data?.Name || payload.data?.name;
    
    if (contactEmail) {
      // Chercher une automatisation pour ce type d'événement Salesforce
      const { data: automations } = await supabaseClient
        .from('email_automations')
        .select('*')
        .eq('user_id', integration.user_id)
        .eq('trigger_type', 'salesforce_event')
        .eq('status', 'active');

      if (automations && automations.length > 0) {
        for (const automation of automations) {
          // Vérifier si cette automatisation doit se déclencher pour ce type d'événement
          const triggerConfig = automation.trigger_config || {};
          if (triggerConfig.salesforce_events?.includes(payload.event_type)) {
            
            console.log(`Salesforce triggered automation: ${automation.name} for ${contactEmail}`);
            
            // Log l'événement
            await supabaseClient
              .from('email_logs')
              .insert({
                automation_id: automation.id,
                recipient_email: contactEmail,
                status: 'triggered_by_salesforce',
                subject: `Welcome ${contactName || 'New Lead'}`,
                sent_at: new Date().toISOString()
              });
          }
        }
      }
    }
  }

  return { 
    processed: true, 
    salesforce_event: payload.event_type,
    contact_email: payload.data?.Email || payload.data?.email 
  };
}