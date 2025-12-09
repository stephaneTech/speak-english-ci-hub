-- Create translation_pricing table for language pair prices
CREATE TABLE public.translation_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_language text NOT NULL,
  target_language text NOT NULL,
  price_per_page integer NOT NULL DEFAULT 9000,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(source_language, target_language)
);

-- Enable RLS
ALTER TABLE public.translation_pricing ENABLE ROW LEVEL SECURITY;

-- Anyone can read prices
CREATE POLICY "Anyone can read pricing" ON public.translation_pricing
FOR SELECT USING (true);

-- Admin can update prices
CREATE POLICY "Admin can update pricing" ON public.translation_pricing
FOR UPDATE USING (true);

-- Admin can insert pricing
CREATE POLICY "Admin can insert pricing" ON public.translation_pricing
FOR INSERT WITH CHECK (true);

-- Admin can delete pricing
CREATE POLICY "Admin can delete pricing" ON public.translation_pricing
FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_translation_pricing_updated_at
BEFORE UPDATE ON public.translation_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pricing (bidirectional)
INSERT INTO public.translation_pricing (source_language, target_language, price_per_page) VALUES
('Français', 'Anglais', 9000),
('Anglais', 'Français', 9000),
('Français', 'Allemand', 14000),
('Allemand', 'Français', 14000),
('Français', 'Espagnol', 14000),
('Espagnol', 'Français', 14000),
('Français', 'Italien', 14000),
('Italien', 'Français', 14000),
('Français', 'Mandarin', 14000),
('Mandarin', 'Français', 14000);