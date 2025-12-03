import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="form-control">
      {label && <label className="label">{label}</label>}
      <input {...props} className="input" />
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

