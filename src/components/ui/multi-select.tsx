/**
 * @file Custom multi-select dropdown component
 */

import type React from "react";
import { useEffect, useState, useRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (selectedOptions.length && value && !value?.length) {
      onChange?.(defaultSelected);
    }
  }, [defaultSelected]);

  useEffect(() => {
    if (
      value?.length &&
      (value.length !== selectedOptions.length ||
        value.some((val) => !selectedOptions.includes(val)))
    ) {
      setSelectedOptions(value);
    }
  }, [value, selectedOptions]);

  const handleSelect = (optionValue: string) => {
    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((value) => value !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const removeOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const selectedValuesText = selectedOptions.map(
    (value) => options.find((option) => option.value === value)?.label || ""
  );

  return (
    <div className="relative z-20 inline-block w-full" ref={containerRef}>
      <div className="relative flex flex-col items-center">
        <div onClick={toggleDropdown} className="w-full">
          <div className="mb-2 flex h-11 rounded-lg border border-border bg-card py-1.5 pl-3 pr-3 shadow-theme-xs outline-hidden transition focus:border-primary focus:ring-1 focus:ring-ring">
            <div className="flex flex-wrap flex-auto gap-2">
              {selectedValuesText.length > 0 ? (
                selectedValuesText.map((text, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-center rounded-full border border-border/60 bg-secondary/25 py-1 pl-2.5 pr-2 text-sm text-foreground hover:border-primary/50"
                  >
                    <span className="flex-initial max-w-full">{text}</span>
                    <div className="flex flex-row-reverse flex-auto">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(selectedOptions[index]);
                        }}
                        className="cursor-pointer pl-2 text-muted-foreground group-hover:text-primary"
                      >
                        <svg
                          className="fill-current"
                          role="button"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <input
                  placeholder="Please select options..."
                  className="h-full w-full appearance-none border-0 bg-transparent p-1 pr-2 text-sm text-foreground outline-hidden placeholder:text-muted-foreground focus:border-0 focus:outline-hidden focus:ring-0"
                  readOnly
                  value="Please select options..."
                />
              )}
            </div>
            <div className="flex w-7 items-center py-1 pl-1 pr-1">
              <button
                type="button"
                onClick={toggleDropdown}
                className="h-5 w-5 cursor-pointer text-muted-foreground outline-hidden focus:outline-hidden"
              >
                <svg
                  className={`stroke-current ${isOpen ? "rotate-180" : ""}`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute left-0 top-full z-40 max-h-select w-full overflow-y-auto rounded-lg border border-border bg-card shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="w-full cursor-pointer rounded-t border-b border-border hover:bg-primary/5"
                  onClick={() => handleSelect(option.value)}
                >
                  <div
                    className={`relative flex w-full items-center p-2 pl-2 ${
                      selectedOptions.includes(option.value)
                        ? "bg-primary/10"
                        : ""
                    }`}
                  >
                    <div className="mx-2 leading-6 text-foreground">
                      {option.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
