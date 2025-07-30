import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Globe, Settings, Copy, ExternalLink, Key, Webhook } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Integration {
  id: string;
  platform_name: string;
  platform_type: string;
  config: any;
  is_active: boolean;
  last_sync: string;
  created_at: string;
}

interface IntegrationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
  integration?: Integration;
  onSave: (platformName: string, platformType: string, config: any) => void;
}

const IntegrationConfigModal = ({ 
  isOpen, 
  onClose, 
  platform, 
  integration, 
  onSave 
}: IntegrationConfigModalProps) => {
  const [config, setConfig] = useState(integration?.config || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const platformConfigs = {
    zapier: {
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      title: "Configuration Zapier",
      description: "Connectez vos Zaps pour automatiser vos workflows",
      type: "webhook",
      fields: [
        {
          key: "webhook_url",
          label: "URL du Webhook",
          type: "text",
          placeholder: "https://hooks.zapier.com/hooks/catch/...",
          required: true,
          description: "URL du webhook fournie par Zapier"
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Décrivez ce que fait cette intégration...",
          required: false
        }
      ]
    },
    salesforce: {
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      title: "Configuration Salesforce",
      description: "Synchronisez vos leads et opportunités",
      type: "api",
      fields: [
        {
          key: "instance_url",
          label: "URL de l'instance",
          type: "text",
          placeholder: "https://votre-domaine.salesforce.com",
          required: true
        },
        {
          key: "client_id",
          label: "Consumer Key",
          type: "text",
          placeholder: "Votre Consumer Key Salesforce",
          required: true
        },
        {
          key: "client_secret",
          label: "Consumer Secret",
          type: "password",
          placeholder: "Votre Consumer Secret",
          required: true
        },
        {
          key: "username",
          label: "Nom d'utilisateur",
          type: "text",
          placeholder: "votre.email@entreprise.com",
          required: true
        }
      ]
    },
    make: {
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      title: "Configuration Make.com",
      description: "Automatisez vos scénarios complexes",
      type: "webhook",
      fields: [
        {
          key: "webhook_url",
          label: "URL du Webhook",
          type: "text",
          placeholder: "https://hook.eu1.make.com/...",
          required: true
        },
        {
          key: "api_key",
          label: "Clé API (optionnelle)",
          type: "password",
          placeholder: "Votre clé API Make",
          required: false
        },
        {
          key: "scenario_name",
          label: "Nom du scénario",
          type: "text",
          placeholder: "Email Automation",
          required: false
        }
      ]
    }
  };

  const platformConfig = platformConfigs[platform as keyof typeof platformConfigs];
  const Icon = platformConfig.icon;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validation des champs requis
      const requiredFields = platformConfig.fields.filter(field => field.required);
      for (const field of requiredFields) {
        if (!config[field.key]) {
          toast({
            title: "Champ requis manquant",
            description: `Le champ "${field.label}" est requis.`,
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      await onSave(platform, platformConfig.type, config);
      onClose();
      toast({
        title: "Configuration sauvegardée",
        description: `L'intégration ${platform} a été configurée avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le texte a été copié dans le presse-papiers."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${platformConfig.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${platformConfig.color}`} />
            </div>
            <div>
              <DialogTitle>{platformConfig.title}</DialogTitle>
              <DialogDescription>{platformConfig.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions spécifiques à la plateforme */}
          {platform === 'zapier' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Webhook className="w-4 h-4" />
                  Instructions Zapier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>1. Créez un nouveau Zap dans Zapier</p>
                  <p>2. Choisissez "Webhooks by Zapier" comme trigger</p>
                  <p>3. Sélectionnez "Catch Hook"</p>
                  <p>4. Copiez l'URL du webhook ci-dessous</p>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <code className="flex-1 text-xs">
                    {config.webhook_url || "Configurez votre webhook URL"}
                  </code>
                  {config.webhook_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(config.webhook_url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {platform === 'salesforce' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Key className="w-4 h-4" />
                  Configuration API Salesforce
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>1. Créez une "Connected App" dans Salesforce Setup</p>
                  <p>2. Activez "Enable OAuth Settings"</p>
                  <p>3. Ajoutez les scopes nécessaires (api, refresh_token)</p>
                  <p>4. Récupérez votre Consumer Key et Secret</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Guide Salesforce
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Formulaire de configuration */}
          <div className="space-y-4">
            {platformConfig.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    value={config[field.key] || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="min-h-[80px]"
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={config[field.key] || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                )}
                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Status et test */}
          {integration && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statut de l'intégration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Statut:</span>
                    <Badge variant={integration.is_active ? "default" : "secondary"}>
                      {integration.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <Switch
                    checked={integration.is_active}
                    onCheckedChange={(checked) => {
                      // Cette fonction serait connectée à la fonction de toggle
                      console.log('Toggle integration:', checked);
                    }}
                  />
                </div>
                {integration.last_sync && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Dernière synchronisation: {new Date(integration.last_sync).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationConfigModal;