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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
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
          discount_amount: number | null
          discount_code: string | null
          discount_tier: string | null
          id: string
          internal_notes: string | null
          notes: string | null
          order_number: string
          paid_at: string | null
          payment_status: string | null
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
          discount_amount?: number | null
          discount_code?: string | null
          discount_tier?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number: string
          paid_at?: string | null
          payment_status?: string | null
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
          discount_amount?: number | null
          discount_code?: string | null
          discount_tier?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number?: string
          paid_at?: string | null
          payment_status?: string | null
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
      [_ in never]: never
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_approved: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
      user_status: ["pending", "approved", "denied"],
    },
  },
} as const
