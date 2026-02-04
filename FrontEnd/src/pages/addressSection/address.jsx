import React, { useState } from "react";
import "./address.css";
import { useNavigate } from "react-router-dom";

function Address() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("addresses");
    return saved ? JSON.parse(saved) : [];
  });
 
  const [isFormOpen, setIsFormOpen] = useState(addresses.length === 0);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "", // was phone
    pincode: "",
    city: "",
    state: "",
    landmark: "",
    address: "" // was fullAddress
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveAddress = () => {
    // Basic validation
    if (!formData.address || !formData.mobileNumber || !formData.name) {
      return alert("Please fill Name, Address, and Mobile Number");
    }

    let updated = [...addresses];

    if (editIndex !== null) {
      updated[editIndex] = formData;
    } else {
      updated.push(formData);
    }

    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));

    setIsFormOpen(false);
    setEditIndex(null);
    resetForm();
  };

  const deliverHere = (index) => {
    navigate("/buy", { state: { address: addresses[index] } });
  };

  const editAddress = (index) => {
    setFormData(addresses[index]);
    setEditIndex(index);
    setIsFormOpen(true);
  };

  const deleteAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    if (updated.length === 0) setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mobileNumber: "",
      pincode: "",
      city: "",
      state: "",
      landmark: "",
      address: ""
    });
  };

  return (
    <div className="addressSection">
      <h2 className="addressTitle">Delivery Address</h2>

      {!isFormOpen && addresses.length > 0 && (
        <div className="savedAddresses">
          {addresses.map((addr, index) => (
            <div key={index} className="addressCard">
              <h4>{addr.name} <span>{addr.mobileNumber}</span></h4>
              <p>{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
              {addr.landmark && <p>Landmark: {addr.landmark}</p>}

              <div className="addressActions">
                <button onClick={() => deliverHere(index)}>Deliver Here</button>
                <button onClick={() => editAddress(index)}>Edit</button>
                <button onClick={() => deleteAddress(index)}>Delete</button>
              </div>
            </div>
          ))}

          <button className="addNewBtn" onClick={() => setIsFormOpen(true)}>
            + Add New Address
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="addressForm">
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          <input name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
          <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
          <input name="landmark" placeholder="Landmark" value={formData.landmark} onChange={handleChange} />
          <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} />

          <button className="saveBtn" onClick={saveAddress}>
            {editIndex !== null ? "Update Address" : "Save Address"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Address;