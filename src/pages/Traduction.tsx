import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { FileText, Upload, Calculator, Clock, CheckCircle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

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

const orderSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  whatsapp: z.string().trim().min(8, "Numéro WhatsApp invalide").max(20),
  country: z.string().min(1, "Le pays est requis"),
  sourceLanguage: z.string().min(1, "La langue source est requise"),
  targetLanguage: z.string().min(1, "La langue cible est requise"),
});

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
    const tranches = Math.ceil(pages / 5);
    const hours = tranches * 24;
    const days = hours / 24;
    
    if (days >= 1) {
      return `${hours}h (${days} jour${days > 1 ? 's' : ''})`;
    }
    return `${hours} heures`;
  };

  const getDeliveryHours = (pages: number) => {
    const tranches = Math.ceil(pages / 5);
    return tranches * 24;
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
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const fileName = `originals/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Erreur lors de l'upload de ${file.name}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasDocTypes = formData.selectedDocTypes.length > 0 || formData.otherDocType.trim() !== "";
    
    // Validate form
    const validation = orderSchema.safeParse({
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      country: formData.country,
      sourceLanguage: formData.sourceLanguage,
      targetLanguage: formData.targetLanguage,
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    if (!hasDocTypes) {
      toast.error("Veuillez sélectionner au moins un type de document");
      return;
    }

    if (formData.files.length === 0) {
      toast.error("Veuillez uploader au moins un fichier PDF");
      return;
    }

    if (formData.sourceLanguage === formData.targetLanguage) {
      toast.error("La langue source et cible doivent être différentes");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload files first
      const uploadedUrls = await uploadFiles(formData.files);

      // 2. Create or find client
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      let clientId: string;

      if (existingClient) {
        clientId = existingClient.id;
        // Update client info
        await supabase
          .from('clients')
          .update({
            nom: formData.name,
            whatsapp: formData.whatsapp,
            pays: formData.country,
          })
          .eq('id', clientId);
      } else {
        // Create new client
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            nom: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            pays: formData.country,
          })
          .select('id')
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      // 3. Create order
      const { error: orderError } = await supabase
        .from('translation_orders')
        .insert({
          client_id: clientId,
          document_types: formData.selectedDocTypes,
          document_type_autre: formData.otherDocType || null,
          langue_source: formData.sourceLanguage,
          langue_cible: formData.targetLanguage,
          nombre_pages: formData.pages,
          prix: totalPrice,
          delai_heures: getDeliveryHours(formData.pages),
          fichiers_originaux: uploadedUrls,
          statut: 'en_attente',
        });

      if (orderError) throw orderError;

      toast.success("Votre commande a été envoyée avec succès ! Nous vous contacterons bientôt.");
      
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
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 lg:py-24 bg-hero-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/10 text-secondary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              Traduction Certifiée
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 sm:mb-6">
              Traduction de documents
              <span className="text-gradient"> professionnelle</span>
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground px-2">
              Obtenez une traduction certifiée de vos documents officiels. 
              Qualité garantie et livraison rapide.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-8 sm:py-12 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-soft">
              <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Calculator className="w-5 sm:w-7 h-5 sm:h-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-2xl text-primary mb-1">9 000 FCFA</h3>
              <p className="text-xs sm:text-base text-muted-foreground">par page</p>
            </div>
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-soft">
              <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="w-5 sm:w-7 h-5 sm:h-7 text-secondary" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-2xl text-secondary mb-1">24h / 5 pages</h3>
              <p className="text-xs sm:text-base text-muted-foreground">délai de livraison</p>
            </div>
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-soft">
              <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-5 sm:w-7 h-5 sm:h-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-lg mb-1">Certification Officielle</h3>
              <p className="text-xs sm:text-base text-muted-foreground">Document reconnu</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-24">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Form */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-soft">
                  <h2 className="text-xl sm:text-2xl font-heading font-bold mb-6 sm:mb-8">Commander une traduction</h2>
                  
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
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft lg:sticky lg:top-24">
                  <h3 className="font-heading font-bold text-lg sm:text-xl mb-4 sm:mb-6">Récapitulatif</h3>
                  
                  <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-border">
                      <span className="text-xs sm:text-base text-muted-foreground">Nombre de pages</span>
                      <span className="text-sm sm:text-base font-semibold">{formData.pages}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-border">
                      <span className="text-xs sm:text-base text-muted-foreground">Prix par page</span>
                      <span className="text-sm sm:text-base font-semibold">9 000 FCFA</span>
                    </div>
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-border">
                      <span className="text-xs sm:text-base text-muted-foreground">Fichiers PDF</span>
                      <span className="text-sm sm:text-base font-semibold">{formData.files.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-border">
                      <span className="text-xs sm:text-base text-muted-foreground">Délai de livraison</span>
                      <span className="text-sm sm:text-base font-semibold text-secondary">{getDeliveryTime(formData.pages)}</span>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-bold text-sm sm:text-lg">Total</span>
                      <span className="font-heading font-bold text-lg sm:text-2xl text-primary">
                        {totalPrice.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Traduction certifiée et officielle</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Livraison par email et WhatsApp</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
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
