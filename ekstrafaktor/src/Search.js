import React, { useEffect } from 'react';



const Search = (props) => {
    
  useEffect(() => {
    props.setQuery('');//resetter søkefeltet pga sideskift & ny dag
  }, [props.location, props.selectedDate]);

  const handleInputChange = (e) => {
    props.setQuery(e.target.value);
  };

  return (
    <div>
      <input type="text" id='Search' value={props.query} onChange={handleInputChange} placeholder='søk...' />
    </div>
  );
};

export default Search;