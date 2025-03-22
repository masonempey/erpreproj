import { pool } from "@/lib/database";

// Get shop information
export const getShopInfo = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM public.shop_info ORDER BY id LIMIT 1"
    );

    return result.rows[0] || null;
  } catch (err) {
    throw new Error(`Failed to fetch shop info: ${err.message}`);
  } finally {
    client.release();
  }
};
