import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  clientName: string;
  clientEmail: string;
  documentTypes: string[];
  sourceLanguage: string;
  targetLanguage: string;
  numberOfPages: number;
  totalPrice: number;
  deliveryTime: string;
  paymentMethod: string;
  paymentReference: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-order-confirmation function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      orderId,
      clientName,
      clientEmail,
      documentTypes,
      sourceLanguage,
      targetLanguage,
      numberOfPages,
      totalPrice,
      deliveryTime,
      paymentMethod,
      paymentReference,
    }: OrderConfirmationRequest = await req.json();

    console.log(`Sending confirmation email to ${clientEmail} for order ${orderId}`);

    const paymentMethodLabel = {
      wave: "Wave",
      orange_money: "Orange Money",
      moov_money: "Moov Money",
    }[paymentMethod] || paymentMethod;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #f97316 0%, #14b8a6 100%); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
            .content { padding: 30px; }
            .success-badge { background-color: #10b981; color: white; padding: 12px 24px; border-radius: 30px; display: inline-block; font-weight: bold; margin-bottom: 20px; }
            .order-details { background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .order-details h3 { margin-top: 0; color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { color: #64748b; }
            .detail-value { font-weight: 600; color: #1e293b; }
            .total-row { background-color: #f97316; color: white; padding: 15px; border-radius: 8px; margin-top: 15px; }
            .total-row .detail-label, .total-row .detail-value { color: white; }
            .footer { background-color: #1e293b; color: white; padding: 30px; text-align: center; }
            .footer a { color: #14b8a6; text-decoration: none; }
            .whatsapp-btn { display: inline-block; background-color: #25d366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SPEAK ENGLISH CI</h1>
              <p>Service de Traduction Certifiée</p>
            </div>
            
            <div class="content">
              <div style="text-align: center;">
                <span class="success-badge">✓ Commande Confirmée</span>
              </div>
              
              <h2 style="text-align: center; color: #1e293b;">Bonjour ${clientName} !</h2>
              
              <p style="text-align: center; color: #64748b;">
                Votre commande de traduction a été reçue avec succès. Voici le récapitulatif de votre commande :
              </p>
              
              <div class="order-details">
                <h3>📋 Détails de la commande</h3>
                
                <div class="detail-row">
                  <span class="detail-label">Numéro de commande</span>
                  <span class="detail-value">${orderId.slice(0, 8).toUpperCase()}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Type(s) de document</span>
                  <span class="detail-value">${documentTypes.join(", ")}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Traduction</span>
                  <span class="detail-value">${sourceLanguage} → ${targetLanguage}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Nombre de pages</span>
                  <span class="detail-value">${numberOfPages} page(s)</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Délai de livraison</span>
                  <span class="detail-value">${deliveryTime}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Mode de paiement</span>
                  <span class="detail-value">${paymentMethodLabel}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Référence de paiement</span>
                  <span class="detail-value">${paymentReference}</span>
                </div>
                
                <div class="total-row">
                  <div class="detail-row" style="border: none; padding: 0;">
                    <span class="detail-label" style="font-size: 18px;">Total payé</span>
                    <span class="detail-value" style="font-size: 20px;">${totalPrice.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #64748b;">
                  📧 Vous recevrez votre document traduit par email et WhatsApp dès qu'il sera prêt.
                </p>
                
                <p style="color: #64748b;">
                  Des questions ? Contactez-nous sur WhatsApp :
                </p>
                
                <a href="https://wa.me/2250797721270" class="whatsapp-btn">
                  💬 Nous contacter sur WhatsApp
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>SPEAK ENGLISH CI</strong></p>
              <p>Service de Traduction Certifiée & Coaching en Anglais</p>
              <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "SPEAK ENGLISH CI <onboarding@resend.dev>",
      to: [clientEmail],
      subject: `✓ Confirmation de votre commande de traduction #${orderId.slice(0, 8).toUpperCase()}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
