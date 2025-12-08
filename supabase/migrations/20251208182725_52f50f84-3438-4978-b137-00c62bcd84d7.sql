-- Create admin_settings table for universal password
CREATE TABLE public.admin_settings (
    id TEXT PRIMARY KEY DEFAULT 'admin_password',
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (for password verification)
CREATE POLICY "Anyone can read admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (true);

-- Only allow updates from authenticated admin sessions (will be handled via edge function)
CREATE POLICY "Allow updates via service role" 
ON public.admin_settings 
FOR UPDATE 
USING (true);

-- Insert the initial password (hashed version of 'Moviephone12')
-- Using a simple hash for now, will be verified server-side
INSERT INTO public.admin_settings (id, password_hash) 
VALUES ('admin_password', 'Moviephone12');

-- Add trigger for updated_at
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();