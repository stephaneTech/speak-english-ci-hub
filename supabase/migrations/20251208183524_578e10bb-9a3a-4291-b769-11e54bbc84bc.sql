-- Table pour les packs de coaching
CREATE TABLE public.coaching_packs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    duration TEXT,
    features TEXT[] NOT NULL DEFAULT '{}',
    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les paramètres du site
CREATE TABLE public.site_settings (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    label TEXT,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les questions du test de niveau
CREATE TABLE public.test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'A1',
    category TEXT NOT NULL DEFAULT 'grammar',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coaching_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coaching_packs (public read, admin write)
CREATE POLICY "Anyone can read packs" ON public.coaching_packs FOR SELECT USING (true);
CREATE POLICY "Admin can update packs" ON public.coaching_packs FOR UPDATE USING (true);
CREATE POLICY "Admin can insert packs" ON public.coaching_packs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can delete packs" ON public.coaching_packs FOR DELETE USING (true);

-- RLS Policies for site_settings (public read, admin write)
CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can update settings" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Admin can insert settings" ON public.site_settings FOR INSERT WITH CHECK (true);

-- RLS Policies for test_questions (public read active, admin write)
CREATE POLICY "Anyone can read active questions" ON public.test_questions FOR SELECT USING (true);
CREATE POLICY "Admin can update questions" ON public.test_questions FOR UPDATE USING (true);
CREATE POLICY "Admin can insert questions" ON public.test_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can delete questions" ON public.test_questions FOR DELETE USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_coaching_packs_updated_at
BEFORE UPDATE ON public.coaching_packs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_questions_updated_at
BEFORE UPDATE ON public.test_questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default packs
INSERT INTO public.coaching_packs (id, title, description, price, duration, features, is_popular, display_order) VALUES
('pack-decouverte', 'Pack Découverte', 'Idéal pour débuter et évaluer votre niveau', 25000, '1 mois', ARRAY['4 sessions de 45 min', 'Évaluation initiale', 'Support WhatsApp', 'Ressources PDF'], false, 1),
('pack-essentiel', 'Pack Essentiel', 'Pour une progression régulière et efficace', 65000, '3 mois', ARRAY['12 sessions de 45 min', 'Plan personnalisé', 'Support WhatsApp prioritaire', 'Exercices interactifs', 'Suivi de progression'], true, 2),
('pack-intensif', 'Pack Intensif', 'Pour une maîtrise rapide de l''anglais', 120000, '6 mois', ARRAY['24 sessions de 60 min', 'Coaching personnalisé', 'Support 7j/7', 'Accès plateforme premium', 'Certification finale', 'Sessions de groupe bonus'], false, 3);

-- Insert default site settings
INSERT INTO public.site_settings (id, value, label, category) VALUES
('translation_price_per_page', '9000', 'Prix par page (FCFA)', 'translation'),
('wave_number', 'https://pay.wave.com/m/M_ci_fShORPhre-ds/c/ci/', 'Lien Wave Business', 'payment'),
('orange_money_number', '+2250797721270', 'Numéro Orange Money', 'payment'),
('moov_money_number', '+2250103026467', 'Numéro Moov Money', 'payment'),
('contact_email', 'contact@speakenglishci.com', 'Email de contact', 'contact'),
('contact_phone', '+225 07 97 72 12 70', 'Téléphone', 'contact'),
('contact_whatsapp', '+225 07 97 72 12 70', 'WhatsApp', 'contact'),
('contact_address', 'Abidjan, Côte d''Ivoire', 'Adresse', 'contact');

-- Insert sample test questions
INSERT INTO public.test_questions (question, options, correct_answer, difficulty, category, display_order) VALUES
('What ___ your name?', ARRAY['is', 'are', 'am', 'be'], 0, 'A1', 'grammar', 1),
('She ___ to school every day.', ARRAY['go', 'goes', 'going', 'went'], 1, 'A1', 'grammar', 2),
('They ___ watching TV now.', ARRAY['is', 'are', 'am', 'be'], 1, 'A1', 'grammar', 3),
('I ___ breakfast at 7 am yesterday.', ARRAY['have', 'has', 'had', 'having'], 2, 'A2', 'grammar', 4),
('He has ___ lived in Paris.', ARRAY['ever', 'never', 'already', 'yet'], 1, 'A2', 'grammar', 5),
('If I ___ rich, I would travel the world.', ARRAY['am', 'was', 'were', 'be'], 2, 'B1', 'grammar', 6),
('The book ___ by millions of people.', ARRAY['has read', 'has been read', 'have read', 'reading'], 1, 'B1', 'grammar', 7),
('I wish I ___ speak French fluently.', ARRAY['can', 'could', 'may', 'might'], 1, 'B2', 'grammar', 8),
('By next year, I ___ here for 10 years.', ARRAY['will work', 'will have worked', 'am working', 'work'], 1, 'B2', 'grammar', 9),
('The opposite of "happy" is:', ARRAY['sad', 'angry', 'tired', 'hungry'], 0, 'A1', 'vocabulary', 10),
('Choose the synonym of "big":', ARRAY['small', 'large', 'tiny', 'narrow'], 1, 'A1', 'vocabulary', 11),
('What does "entrepreneur" mean?', ARRAY['Employee', 'Business owner', 'Student', 'Teacher'], 1, 'B1', 'vocabulary', 12),
('"To procrastinate" means to:', ARRAY['Work hard', 'Delay tasks', 'Finish early', 'Help others'], 1, 'B2', 'vocabulary', 13),
('The word "ubiquitous" means:', ARRAY['Rare', 'Present everywhere', 'Unknown', 'Ancient'], 1, 'C1', 'vocabulary', 14),
('Had I known about the meeting, I ___ attended.', ARRAY['will have', 'would have', 'could', 'might'], 1, 'C1', 'grammar', 15);