import { useCallback } from "react";

const useAutoFocus = () => {
  const inputRef = useCallback((inputElement: HTMLInputElement | null) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return inputRef;
};

export default useAutoFocus;