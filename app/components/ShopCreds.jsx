"use client";

import {useState, useEffect} from "react";

const ShopCreds = () => {
    const [shopCredentials, setShopCredentials] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchCredentials = async () =>{
            const response = await fetch("/api/shop");
            const data = response.json();
            setShopCredentials(data);
            setFormData(data);
        }
        fetchCredentials();
    }, [])

    const handleSave = async () => {
      
    }

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        if (isEditing) setFormData(shopCredentials); // Reset form data if canceling
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (!shopCredentials) {
        return <div>Loading shop credentials...</div>;
      }

    return(
        <div>
      <h2>Shop Details</h2>
      {isEditing ? (
        <div>
          {/* Example fields - adjust based on your shopCredentials structure */}
          <label>
            Shop Name:
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={toggleEdit}>Cancel</button>
        </div>
      ) : (
        <div>
          {/* Display credentials - adjust fields based on your data */}
          <p><strong>Shop Name:</strong> {shopCredentials.name}</p>
          <p><strong>Address:</strong> {shopCredentials.address}</p>
          <p><strong>Phone:</strong> {shopCredentials.phone}</p>
          <button onClick={toggleEdit}>Edit</button>
        </div>
      )}
    </div>
    )
}

export default ShopCreds;