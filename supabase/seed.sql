-- ============================================================================
-- CREATORGEAR INITIAL SEED DATA
-- Categories, Brands, Sellers, and Real Content Creator Products
-- ============================================================================

-- 1. CATEGORIES (From PDF Page 10)
INSERT INTO public.categories (id, name, slug, description, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Cameras & Lenses', 'cameras-and-lenses', 'Mirrorless cameras, cinema cameras, DSLR cameras, lenses, filters', 1),
('c1000000-0000-0000-0000-000000000002', 'Lighting & Studio', 'lighting-and-studio', 'LED lights, softboxes, ring lights, reflectors, light stands', 2),
('c1000000-0000-0000-0000-000000000003', 'Audio Equipment', 'audio-equipment', 'Wireless microphones, shotgun microphones, recorders, mixers', 3),
('c1000000-0000-0000-0000-000000000004', 'Video Production', 'video-production', 'Tripods, gimbals, camera rigs, monitors, teleprompters', 4),
('c1000000-0000-0000-0000-000000000005', 'Streaming & Content Creation', 'streaming-and-content', 'Webcams, capture cards, stream controllers, green screens', 5),
('c1000000-0000-0000-0000-000000000006', 'Accessories', 'accessories', 'Batteries, memory cards, chargers, cables, bags, cleaning kits', 6)
ON CONFLICT (id) DO NOTHING;

-- 2. BRANDS (From PDF Page 22)
INSERT INTO public.brands (id, name, slug, website) VALUES
('b1000000-0000-0000-0000-000000000001', 'Sony', 'sony', 'https://sony.com'),
('b1000000-0000-0000-0000-000000000002', 'RED Digital Cinema', 'red', 'https://red.com'),
('b1000000-0000-0000-0000-000000000003', 'Canon', 'canon', 'https://canon.com'),
('b1000000-0000-0000-0000-000000000004', 'Røde', 'rode', 'https://rode.com'),
('b1000000-0000-0000-0000-000000000005', 'DJI', 'dji', 'https://dji.com'),
('b1000000-0000-0000-0000-000000000006', 'Aputure', 'aputure', 'https://aputure.com'),
('b1000000-0000-0000-0000-000000000007', 'Sennheiser', 'sennheiser', 'https://sennheiser.com'),
('b1000000-0000-0000-0000-000000000008', 'Blackmagic Design', 'blackmagic-design', 'https://blackmagicdesign.com')
ON CONFLICT (id) DO NOTHING;
