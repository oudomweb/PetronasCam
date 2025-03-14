
-- add u UNIQUE
ALTER TABLE product
ADD CONSTRAINT p_barcode UNIQUE (barcode);

ALTER TABLE `order` ADD `total_amount` DECIMAL(6) NOT NULL DEFAULT '0' AFTER `user_id`;



SELECT DATE_FORMAT(r.create_at,'%M') title 
,SUM(r.total_amount) total
,COUNT(r.id) total_order
FROM `order` r 
WHERE YEAR(r.create_at) = YEAR(CURRENT_DATE)
GROUP BY
MONTH(r.create_at);



SELECT 
SUM(od.total_qty) total_qty,
SUM(od.total_amount) total_amount

FROM `order` o 
INNER JOIN 
(
    SELECT 
    odl.order_id,
    SUM(odl.qty) total_qty,
    SUM(odl.total) total_amount
    FROM order_detail odl
    GROUP BY odl.order_id
    ) od ON  o.id = od.order_id;





    SELECT 
DATE_FORMAT(o.create_at,'%d/%m/%Y') title,
SUM(od.total_qty) total_qty,
SUM(od.total_amount) total_amount
FROM `order` o 
INNER JOIN 
( 
    SELECT odl.order_id,
    SUM(odl.qty) total_qty,
    SUM(odl.total) total_amount
    FROM order_detail odl
    INNER JOIN product p ON odl.product_id = p.id
    GROUP BY odl.order_id
    ) od ON o.id = od.order_id
    WHERE 
    DATE_FORMAT(o.create_at,'%Y/%m/%d') BETWEEN '2024-1-01' AND '2025-01-30'
    GROUP BY DATE_FORMAT(o.create_at, '%d/%m/%Y');