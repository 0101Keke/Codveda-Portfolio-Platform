import { useState } from "react";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  function handleSubmit() {
    if (!city.trim()) return;
    onSearch(city);
    setCity("");
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSubmit}>Search</button>
    </div>
  );
}

export default SearchBar;
