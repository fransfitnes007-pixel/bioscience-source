export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      abandoned_checkouts: {
        Row: {
          abandoned_at: string
          cart_items: Json
          created_at: string
          customer_name: string | null
          email: string | null
          id: string
          recovered: boolean
          recovered_order_id: string | null
          recovery_email_sent: boolean
          recovery_email_sent_at: string | null
          subtotal: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          abandoned_at?: string
          cart_items?: Json
          created_at?: string
          customer_name?: string | null
          email?: string | null
          id?: string
          recovered?: boolean
          recovered_order_id?: string | null
          recovery_email_sent?: boolean
          recovery_email_sent_at?: string | null
          subtotal?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          abandoned_at?: string
          cart_items?: Json
          created_at?: string
          customer_name?: string | null
          email?: string | null
          id?: string
          recovered?: boolean
          recovered_order_id?: string | null
          recovery_email_sent?: boolean
          recovery_email_sent_at?: string | null
          subtotal?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      affiliate_earnings: {
        Row: {
          affiliate_id: string
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          order_id: string | null
          order_number: string | null
          order_total: number
          paid_at: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          commission_rate: number
          created_at?: string
          id?: string
          order_id?: string | null
          order_number?: string | null
          order_total?: number
          paid_at?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          order_id?: string | null
          order_number?: string | null
          order_total?: number
          paid_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_earnings_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_earnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_earnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "supplier_order_view"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          commission_rate: number
          created_at: string
          discount_code: string | null
          email: string
          id: string
          instagram: string | null
          is_active: boolean
          name: string
          notes: string | null
          phone: string | null
          sport: string | null
          tiktok: string | null
          total_earnings: number
          total_orders: number
          updated_at: string
          youtube: string | null
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          discount_code?: string | null
          email: string
          id?: string
          instagram?: string | null
          is_active?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          sport?: string | null
          tiktok?: string | null
          total_earnings?: number
          total_orders?: number
          updated_at?: string
          youtube?: string | null
        }
        Update: {
          commission_rate?: number
          created_at?: string
          discount_code?: string | null
          email?: string
          id?: string
          instagram?: string | null
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          sport?: string | null
          tiktok?: string | null
          total_earnings?: number
          total_orders?: number
          updated_at?: string
          youtube?: string | null
        }
        Relationships: []
      }
      analytics_daily: {
        Row: {
          applications_submitted: number | null
          avg_session_duration: number | null
          bounce_rate: number | null
          created_at: string
          date: string
          id: string
          inquiries_submitted: number | null
          page_views: number | null
          product_views: number | null
          sessions: number | null
          top_pages: Json | null
          top_products: Json | null
          total_visitors: number | null
          traffic_sources: Json | null
          unique_visitors: number | null
          updated_at: string
        }
        Insert: {
          applications_submitted?: number | null
          avg_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string
          date: string
          id?: string
          inquiries_submitted?: number | null
          page_views?: number | null
          product_views?: number | null
          sessions?: number | null
          top_pages?: Json | null
          top_products?: Json | null
          total_visitors?: number | null
          traffic_sources?: Json | null
          unique_visitors?: number | null
          updated_at?: string
        }
        Update: {
          applications_submitted?: number | null
          avg_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string
          date?: string
          id?: string
          inquiries_submitted?: number | null
          page_views?: number | null
          product_views?: number | null
          sessions?: number | null
          top_pages?: Json | null
          top_products?: Json | null
          total_visitors?: number | null
          traffic_sources?: Json | null
          unique_visitors?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          page_path: string | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_path?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_path?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          business_address: string | null
          business_name: string
          business_type: string | null
          city: string | null
          company_impact: string | null
          company_logo_url: string | null
          contact_name: string
          country: string | null
          created_at: string
          document_url: string | null
          email: string
          how_we_benefit: string | null
          id: string
          intended_use: string | null
          monthly_volume: string | null
          notes: string | null
          phone: string | null
          product_usage: string | null
          products_interest: string | null
          referral_source: string | null
          reviewed_at: string | null
          state: string | null
          status: Database["public"]["Enums"]["user_status"]
          user_id: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          business_address?: string | null
          business_name: string
          business_type?: string | null
          city?: string | null
          company_impact?: string | null
          company_logo_url?: string | null
          contact_name: string
          country?: string | null
          created_at?: string
          document_url?: string | null
          email: string
          how_we_benefit?: string | null
          id?: string
          intended_use?: string | null
          monthly_volume?: string | null
          notes?: string | null
          phone?: string | null
          product_usage?: string | null
          products_interest?: string | null
          referral_source?: string | null
          reviewed_at?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          user_id?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          business_address?: string | null
          business_name?: string
          business_type?: string | null
          city?: string | null
          company_impact?: string | null
          company_logo_url?: string | null
          contact_name?: string
          country?: string | null
          created_at?: string
          document_url?: string | null
          email?: string
          how_we_benefit?: string | null
          id?: string
          intended_use?: string | null
          monthly_volume?: string | null
          notes?: string | null
          phone?: string | null
          product_usage?: string | null
          products_interest?: string | null
          referral_source?: string | null
          reviewed_at?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          user_id?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string | null
          content: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          id: string
          name: string
          starts_at: string | null
          status: string
          total_orders: number
          total_sales: number
          total_sessions: number
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          name: string
          starts_at?: string | null
          status?: string
          total_orders?: number
          total_sales?: number
          total_sessions?: number
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          name?: string
          starts_at?: string | null
          status?: string
          total_orders?: number
          total_sales?: number
          total_sessions?: number
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          product_id: string | null
          product_name: string | null
          quantity: number
          unit_price: number | null
          updated_at: string
          user_id: string
          variation_id: string | null
          variation_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number
          unit_price?: number | null
          updated_at?: string
          user_id: string
          variation_id?: string | null
          variation_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number
          unit_price?: number | null
          updated_at?: string
          user_id?: string
          variation_id?: string | null
          variation_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "product_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_messages: {
        Row: {
          client_id: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          read_at: string | null
          sender_type: string
          sender_user_id: string
        }
        Insert: {
          client_id: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          read_at?: string | null
          sender_type: string
          sender_user_id: string
        }
        Update: {
          client_id?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          read_at?: string | null
          sender_type?: string
          sender_user_id?: string
        }
        Relationships: []
      }
      coa_documents: {
        Row: {
          created_at: string
          file_url: string
          id: string
          is_public: boolean | null
          title: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          is_public?: boolean | null
          title: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          is_public?: boolean | null
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          notes: string | null
          phone: string | null
          responded_at: string | null
          responded_by: string | null
          session_id: string | null
          source_page: string | null
          status: string
          subject: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          session_id?: string | null
          source_page?: string | null
          status?: string
          subject?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          session_id?: string | null
          source_page?: string | null
          status?: string
          subject?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      customer_segments: {
        Row: {
          created_at: string
          created_by: string | null
          customer_count: number
          customer_percentage: number
          description: string | null
          filter_rules: Json
          id: string
          is_template: boolean
          name: string
          template_category: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_count?: number
          customer_percentage?: number
          description?: string | null
          filter_rules?: Json
          id?: string
          is_template?: boolean
          name: string
          template_category?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_count?: number
          customer_percentage?: number
          description?: string | null
          filter_rules?: Json
          id?: string
          is_template?: boolean
          name?: string
          template_category?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      deal_tiers: {
        Row: {
          celebration_text: string
          created_at: string
          id: string
          is_active: boolean | null
          min_spend: number
          name: string
          reward_description: string
          reward_product_id: string | null
          reward_type: string
          reward_value: number | null
          tier_number: number
          updated_at: string
        }
        Insert: {
          celebration_text?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          min_spend: number
          name: string
          reward_description: string
          reward_product_id?: string | null
          reward_type: string
          reward_value?: number | null
          tier_number: number
          updated_at?: string
        }
        Update: {
          celebration_text?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          min_spend?: number
          name?: string
          reward_description?: string
          reward_product_id?: string | null
          reward_type?: string
          reward_value?: number | null
          tier_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_tiers_reward_product_id_fkey"
            columns: ["reward_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          affiliate_id: string | null
          applies_to: string
          code: string
          combine_with_order_discounts: boolean | null
          combine_with_product_discounts: boolean | null
          combine_with_shipping_discounts: boolean | null
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          is_affiliate: boolean
          max_uses: number | null
          max_uses_per_customer: number | null
          method: string
          minimum_purchase_amount: number | null
          minimum_quantity: number | null
          starts_at: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          affiliate_id?: string | null
          applies_to?: string
          code: string
          combine_with_order_discounts?: boolean | null
          combine_with_product_discounts?: boolean | null
          combine_with_shipping_discounts?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          is_affiliate?: boolean
          max_uses?: number | null
          max_uses_per_customer?: number | null
          method?: string
          minimum_purchase_amount?: number | null
          minimum_quantity?: number | null
          starts_at?: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          affiliate_id?: string | null
          applies_to?: string
          code?: string
          combine_with_order_discounts?: boolean | null
          combine_with_product_discounts?: boolean | null
          combine_with_shipping_discounts?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          is_affiliate?: boolean
          max_uses?: number | null
          max_uses_per_customer?: number | null
          method?: string
          minimum_purchase_amount?: number | null
          minimum_quantity?: number | null
          starts_at?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "discounts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      draft_order_items: {
        Row: {
          created_at: string
          draft_order_id: string
          id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variation_id: string | null
          variation_name: string | null
        }
        Insert: {
          created_at?: string
          draft_order_id: string
          id?: string
          product_id?: string | null
          product_name: string
          quantity?: number
          total_price: number
          unit_price: number
          variation_id?: string | null
          variation_name?: string | null
        }
        Update: {
          created_at?: string
          draft_order_id?: string
          id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          variation_id?: string | null
          variation_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "draft_order_items_draft_order_id_fkey"
            columns: ["draft_order_id"]
            isOneToOne: false
            referencedRelation: "draft_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      draft_orders: {
        Row: {
          billing_address: Json | null
          converted_order_id: string | null
          created_at: string
          created_by: string | null
          customer_email: string | null
          customer_name: string | null
          discount_amount: number | null
          draft_number: string
          id: string
          notes: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          status: string
          subtotal: number
          tax_amount: number | null
          total: number
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          converted_order_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          draft_number: string
          id?: string
          notes?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total?: number
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          converted_order_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          draft_number?: string
          id?: string
          notes?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "draft_orders_converted_order_id_fkey"
            columns: ["converted_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_orders_converted_order_id_fkey"
            columns: ["converted_order_id"]
            isOneToOne: false
            referencedRelation: "supplier_order_view"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          bounced_at: string | null
          clicked_at: string | null
          created_at: string
          email_type: string
          error_message: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          recipient_email: string
          recipient_name: string | null
          sent_at: string | null
          status: string
          subject: string | null
          template_id: string | null
        }
        Insert: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string
          email_type: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_id?: string | null
        }
        Update: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_id?: string | null
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          created_at: string
          error_message: string | null
          form_name: string
          form_type: string
          id: string
          page_url: string | null
          session_id: string | null
          submission_data: Json
          success: boolean | null
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          form_name: string
          form_type: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          submission_data?: Json
          success?: boolean | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          form_name?: string
          form_type?: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          submission_data?: Json
          success?: boolean | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          currency: string
          current_balance: number
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          expires_at: string | null
          id: string
          initial_value: number
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          currency?: string
          current_balance?: number
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          expires_at?: string | null
          id?: string
          initial_value?: number
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          current_balance?: number
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          expires_at?: string | null
          id?: string
          initial_value?: number
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          business_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          product_id: string | null
          product_name: string
          quantity: number
          status: string
          user_id: string | null
          variation_id: string | null
          variation_name: string | null
        }
        Insert: {
          business_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          product_id?: string | null
          product_name: string
          quantity: number
          status?: string
          user_id?: string | null
          variation_id?: string | null
          variation_name?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          status?: string
          user_id?: string | null
          variation_id?: string | null
          variation_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "product_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          available: number
          committed: number
          id: string
          on_hand: number
          product_id: string | null
          sku: string | null
          unavailable: number
          updated_at: string
          variation_id: string
        }
        Insert: {
          available?: number
          committed?: number
          id?: string
          on_hand?: number
          product_id?: string | null
          sku?: string | null
          unavailable?: number
          updated_at?: string
          variation_id: string
        }
        Update: {
          available?: number
          committed?: number
          id?: string
          on_hand?: number
          product_id?: string | null
          sku?: string | null
          unavailable?: number
          updated_at?: string
          variation_id?: string
        }
        Relationships: []
      }
      media_files: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          height: number | null
          id: string
          mime_type: string | null
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string
          file_url: string
          height?: number | null
          id?: string
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      nav_menu_items: {
        Row: {
          created_at: string
          id: string
          menu_id: string
          parent_id: string | null
          sort_order: number
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          menu_id: string
          parent_id?: string | null
          sort_order?: number
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          menu_id?: string
          parent_id?: string | null
          sort_order?: number
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nav_menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "nav_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nav_menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nav_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      nav_menus: {
        Row: {
          created_at: string
          handle: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          handle: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          handle?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          order_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          order_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          order_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_activity_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_activity_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "supplier_order_view"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_fulfillment: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_item_id: string
          shipped_at: string | null
          shipping_carrier: string | null
          status: Database["public"]["Enums"]["fulfillment_status"]
          supplier_id: string
          tracking_number: string | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_item_id: string
          shipped_at?: string | null
          shipping_carrier?: string | null
          status?: Database["public"]["Enums"]["fulfillment_status"]
          supplier_id: string
          tracking_number?: string | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_item_id?: string
          shipped_at?: string | null
          shipping_carrier?: string | null
          status?: Database["public"]["Enums"]["fulfillment_status"]
          supplier_id?: string
          tracking_number?: string | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_fulfillment_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: true
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_fulfillment_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variation_id: string | null
          variation_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variation_id?: string | null
          variation_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          variation_id?: string | null
          variation_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "supplier_order_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "product_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_refunds: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          order_id: string
          reason: string | null
          refund_type: string
          refunded_by: string | null
          status: string
          stripe_refund_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          reason?: string | null
          refund_type?: string
          refunded_by?: string | null
          status?: string
          stripe_refund_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          reason?: string | null
          refund_type?: string
          refunded_by?: string | null
          status?: string
          stripe_refund_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "supplier_order_view"
            referencedColumns: ["id"]
          },
        ]
      }
      order_returns: {
        Row: {
          admin_notes: string | null
          created_at: string
          customer_notes: string | null
          id: string
          order_id: string
          reason: string | null
          received_at: string | null
          refund_id: string | null
          requested_at: string
          resolved_at: string | null
          return_number: string
          return_shipping_carrier: string | null
          return_tracking_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          customer_notes?: string | null
          id?: string
          order_id: string
          reason?: string | null
          received_at?: string | null
          refund_id?: string | null
          requested_at?: string
          resolved_at?: string | null
          return_number: string
          return_shipping_carrier?: string | null
          return_tracking_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          customer_notes?: string | null
          id?: string
          order_id?: string
          reason?: string | null
          received_at?: string | null
          refund_id?: string | null
          requested_at?: string
          resolved_at?: string | null
          return_number?: string
          return_shipping_carrier?: string | null
          return_tracking_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "supplier_order_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "order_refunds"
            referencedColumns: ["id"]
          },
        ]
      }
      order_shipments: {
        Row: {
          carrier: string | null
          created_at: string
          created_by: string | null
          delivered_at: string | null
          estimated_delivery: string | null
          id: string
          notes: string | null
          order_id: string
          shipment_number: string
          shipped_at: string | null
          shipping_cost: number | null
          status: string
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          created_by?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_id: string
          shipment_number: string
          shipped_at?: string | null
          shipping_cost?: number | null
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          carrier?: string | null
          created_at?: string
          created_by?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          shipment_number?: string
          shipped_at?: string | null
          shipping_cost?: number | null
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "supplier_order_view"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: string
          billing_address_2: string | null
          billing_city: string
          billing_company: string | null
          billing_country: string
          billing_email: string
          billing_first_name: string
          billing_last_name: string
          billing_phone: string | null
          billing_state: string | null
          billing_zip: string
          buyer_protection: boolean | null
          buyer_protection_cost: number | null
          created_at: string
          custom_labeling: boolean | null
          custom_labeling_cost: number | null
          custom_labeling_logo_url: string | null
          discount_amount: number | null
          discount_code: string | null
          discount_tier: string | null
          estimated_delivery_date: string | null
          fulfillment_carrier: string | null
          fulfillment_tracking_number: string | null
          id: string
          internal_notes: string | null
          notes: string | null
          order_number: string
          paid_at: string | null
          payment_status: string | null
          shipped_at: string | null
          shipping_address: string | null
          shipping_address_2: string | null
          shipping_city: string | null
          shipping_company: string | null
          shipping_cost: number | null
          shipping_country: string | null
          shipping_first_name: string | null
          shipping_last_name: string | null
          shipping_same_as_billing: boolean | null
          shipping_state: string | null
          shipping_zip: string | null
          status: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          subtotal: number
          tax_amount: number | null
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address: string
          billing_address_2?: string | null
          billing_city: string
          billing_company?: string | null
          billing_country: string
          billing_email: string
          billing_first_name: string
          billing_last_name: string
          billing_phone?: string | null
          billing_state?: string | null
          billing_zip: string
          buyer_protection?: boolean | null
          buyer_protection_cost?: number | null
          created_at?: string
          custom_labeling?: boolean | null
          custom_labeling_cost?: number | null
          custom_labeling_logo_url?: string | null
          discount_amount?: number | null
          discount_code?: string | null
          discount_tier?: string | null
          estimated_delivery_date?: string | null
          fulfillment_carrier?: string | null
          fulfillment_tracking_number?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number: string
          paid_at?: string | null
          payment_status?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_address_2?: string | null
          shipping_city?: string | null
          shipping_company?: string | null
          shipping_cost?: number | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_same_as_billing?: boolean | null
          shipping_state?: string | null
          shipping_zip?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal: number
          tax_amount?: number | null
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: string
          billing_address_2?: string | null
          billing_city?: string
          billing_company?: string | null
          billing_country?: string
          billing_email?: string
          billing_first_name?: string
          billing_last_name?: string
          billing_phone?: string | null
          billing_state?: string | null
          billing_zip?: string
          buyer_protection?: boolean | null
          buyer_protection_cost?: number | null
          created_at?: string
          custom_labeling?: boolean | null
          custom_labeling_cost?: number | null
          custom_labeling_logo_url?: string | null
          discount_amount?: number | null
          discount_code?: string | null
          discount_tier?: string | null
          estimated_delivery_date?: string | null
          fulfillment_carrier?: string | null
          fulfillment_tracking_number?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number?: string
          paid_at?: string | null
          payment_status?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_address_2?: string | null
          shipping_city?: string | null
          shipping_company?: string | null
          shipping_cost?: number | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_same_as_billing?: boolean | null
          shipping_state?: string | null
          shipping_zip?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          page_path: string
          page_title: string | null
          page_url: string
          referrer: string | null
          session_id: string | null
          time_on_page: number | null
          user_agent: string | null
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          page_path: string
          page_title?: string | null
          page_url: string
          referrer?: string | null
          session_id?: string | null
          time_on_page?: number | null
          user_agent?: string | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          page_path?: string
          page_title?: string | null
          page_url?: string
          referrer?: string | null
          session_id?: string | null
          time_on_page?: number | null
          user_agent?: string | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      product_variations: {
        Row: {
          created_at: string
          id: string
          moq: number
          price: number | null
          product_id: string
          sort_order: number | null
          strength: string
        }
        Insert: {
          created_at?: string
          id?: string
          moq?: number
          price?: number | null
          product_id: string
          sort_order?: number | null
          strength: string
        }
        Update: {
          created_at?: string
          id?: string
          moq?: number
          price?: number | null
          product_id?: string
          sort_order?: number | null
          strength?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_views: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          product_name: string
          session_id: string | null
          user_id: string | null
          variation_id: string | null
          variation_name: string | null
          view_duration: number | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name: string
          session_id?: string | null
          user_id?: string | null
          variation_id?: string | null
          variation_name?: string | null
          view_duration?: number | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name?: string
          session_id?: string | null
          user_id?: string | null
          variation_id?: string | null
          variation_name?: string | null
          view_duration?: number | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          coa_url: string | null
          created_at: string
          description: string | null
          display_name: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          nih_link: string | null
          scientific_purpose: string | null
          slug: string
          sort_order: number | null
          studies_findings: string | null
          updated_at: string
        }
        Insert: {
          category_id: string
          coa_url?: string | null
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          nih_link?: string | null
          scientific_purpose?: string | null
          slug: string
          sort_order?: number | null
          studies_findings?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          coa_url?: string | null
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          nih_link?: string | null
          scientific_purpose?: string | null
          slug?: string
          sort_order?: number | null
          studies_findings?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_email: string | null
          business_name: string | null
          company_logo_url: string | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          business_email?: string | null
          business_name?: string | null
          company_logo_url?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          business_email?: string | null
          business_name?: string | null
          company_logo_url?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          attempt_count: number
          blocked_until: string | null
          first_attempt_at: string
          id: string
          identifier: string
          last_attempt_at: string
        }
        Insert: {
          action: string
          attempt_count?: number
          blocked_until?: string | null
          first_attempt_at?: string
          id?: string
          identifier: string
          last_attempt_at?: string
        }
        Update: {
          action?: string
          attempt_count?: number
          blocked_until?: string | null
          first_attempt_at?: string
          id?: string
          identifier?: string
          last_attempt_at?: string
        }
        Relationships: []
      }
      refund_items: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_item_id: string
          quantity: number
          refund_id: string
          restock: boolean
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_item_id: string
          quantity?: number
          refund_id: string
          restock?: boolean
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_item_id?: string
          quantity?: number
          refund_id?: string
          restock?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "refund_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_items_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "order_refunds"
            referencedColumns: ["id"]
          },
        ]
      }
      return_items: {
        Row: {
          condition: string | null
          created_at: string
          id: string
          order_item_id: string
          quantity: number
          reason: string | null
          return_id: string
        }
        Insert: {
          condition?: string | null
          created_at?: string
          id?: string
          order_item_id: string
          quantity?: number
          reason?: string | null
          return_id: string
        }
        Update: {
          condition?: string | null
          created_at?: string
          id?: string
          order_item_id?: string
          quantity?: number
          reason?: string | null
          return_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "order_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      shipment_items: {
        Row: {
          created_at: string
          id: string
          order_item_id: string
          quantity: number
          shipment_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_item_id: string
          quantity?: number
          shipment_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_item_id?: string
          quantity?: number
          shipment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_items_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "order_shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      supplier_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          order_id: string
          sender_type: string
          sender_user_id: string
          supplier_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          order_id: string
          sender_type: string
          sender_user_id: string
          supplier_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          order_id?: string
          sender_type?: string
          sender_user_id?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "supplier_order_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_messages_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_order_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          id: string
          notes: string | null
          order_id: string
          supplier_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          id?: string
          notes?: string | null
          order_id: string
          supplier_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          id?: string
          notes?: string | null
          order_id?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_order_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_order_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "supplier_order_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_order_assignments_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          company_name: string
          contact_email: string
          contact_name: string
          created_at: string
          id: string
          is_active: boolean
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_email: string
          contact_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          device_type: string | null
          ended_at: string | null
          events_count: number | null
          first_page: string | null
          id: string
          ip_address: string | null
          last_page: string | null
          os: string | null
          page_views: number | null
          referrer: string | null
          session_id: string
          started_at: string
          user_agent: string | null
          user_id: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          ended_at?: string | null
          events_count?: number | null
          first_page?: string | null
          id?: string
          ip_address?: string | null
          last_page?: string | null
          os?: string | null
          page_views?: number | null
          referrer?: string | null
          session_id: string
          started_at?: string
          user_agent?: string | null
          user_id?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          ended_at?: string | null
          events_count?: number | null
          first_page?: string | null
          id?: string
          ip_address?: string | null
          last_page?: string | null
          os?: string | null
          page_views?: number | null
          referrer?: string | null
          session_id?: string
          started_at?: string
          user_agent?: string | null
          user_id?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          endpoint_url: string
          error_message: string | null
          id: string
          related_id: string | null
          related_table: string | null
          request_payload: Json | null
          response_payload: Json | null
          response_status: number | null
          retry_count: number | null
          success: boolean | null
          triggered_by: string | null
          webhook_type: string
        }
        Insert: {
          created_at?: string
          endpoint_url: string
          error_message?: string | null
          id?: string
          related_id?: string | null
          related_table?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          response_status?: number | null
          retry_count?: number | null
          success?: boolean | null
          triggered_by?: string | null
          webhook_type: string
        }
        Update: {
          created_at?: string
          endpoint_url?: string
          error_message?: string | null
          id?: string
          related_id?: string | null
          related_table?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          response_status?: number | null
          retry_count?: number | null
          success?: boolean | null
          triggered_by?: string | null
          webhook_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      supplier_order_view: {
        Row: {
          created_at: string | null
          estimated_delivery_date: string | null
          fulfillment_carrier: string | null
          fulfillment_tracking_number: string | null
          id: string | null
          notes: string | null
          order_number: string | null
          shipped_at: string | null
          shipping_address: string | null
          shipping_address_2: string | null
          shipping_city: string | null
          shipping_company: string | null
          shipping_country: string | null
          shipping_first_name: string | null
          shipping_last_name: string | null
          shipping_state: string | null
          shipping_zip: string | null
          status: string | null
          subtotal: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_delivery_date?: string | null
          fulfillment_carrier?: string | null
          fulfillment_tracking_number?: string | null
          id?: string | null
          notes?: string | null
          order_number?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_address_2?: string | null
          shipping_city?: string | null
          shipping_company?: string | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          status?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_delivery_date?: string | null
          fulfillment_carrier?: string | null
          fulfillment_tracking_number?: string | null
          id?: string | null
          notes?: string | null
          order_number?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_address_2?: string | null
          shipping_city?: string | null
          shipping_company?: string | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          status?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_all_customer_leads: {
        Args: never
        Returns: {
          business_address: string
          business_name: string
          business_type: string
          city: string
          company_impact: string
          country: string
          created_at: string
          email: string
          how_we_benefit: string
          id: string
          intended_use: string
          lead_type: string
          monthly_volume: string
          name: string
          notes: string
          phone: string
          product_usage: string
          products_interest: string
          referral_source: string
          state: string
          status: string
          user_id: string
          website: string
          zip_code: string
        }[]
      }
      get_supplier_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_approved: { Args: { _user_id: string }; Returns: boolean }
      is_supplier: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "supplier"
      fulfillment_status:
        | "pending"
        | "in_production"
        | "packed"
        | "shipped"
        | "completed"
      user_status: "pending" | "approved" | "denied"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "supplier"],
      fulfillment_status: [
        "pending",
        "in_production",
        "packed",
        "shipped",
        "completed",
      ],
      user_status: ["pending", "approved", "denied"],
    },
  },
} as const
