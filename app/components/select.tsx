"use client";

import { CaretDown, Check } from "@phosphor-icons/react";
import { Children, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Option = { value: string; label: string; disabled: boolean };

type OptionProps = { value?: string | number; disabled?: boolean; children?: React.ReactNode };

function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

// Liest <option>-Kinder aus, damit Aufrufer wie bei einem normalen <select> schreiben können.
function readOptions(children: React.ReactNode): Option[] {
  const options: Option[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<OptionProps>(child)) return;
    if (child.type === "option") {
      const label = textOf(child.props.children);
      options.push({
        value: child.props.value !== undefined ? String(child.props.value) : label,
        label,
        disabled: Boolean(child.props.disabled),
      });
    } else if (child.props.children) {
      options.push(...readOptions(child.props.children));
    }
  });
  return options;
}

type Placement = { left: number; top: number; width: number; up: boolean; maxHeight: number };

// Öffnet nach unten, ausser unten ist zu wenig Platz und oben mehr.
function measure(button: HTMLElement | null, count: number): Placement | null {
  const box = button?.getBoundingClientRect();
  if (!box) return null;
  const below = window.innerHeight - box.bottom - 12;
  const above = box.top - 12;
  const wanted = Math.min(count * 40 + 12, 320);
  const up = below < Math.min(wanted, 200) && above > below;
  return {
    left: box.left,
    top: up ? box.top - 6 : box.bottom + 6,
    width: box.width,
    up,
    maxHeight: Math.max(Math.min(up ? above : below, 320), 120),
  };
}

type Props = {
  name?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
};

// Eigene Auswahlliste statt der Darstellung von Browser und Betriebssystem.
// Wert geht über ein verstecktes Feld mit dem Formular mit; Tastatur wie bei einem nativen Select.
export default function Select({ name, defaultValue, required, disabled, id, className, children, ...rest }: Props) {
  const options = readOptions(children);
  const initial = defaultValue ?? options.find((o) => !o.disabled)?.value ?? "";
  const [value, setValue] = useState(initial);
  const [lastDefault, setLastDefault] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [rect, setRect] = useState<Placement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const baseId = useId();
  const listId = `${baseId}-list`;

  // Neuer Vorgabewert vom Server (z. B. nach dem Speichern) übernimmt die Auswahl.
  if (defaultValue !== lastDefault) {
    setLastDefault(defaultValue);
    setValue(defaultValue ?? initial);
  }

  const selected = options.find((o) => o.value === value);
  const isPlaceholder = !selected || selected.disabled;

  const optionCount = options.length;
  const place = () => setRect(measure(buttonRef.current, optionCount));

  const openMenu = () => {
    if (disabled) return;
    place();
    const index = options.findIndex((o) => o.value === value);
    setActive(index >= 0 ? index : 0);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setValue(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const move = (from: number, step: number) => {
    let next = from;
    for (let i = 0; i < options.length; i++) {
      next = (next + step + options.length) % options.length;
      if (!options[next].disabled) return next;
    }
    return from;
  };

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setOpen(false);
    };
    // Beim Scrollen und Ändern der Fenstergrösse wandert die Liste mit; scrollt das Feld aus dem Bild, schliesst sie.
    const reposition = (event: Event) => {
      if (event.target instanceof Node && listRef.current?.contains(event.target)) return;
      const box = buttonRef.current?.getBoundingClientRect();
      if (!box || box.bottom < 0 || box.top > window.innerHeight) setOpen(false);
      else setRect(measure(buttonRef.current, optionCount));
    };
    document.addEventListener("pointerdown", close);
    const resize = () => setRect(measure(buttonRef.current, optionCount));
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, optionCount]);

  useLayoutEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    const key = event.key;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }
    if (key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (key === "Tab") {
      setOpen(false);
    } else if (key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => move(i, 1));
    } else if (key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => move(i, -1));
    } else if (key === "Home") {
      event.preventDefault();
      setActive(move(-1, 1));
    } else if (key === "End") {
      event.preventDefault();
      setActive(move(options.length, -1));
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      choose(active);
    } else if (key.length === 1) {
      const now = Date.now();
      typed.current.text = now - typed.current.at > 700 ? key : typed.current.text + key;
      typed.current.at = now;
      const match = options.findIndex(
        (o) => !o.disabled && o.label.toLowerCase().startsWith(typed.current.text.toLowerCase()),
      );
      if (match >= 0) setActive(match);
    }
  };

  return (
    <span
      className={`select${open ? " is-open" : ""}${disabled ? " is-disabled" : ""}${className ? ` ${className}` : ""}`}
    >
      <button
        ref={buttonRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${baseId}-o${active}` : undefined}
        aria-label={rest["aria-label"]}
        aria-required={required || undefined}
        disabled={disabled}
        className={`select-trigger${isPlaceholder ? " is-placeholder" : ""}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span className="select-value">{selected?.label ?? "Bitte wählen"}</span>
        <CaretDown size={16} weight="bold" className="select-caret" aria-hidden="true" />
      </button>
      {/* Trägt den Wert ins Formular und lässt den Browser Pflichtfelder prüfen. */}
      <input
        className="select-proxy"
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={() => {}}
        onFocus={() => buttonRef.current?.focus()}
      />
      {open &&
        rect &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className={`select-menu${rect.up ? " is-up" : ""}`}
            style={{
              left: rect.left,
              top: rect.up ? undefined : rect.top,
              bottom: rect.up ? window.innerHeight - rect.top : undefined,
              minWidth: rect.width,
              maxHeight: rect.maxHeight,
            }}
          >
            {options.map((option, index) => (
              <li
                key={`${option.value}-${index}`}
                id={`${baseId}-o${index}`}
                data-index={index}
                data-value={option.value}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled || undefined}
                className={`${index === active ? "is-active" : ""}${option.value === value ? " is-selected" : ""}${
                  option.disabled ? " is-disabled" : ""
                }`}
                onPointerEnter={() => !option.disabled && setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                {option.value === value && <Check size={15} weight="bold" aria-hidden="true" />}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </span>
  );
}
