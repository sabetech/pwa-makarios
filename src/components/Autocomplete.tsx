import { Input, List } from "antd-mobile";
import { useState } from "react";

type AutocompleteProps = {
    items: {
        id: string | number,
        name: string
    }[]
    onItemSelected: (item: {
        id: string | number,
        name: string
    }) => void
    placeholder?: string
}
const Autocomplete:React.FC<AutocompleteProps> = ({items, onItemSelected, placeholder}) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<{id: string | number, name: string}[]>([]);

    const handleInputChange = (value :string) => {
        setInputValue(value);
        if (value) {
          const filtered = items.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
          );
          setFilteredSuggestions(filtered);
        } else {
          setFilteredSuggestions([]);
        }
      };

      const handleSelect = (item: { id: string | number, name: string }) => {
        console.log("Select internal::", item)
        setInputValue(item.name);
        setFilteredSuggestions([]); // Clear suggestions after selection
        onItemSelected(item);
      };

    return (<>
        <Input 
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            clearable
        />
        {/* Display Suggestions */}
      {filteredSuggestions.length > 0 && (
        <List mode='card' style={{'--font-size': '14px'}}>
          {filteredSuggestions.map((item, index) => (
            <List.Item 
                arrow={false}
                key={index} onClick={() => handleSelect(item)}>
              {item.name}
            </List.Item>
          ))}
        </List>
      )}
    </>
    )
}

export default Autocomplete;