import {useState} from "react";
import { ChromePicker } from 'react-color';

export default function ColorPanel({ onSelect, currentValue }: Props){
    const [color, setColor] = useState(currentValue)
    const onChange = (color) => {
        setColor(color.hex)
    }

    const onChangeComplete = (color) => {
        onSelect(color.hex)
    }

    return  <ChromePicker width={"100%"} onChange={ onChange } disableAlpha={true} color={color} onChangeComplete={onChangeComplete}/>
}

interface Props{
    onSelect: (color: string) => void;
    currentValue: string;
}