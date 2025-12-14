-- Run this to check if the "Nuclear Fix" actually worked.
-- Look at the "on_delete_action" column in the result.
-- 'r' = RESTRICT (Bad, causes delete to fail)
-- 'n' = SET NULL (Good, allows delete)

SELECT
    conname AS constraint_name,
    CASE confdeltype
        WHEN 'r' THEN 'RESTRICT (Blocks Delete)'
        WHEN 'n' THEN 'SET NULL (Allows Delete)'
        WHEN 'c' THEN 'CASCADE (Deletes Orders)'
        WHEN 'a' THEN 'NO ACTION'
        ELSE confdeltype::text
    END AS on_delete_action
FROM
    pg_constraint
WHERE
    conname = 'order_items_product_id_fkey';
