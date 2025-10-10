/**
 * Chatbot Service
 * Handles communication with n8n RAG chatbot
 */

import { supabase } from '@/integrations/supabase/client';

class ChatbotService {
  constructor() {
    this.n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    this.apiKey = import.meta.env.VITE_N8N_API_KEY;
  }

  /**
   * Send message to n8n chatbot and get response
   */
  async sendMessage(message, context = {}) {
    try {
      const payload = {
        message,
        context: {
          ...context,
          userId: context.userId,
          sessionId: context.sessionId || this.generateSessionId(),
          timestamp: new Date().toISOString(),
        }
      };

      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Chatbot API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store conversation in Supabase
      await this.storeChatMessage(payload.context.sessionId, message, data.response, context.userId);
      
      return data;
    } catch (error) {
      console.error('Chatbot service error:', error);
      throw error;
    }
  }

  /**
   * Get country-specific context for RAG
   */
  async getCountryContext(countryCode) {
    try {
      // Fetch country data from your existing services
      const { data: countryData, error } = await supabase
        .from('countries')
        .select('*')
        .eq('code', countryCode)
        .single();

      if (error) throw error;

      return {
        country: countryData,
        type: 'country_context',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching country context:', error);
      return null;
    }
  }

  /**
   * Get user's wishlist context for personalized responses
   */
  async getUserWishlistContext(userId) {
    try {
      const { data: wishlist, error } = await supabase
        .from('wishlists')
        .select('country_code, country_name, added_at')
        .eq('user_id', userId);

      if (error) throw error;

      return {
        wishlist,
        type: 'user_wishlist',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching wishlist context:', error);
      return null;
    }
  }

  /**
   * Store chat conversation in database
   */
  async storeChatMessage(sessionId, userMessage, botResponse, userId = null) {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .insert({
          session_id: sessionId,
          user_id: userId,
          user_message: userMessage,
          bot_response: botResponse,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing chat message:', error);
    }
  }

  /**
   * Get chat history for context
   */
  async getChatHistory(sessionId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send country data to n8n for RAG indexing
   */
  async indexCountryData(countryData) {
    try {
      const indexingUrl = `${this.n8nWebhookUrl}/index`;
      
      const response = await fetch(indexingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          type: 'country_data',
          data: countryData,
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error indexing country data:', error);
      return false;
    }
  }
}

export const chatbotService = new ChatbotService();
export default ChatbotService;
