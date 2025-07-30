import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Bonjour ! Je suis votre assistant IA GhostWorker. Comment puis-je vous aider à automatiser vos tâches aujourd'hui ?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour utiliser l'assistant IA.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: input.trim(),
          context: messages.slice(-5) // Send last 5 messages for context
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-ghost">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Assistant IA GhostWorker</h1>
              <p className="text-muted-foreground">Automatisez vos tâches avec l'intelligence artificielle</p>
            </div>
          </div>
          
          {user && (
            <Badge variant="outline" className="bg-ghost-secondary/20 text-ghost-secondary border-ghost-secondary/30">
              <Zap className="w-3 h-3 mr-1" />
              Connecté en tant que {user.user_metadata?.name || user.email}
            </Badge>
          )}
        </div>

        {/* Chat Interface */}
        <Card className="border border-ghost-gray/30 shadow-ghost">
          <CardHeader className="border-b border-ghost-gray/20">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-ghost-primary" />
              Chat IA
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-ghost flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-ghost-primary text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-ghost-gray flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-ghost-light" />
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-ghost flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">L'IA réfléchit...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-ghost-gray/20 p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-ghost hover:opacity-90 transition-opacity"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {!user && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Connectez-vous pour utiliser l'assistant IA
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-ghost-gray/30 hover:border-ghost-primary/50 transition-colors cursor-pointer"
                onClick={() => setInput("Aide-moi à automatiser l'envoi d'emails")}>
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold mb-2">Automatisation Email</h3>
              <p className="text-sm text-muted-foreground">Configurez l'envoi automatique d'emails</p>
            </CardContent>
          </Card>
          
          <Card className="border border-ghost-gray/30 hover:border-ghost-primary/50 transition-colors cursor-pointer"
                onClick={() => setInput("Comment automatiser mes réseaux sociaux ?")}>
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold mb-2">Réseaux Sociaux</h3>
              <p className="text-sm text-muted-foreground">Automatisez vos publications sociales</p>
            </CardContent>
          </Card>
          
          <Card className="border border-ghost-gray/30 hover:border-ghost-primary/50 transition-colors cursor-pointer"
                onClick={() => setInput("Aide-moi à créer un workflow personnalisé")}>
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold mb-2">Workflow Personnalisé</h3>
              <p className="text-sm text-muted-foreground">Créez vos propres automatisations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChat;