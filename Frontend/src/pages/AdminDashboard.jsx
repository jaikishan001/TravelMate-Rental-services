import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";

export function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "economy",
    description: "",
    imageUrl: "",
    pricePerDay: "",
    features: "AC, 4 Seats"
  });

  const fetchVehicles = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/vehicles");
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
    } catch (e) {
      console.error("Failed to fetch vehicles", e);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8081/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Vehicle added successfully!");
        fetchVehicles();
        setFormData({ name: "", category: "economy", description: "", imageUrl: "", pricePerDay: "", features: "AC, 4 Seats" });
      } else {
        alert("Failed to add vehicle");
      }
    } catch (e) {
      console.error("Error adding vehicle", e);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/vehicles/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchVehicles();
      }
    } catch (e) {
      console.error("Error deleting", e);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <Topbar />
      <div className="max-w-6xl mx-auto p-6 mt-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard - Manage Vehicles</h1>

        {/* Add Vehicle Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Vehicle</h2>
          <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Vehicle Name (e.g. Hyundai Creta)" value={formData.name} onChange={handleInputChange} required className="border p-2 rounded" />
            <select name="category" value={formData.category} onChange={handleInputChange} className="border p-2 rounded">
              <option value="economy">Economy</option>
              <option value="luxury">Luxury</option>
              <option value="suv">SUV</option>
              <option value="bike">Bike</option>
              <option value="scooty">Scooty</option>
              <option value="electric">Electric</option>
            </select>
            <input type="text" name="imageUrl" placeholder="Image URL (e.g. /HyundaiCreta.png)" value={formData.imageUrl} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="text" name="pricePerDay" placeholder="Price Per Day (e.g. 3500)" value={formData.pricePerDay} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="text" name="features" placeholder="Features (comma separated)" value={formData.features} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="text" name="description" placeholder="Short Description" value={formData.description} onChange={handleInputChange} className="border p-2 rounded" />
            
            <button type="submit" className="md:col-span-2 bg-black text-white p-2 rounded hover:bg-gray-800">Add Vehicle</button>
          </form>
        </div>

        {/* List of Vehicles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Existing Vehicles</h2>
          {vehicles.length === 0 ? <p>No vehicles in database.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b">ID</th>
                    <th className="p-3 border-b">Image</th>
                    <th className="p-3 border-b">Name</th>
                    <th className="p-3 border-b">Category</th>
                    <th className="p-3 border-b">Price</th>
                    <th className="p-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{v.id}</td>
                      <td className="p-3 border-b"><img src={v.imageUrl} alt={v.name} className="w-16 h-10 object-cover rounded" /></td>
                      <td className="p-3 border-b">{v.name}</td>
                      <td className="p-3 border-b capitalize">{v.category}</td>
                      <td className="p-3 border-b">₹{v.pricePerDay}</td>
                      <td className="p-3 border-b">
                        <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
