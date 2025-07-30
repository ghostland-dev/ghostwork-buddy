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

-- Enable RLS for all tables
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_steps ENABLE ROW LEVEL SECURITY;

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