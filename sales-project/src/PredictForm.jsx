import React, { useState } from "react";
import axios from "axios";

const PredictForm = () => {
  const [formData, setFormData] = useState({
    is_returning_user: 0,
    age: "",
    visits: "",
    avg_time_spent_minutes: "",
    pages_viewed: "",
    previous_purchases: "",
    cart_added: 0,
    discount_applied: 0,
    gender: "Male",
    country: "India",
    device_type: "Mobile"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          ...formData,
          age: Number(formData.age),
          visits: Number(formData.visits),
          avg_time_spent_minutes: Number(formData.avg_time_spent_minutes),
          pages_viewed: Number(formData.pages_viewed),
          previous_purchases: Number(formData.previous_purchases),
          is_returning_user: Number(formData.is_returning_user),
          cart_added: Number(formData.cart_added),
          discount_applied: Number(formData.discount_applied)
        }
      );

      setResult(response.data.will_purchase);
    } catch (error) {
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Sales Purchase Prediction</h2>

      <form onSubmit={handleSubmit}>
        <label>Returning User</label>
        <select name="is_returning_user" onChange={handleChange}>
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>

        <label>Age</label>
        <input name="age" type="number" required onChange={handleChange} />

        <label>Visits</label>
        <input name="visits" type="number" required onChange={handleChange} />

        <label>Avg Time Spent (minutes)</label>
        <input
          name="avg_time_spent_minutes"
          type="number"
          step="0.1"
          required
          onChange={handleChange}
        />

        <label>Pages Viewed</label>
        <input name="pages_viewed" type="number" required onChange={handleChange} />

        <label>Previous Purchases</label>
        <input
          name="previous_purchases"
          type="number"
          required
          onChange={handleChange}
        />

        <label>Cart Added</label>
        <select name="cart_added" onChange={handleChange}>
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>

        <label>Discount Applied</label>
        <select name="discount_applied" onChange={handleChange}>
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>

        <label>Gender</label>
        <select name="gender" onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Country</label>
        <select name="country" onChange={handleChange}>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>

        <label>Device Type</label>
        <select name="device_type" onChange={handleChange}>
          <option value="Mobile">Mobile</option>
          <option value="Desktop">Desktop</option>
          <option value="Tablet">Tablet</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {result !== null && (
        <h3 style={{ marginTop: "20px" }}>
          Will Purchase: {result === 1 ? "YES" : "NO"}
        </h3>
      )}
    </div>
  );
};

export default PredictForm;
