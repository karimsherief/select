import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";
export interface SelectOptions {
  label: string;
  value: number;
}
interface SelectProps {
  options: SelectOptions[];
}
interface SingleSelectProps extends SelectProps {
  multiple?: false;
  value?: SelectOptions;
  onChange: (value: SelectOptions | undefined) => void;
}
interface MultipleSelectProps extends SelectProps {
  multiple: true;
  value: SelectOptions[];
  onChange: (value: SelectOptions[]) => void;
}
function Select({
  options,
  value,
  onChange,
  multiple,
}: SingleSelectProps | MultipleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlitedIndex, setHighlitedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);
  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }
  function selectOption(option: SelectOptions) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((opt) => opt !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }
  function isOptionSelected(option: SelectOptions) {
    return multiple ? value.includes(option) : value === option;
  }
  useEffect(() => {
    setHighlitedIndex(0);
  }, [isOpen]);
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.target != selectRef.current) return;

      switch (e.code) {
        case "Space":
        case "Enter":
          if (isOpen) {
            selectOption(options[highlitedIndex]);
          }
          setIsOpen((prev) => !prev);
          break;
        case "ArrowUp":
        case "ArrowDown":
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          let newIndex = highlitedIndex + (e.code === "ArrowUp" ? -1 : 1);
          if (newIndex >= 0 && newIndex < options.length) {
            setHighlitedIndex(newIndex);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    }
    selectRef.current?.addEventListener("keydown", handler);
    return () => {
      selectRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlitedIndex]);
  return (
    <div
      className={styles.container}
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
      ref={selectRef}
    >
      <span className={styles.value}>
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                className={styles["option-badge"]}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
              >
                {v.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        className={styles["clear-btn"]}
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
      >
        &times;
      </button>
      <div className={styles.divider} />
      <div className={styles.caret} />
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            key={option.value}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            } ${highlitedIndex === index ? styles.highlighted : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlitedIndex(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Select;
