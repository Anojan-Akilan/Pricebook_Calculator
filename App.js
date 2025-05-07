import React, { useEffect, useState } from "react";
import {
  getRegions,
  getCountries,
  getPricing,
} from "./api";
import "./styles.css";

function App() {
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    region: "",
    country: "",
    level: "L1",
    term: "short",
    rate_type: "with_backfill",
  });
  const [price, setPrice] = useState(null);

  useEffect(() => {
    getRegions().then(setRegions);
  }, []);

  useEffect(() => {
    if (form.region) {
      getCountries(form.region).then(setCountries);
    }
  }, [form.region]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await getPricing(form);
    setPrice(data.price || "Not Found");
  };

  return (
    <div className="container">
      <h1>Price Book Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Region:
          <select name="region" value={form.region} onChange={handleChange}>
            <option value="">Select Region</option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>

        <label>
          Country:
          <select name="country" value={form.country} onChange={handleChange}>
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Level:
          <select name="level" value={form.level} onChange={handleChange}>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
          </select>
        </label>

        <label>
          Term:
          <select name="term" value={form.term} onChange={handleChange}>
            <option value="short">Short</option>
            <option value="long">Long</option>
          </select>
        </label>

        <label>
          Rate Type:
          <select
            name="rate_type"
            value={form.rate_type}
            onChange={handleChange}
          >
            <option value="with_backfill">With Backfill</option>
            <option value="without_backfill">Without Backfill</option>
          </select>
        </label>

        <button type="submit">Calculate Price</button>
      </form>

      {price && (
        <div className="result">
          <strong>Calculated Price:</strong> {price}
        </div>
      )}
    </div>
  );
}

export default App;
