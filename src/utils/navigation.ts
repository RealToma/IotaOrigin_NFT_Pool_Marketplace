export function navigateToURL(url: string) {
  window.location.assign(url);
}

export function openInNewTab(url: string) {
  if (window) {
    window.open(url, '_blank')?.focus();
  }
}
