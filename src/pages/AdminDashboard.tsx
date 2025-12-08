import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Users,
  LogOut,
  Loader2,
  Search,
  Eye,
  Upload,
  Download,
  CheckCircle,
  Clock,
  RefreshCw,
  Smartphone,
  CreditCard,
  Settings,
  Lock,
  Package,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import PacksManager from '@/components/admin/PacksManager';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';
import QuestionsManager from '@/components/admin/QuestionsManager';

interface Client {
  id: string;
  nom: string;
  email: string;
  whatsapp: string;
  pays: string;
  created_at: string;
}

interface Order {
  id: string;
  client_id: string;
  document_types: string[];
  document_type_autre: string | null;
  langue_source: string;
  langue_cible: string;
  nombre_pages: number;
  prix: number;
  delai_heures: number;
  statut: string;
  fichiers_originaux: string[] | null;
  fichier_traduit: string | null;
  notes: string | null;
  created_at: string;
  methode_paiement: string | null;
  reference_paiement: string | null;
  paiement_confirme: boolean | null;
  date_paiement: string | null;
  clients?: Client;
}

const statusOptions = [
  { value: 'en_attente', label: 'En attente', color: 'bg-amber-100 text-amber-800' },
  { value: 'en_cours', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
  { value: 'termine', label: 'Terminé', color: 'bg-green-100 text-green-800' },
  { value: 'annule', label: 'Annulé', color: 'bg-red-100 text-red-800' },
];

const languageLabels: Record<string, string> = {
  en: 'Anglais',
  de: 'Allemand',
  zh: 'Mandarin',
  it: 'Italien',
  es: 'Espagnol',
  fr: 'Français',
};

type TabType = 'orders' | 'clients' | 'packs' | 'questions' | 'settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // Password change dialog
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    // Check if authenticated
    const isAdminAuth = sessionStorage.getItem('admin_authenticated');
    if (isAdminAuth !== 'true') {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, clientsRes] = await Promise.all([
        supabase
          .from('translation_orders')
          .select('*, clients(*)')
          .order('created_at', { ascending: false }),
        supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (clientsRes.data) setClients(clientsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('translation_orders')
        .update({ statut: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => o.id === orderId ? { ...o, statut: newStatus } : o));
      toast.success('Statut mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleUploadTranslatedFile = async (orderId: string, file: File) => {
    setUploadingFile(true);
    try {
      const fileName = `translated/${orderId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('translation_orders')
        .update({ fichier_traduit: publicUrl })
        .eq('id', orderId);

      if (updateError) throw updateError;

      setOrders(orders.map(o => o.id === orderId ? { ...o, fichier_traduit: publicUrl } : o));
      toast.success('Document traduit uploadé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleConfirmPayment = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('translation_orders')
        .update({ 
          paiement_confirme: true,
          date_paiement: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => o.id === orderId ? { ...o, paiement_confirme: true, date_paiement: new Date().toISOString() } : o));
      toast.success('Paiement confirmé !');
    } catch {
      toast.error('Erreur lors de la confirmation');
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsChangingPassword(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'change', password: currentPassword, newPassword }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success('Mot de passe modifié avec succès');
        setShowPasswordDialog(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const getPaymentMethodLabel = (method: string | null) => {
    if (method === 'wave') return 'Wave';
    if (method === 'orange_money') return 'Orange Money';
    return 'Non spécifié';
  };

  const getDeliveryTime = (hours: number) => {
    const days = hours / 24;
    if (days >= 1) {
      return `${hours}h (${days} jour${days > 1 ? 's' : ''})`;
    }
    return `${hours}h`;
  };

  const filteredOrders = orders.filter(order => {
    const client = order.clients;
    const query = searchQuery.toLowerCase();
    return (
      client?.nom.toLowerCase().includes(query) ||
      client?.email.toLowerCase().includes(query) ||
      order.document_types.some(t => t.toLowerCase().includes(query))
    );
  });

  const filteredClients = clients.filter(client => {
    const query = searchQuery.toLowerCase();
    return (
      client.nom.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.whatsapp.includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: 'orders' as TabType, label: 'Commandes', icon: FileText },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
    { id: 'packs' as TabType, label: 'Packs', icon: Package },
    { id: 'questions' as TabType, label: 'Test', icon: HelpCircle },
    { id: 'settings' as TabType, label: 'Paramètres', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-gradient">
                SPEAK ENGLISH CI
              </h1>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPasswordDialog(true)}>
                <Lock className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Mot de passe</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Commandes</span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-bold">{orders.length}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-sm text-muted-foreground">Clients</span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-bold">{clients.length}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-muted-foreground">En attente</span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-bold">
              {orders.filter(o => o.statut === 'en_attente').length}
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-muted-foreground">Terminées</span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-bold">
              {orders.filter(o => o.statut === 'termine').length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Search (for orders and clients) */}
        {(activeTab === 'orders' || activeTab === 'clients') && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Content */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune commande trouvée</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading font-bold text-lg">
                          {order.clients?.nom || 'Client inconnu'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(order.statut).color}`}>
                          {getStatusInfo(order.statut).label}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <p>📧 {order.clients?.email}</p>
                        <p>📱 {order.clients?.whatsapp}</p>
                        <p>📄 {order.nombre_pages} page(s)</p>
                        <p>💰 {order.prix.toLocaleString()} FCFA</p>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Documents: </span>
                        {order.document_types.join(', ')}
                        {order.document_type_autre && `, ${order.document_type_autre}`}
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="text-muted-foreground">Traduction: </span>
                        {languageLabels[order.langue_source] || order.langue_source} → {languageLabels[order.langue_cible] || order.langue_cible}
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="text-muted-foreground">Délai: </span>
                        {getDeliveryTime(order.delai_heures)}
                      </div>
                      
                      {/* Payment Info */}
                      {order.methode_paiement && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {order.methode_paiement === 'wave' ? (
                              <Smartphone className="w-4 h-4 text-[#1DC3EB]" />
                            ) : (
                              <CreditCard className="w-4 h-4 text-[#FF6600]" />
                            )}
                            <span className="font-medium text-sm">{getPaymentMethodLabel(order.methode_paiement)}</span>
                            {order.paiement_confirme ? (
                              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                ✓ Confirmé
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                                En attente
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Réf: <span className="font-mono">{order.reference_paiement}</span>
                          </p>
                          {!order.paiement_confirme && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => handleConfirmPayment(order.id)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirmer le paiement
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Select
                        value={order.statut}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2">
                        {order.fichiers_originaux && order.fichiers_originaux.length > 0 && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={order.fichiers_originaux[0]} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-1" />
                              Originaux
                            </a>
                          </Button>
                        )}
                        
                        {order.fichier_traduit ? (
                          <Button variant="turquoise" size="sm" asChild>
                            <a href={order.fichier_traduit} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-1" />
                              Traduit
                            </a>
                          </Button>
                        ) : (
                          <div className="relative">
                            <input
                              type="file"
                              id={`upload-${order.id}`}
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadTranslatedFile(order.id, file);
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={uploadingFile}
                              onClick={() => document.getElementById(`upload-${order.id}`)?.click()}
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Uploader
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-heading font-semibold">Nom</th>
                    <th className="text-left p-4 font-heading font-semibold">Email</th>
                    <th className="text-left p-4 font-heading font-semibold">WhatsApp</th>
                    <th className="text-left p-4 font-heading font-semibold">Pays</th>
                    <th className="text-left p-4 font-heading font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        Aucun client trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{client.nom}</td>
                        <td className="p-4">{client.email}</td>
                        <td className="p-4">{client.whatsapp}</td>
                        <td className="p-4">{client.pays}</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(client.created_at).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'packs' && <PacksManager />}
        
        {activeTab === 'questions' && <QuestionsManager />}
        
        {activeTab === 'settings' && <SiteSettingsManager />}
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Changer le mot de passe
            </DialogTitle>
            <DialogDescription>
              Entrez votre mot de passe actuel puis le nouveau mot de passe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleChangePassword} disabled={isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Modification...
                </>
              ) : (
                'Modifier'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;