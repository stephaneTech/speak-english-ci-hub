import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const isAdminAuth = sessionStorage.getItem('admin_authenticated');
    if (isAdminAuth === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error("Veuillez entrer le mot de passe");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'verify', password }
      });

      if (error) {
        console.error('Error verifying password:', error);
        toast.error("Erreur de connexion");
        return;
      }

      if (data.success) {
        sessionStorage.setItem('admin_authenticated', 'true');
        toast.success("Connexion réussie !");
        navigate('/admin/dashboard');
      } else {
        toast.error("Mot de passe incorrect");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-card rounded-3xl p-8 shadow-elegant">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold">Administration</h1>
            <p className="text-muted-foreground mt-2">
              Entrez le mot de passe pour accéder au tableau de bord
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Retour au site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;