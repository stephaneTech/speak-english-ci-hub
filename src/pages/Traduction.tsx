import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { FileText, Upload, Calculator, Clock, CheckCircle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const documentTypes = [
  "Acte de naissance",
  "Acte de mariage",
  "Diplôme",
  "Relevé de notes",
  "Certificat de travail",
  "CV",
  "Lettre de motivation",
  "Contrat",
  "Passeport",
  "Permis de conduire",
];

const sourceLanguages = [
  { value: "en", label: "Anglais" },
  { value: "de", label: "Allemand" },
  { value: "zh", label: "Mandarin" },
  { value: "it", label: "Italien" },
  { value: "es", label: "Espagnol" },
];

const targetLanguages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
];

const countries = [
  "Côte d'Ivoire",
  "France",
  "Canada",
  "Belgique",
  "Suisse",
  "Sénégal",
  "Cameroun",
  "Mali",
  "Burkina Faso",
  "Autre",
];

const PRICE_PER_PAGE = 9000;

const Traduction = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    country: "",
    selectedDocTypes: [] as string[],
    otherDocType: "",
    sourceLanguage: "",
    targetLanguage: "",
    pages: 1,
    files: [] as File[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = formData.pages * PRICE_PER_PAGE;

  const getDeliveryTime = (pages: number) => {
    // 24h pour chaque tranche de 5 pages
    const tranches = Math.ceil(pages / 5);
    const hours = tranches * 24;
    return `${hours} heures`;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocTypeChange = (docType: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedDocTypes: checked
        ? [...prev.selectedDocTypes, docType]
        : prev.selectedDocTypes.filter((t) => t !== docType),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type !== "application/pdf") {
          toast.error(`${file.name} n'est pas un fichier PDF`);
          continue;
        }
        newFiles.push(file);
      }
      if (newFiles.length > 0) {
        setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
      }
    }
    // Reset input to allow selecting same file again
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasDocTypes = formData.selectedDocTypes.length > 0 || formData.otherDocType.trim() !== "";
    
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.country || 
        !hasDocTypes || !formData.sourceLanguage || !formData.targetLanguage || formData.files.length === 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.sourceLanguage === formData.targetLanguage) {
      toast.error("La langue source et cible doivent être différentes");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("Votre commande a été envoyée avec succès ! Nous vous contacterons bientôt.");
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      whatsapp: "",
      country: "",
      selectedDocTypes: [],
      otherDocType: "",
      sourceLanguage: "",
      targetLanguage: "",
      pages: 1,
      files: [],
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-hero-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              Traduction Certifiée
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Traduction de documents
              <span className="text-gradient"> professionnelle</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Obtenez une traduction certifiée de vos documents officiels. 
              Qualité garantie et livraison rapide.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-6 text-center shadow-soft">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-primary mb-1">9 000 FCFA</h3>
              <p className="text-muted-foreground">par page</p>
            </div>
            <div className="bg-card rounded-2xl p-6 text-center shadow-soft">
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-secondary mb-1">24h / 5 pages</h3>
              <p className="text-muted-foreground">délai de livraison</p>
            </div>
            <div className="bg-card rounded-2xl p-6 text-center shadow-soft">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">Certification Officielle</h3>
              <p className="text-muted-foreground">Document reconnu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="bg-card rounded-3xl p-8 shadow-soft">
                  <h2 className="text-2xl font-heading font-bold mb-8">Commander une traduction</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="font-heading font-semibold text-lg border-b border-border pb-2">
                        Informations personnelles
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom complet *</Label>
                          <Input
                            id="name"
                            placeholder="Votre nom"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="whatsapp">Numéro WhatsApp *</Label>
                          <Input
                            id="whatsapp"
                            placeholder="+225 XX XX XX XX XX"
                            value={formData.whatsapp}
                            onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Pays *</Label>
                          <Select
                            value={formData.country}
                            onValueChange={(value) => handleInputChange("country", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="space-y-4">
                      <h3 className="font-heading font-semibold text-lg border-b border-border pb-2">
                        Détails du document
                      </h3>
                      
                      {/* Document Types - Checkboxes */}
                      <div className="space-y-3">
                        <Label>Type(s) de document *</Label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {documentTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={formData.selectedDocTypes.includes(type)}
                                onCheckedChange={(checked) => handleDocTypeChange(type, checked as boolean)}
                              />
                              <label
                                htmlFor={type}
                                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                        
                        {/* Autre option */}
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="otherDocType">Autre (précisez)</Label>
                          <Input
                            id="otherDocType"
                            placeholder="Autre type de document..."
                            value={formData.otherDocType}
                            onChange={(e) => handleInputChange("otherDocType", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Langue source *</Label>
                          <Select
                            value={formData.sourceLanguage}
                            onValueChange={(value) => handleInputChange("sourceLanguage", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="De..." />
                            </SelectTrigger>
                            <SelectContent>
                              {sourceLanguages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Langue cible *</Label>
                          <Select
                            value={formData.targetLanguage}
                            onValueChange={(value) => handleInputChange("targetLanguage", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vers..." />
                            </SelectTrigger>
                            <SelectContent>
                              {targetLanguages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pages">Nombre de pages *</Label>
                        <Input
                          id="pages"
                          type="number"
                          min="1"
                          max="100"
                          value={formData.pages}
                          onChange={(e) => handleInputChange("pages", parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="file">Documents PDF * (plusieurs fichiers autorisés)</Label>
                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <input
                            type="file"
                            id="file"
                            accept=".pdf"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="file" className="cursor-pointer">
                            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm font-medium">Cliquez pour télécharger vos PDF</p>
                            <p className="text-xs text-muted-foreground mt-1">Format PDF uniquement - Plusieurs fichiers autorisés</p>
                          </label>
                        </div>
                        
                        {/* Liste des fichiers */}
                        {formData.files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <Label>Fichiers sélectionnés ({formData.files.length})</Label>
                            <div className="space-y-2">
                              {formData.files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                                  >
                                    <X className="w-4 h-4 text-destructive" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          Envoyer ma commande
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-3xl p-6 shadow-soft sticky top-24">
                  <h3 className="font-heading font-bold text-xl mb-6">Récapitulatif</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground">Nombre de pages</span>
                      <span className="font-semibold">{formData.pages}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground">Prix par page</span>
                      <span className="font-semibold">9 000 FCFA</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground">Fichiers PDF</span>
                      <span className="font-semibold">{formData.files.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground">Délai de livraison</span>
                      <span className="font-semibold text-secondary">{getDeliveryTime(formData.pages)}</span>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-bold text-lg">Total</span>
                      <span className="font-heading font-bold text-2xl text-primary">
                        {totalPrice.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      <span>Traduction certifiée et officielle</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5" />
                      <span>Livraison par email et WhatsApp</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      <span>Paiement sécurisé par Mobile Money</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Traduction;