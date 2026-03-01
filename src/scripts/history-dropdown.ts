/**
 * History dropdown — shared between rule pages and year pages.
 *
 * Queries for a button with [aria-haspopup] and its associated dropdown
 * (next sibling element). Adds toggle, click-outside close, Escape close,
 * arrow-key navigation between menu items, Home/End, and Tab-close.
 */

export function initHistoryDropdown(): void {
  const btn = document.querySelector<HTMLButtonElement>('button[aria-haspopup]');
  if (!btn) return;

  const dropdown = btn.nextElementSibling as HTMLElement | null;
  if (!dropdown) return;

  const getItems = (): HTMLAnchorElement[] =>
    Array.from(dropdown.querySelectorAll<HTMLAnchorElement>('a[href]'));

  function open() {
    dropdown!.style.display = 'block';
    btn!.setAttribute('aria-expanded', 'true');
    // Focus first item
    const items = getItems();
    if (items.length > 0) items[0].focus();
  }

  function close(returnFocus = true) {
    dropdown!.style.display = 'none';
    btn!.setAttribute('aria-expanded', 'false');
    if (returnFocus) btn!.focus();
  }

  function isOpen(): boolean {
    return dropdown!.style.display !== 'none';
  }

  // Toggle on button click
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen()) {
      close();
    } else {
      open();
    }
  });

  // Close on click outside
  document.addEventListener('click', () => {
    if (isOpen()) close(false);
  });

  // Prevent clicks inside dropdown from closing it
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;

    const items = getItems();
    if (items.length === 0) return;

    const activeEl = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(activeEl as HTMLAnchorElement);

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close(true);
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < items.length - 1) {
          items[currentIndex + 1].focus();
        } else {
          items[0].focus();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          items[currentIndex - 1].focus();
        } else {
          items[items.length - 1].focus();
        }
        break;

      case 'Home':
        e.preventDefault();
        items[0].focus();
        break;

      case 'End':
        e.preventDefault();
        items[items.length - 1].focus();
        break;

      case 'Tab':
        close(false);
        break;
    }
  });
}
