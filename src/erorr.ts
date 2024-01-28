const el = document.getElementById("error");

export const logError = (errorText?: string | null) => {
  if (!el) {
    console.error("No 'error' element");
    return;
  }

  console.error(errorText);
  el.textContent = errorText || "";
};
