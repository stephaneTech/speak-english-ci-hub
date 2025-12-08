-- Add payment fields to translation_orders table
ALTER TABLE public.translation_orders 
ADD COLUMN methode_paiement TEXT,
ADD COLUMN reference_paiement TEXT,
ADD COLUMN paiement_confirme BOOLEAN DEFAULT false,
ADD COLUMN date_paiement TIMESTAMP WITH TIME ZONE;