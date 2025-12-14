-- Delete all products EXCEPT the following unique IDs
-- Preserving '6c816ba4-3f82-4075-bdb2-e13b645dda40' for the Watch banner link

DELETE FROM products 
WHERE id NOT IN (
    '6c816ba4-3f82-4075-bdb2-e13b645dda40', -- Lumina Watch GT (LINKED)
    'f27c65e8-f73e-409a-b4a5-532e093fa512', -- Lumina X1 Pro
    'f2097950-9b36-4669-b547-1e71ea9493db', -- Lumina Air 5
    '1feb8c5e-020b-44ab-9a60-92dd03dd85ab', -- Lumina Case Ultra
    'adfbe16e-ecaa-4b00-8808-8801e36b9c8e', -- Lumina Pad 11
    '15cabb99-19ee-4ae1-9537-71f7cb1b9bf4', -- Lumina Buds Pro
    '4e80b762-d3f8-4744-acde-8af3af88ccd9', -- Lumina X1
    '964fbca0-af87-4ff7-ae38-76fe728282aa'  -- Lumina Air 5 Pro
);
