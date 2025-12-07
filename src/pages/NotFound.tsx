import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="py-32">
        <div className="container">
          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-8xl font-heading font-bold text-gradient mb-6">404</h1>
            <h2 className="text-2xl font-heading font-bold mb-4">Page non trouvée</h2>
            <p className="text-muted-foreground mb-8">
              Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link to="/">
              <Button size="lg">
                <Home className="w-5 h-5" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
