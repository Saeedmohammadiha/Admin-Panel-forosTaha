import React, {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
/**
 * search input that stors the value as a query sring 
 *  
 * @param {setSearch function that acceps it as a props} param0 
 * @returns 
 */
const SearchInput = ({ setSearch }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function onChange(e) {
    setQuery(e.target.value);
    setSearch(query);
    
  }

  useEffect(() => {
    setSearch(query);
    const params = new URLSearchParams();
    if (query) {
      params.append("search", query);
    } else {
      params.delete("search");
    }
    navigate({ search: params.toString() });
  }, [query, navigate]);

  return (
    <input
      className="form-control ml-2 mr-sm-2"
      type="search"
      placeholder="پایه"
      aria-label="Search"
      value={query}
      onChange={onChange}
    />
  );
};

export default SearchInput;
