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
      affiliate_applications: {
        Row: {
          approved_affiliate_id: string | null
          country: string | null
          created_at: string
          display_name: string
          email: string
          follower_count_total: number | null
          id: string
          legal_name: string | null
          niche: string | null
          phone: string | null
          pitch: string | null
          primary_audience: string | null
          referred_by_affiliate_id: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          social_instagram: string | null
          social_tiktok: string | null
          social_twitter: string | null
          social_youtube: string | null
          status: string
          updated_at: string
          user_id: string | null
          why_resurrected_labs: string | null
        }
        Insert: {
          approved_affiliate_id?: string | null
          country?: string | null
          created_at?: string
          display_name: string
          email: string
          follower_count_total?: number | null
          id?: string
          legal_name?: string | null
          niche?: string | null
          phone?: string | null
          pitch?: string | null
          primary_audience?: string | null
          referred_by_affiliate_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_instagram?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          why_resurrected_labs?: string | null
        }
        Update: {
          approved_affiliate_id?: string | null
          country?: string | null
          created_at?: string
          display_name?: string
          email?: string
          follower_count_total?: number | null
          id?: string
          legal_name?: string | null
          niche?: string | null
          phone?: string | null
          pitch?: string | null
          primary_audience?: string | null
          referred_by_affiliate_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_instagram?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          why_resurrected_labs?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_applications_approved_affiliate_id_fkey"
            columns: ["approved_affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_applications_referred_by_affiliate_id_fkey"
            columns: ["referred_by_affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_clicks: {
        Row: {
          affiliate_id: string
          browser: string | null
          city: string | null
          code_id: string | null
          conversion_id: string | null
          converted: boolean
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_hash: string | null
          landing_page: string | null
          link_id: string | null
          os: string | null
          referrer: string | null
          region: string | null
          sub_id: string | null
          user_agent_hash: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_id: string
        }
        Insert: {
          affiliate_id: string
          browser?: string | null
          city?: string | null
          code_id?: string | null
          conversion_id?: string | null
          converted?: boolean
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_hash?: string | null
          landing_page?: string | null
          link_id?: string | null
          os?: string | null
          referrer?: string | null
          region?: string | null
          sub_id?: string | null
          user_agent_hash?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id: string
        }
        Update: {
          affiliate_id?: string
          browser?: string | null
          city?: string | null
          code_id?: string | null
          conversion_id?: string | null
          converted?: boolean
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_hash?: string | null
          landing_page?: string | null
          link_id?: string | null
          os?: string | null
          referrer?: string | null
          region?: string | null
          sub_id?: string | null
          user_agent_hash?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_clicks_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "affiliate_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "tracking_links"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_codes: {
        Row: {
          active: boolean
          affiliate_id: string
          applies_to_product_ids: string[] | null
          code: string
          code_type: Database["public"]["Enums"]["code_type"]
          created_at: string
          customer_discount_label: string | null
          discount_type: Database["public"]["Enums"]["discount_type"] | null
          discount_value: number | null
          expires_at: string | null
          id: string
          is_default: boolean
          max_uses: number | null
          max_uses_per_customer: number
          minimum_order_cents: number | null
          stripe_coupon_id: string | null
          stripe_promotion_code_id: string | null
          updated_at: string
          uses_count: number
        }
        Insert: {
          active?: boolean
          affiliate_id: string
          applies_to_product_ids?: string[] | null
          code: string
          code_type?: Database["public"]["Enums"]["code_type"]
          created_at?: string
          customer_discount_label?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"] | null
          discount_value?: number | null
          expires_at?: string | null
          id?: string
          is_default?: boolean
          max_uses?: number | null
          max_uses_per_customer?: number
          minimum_order_cents?: number | null
          stripe_coupon_id?: string | null
          stripe_promotion_code_id?: string | null
          updated_at?: string
          uses_count?: number
        }
        Update: {
          active?: boolean
          affiliate_id?: string
          applies_to_product_ids?: string[] | null
          code?: string
          code_type?: Database["public"]["Enums"]["code_type"]
          created_at?: string
          customer_discount_label?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"] | null
          discount_value?: number | null
          expires_at?: string | null
          id?: string
          is_default?: boolean
          max_uses?: number | null
          max_uses_per_customer?: number
          minimum_order_cents?: number | null
          stripe_coupon_id?: string | null
          stripe_promotion_code_id?: string | null
          updated_at?: string
          uses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_codes_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_conversions: {
        Row: {
          affiliate_id: string
          approved_at: string | null
          attribution_model: string
          cleared_at: string | null
          click_id: string | null
          code_id: string | null
          commission_cents: number
          commission_rate_used: number
          created_at: string
          customer_email: string | null
          discount_amount_cents: number
          gross_amount_cents: number
          hold_until: string | null
          id: string
          link_id: string | null
          net_amount_cents: number
          notes: string | null
          order_id: string | null
          paid_at: string | null
          payout_id: string | null
          product_summary: Json | null
          refund_reason: string | null
          refunded_at: string | null
          reversal_reason: string | null
          status: Database["public"]["Enums"]["commission_status"]
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          visitor_id: string | null
        }
        Insert: {
          affiliate_id: string
          approved_at?: string | null
          attribution_model?: string
          cleared_at?: string | null
          click_id?: string | null
          code_id?: string | null
          commission_cents: number
          commission_rate_used: number
          created_at?: string
          customer_email?: string | null
          discount_amount_cents?: number
          gross_amount_cents: number
          hold_until?: string | null
          id?: string
          link_id?: string | null
          net_amount_cents: number
          notes?: string | null
          order_id?: string | null
          paid_at?: string | null
          payout_id?: string | null
          product_summary?: Json | null
          refund_reason?: string | null
          refunded_at?: string | null
          reversal_reason?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          visitor_id?: string | null
        }
        Update: {
          affiliate_id?: string
          approved_at?: string | null
          attribution_model?: string
          cleared_at?: string | null
          click_id?: string | null
          code_id?: string | null
          commission_cents?: number
          commission_rate_used?: number
          created_at?: string
          customer_email?: string | null
          discount_amount_cents?: number
          gross_amount_cents?: number
          hold_until?: string | null
          id?: string
          link_id?: string | null
          net_amount_cents?: number
          notes?: string | null
          order_id?: string | null
          paid_at?: string | null
          payout_id?: string | null
          product_summary?: Json | null
          refund_reason?: string | null
          refunded_at?: string | null
          reversal_reason?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_conversions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_conversions_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "affiliate_clicks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_conversions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "affiliate_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_conversions_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "tracking_links"
            referencedColumns: ["id"]
          },
        ]
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
      affiliate_notifications: {
        Row: {
          affiliate_id: string | null
          body: string | null
          created_at: string
          email_sent_at: string | null
          id: string
          link_url: string | null
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          affiliate_id?: string | null
          body?: string | null
          created_at?: string
          email_sent_at?: string | null
          id?: string
          link_url?: string | null
          read_at?: string | null
          title: string
          type: string
        }
        Update: {
          affiliate_id?: string | null
          body?: string | null
          created_at?: string
          email_sent_at?: string | null
          id?: string
          link_url?: string | null
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_notifications_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount_cents: number
          conversion_ids: string[]
          created_at: string
          currency: string
          external_metadata: Json | null
          external_transaction_id: string | null
          failed_at: string | null
          failure_reason: string | null
          fee_cents: number
          id: string
          initiated_at: string | null
          method: Database["public"]["Enums"]["payout_method_type"]
          net_amount_cents: number
          paid_at: string | null
          payout_method_id: string | null
          scheduled_for: string | null
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          amount_cents: number
          conversion_ids?: string[]
          created_at?: string
          currency?: string
          external_metadata?: Json | null
          external_transaction_id?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          fee_cents?: number
          id?: string
          initiated_at?: string | null
          method: Database["public"]["Enums"]["payout_method_type"]
          net_amount_cents: number
          paid_at?: string | null
          payout_method_id?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          amount_cents?: number
          conversion_ids?: string[]
          created_at?: string
          currency?: string
          external_metadata?: Json | null
          external_transaction_id?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          fee_cents?: number
          id?: string
          initiated_at?: string | null
          method?: Database["public"]["Enums"]["payout_method_type"]
          net_amount_cents?: number
          paid_at?: string | null
          payout_method_id?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_payouts_payout_method_id_fkey"
            columns: ["payout_method_id"]
            isOneToOne: false
            referencedRelation: "payout_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_program_settings: {
        Row: {
          application_questions: Json | null
          auto_approve_commissions: boolean
          auto_approve_threshold_cents: number
          auto_payout_day_of_month: number
          auto_payout_enabled: boolean
          brand_kit_url: string | null
          default_attribution_model: string
          default_commission_rate: number
          default_cookie_window_days: number
          default_hold_period_days: number
          fraud_self_purchase_check: boolean
          fraud_velocity_clicks_per_hour: number
          id: number
          minimum_payout_cents: number
          refund_grace_period_days: number
          reply_to_email: string | null
          support_email: string | null
          terms_url: string | null
          updated_at: string
        }
        Insert: {
          application_questions?: Json | null
          auto_approve_commissions?: boolean
          auto_approve_threshold_cents?: number
          auto_payout_day_of_month?: number
          auto_payout_enabled?: boolean
          brand_kit_url?: string | null
          default_attribution_model?: string
          default_commission_rate?: number
          default_cookie_window_days?: number
          default_hold_period_days?: number
          fraud_self_purchase_check?: boolean
          fraud_velocity_clicks_per_hour?: number
          id?: number
          minimum_payout_cents?: number
          refund_grace_period_days?: number
          reply_to_email?: string | null
          support_email?: string | null
          terms_url?: string | null
          updated_at?: string
        }
        Update: {
          application_questions?: Json | null
          auto_approve_commissions?: boolean
          auto_approve_threshold_cents?: number
          auto_payout_day_of_month?: number
          auto_payout_enabled?: boolean
          brand_kit_url?: string | null
          default_attribution_model?: string
          default_commission_rate?: number
          default_cookie_window_days?: number
          default_hold_period_days?: number
          fraud_self_purchase_check?: boolean
          fraud_velocity_clicks_per_hour?: number
          id?: number
          minimum_payout_cents?: number
          refund_grace_period_days?: number
          reply_to_email?: string | null
          support_email?: string | null
          terms_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_resources: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          display_order: number
          download_count: number
          file_size_bytes: number | null
          file_url: string
          id: string
          mime_type: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description?: string | null
          display_order?: number
          download_count?: number
          file_size_bytes?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          download_count?: number
          file_size_bytes?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          affiliate_number: number | null
          application_notes: string | null
          approved_at: string | null
          approved_by: string | null
          audience_size: string | null
          commission_rate: number
          content_niche: string | null
          country: string | null
          created_at: string
          custom_commission_rate: number | null
          default_code_id: string | null
          discount_code: string | null
          display_name: string | null
          email: string
          follower_count_total: number | null
          id: string
          instagram: string | null
          internal_notes: string | null
          is_active: boolean
          last_activity_at: string | null
          legal_name: string | null
          name: string
          notes: string | null
          payout_method_id: string | null
          payout_threshold_cents: number
          phone: string | null
          portfolio_url: string | null
          primary_audience: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          social_twitter: string | null
          sport: string | null
          status: string
          tax_form_filed: boolean
          tax_form_type: string | null
          tax_form_url: string | null
          tier: Database["public"]["Enums"]["affiliate_tier"]
          tiktok: string | null
          total_clicks: number
          total_commission_cents: number
          total_conversions: number
          total_earnings: number
          total_gross_cents: number
          total_orders: number
          total_paid_cents: number
          updated_at: string
          user_id: string | null
          vanity_slug: string | null
          viral_video_links: string | null
          why_join: string | null
          youtube: string | null
        }
        Insert: {
          affiliate_number?: number | null
          application_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          audience_size?: string | null
          commission_rate?: number
          content_niche?: string | null
          country?: string | null
          created_at?: string
          custom_commission_rate?: number | null
          default_code_id?: string | null
          discount_code?: string | null
          display_name?: string | null
          email: string
          follower_count_total?: number | null
          id?: string
          instagram?: string | null
          internal_notes?: string | null
          is_active?: boolean
          last_activity_at?: string | null
          legal_name?: string | null
          name: string
          notes?: string | null
          payout_method_id?: string | null
          payout_threshold_cents?: number
          phone?: string | null
          portfolio_url?: string | null
          primary_audience?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_twitter?: string | null
          sport?: string | null
          status?: string
          tax_form_filed?: boolean
          tax_form_type?: string | null
          tax_form_url?: string | null
          tier?: Database["public"]["Enums"]["affiliate_tier"]
          tiktok?: string | null
          total_clicks?: number
          total_commission_cents?: number
          total_conversions?: number
          total_earnings?: number
          total_gross_cents?: number
          total_orders?: number
          total_paid_cents?: number
          updated_at?: string
          user_id?: string | null
          vanity_slug?: string | null
          viral_video_links?: string | null
          why_join?: string | null
          youtube?: string | null
        }
        Update: {
          affiliate_number?: number | null
          application_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          audience_size?: string | null
          commission_rate?: number
          content_niche?: string | null
          country?: string | null
          created_at?: string
          custom_commission_rate?: number | null
          default_code_id?: string | null
          discount_code?: string | null
          display_name?: string | null
          email?: string
          follower_count_total?: number | null
          id?: string
          instagram?: string | null
          internal_notes?: string | null
          is_active?: boolean
          last_activity_at?: string | null
          legal_name?: string | null
          name?: string
          notes?: string | null
          payout_method_id?: string | null
          payout_threshold_cents?: number
          phone?: string | null
          portfolio_url?: string | null
          primary_audience?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_twitter?: string | null
          sport?: string | null
          status?: string
          tax_form_filed?: boolean
          tax_form_type?: string | null
          tax_form_url?: string | null
          tier?: Database["public"]["Enums"]["affiliate_tier"]
          tiktok?: string | null
          total_clicks?: number
          total_commission_cents?: number
          total_conversions?: number
          total_earnings?: number
          total_gross_cents?: number
          total_orders?: number
          total_paid_cents?: number
          updated_at?: string
          user_id?: string | null
          vanity_slug?: string | null
          viral_video_links?: string | null
          why_join?: string | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_affiliates_default_code"
            columns: ["default_code_id"]
            isOneToOne: false
            referencedRelation: "affiliate_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_affiliates_payout_method"
            columns: ["payout_method_id"]
            isOneToOne: false
            referencedRelation: "payout_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      agreement_signatures: {
        Row: {
          agreement_type: Database["public"]["Enums"]["agreement_type"]
          agreement_version: string
          counter_signed_at: string | null
          counter_signed_by: string | null
          counter_signer_initials: string | null
          created_at: string
          id: string
          initials: string
          ip_address: string | null
          metadata: Json | null
          signed_at: string
          signer_email: string | null
          signer_name: string | null
          status: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          agreement_type: Database["public"]["Enums"]["agreement_type"]
          agreement_version?: string
          counter_signed_at?: string | null
          counter_signed_by?: string | null
          counter_signer_initials?: string | null
          created_at?: string
          id?: string
          initials: string
          ip_address?: string | null
          metadata?: Json | null
          signed_at?: string
          signer_email?: string | null
          signer_name?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          agreement_type?: Database["public"]["Enums"]["agreement_type"]
          agreement_version?: string
          counter_signed_at?: string | null
          counter_signed_by?: string | null
          counter_signer_initials?: string | null
          created_at?: string
          id?: string
          initials?: string
          ip_address?: string | null
          metadata?: Json | null
          signed_at?: string
          signer_email?: string | null
          signer_name?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
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
      commission_tiers: {
        Row: {
          badge_color: string | null
          bonus_per_milestone_cents: number | null
          commission_rate: number
          created_at: string
          display_name: string
          id: string
          monthly_volume_threshold_cents: number
          perks: string[] | null
          recurring_commission_rate: number | null
          rolling_window_days: number
          tier: Database["public"]["Enums"]["affiliate_tier"]
          updated_at: string
        }
        Insert: {
          badge_color?: string | null
          bonus_per_milestone_cents?: number | null
          commission_rate: number
          created_at?: string
          display_name: string
          id?: string
          monthly_volume_threshold_cents: number
          perks?: string[] | null
          recurring_commission_rate?: number | null
          rolling_window_days?: number
          tier: Database["public"]["Enums"]["affiliate_tier"]
          updated_at?: string
        }
        Update: {
          badge_color?: string | null
          bonus_per_milestone_cents?: number | null
          commission_rate?: number
          created_at?: string
          display_name?: string
          id?: string
          monthly_volume_threshold_cents?: number
          perks?: string[] | null
          recurring_commission_rate?: number | null
          rolling_window_days?: number
          tier?: Database["public"]["Enums"]["affiliate_tier"]
          updated_at?: string
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
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
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
      fraud_events: {
        Row: {
          action_taken: string | null
          affiliate_id: string | null
          click_id: string | null
          conversion_id: string | null
          created_at: string
          details: Json
          event_type: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          severity: Database["public"]["Enums"]["fraud_severity"]
          status: string
        }
        Insert: {
          action_taken?: string | null
          affiliate_id?: string | null
          click_id?: string | null
          conversion_id?: string | null
          created_at?: string
          details: Json
          event_type: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: Database["public"]["Enums"]["fraud_severity"]
          status?: string
        }
        Update: {
          action_taken?: string | null
          affiliate_id?: string | null
          click_id?: string | null
          conversion_id?: string | null
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: Database["public"]["Enums"]["fraud_severity"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_events_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_events_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "affiliate_clicks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_events_conversion_id_fkey"
            columns: ["conversion_id"]
            isOneToOne: false
            referencedRelation: "affiliate_conversions"
            referencedColumns: ["id"]
          },
        ]
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
      ledger_entries: {
        Row: {
          affiliate_id: string
          amount_cents: number
          balance_after_cents: number
          conversion_id: string | null
          created_at: string
          description: string
          entry_type: string
          id: string
          metadata: Json | null
          payout_id: string | null
        }
        Insert: {
          affiliate_id: string
          amount_cents: number
          balance_after_cents: number
          conversion_id?: string | null
          created_at?: string
          description: string
          entry_type: string
          id?: string
          metadata?: Json | null
          payout_id?: string | null
        }
        Update: {
          affiliate_id?: string
          amount_cents?: number
          balance_after_cents?: number
          conversion_id?: string | null
          created_at?: string
          description?: string
          entry_type?: string
          id?: string
          metadata?: Json | null
          payout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_conversion_id_fkey"
            columns: ["conversion_id"]
            isOneToOne: false
            referencedRelation: "affiliate_conversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "affiliate_payouts"
            referencedColumns: ["id"]
          },
        ]
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
          app_subscription: boolean | null
          app_subscription_cost: number | null
          app_subscription_interval: string | null
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
          fulfillment_service: string | null
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
          shipstation_order_id: string | null
          shipstation_order_key: string | null
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
          app_subscription?: boolean | null
          app_subscription_cost?: number | null
          app_subscription_interval?: string | null
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
          fulfillment_service?: string | null
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
          shipstation_order_id?: string | null
          shipstation_order_key?: string | null
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
          app_subscription?: boolean | null
          app_subscription_cost?: number | null
          app_subscription_interval?: string | null
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
          fulfillment_service?: string | null
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
          shipstation_order_id?: string | null
          shipstation_order_key?: string | null
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
      payout_methods: {
        Row: {
          affiliate_id: string
          created_at: string
          crypto_address: string | null
          crypto_network: string | null
          display_label: string
          id: string
          is_default: boolean
          is_verified: boolean
          mercury_account_id: string | null
          metadata: Json | null
          method: Database["public"]["Enums"]["payout_method_type"]
          paypal_email: string | null
          plaid_account_id: string | null
          stripe_connect_account_id: string | null
          stripe_connect_payouts_enabled: boolean | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          affiliate_id: string
          created_at?: string
          crypto_address?: string | null
          crypto_network?: string | null
          display_label: string
          id?: string
          is_default?: boolean
          is_verified?: boolean
          mercury_account_id?: string | null
          metadata?: Json | null
          method: Database["public"]["Enums"]["payout_method_type"]
          paypal_email?: string | null
          plaid_account_id?: string | null
          stripe_connect_account_id?: string | null
          stripe_connect_payouts_enabled?: boolean | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          affiliate_id?: string
          created_at?: string
          crypto_address?: string | null
          crypto_network?: string | null
          display_label?: string
          id?: string
          is_default?: boolean
          is_verified?: boolean
          mercury_account_id?: string | null
          metadata?: Json | null
          method?: Database["public"]["Enums"]["payout_method_type"]
          paypal_email?: string | null
          plaid_account_id?: string | null
          stripe_connect_account_id?: string | null
          stripe_connect_payouts_enabled?: boolean | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_methods_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
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
          address_line1: string | null
          address_line2: string | null
          business_email: string | null
          business_name: string | null
          city: string | null
          company_logo_url: string | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_email?: string | null
          business_name?: string | null
          city?: string | null
          company_logo_url?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_email?: string | null
          business_name?: string | null
          city?: string | null
          company_logo_url?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
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
      sms_optins: {
        Row: {
          consent_text: string | null
          created_at: string
          email: string
          id: string
          ip_address: string | null
          name: string
          phone: string
          sms_consent: boolean
          user_agent: string | null
        }
        Insert: {
          consent_text?: string | null
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          name: string
          phone: string
          sms_consent?: boolean
          user_agent?: string | null
        }
        Update: {
          consent_text?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          name?: string
          phone?: string
          sms_consent?: boolean
          user_agent?: string | null
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tracking_links: {
        Row: {
          active: boolean
          affiliate_id: string
          click_count: number
          code_id: string | null
          conversion_count: number
          created_at: string
          destination_url: string
          id: string
          label: string | null
          revenue_cents: number
          short_slug: string
          sub_id: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          active?: boolean
          affiliate_id: string
          click_count?: number
          code_id?: string | null
          conversion_count?: number
          created_at?: string
          destination_url: string
          id?: string
          label?: string | null
          revenue_cents?: number
          short_slug: string
          sub_id?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          active?: boolean
          affiliate_id?: string
          click_count?: number
          code_id?: string | null
          conversion_count?: number
          created_at?: string
          destination_url?: string
          id?: string
          label?: string | null
          revenue_cents?: number
          short_slug?: string
          sub_id?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_links_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_links_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "affiliate_codes"
            referencedColumns: ["id"]
          },
        ]
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
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
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      recompute_affiliate_tier: {
        Args: { _affiliate_id: string }
        Returns: undefined
      }
      refresh_affiliate_totals: {
        Args: { _affiliate_id: string }
        Returns: undefined
      }
      resolve_tracking_link: {
        Args: { _slug: string }
        Returns: {
          active: boolean
          affiliate_id: string
          code_id: string
          destination_url: string
          id: string
          utm_campaign: string
          utm_content: string
          utm_medium: string
          utm_source: string
        }[]
      }
      validate_discount_code: {
        Args: { _code: string }
        Returns: {
          applies_to: string
          code: string
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          minimum_purchase_amount: number
        }[]
      }
    }
    Enums: {
      affiliate_tier: "bronze" | "silver" | "gold" | "platinum"
      agreement_type: "purchaser_terms" | "b2b_terms" | "creator_campaign"
      app_role: "admin" | "user" | "supplier"
      code_type: "tracking_only" | "discount_and_tracking"
      commission_status:
        | "pending"
        | "approved"
        | "cleared"
        | "paid"
        | "denied"
        | "refunded"
        | "reversed"
      discount_type: "percentage" | "fixed_amount"
      fraud_severity: "info" | "low" | "medium" | "high" | "critical"
      fulfillment_status:
        | "pending"
        | "in_production"
        | "packed"
        | "shipped"
        | "completed"
      payout_method_type:
        | "stripe_connect"
        | "crypto_usdc_base"
        | "crypto_usdc_polygon"
        | "crypto_usdc_ethereum"
        | "ach_plaid"
        | "ach_mercury"
        | "paypal"
      payout_status: "queued" | "processing" | "paid" | "failed" | "cancelled"
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
      affiliate_tier: ["bronze", "silver", "gold", "platinum"],
      agreement_type: ["purchaser_terms", "b2b_terms", "creator_campaign"],
      app_role: ["admin", "user", "supplier"],
      code_type: ["tracking_only", "discount_and_tracking"],
      commission_status: [
        "pending",
        "approved",
        "cleared",
        "paid",
        "denied",
        "refunded",
        "reversed",
      ],
      discount_type: ["percentage", "fixed_amount"],
      fraud_severity: ["info", "low", "medium", "high", "critical"],
      fulfillment_status: [
        "pending",
        "in_production",
        "packed",
        "shipped",
        "completed",
      ],
      payout_method_type: [
        "stripe_connect",
        "crypto_usdc_base",
        "crypto_usdc_polygon",
        "crypto_usdc_ethereum",
        "ach_plaid",
        "ach_mercury",
        "paypal",
      ],
      payout_status: ["queued", "processing", "paid", "failed", "cancelled"],
      user_status: ["pending", "approved", "denied"],
    },
  },
} as const
