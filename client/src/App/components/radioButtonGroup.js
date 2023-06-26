import { FormControl } from '@mui/material';
import { RadioGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Radio } from '@mui/material';

export default function RadioButtonGroup({options, onChange, selectedValue}) {
    return (
            <FormControl component='fieldset'>
                <RadioGroup
                    onChange={onChange} value={selectedValue}>
                    {options.map(({ value, label }) => (
                        <FormControlLabel
                            value={value}
                            control={<Radio />}
                            label={label}
                            key={value}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
    )
}