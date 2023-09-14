import { useState } from "react";
import Select, { SelectOptions } from "./Select";

const OPTIONS = [
  { label: "first", value: 1 },
  { label: "second", value: 2 },
  { label: "third", value: 3 },
  { label: "fourth", value: 4 },
  { label: "fifth", value: 5 },
];
function App() {
  const [value, setValue] = useState<SelectOptions | undefined>(OPTIONS[0]);
  const [multipleValue, setMultipleValue] = useState<SelectOptions[]>([
    OPTIONS[0],
  ]);
  return (
    <div className="App">
      <Select
        options={OPTIONS}
        multiple
        value={multipleValue}
        onChange={setMultipleValue}
      />
      <br />
      <Select
        options={OPTIONS}
        value={value}
        onChange={(option) => setValue(option)}
      />
    </div>
  );
}

export default App;
