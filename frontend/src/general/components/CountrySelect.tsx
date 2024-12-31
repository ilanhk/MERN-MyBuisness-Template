// import { useEffect, useState } from "react";
// import Select from "react-select";

// //got this from https://codesandbox.io/p/sandbox/country-dropdown-with-react-select-w0rk6?file=%2Fsrc%2FApp.js%3A22%2C14-22%2C29

// interface CountrySelectProps {
//   selectedCountry: string;
//   onCountryChange: (value: string) => void;
// }

// const CountrySelect : React.FC<CountrySelectProps>  = ({selectedCountry, onCountryChange}) => {
//   const [countries, setCountries] = useState([]);


//   useEffect(() => {
//     fetch(
//       "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         setCountries(data.countries);
//         onCountryChange(data.userSelectValue);
//       });
//   }, []);


//   return (
//     <Select
//       options={countries}
//       value={selectedCountry}
//       onChange={(selectedOption) => onCountryChange(selectedOption.label)}
//     />
//   );
// };

// export default CountrySelect;


import { useEffect, useState } from "react";
import Select from "react-select";

// Define the type for the selected country object
interface CountrySelectProps {
  savedCountry: string; 
  onCountryChange: (value: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ savedCountry, onCountryChange }) => {
  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<{ label: string; value: string } | null>(null);

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);

        // Find and set the saved country after countries are fetched
        const foundCountry = data.countries.find((country: { label: string; value: string }) => country.label.slice(4) === savedCountry);
        if (foundCountry) {
          setSelectedCountry(foundCountry);
        }
      });
  }, [savedCountry]);

  const handleCountryChange = (selectedOption: { label: string; value: string } | null) => {
    if (selectedOption) {
      setSelectedCountry(selectedOption);
      onCountryChange(selectedOption.label.slice(4));
    }
  };

  return (
    <Select
      options={countries}
      value={selectedCountry} // This is now set correctly after fetching data
      onChange={handleCountryChange} // Handles country selection
    />
  );
};

export default CountrySelect;
