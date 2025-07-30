import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Shield, Zap, Brain } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "Comment GhostWorker peut-il être 100% indétectable ?",
      answer: "GhostWorker utilise des techniques avancées d'imitation humaine : variations dans le style d'écriture, erreurs de frappe volontaires, délais de réponse réalistes, emojis personnalisés, et apprentissage de votre vocabulaire unique. L'IA s'adapte parfaitement à votre personnalité professionnelle."
    },
    {
      question: "Mes clients vont-ils découvrir que c'est une IA ?",
      answer: "Non, c'est notre garantie principale. GhostWorker imite parfaitement les patterns humains : il 'fait des pauses' dans ses réponses, utilise votre style personnel, et même simule des états comme 'je suis en réunion' ou 'je reviens de déjeuner'. En 6 mois de tests, aucun client n'a détecté l'automatisation."
    },
    {
      question: "Comment ça marche techniquement ?",
      answer: "GhostWorker se connecte à votre email (Gmail/Outlook) via OAuth sécurisé. Il analyse les demandes entrantes, génère des réponses avec GPT-4 fine-tuné sur votre style, et envoie automatiquement avec votre signature. Vous gardez un contrôle total via le dashboard."
    },
    {
      question: "Que se passe-t-il si l'IA fait une erreur ?",
      answer: "Système de sécurité à 3 niveaux : 1) Validation automatique des réponses, 2) Notification instantanée pour révision, 3) Mode 'brouillon' pour validation manuelle. Vous pouvez aussi définir des sujets sensibles qui nécessitent votre approbation systématique."
    },
    {
      question: "Est-ce légal et éthique ?",
      answer: "Totalement légal ! GhostWorker est un outil d'aide à la productivité, comme un assistant virtuel. Vous restez responsable des engagements pris. C'est comme avoir un secrétaire qui rédige vos emails selon vos instructions. De nombreuses entreprises utilisent déjà des chatbots, nous sommes juste plus sophistiqués."
    },
    {
      question: "Combien de temps pour configurer GhostWorker ?",
      answer: "Installation complète en moins de 10 minutes : 1) Connexion de votre email (2 min), 2) Configuration de votre style d'écriture (5 min), 3) Paramétrage des réponses automatiques (3 min). L'IA apprend ensuite de vos emails existants pour affiner son style."
    },
    {
      question: "Quel ROI puis-je espérer ?",
      answer: "En moyenne : 15-20h économisées par semaine, +40% de réactivité client, +30% de taux de conversion. Le coût de GhostWorker se rembourse généralement en moins d'une semaine grâce aux nouveaux clients acquis par votre 'réactivité exceptionnelle'."
    },
    {
      question: "GhostWorker fonctionne-t-il dans mon secteur ?",
      answer: "Oui, GhostWorker s'adapte à tous les secteurs : développement, design, marketing, coaching, photographie, consulting, etc. L'IA apprend le vocabulaire technique de votre domaine et s'adapte aux codes de votre profession."
    },
    {
      question: "Puis-je l'utiliser pour plusieurs entreprises ?",
      answer: "Absolument ! Le plan Agency permet de gérer plusieurs identités : votre entreprise personnelle, vos collaborateurs, ou même différents secteurs d'activité. Chaque 'ghost' a sa propre personnalité et son style unique."
    },
    {
      question: "Que se passe-t-il si j'annule mon abonnement ?",
      answer: "Aucun engagement ! Vous pouvez annuler en 1 clic. Vos données restent accessibles 30 jours pour export. GhostWorker cesse simplement de répondre automatiquement. Vos emails et configurations peuvent être exportés à tout moment."
    },
    {
      question: "Comment mes données sont-elles protégées ?",
      answer: "Sécurité bancaire : chiffrement AES-256, serveurs européens conformes RGPD, connexions OAuth (pas de stockage de mots de passe), audits de sécurité réguliers. Vos emails ne sont jamais stockés en permanence, seulement analysés pour la réponse puis supprimés."
    },
    {
      question: "GhostWorker peut-il gérer les appels téléphoniques ?",
      answer: "Pas encore, mais c'est prévu pour 2025 ! Pour l'instant, GhostWorker gère emails, devis, relances et reporting. La version 'Ghost Voice' pour les appels automatiques est en développement."
    }
  ];

  return (
    <section className="py-24 bg-background" id="faq">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-ghost-primary/20 text-ghost-primary border-ghost-primary/30 mb-4">
            <HelpCircle className="w-3 h-3 mr-1" />
            Questions Fréquentes
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Tout savoir sur <span className="text-ghost-primary">GhostWorker</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez comment GhostWorker révolutionne votre business et répond à toutes vos interrogations
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="bg-ghost-primary/10 text-ghost-primary border-ghost-primary/30">
              <Brain className="w-3 h-3 mr-1" />
              Fonctionnement
            </Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              <Shield className="w-3 h-3 mr-1" />
              Sécurité & Légal
            </Badge>
            <Badge variant="outline" className="bg-ghost-secondary/10 text-ghost-secondary border-ghost-secondary/30">
              <Zap className="w-3 h-3 mr-1" />
              Performance & ROI
            </Badge>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-ghost-gray/30 bg-card/50 backdrop-blur-sm rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:text-ghost-primary transition-colors">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-ghost p-8 rounded-2xl text-primary-foreground max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Une question non résolue ?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Notre équipe support répond en moins de 2h (promis, c'est un humain, pas une IA ! 😉)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                📧 support@ghostworker.fr
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                💬 Chat en direct 24/7
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;