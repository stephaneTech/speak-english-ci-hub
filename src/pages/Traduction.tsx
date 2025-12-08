import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { FileText, Upload, Calculator, Clock, CheckCircle, ArrowRight, X, ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import waveLogo from "@/assets/wave-logo.png";
import orangeMoneyLogo from "@/assets/orange-money-logo.png";
import mtnMoneyLogo from "@/assets/mtn-money-logo.jpeg";

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
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "de", label: "Allemand" },
  { value: "zh", label: "Mandarin" },
  { value: "it", label: "Italien" },
  { value: "es", label: "Espagnol" },
];

const targetLanguages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "de", label: "Allemand" },
  { value: "zh", label: "Mandarin" },
  { value: "it", label: "Italien" },
  { value: "es", label: "Espagnol" },
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

// Informations de paiement
const PAYMENT_INFO = {
  wave: {
    link: "https://pay.wave.com/m/M_ci_fShORPhre-ds/c/ci/",
    name: "SPEAK ENGLISH CI",
  },
  orangeMoney: {
    number: "+225 07 97 72 12 70",
    name: "SPEAK ENGLISH CI",
  },
  moovMoney: {
    number: "+225 01 03 02 64 67",
    name: "SPEAK ENGLISH CI",
  },
};

const orderSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  whatsapp: z.string().trim().min(8, "Numéro WhatsApp invalide").max(20),
  country: z.string().min(1, "Le pays est requis"),
  sourceLanguage: z.string().min(1, "La langue source est requise"),
  targetLanguage: z.string().min(1, "La langue cible est requise"),
});

type Step = 'form' | 'payment' | 'confirmation';

const Traduction = () => {
  const [step, setStep] = useState<Step>('form');
  const [orderId, setOrderId] = useState<string | null>(null);
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

  const [paymentData, setPaymentData] = useState({
    method: '' as 'wave' | 'orange_money' | 'moov_money' | '',
    reference: '',
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

  const sanitizeFileName = (name: string): string => {
    // Remove accents and special characters, replace spaces with underscores
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
      .replace(/_+/g, '_') // Remove consecutive underscores
      .toLowerCase();
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const sanitizedName = sanitizeFileName(file.name);
      const fileName = `originals/${Date.now()}_${sanitizedName}`;
      
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Numéro copié !");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasDocTypes = formData.selectedDocTypes.length > 0 || formData.otherDocType.trim() !== "";
    
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
      const uploadedUrls = await uploadFiles(formData.files);

      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      let clientId: string;

      if (existingClient) {
        clientId = existingClient.id;
        await supabase
          .from('clients')
          .update({
            nom: formData.name,
            whatsapp: formData.whatsapp,
            pays: formData.country,
          })
          .eq('id', clientId);
      } else {
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

      const { data: order, error: orderError } = await supabase
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
        })
        .select('id')
        .single();

      if (orderError) throw orderError;
      
      setOrderId(order.id);
      setStep('payment');
      toast.success("Documents uploadés ! Passons au paiement.");
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentData.method) {
      toast.error("Veuillez sélectionner un mode de paiement");
      return;
    }

    if (!paymentData.reference.trim()) {
      toast.error("Veuillez entrer la référence de transaction");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('translation_orders')
        .update({
          methode_paiement: paymentData.method,
          reference_paiement: paymentData.reference,
        })
        .eq('id', orderId);

      if (error) throw error;

      // Send confirmation email
      const sourceLabel = sourceLanguages.find(l => l.value === formData.sourceLanguage)?.label || formData.sourceLanguage;
      const targetLabel = targetLanguages.find(l => l.value === formData.targetLanguage)?.label || formData.targetLanguage;
      
      try {
        const emailResponse = await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId: orderId,
            clientName: formData.name,
            clientEmail: formData.email,
            documentTypes: formData.selectedDocTypes.length > 0 ? formData.selectedDocTypes : [formData.otherDocType],
            sourceLanguage: sourceLabel,
            targetLanguage: targetLabel,
            numberOfPages: formData.pages,
            totalPrice: totalPrice,
            deliveryTime: getDeliveryTime(formData.pages),
            paymentMethod: paymentData.method,
            paymentReference: paymentData.reference,
          },
        });
        
        if (emailResponse.error) {
          console.error('Email sending error:', emailResponse.error);
        } else {
          console.log('Confirmation email sent successfully');
        }
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't block the flow if email fails
      }

      setStep('confirmation');
      toast.success("Paiement enregistré ! Un email de confirmation vous a été envoyé.");
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Erreur lors de l'enregistrement du paiement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep('form');
    setOrderId(null);
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
    setPaymentData({ method: '', reference: '' });
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

      {/* Steps indicator */}
      <section className="py-6 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-md mx-auto">
            <div className={`flex items-center gap-2 ${step === 'form' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'form' ? 'bg-primary text-primary-foreground' : step === 'payment' || step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                {step === 'payment' || step === 'confirmation' ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="hidden sm:inline text-sm font-medium">Commande</span>
            </div>
            <div className="flex-1 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'payment' ? 'bg-primary text-primary-foreground' : step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                {step === 'confirmation' ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className="hidden sm:inline text-sm font-medium">Paiement</span>
            </div>
            <div className="flex-1 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === 'confirmation' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                3
              </div>
              <span className="hidden sm:inline text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Info - Only show on form step */}
      {step === 'form' && (
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
      )}

      <section className="py-10 sm:py-16 lg:py-24">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Step 1: Order Form */}
            {step === 'form' && (
              <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-soft">
                    <h2 className="text-xl sm:text-2xl font-heading font-bold mb-6 sm:mb-8">Commander une traduction</h2>
                    
                    <form onSubmit={handleFormSubmit} className="space-y-6">
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
                                {sourceLanguages
                                  .filter((lang) => lang.value !== formData.targetLanguage)
                                  .map((lang) => (
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
                                {targetLanguages
                                  .filter((lang) => lang.value !== formData.sourceLanguage)
                                  .map((lang) => (
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
                            Continuer vers le paiement
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
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-soft">
                  <div className="flex items-center gap-3 mb-6">
                    <Button variant="outline" size="icon" onClick={() => setStep('form')}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold">Paiement Mobile Money</h2>
                  </div>

                  {/* Amount to pay */}
                  <div className="bg-primary/5 rounded-xl p-4 mb-6 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Montant à payer</p>
                    <p className="text-3xl font-heading font-bold text-primary">{totalPrice.toLocaleString()} FCFA</p>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      <Label>Choisissez votre mode de paiement *</Label>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {/* Wave */}
                        <div
                          onClick={() => setPaymentData(prev => ({ ...prev, method: 'wave' }))}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentData.method === 'wave' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-full h-12 flex items-center justify-center">
                              <img src={waveLogo} alt="Wave" className="h-10 w-auto object-contain" />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">Paiement instantané</p>
                          </div>
                          {paymentData.method === 'wave' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>

                        {/* Orange Money */}
                        <div
                          onClick={() => setPaymentData(prev => ({ ...prev, method: 'orange_money' }))}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentData.method === 'orange_money' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-full h-12 flex items-center justify-center">
                              <img src={orangeMoneyLogo} alt="Orange Money" className="h-10 w-auto object-contain" />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">Paiement sécurisé</p>
                          </div>
                          {paymentData.method === 'orange_money' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>

                        {/* MTN Money */}
                        <div
                          onClick={() => setPaymentData(prev => ({ ...prev, method: 'moov_money' }))}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentData.method === 'moov_money' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-full h-12 flex items-center justify-center">
                              <img src={mtnMoneyLogo} alt="MTN Money" className="h-10 w-auto object-contain" />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">Paiement rapide</p>
                          </div>
                          {paymentData.method === 'moov_money' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Instructions */}
                    {paymentData.method && (
                      <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                        <h4 className="font-heading font-semibold">Instructions de paiement</h4>
                        
                        {/* Wave - Direct Payment Link */}
                        {paymentData.method === 'wave' && (
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              Cliquez sur le bouton ci-dessous pour payer directement via Wave Business :
                            </p>
                            <a
                              href={`${PAYMENT_INFO.wave.link}?amount=${totalPrice}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <Button type="button" className="w-full bg-[#1DC3EB] hover:bg-[#1DC3EB]/90">
                                <img src={waveLogo} alt="Wave" className="w-6 h-6 mr-2 object-contain" />
                                Payer {totalPrice.toLocaleString()} FCFA via Wave
                              </Button>
                            </a>
                            <p className="text-xs text-muted-foreground text-center">
                              Après paiement, notez la référence de transaction et entrez-la ci-dessous.
                            </p>
                          </div>
                        )}

                        {/* Orange Money - Manual */}
                        {paymentData.method === 'orange_money' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                              <div>
                                <p className="text-xs text-muted-foreground">Numéro à envoyer</p>
                                <p className="font-bold">{PAYMENT_INFO.orangeMoney.number}</p>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(PAYMENT_INFO.orangeMoney.number)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="p-3 bg-card rounded-lg">
                              <p className="text-xs text-muted-foreground">Nom du bénéficiaire</p>
                              <p className="font-bold">{PAYMENT_INFO.orangeMoney.name}</p>
                            </div>

                            <div className="p-3 bg-card rounded-lg">
                              <p className="text-xs text-muted-foreground">Montant exact</p>
                              <p className="font-bold text-primary">{totalPrice.toLocaleString()} FCFA</p>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              <p className="font-medium mb-2">Étapes :</p>
                              <ol className="list-decimal list-inside space-y-1">
                                <li>Ouvrez votre application Orange Money</li>
                                <li>Envoyez {totalPrice.toLocaleString()} FCFA au numéro ci-dessus</li>
                                <li>Notez la référence de transaction</li>
                                <li>Entrez la référence ci-dessous</li>
                              </ol>
                            </div>
                          </div>
                        )}

                        {/* Moov Money - Manual */}
                        {paymentData.method === 'moov_money' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                              <div>
                                <p className="text-xs text-muted-foreground">Numéro à envoyer</p>
                                <p className="font-bold">{PAYMENT_INFO.moovMoney.number}</p>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(PAYMENT_INFO.moovMoney.number)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="p-3 bg-card rounded-lg">
                              <p className="text-xs text-muted-foreground">Nom du bénéficiaire</p>
                              <p className="font-bold">{PAYMENT_INFO.moovMoney.name}</p>
                            </div>

                            <div className="p-3 bg-card rounded-lg">
                              <p className="text-xs text-muted-foreground">Montant exact</p>
                              <p className="font-bold text-primary">{totalPrice.toLocaleString()} FCFA</p>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              <p className="font-medium mb-2">Étapes :</p>
                              <ol className="list-decimal list-inside space-y-1">
                                <li>Ouvrez votre application Moov Money</li>
                                <li>Envoyez {totalPrice.toLocaleString()} FCFA au numéro ci-dessus</li>
                                <li>Notez la référence de transaction</li>
                                <li>Entrez la référence ci-dessous</li>
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Transaction Reference */}
                    <div className="space-y-2">
                      <Label htmlFor="reference">Référence de transaction *</Label>
                      <Input
                        id="reference"
                        placeholder="Ex: TXN123456789"
                        value={paymentData.reference}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Entrez la référence reçue après votre paiement
                      </p>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !paymentData.method}>
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          Confirmer le paiement
                          <CheckCircle className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 'confirmation' && (
              <div className="max-w-lg mx-auto text-center">
                <div className="bg-card rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-soft">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4">
                    Commande confirmée !
                  </h2>
                  
                  <p className="text-muted-foreground mb-6">
                    Merci pour votre commande. Nous allons vérifier votre paiement et commencer la traduction.
                  </p>

                  <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
                    <h4 className="font-heading font-semibold mb-3">Récapitulatif</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Montant payé</span>
                        <span className="font-semibold">{totalPrice.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mode de paiement</span>
                        <span className="font-semibold">
                          {paymentData.method === 'wave' ? 'Wave' : paymentData.method === 'orange_money' ? 'Orange Money' : 'Moov Money'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Délai de livraison</span>
                        <span className="font-semibold">{getDeliveryTime(formData.pages)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-muted-foreground mb-8">
                    <p>📧 Vous recevrez un email de confirmation</p>
                    <p>📱 Nous vous contacterons via WhatsApp</p>
                  </div>

                  <Button onClick={resetForm} variant="outline" size="lg">
                    Nouvelle commande
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Traduction;
