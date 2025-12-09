import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, DollarSign } from 'lucide-react';

interface TranslationPricing {
  id: string;
  source_language: string;
  target_language: string;
  price_per_page: number;
}

const PricingManager = () => {
  const [pricing, setPricing] = useState<TranslationPricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const { data, error } = await supabase
        .from('translation_pricing')
        .select('*')
        .order('source_language', { ascending: true });

      if (error) throw error;

      if (data) {
        setPricing(data);
        const prices: Record<string, number> = {};
        data.forEach((p) => {
          prices[p.id] = p.price_per_page;
        });
        setEditedPrices(prices);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Erreur lors du chargement des tarifs');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditedPrices((prev) => ({ ...prev, [id]: numValue }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const item of pricing) {
        const newPrice = editedPrices[item.id];
        if (newPrice !== item.price_per_page) {
          const { error } = await supabase
            .from('translation_pricing')
            .update({ price_per_page: newPrice })
            .eq('id', item.id);

          if (error) throw error;
        }
      }

      toast.success('Tarifs mis à jour avec succès');
      fetchPricing();
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Group pricing by source language for cleaner display
  const groupedPricing = pricing.reduce((acc, item) => {
    const key = item.source_language;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, TranslationPricing[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Tarifs de traduction
        </h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Enregistrer
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Modifiez les tarifs par page pour chaque combinaison de langues. Les prix sont en FCFA.
      </p>

      <div className="grid gap-6">
        {Object.entries(groupedPricing).map(([sourceLanguage, items]) => (
          <div key={sourceLanguage} className="bg-card rounded-xl p-4 shadow-soft">
            <h3 className="font-bold text-lg mb-4 text-primary">{sourceLanguage}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <Label className="text-sm font-medium">
                    → {item.target_language}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editedPrices[item.id] || 0}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      min={0}
                      step={500}
                      className="text-right"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">FCFA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pricing.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun tarif configuré. Les tarifs par défaut seront utilisés.
        </div>
      )}
    </div>
  );
};

export default PricingManager;
