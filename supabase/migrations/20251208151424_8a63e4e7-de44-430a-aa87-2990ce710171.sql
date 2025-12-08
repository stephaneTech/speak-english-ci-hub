-- Add RLS policy for user_roles table (admins only can read)
CREATE POLICY "Admins can view all user roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow service role to insert roles (for initial admin setup)
CREATE POLICY "Allow insert user roles"
ON public.user_roles FOR INSERT
WITH CHECK (true);