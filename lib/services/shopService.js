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

// Update shop information (address, city, province, postal code, phone, email)
export const updateShopInfo = async (shopInfoUpdates) => {
  const client = await pool.connect();
  try {
    // First get current shop info
    const currentInfo = await client.query(
      "SELECT * FROM public.shop_info WHERE id = 1"
    );
    
    if (currentInfo.rows.length === 0) {
      throw new Error("Shop information not found");
    }

    // Merge existing info with updates (partial updates supported)
    const updatedInfo = {
      ...currentInfo.rows[0],
      ...shopInfoUpdates
    };

    // Execute update with all fields (including unchanged ones)
    const result = await client.query(
      `UPDATE public.shop_info SET 
        address = $1, 
        city = $2, 
        province = $3, 
        postal_code = $4, 
        phone = $5,
        email = $6
       WHERE id = 1`,
      [
        updatedInfo.address,
        updatedInfo.city,
        updatedInfo.province,
        updatedInfo.postal_code,
        updatedInfo.phone,
        updatedInfo.email
      ]
    );

    return result.rowCount;
  } catch (err) {
    console.error('Error updating shop info:', err);
    throw new Error(`Failed to update shop info: ${err.message}`);
  } finally {
    client.release();
  }
};
export const updateShopHours = async (shopHours) => {
  const client = await pool.connect();
  try {
    // Get current hours first
    const currentHours = await client.query(
      "SELECT * FROM public.shop_info WHERE id = 1"
    );
    
    // Merge existing hours with new updates
    const updatedHours = {
      ...currentHours.rows[0],
      ...shopHours
    };

    const result = await client.query(
      `UPDATE public.shop_info SET 
        monday_open = $1, monday_close = $2,
        tuesday_open = $3, tuesday_close = $4,
        wednesday_open = $5, wednesday_close = $6,
        thursday_open = $7, thursday_close = $8,
        friday_open = $9, friday_close = $10,
        saturday_open = $11, saturday_close = $12,
        sunday_open = $13, sunday_close = $14
       WHERE id = 1`,
      [
        updatedHours.monday_open,
        updatedHours.monday_close,
        updatedHours.tuesday_open,
        updatedHours.tuesday_close,
        updatedHours.wednesday_open,
        updatedHours.wednesday_close,
        updatedHours.thursday_open,
        updatedHours.thursday_close,
        updatedHours.friday_open,
        updatedHours.friday_close,
        updatedHours.saturday_open,
        updatedHours.saturday_close,
        updatedHours.sunday_open,
        updatedHours.sunday_close
      ]
    );

    return result.rowCount;
  } catch (err) {
    console.error('Error updating shop hours:', err);
    throw new Error(`Failed to update shop hours: ${err.message}`);
  } finally {
    client.release();
  }
};