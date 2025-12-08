import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Loader2,
  Save,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  DollarSign,
} from 'lucide-react';

interface SiteSetting {
  id: string;
  value: string;
  label: string | null;
  category: string;
}

const SiteSettingsManager = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      setSettings(data || []);
      
      // Initialize edited values
      const values: Record<string, string> = {};
      data?.forEach(s => { values[s.id] = s.value; });
      setEditedValues(values);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = settings.map(s => ({
        id: s.id,
        value: editedValues[s.id] || s.value,
        label: s.label,
        category: s.category,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: update.value })
          .eq('id', update.id);
        
        if (error) throw error;
      }

      toast.success('Paramètres enregistrés');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'contact':
        return <Phone className="w-5 h-5 text-secondary" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-primary" />;
      case 'translation':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'contact':
        return 'Informations de contact';
      case 'payment':
        return 'Numéros de paiement';
      case 'translation':
        return 'Tarifs traduction';
      default:
        return category;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, SiteSetting[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <div key={category} className="bg-card rounded-xl p-4 sm:p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            {getCategoryIcon(category)}
            <h3 className="font-heading font-semibold">{getCategoryLabel(category)}</h3>
          </div>
          
          <div className="grid gap-4">
            {categorySettings.map((setting) => (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.id}>{setting.label || setting.id}</Label>
                <Input
                  id={setting.id}
                  value={editedValues[setting.id] || ''}
                  onChange={(e) => setEditedValues({ ...editedValues, [setting.id]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};

export default SiteSettingsManager;