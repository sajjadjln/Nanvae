import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Checkbox } from '@mui/material';
import { useState } from 'react';

export function CheckBoxButtons({ items, onChange, checked }) {
  const [checkedItems, setCheckedItems] = useState(checked || []);

  const handleChecked = (value) => {
    const currentIndex = checkedItems.indexOf(value);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedItems(newChecked);
    onChange(newChecked);
  };

  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.includes(item)}
              onChange={() => handleChecked(item)}
            />
          }
          label={item}
          key={item}
        />
      ))}
    </FormGroup>
  );
}
