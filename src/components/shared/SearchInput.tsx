interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-xs bg-slate-100 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 placeholder-slate-400"
    />
  );
}
