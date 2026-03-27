
-- Media files table
CREATE TABLE public.media_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'image',
  file_size BIGINT,
  alt_text TEXT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Navigation menus table
CREATE TABLE public.nav_menus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  handle TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Menu items table
CREATE TABLE public.nav_menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_id UUID NOT NULL REFERENCES public.nav_menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.nav_menu_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage media files" ON public.media_files FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view media files" ON public.media_files FOR SELECT USING (true);

CREATE POLICY "Admins can manage nav menus" ON public.nav_menus FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view nav menus" ON public.nav_menus FOR SELECT USING (true);

CREATE POLICY "Admins can manage nav menu items" ON public.nav_menu_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view nav menu items" ON public.nav_menu_items FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (status = 'published');

-- Seed default menus
INSERT INTO public.nav_menus (title, handle) VALUES
  ('Main menu', 'main-menu'),
  ('Footer menu', 'footer-menu');

-- Seed main menu items
INSERT INTO public.nav_menu_items (menu_id, title, url, sort_order)
SELECT id, 'Shop', '/products', 0 FROM public.nav_menus WHERE handle = 'main-menu'
UNION ALL
SELECT id, 'Home', '/', 1 FROM public.nav_menus WHERE handle = 'main-menu'
UNION ALL
SELECT id, 'About', '/about', 2 FROM public.nav_menus WHERE handle = 'main-menu';

-- Seed footer menu items
INSERT INTO public.nav_menu_items (menu_id, title, url, sort_order)
SELECT id, 'Terms of Service', '/terms', 0 FROM public.nav_menus WHERE handle = 'footer-menu'
UNION ALL
SELECT id, 'Privacy Policy', '/privacy', 1 FROM public.nav_menus WHERE handle = 'footer-menu';

-- Create storage bucket for content files
INSERT INTO storage.buckets (id, name, public) VALUES ('content-files', 'content-files', true)
ON CONFLICT (id) DO NOTHING;
