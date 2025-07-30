-- Create user profiles table with roles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  company TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create some test data
-- Note: These are test accounts, you'll need to create them via Supabase auth
INSERT INTO public.profiles (user_id, email, full_name, role, company, phone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@ghostworker.com', 'Admin GhostWorker', 'admin', 'GhostWorker SAS', '+33 1 23 45 67 89'),
  ('00000000-0000-0000-0000-000000000002', 'client1@example.com', 'Marie Dupont', 'client', 'Freelance Marketing', '+33 6 12 34 56 78'),
  ('00000000-0000-0000-0000-000000000003', 'client2@example.com', 'Pierre Martin', 'client', 'Agence Web Plus', '+33 6 87 65 43 21'),
  ('00000000-0000-0000-0000-000000000004', 'client3@example.com', 'Sophie Bernard', 'client', 'Consultante RH', '+33 6 98 76 54 32');

-- Create admin dashboard stats table
CREATE TABLE public.admin_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_users INTEGER DEFAULT 0,
  active_subscribers INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_automations INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert initial stats
INSERT INTO public.admin_stats (total_users, active_subscribers, total_revenue, total_automations) 
VALUES (150, 45, 12500.00, 320);

-- Enable RLS for admin_stats
ALTER TABLE public.admin_stats ENABLE ROW LEVEL SECURITY;

-- Only admins can access stats
CREATE POLICY "Only admins can view stats" ON public.admin_stats
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create user activity log table
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Users can view their own activities
CREATE POLICY "Users can view own activities" ON public.user_activities
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all activities
CREATE POLICY "Admins can view all activities" ON public.user_activities
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert some sample activities
INSERT INTO public.user_activities (user_id, activity_type, description, metadata) VALUES
  ('00000000-0000-0000-0000-000000000002', 'automation_created', 'Création automatisation email', '{"automation_name": "Relance prospects", "type": "email"}'),
  ('00000000-0000-0000-0000-000000000002', 'subscription_activated', 'Abonnement Plan Pro activé', '{"plan": "Pro", "amount": 79}'),
  ('00000000-0000-0000-0000-000000000003', 'ai_chat_used', 'Utilisation Assistant IA', '{"messages_count": 15}'),
  ('00000000-0000-0000-0000-000000000004', 'automation_created', 'Création automatisation sociale', '{"automation_name": "Posts LinkedIn", "type": "social"}');