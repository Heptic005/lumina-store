-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'order', 'stock', 'system'
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    user_id UUID REFERENCES auth.users(id) -- Optional, if we want to target specific users
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all notifications
CREATE POLICY "Admins can view all notifications" ON notifications
    FOR SELECT
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );

-- Policy: Admins can update notifications (mark as read)
CREATE POLICY "Admins can update notifications" ON notifications
    FOR UPDATE
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );

-- Function to create notification on new order
CREATE OR REPLACE FUNCTION public.handle_new_order_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (title, message, type, link)
    VALUES (
        'New Order Received',
        'Order #' || NEW.id || ' has been placed by ' || (NEW.shipping_address->>'firstName') || ' ' || (NEW.shipping_address->>'lastName'),
        'order',
        '/admin/orders/' || NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new order
DROP TRIGGER IF EXISTS on_new_order_notification ON orders;
CREATE TRIGGER on_new_order_notification
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_order_notification();
