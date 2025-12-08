-- Drop existing restrictive policies on clients
DROP POLICY IF EXISTS "Users can view their own client data" ON public.clients;
DROP POLICY IF EXISTS "Users can create their own client data" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own client data" ON public.clients;

-- Allow anyone to insert clients (for translation orders from non-authenticated users)
CREATE POLICY "Anyone can create clients for translation orders" 
ON public.clients 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view clients by email (for checking existing clients)
CREATE POLICY "Anyone can view clients" 
ON public.clients 
FOR SELECT 
USING (true);

-- Allow anyone to update clients (for updating existing client info)
CREATE POLICY "Anyone can update clients" 
ON public.clients 
FOR UPDATE 
USING (true);

-- Drop existing restrictive policies on translation_orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.translation_orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.translation_orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.translation_orders;

-- Allow anyone to insert translation orders
CREATE POLICY "Anyone can create translation orders" 
ON public.translation_orders 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view translation orders (for confirmation page)
CREATE POLICY "Anyone can view translation orders" 
ON public.translation_orders 
FOR SELECT 
USING (true);

-- Allow anyone to update translation orders (for payment info)
CREATE POLICY "Anyone can update translation orders" 
ON public.translation_orders 
FOR UPDATE 
USING (true);