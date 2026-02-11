import { useState, useMemo } from "react";

export default function App() {
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
    device_type: "Mobile",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const filledFields = Object.values(formData).filter(v => v !== "" && v !== null).length;
  const progress = Math.round((filledFields / Object.keys(formData).length) * 100);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        age: Number(formData.age),
        visits: Number(formData.visits),
        avg_time_spent_minutes: Number(formData.avg_time_spent_minutes),
        pages_viewed: Number(formData.pages_viewed),
        previous_purchases: Number(formData.previous_purchases),
        is_returning_user: Number(formData.is_returning_user),
        cart_added: Number(formData.cart_added),
        discount_applied: Number(formData.discount_applied),
      }),
    });

    const data = await response.json();
    setTimeout(() => {
      setResult(data.will_purchase);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl w-full max-w-3xl p-8 transition-all">

        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
          🛍️ Smart Sales Predictor
        </h1>
        <p className="text-center text-gray-600 mb-6">
          AI-powered purchase prediction engine
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
            {/* <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Form Progress</span>
              <span>{progress}%</span>
            </div> */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input label="Age" name="age" value={formData.age} onChange={handleChange} />
          <Input label="Visits" name="visits" value={formData.visits} onChange={handleChange} />
          <Input label="Avg Time Spent (min)" name="avg_time_spent_minutes" value={formData.avg_time_spent_minutes} onChange={handleChange} />
          <Input label="Pages Viewed" name="pages_viewed" value={formData.pages_viewed} onChange={handleChange} />
          <Input label="Previous Purchases" name="previous_purchases" value={formData.previous_purchases} onChange={handleChange} />

          <Select label="Returning User" name="is_returning_user" value={formData.is_returning_user} onChange={handleChange} options={[["0","No"],["1","Yes"]]} />
          <Select label="Cart Added" name="cart_added" value={formData.cart_added} onChange={handleChange} options={[["0","No"],["1","Yes"]]} />
          <Select label="Discount Applied" name="discount_applied" value={formData.discount_applied} onChange={handleChange} options={[["0","No"],["1","Yes"]]} />
          <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male","Female"]} />
          <Select label="Country" name="country" value={formData.country} onChange={handleChange} options={["India","USA","UK","Germany"]} />
          <Select label="Device Type" name="device_type" value={formData.device_type} onChange={handleChange} options={["Mobile","Desktop","Tablet"]} />

          <button
            type="submit"
            disabled={loading}
            className="col-span-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 rounded-xl transition-all transform hover:scale-105 disabled:bg-gray-400"
          >
            {loading ? "🔮 Predicting..." : "🚀 Predict Purchase"}
          </button>
        </form>

        {result !== null && (
          <div className={`mt-8 p-6 rounded-2xl text-center text-2xl font-bold animate-pulse ${
            result === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {result === 1
              ? "✅ Customer WILL Purchase"
              : "❌ Customer will NOT Purchase"}
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        {options.map(opt =>
          Array.isArray(opt)
            ? <option key={opt[0]} value={opt[0]}>{opt[1]}</option>
            : <option key={opt} value={opt}>{opt}</option>
        )}
      </select>
    </div>
  );
}
