export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      purchases: {
        Row: {
          id: string;
          user_id: string | null;
          email: string | null;
          stripe_session_id: string | null;
          amount_paid: number | null;
          plaque_status: string;
          plaque_tracking_url: string | null;
          shipping_address_deferred: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email?: string | null;
          stripe_session_id?: string | null;
          amount_paid?: number | null;
          plaque_status?: string;
          plaque_tracking_url?: string | null;
          shipping_address_deferred?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string | null;
          stripe_session_id?: string | null;
          amount_paid?: number | null;
          plaque_status?: string;
          plaque_tracking_url?: string | null;
          shipping_address_deferred?: boolean;
          created_at?: string;
        };
      };
      shipping_addresses: {
        Row: {
          id: string;
          user_id: string | null;
          delivery_type: string | null;
          recipient_name: string | null;
          contact_name: string | null;
          address_line_1: string | null;
          address_line_2: string | null;
          city: string | null;
          state_province: string | null;
          postal_code: string | null;
          country: string | null;
          attorney_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          delivery_type?: string | null;
          recipient_name?: string | null;
          contact_name?: string | null;
          address_line_1?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          state_province?: string | null;
          postal_code?: string | null;
          country?: string | null;
          attorney_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          delivery_type?: string | null;
          recipient_name?: string | null;
          contact_name?: string | null;
          address_line_1?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          state_province?: string | null;
          postal_code?: string | null;
          country?: string | null;
          attorney_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          has_seen_dashboard: boolean;
          page_is_public: boolean;
          memorial_slug: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          has_seen_dashboard?: boolean;
          page_is_public?: boolean;
          memorial_slug?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          has_seen_dashboard?: boolean;
          page_is_public?: boolean;
          memorial_slug?: string | null;
          created_at?: string;
        };
      };
      story_answers: {
        Row: {
          id: string;
          user_id: string | null;
          section_slug: string;
          question_id: string;
          answer_text: string | null;
          skipped: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          section_slug: string;
          question_id: string;
          answer_text?: string | null;
          skipped?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          section_slug?: string;
          question_id?: string;
          answer_text?: string | null;
          skipped?: boolean;
          updated_at?: string;
        };
      };
      guestbook_entries: {
        Row: {
          id: string;
          memorial_slug: string;
          author_name: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          memorial_slug: string;
          author_name: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          memorial_slug?: string;
          author_name?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
