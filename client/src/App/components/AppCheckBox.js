import { FormControlLabel, Checkbox } from '@mui/material';
import { useController } from 'react-hook-form';

export default function AppCheckBox(props) {
    const { field } = useController({ ...props, defaultValue:false });
    return (
        <FormControlLabel
            control={
                <Checkbox
                    {...field}
                    checked={field.value}
                    color="secondary"
                    disabled={props.disabled}
                />
            }
            label={props.label}
        />
    )
}