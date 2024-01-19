export const logError = (errorText?: string | null) => {
  const el = document.getElementById("error");
  if (!el) {
    console.error("No 'error' element");
    return;
  }

  console.error(errorText);
  el.textContent = errorText || "";
};
