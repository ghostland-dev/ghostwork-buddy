-- Create email automations system
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'custom',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create email automations table
CREATE TABLE public.email_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES public.email_templates(id),
  trigger_type TEXT NOT NULL, -- 'manual', 'schedule', 'event'
  trigger_config JSONB DEFAULT '{}',
  target_emails TEXT[],
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
  send_count INTEGER DEFAULT 0,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create email logs table
CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES public.email_automations(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL, -- 'sent', 'failed', 'pending'
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);

-- Enable RLS for all tables
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policies for email_templates
CREATE POLICY "Users can manage own templates" ON public.email_templates
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policies for email_automations
CREATE POLICY "Users can manage own automations" ON public.email_automations
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policies for email_logs
CREATE POLICY "Users can view own automation logs" ON public.email_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.email_automations 
    WHERE id = email_logs.automation_id AND user_id = auth.uid()
  )
);

-- Insert default email templates
INSERT INTO public.email_templates (user_id, name, subject, content, category, variables) VALUES
  (
    '00000000-0000-0000-0000-000000000000',  -- System templates
    'Relance Client Prospect',
    'Suivi de notre proposition - {{company_name}}',
    '<h2>Bonjour {{client_name}},</h2>
    <p>J''espère que vous allez bien. Je reviens vers vous concernant la proposition que nous avons discutée le {{date_contact}}.</p>
    
    <p>Pour rappel, notre offre comprend :</p>
    <ul>
      <li>{{service_1}}</li>
      <li>{{service_2}}</li>
      <li>{{service_3}}</li>
    </ul>
    
    <p>Cette proposition reste valable jusqu''au {{date_limite}}.</p>
    
    <p>Seriez-vous disponible cette semaine pour en discuter ?</p>
    
    <p>Cordialement,<br>{{sender_name}}<br>{{sender_company}}</p>',
    'prospection',
    '{"client_name": "Nom du client", "company_name": "Nom entreprise", "date_contact": "Date de contact", "service_1": "Service 1", "service_2": "Service 2", "service_3": "Service 3", "date_limite": "Date limite", "sender_name": "Votre nom", "sender_company": "Votre entreprise"}'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'Devis de Suivi',
    'Votre devis {{devis_numero}} - Réponse souhaitée',
    '<h2>Bonjour {{client_name}},</h2>
    
    <p>Nous vous avons envoyé le devis n°{{devis_numero}} le {{date_envoi}} d''un montant de {{montant}}€.</p>
    
    <p>Nous n''avons pas encore reçu de retour de votre part. Avez-vous eu l''occasion de l''examiner ?</p>
    
    <p>Si vous avez des questions ou souhaitez discuter de modifications, je reste à votre disposition.</p>
    
    <p>Dans l''attente de votre retour,</p>
    
    <p>Cordialement,<br>{{sender_name}}</p>',
    'devis',
    '{"client_name": "Nom du client", "devis_numero": "Numéro devis", "date_envoi": "Date envoi", "montant": "Montant", "sender_name": "Votre nom"}'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'Newsletter Mensuelle',
    '{{newsletter_title}} - {{month}} {{year}}',
    '<h1>{{newsletter_title}}</h1>
    
    <h2>🚀 Les nouveautés de {{month}}</h2>
    <p>{{news_content}}</p>
    
    <h2>💡 Conseil du mois</h2>
    <p>{{tip_content}}</p>
    
    <h2>📈 Nos dernières réalisations</h2>
    <p>{{achievements_content}}</p>
    
    <p>Merci de votre confiance !</p>
    
    <p>L''équipe {{company_name}}</p>',
    'newsletter',
    '{"newsletter_title": "Titre newsletter", "month": "Mois", "year": "Année", "news_content": "Contenu actualités", "tip_content": "Conseil du mois", "achievements_content": "Réalisations", "company_name": "Nom entreprise"}'
  );

-- Create automation workflow steps table
CREATE TABLE public.automation_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES public.email_automations(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_type TEXT NOT NULL, -- 'email', 'wait', 'condition'
  step_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for automation steps
ALTER TABLE public.automation_steps ENABLE ROW LEVEL SECURITY;

-- Policy for automation steps
CREATE POLICY "Users can manage own automation steps" ON public.automation_steps
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.email_automations 
    WHERE id = automation_steps.automation_id AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.email_automations 
    WHERE id = automation_steps.automation_id AND user_id = auth.uid()
  )
);