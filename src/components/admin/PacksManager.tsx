import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  Star,
} from 'lucide-react';

interface CoachingPack {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: string | null;
  features: string[];
  is_popular: boolean | null;
  display_order: number | null;
}

interface PacksManagerProps {
  onClose?: () => void;
}

const PacksManager = ({ onClose }: PacksManagerProps) => {
  const [packs, setPacks] = useState<CoachingPack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPack, setEditingPack] = useState<CoachingPack | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    price: 0,
    duration: '',
    features: '',
    is_popular: false,
    display_order: 0,
  });

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('coaching_packs')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setPacks(data || []);
    } catch (error) {
      console.error('Error fetching packs:', error);
      toast.error('Erreur lors du chargement des packs');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (pack?: CoachingPack) => {
    if (pack) {
      setFormData({
        id: pack.id,
        title: pack.title,
        description: pack.description || '',
        price: pack.price,
        duration: pack.duration || '',
        features: pack.features.join('\n'),
        is_popular: pack.is_popular || false,
        display_order: pack.display_order || 0,
      });
      setEditingPack(pack);
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        price: 0,
        duration: '',
        features: '',
        is_popular: false,
        display_order: packs.length + 1,
      });
      setEditingPack(null);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.id.trim()) {
      toast.error('Le titre et l\'ID sont requis');
      return;
    }

    setIsSaving(true);
    try {
      const packData = {
        id: formData.id.toLowerCase().replace(/\s+/g, '-'),
        title: formData.title,
        description: formData.description || null,
        price: formData.price,
        duration: formData.duration || null,
        features: formData.features.split('\n').filter(f => f.trim()),
        is_popular: formData.is_popular,
        display_order: formData.display_order,
      };

      if (editingPack) {
        const { error } = await supabase
          .from('coaching_packs')
          .update(packData)
          .eq('id', editingPack.id);
        
        if (error) throw error;
        toast.success('Pack modifié avec succès');
      } else {
        const { error } = await supabase
          .from('coaching_packs')
          .insert(packData);
        
        if (error) throw error;
        toast.success('Pack créé avec succès');
      }

      setIsDialogOpen(false);
      fetchPacks();
    } catch (error) {
      console.error('Error saving pack:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (packId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce pack ?')) return;

    try {
      const { error } = await supabase
        .from('coaching_packs')
        .delete()
        .eq('id', packId);
      
      if (error) throw error;
      toast.success('Pack supprimé');
      fetchPacks();
    } catch (error) {
      console.error('Error deleting pack:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-heading font-bold">Gestion des Packs</h2>
        </div>
        <Button onClick={() => openEditDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Pack
        </Button>
      </div>

      <div className="grid gap-4">
        {packs.map((pack) => (
          <div key={pack.id} className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading font-semibold">{pack.title}</h3>
                  {pack.is_popular && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs flex items-center gap-1">
                      <Star className="w-3 h-3" /> Populaire
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{pack.description}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="font-semibold text-primary">{pack.price.toLocaleString()} FCFA</span>
                  {pack.duration && <span className="text-muted-foreground">• {pack.duration}</span>}
                  <span className="text-muted-foreground">• {pack.features.length} fonctionnalités</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => openEditDialog(pack)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(pack.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPack ? 'Modifier le Pack' : 'Nouveau Pack'}</DialogTitle>
            <DialogDescription>
              {editingPack ? 'Modifiez les informations du pack' : 'Créez un nouveau pack de coaching'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pack-id">ID (unique)</Label>
                <Input
                  id="pack-id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="pack-decouverte"
                  disabled={!!editingPack}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pack-order">Ordre d'affichage</Label>
                <Input
                  id="pack-order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pack-title">Titre</Label>
              <Input
                id="pack-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Pack Découverte"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pack-description">Description</Label>
              <Textarea
                id="pack-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Idéal pour débuter..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pack-price">Prix (FCFA)</Label>
                <Input
                  id="pack-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pack-duration">Durée</Label>
                <Input
                  id="pack-duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="3 mois"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pack-features">Fonctionnalités (une par ligne)</Label>
              <Textarea
                id="pack-features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="4 sessions de 45 min&#10;Support WhatsApp&#10;Ressources PDF"
                rows={5}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="pack-popular"
                checked={formData.is_popular}
                onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
              />
              <Label htmlFor="pack-popular">Pack populaire (mis en avant)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PacksManager;