import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Send, Mail, MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les 2 heures. Merci pour votre intérêt ! 🚀",
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@ghostworker.fr",
      description: "Réponse sous 2h en moyenne"
    },
    {
      icon: MessageCircle,
      title: "Chat Live",
      value: "Disponible 24/7",
      description: "Support technique instantané"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+33 1 23 45 67 89",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "Paris, France",
      description: "Équipe 100% française"
    }
  ];

  const quickActions = [
    { label: "Demande de démo", value: "Démonstration personnalisée" },
    { label: "Question technique", value: "Support technique" },
    { label: "Partenariat", value: "Opportunité de partenariat" },
    { label: "Presse", value: "Demande presse/média" }
  ];

  return (
    <section className="py-24 bg-gradient-dark" id="contact">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 mb-4">
            <Send className="w-3 h-3 mr-1" />
            Nous Contacter
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Parlons de votre <span className="text-accent">révolution business</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Questions, démonstration personnalisée, ou simplement envie de discuter ? 
            Notre équipe d'experts GhostWorker est là pour vous accompagner.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-ghost-gray/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Support Réactif
                </CardTitle>
                <CardDescription>
                  Notre équipe vous répond rapidement via votre canal préféré
                </CardDescription>
              </CardHeader>
            </Card>

            {contactInfo.map((info, index) => (
              <Card key={index} className="border-ghost-gray/50 bg-card/50 backdrop-blur-sm hover:shadow-ghost transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-ghost-primary/20 rounded-full flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-ghost-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      <p className="text-foreground font-medium">{info.value}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Stats */}
            <Card className="border-accent/30 bg-accent/10">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold mb-4">Nos engagements</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Temps de réponse</span>
                    <span className="font-semibold text-accent">{"< 2h"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfaction client</span>
                    <span className="font-semibold text-accent">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Support français</span>
                    <span className="font-semibold text-accent">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-ghost-gray/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Envoyer un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="De quoi souhaitez-vous parler ?"
                      required
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, subject: action.value }))}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre projet, vos besoins ou vos questions..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="w-5 h-5 mr-2 animate-pulse" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    En envoyant ce formulaire, vous acceptez notre politique de confidentialité. 
                    Vos données ne seront jamais partagées avec des tiers.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-ghost text-primary-foreground max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Préférez une démonstration en direct ?
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Réservez un créneau de 15 minutes avec notre équipe pour une démo personnalisée de GhostWorker
              </p>
              <Button variant="outline" size="lg" className="bg-white text-ghost-primary hover:bg-white/90">
                Réserver une démo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;