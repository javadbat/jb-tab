import { defineWebComponent, JBBaseComponent } from "jb-core";
import { registerDefaultVariables } from "jb-core/theme";
import CSS from "./jb-tab-trigger.css";
import VariablesCSS from "./variables.css";
import { renderHTML } from "./render.js";
import type { JBTabSelectEvent, JBTabTriggerColor, JBTabTriggerColorVariant } from "./types.js";

const colorVariants: readonly JBTabTriggerColorVariant[] = [
  "primary",
  "primary-subtle",
  "secondary",
  "secondary-subtle",
  "positive",
  "positive-subtle",
  "danger",
  "danger-subtle",
  "warning",
  "warning-subtle",
  "light",
  "dark",
];

export class JBTabTriggerWebComponent extends JBBaseComponent {
  static get observedAttributes(): string[] {
    return ["value", "disabled", "color"];
  }

  #value = "";
  #selected = false;
  #colorCanvas = document.createElement("canvas");
  #internals?: ElementInternals;

  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      this.#internals = this.attachInternals();
      this.#internals.role = "tab";
    } else {
      this.setAttribute("role", "tab");
    }
    const shadowRoot = this.attachShadow({ mode: "open", clonable: true, serializable: true });
    registerDefaultVariables();
    const template = document.createElement("template");
    template.innerHTML = `<style>${VariablesCSS}\n${CSS}</style>${renderHTML()}`;
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.#registerEventListener();
  }

  connectedCallback(): void {
    this.#value = this.getAttribute("value") ?? "";
    this.#updateIndicatorColor(this.getAttribute("color"));
    this.#updateAccessibility();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this.#onAttributeChange(name, newValue);
  }

  get value(): string {
    return this.#value;
  }

  set value(value: string) {
    const normalizedValue = String(value ?? "");
    this.#value = normalizedValue;
    if (this.getAttribute("value") !== normalizedValue) this.setAttribute("value", normalizedValue);
  }

  get disabled(): boolean {
    return this.hasAttribute("disabled");
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", Boolean(value));
  }

  get color(): JBTabTriggerColor | null {
    return this.getAttribute("color");
  }

  set color(value: JBTabTriggerColor | null) {
    if (value === null) this.removeAttribute("color");
    else this.setAttribute("color", value);
  }

  get selected(): boolean {
    return this.#selected;
  }

  set selected(value: boolean) {
    const selected = Boolean(value);
    if (this.#selected === selected) return;
    if (selected) this.#updateSelectedTextColor();
    this.#selected = selected;
    this.toggleAttribute("selected", selected);
    if (selected) this.#internals?.states.add("selected");
    else this.#internals?.states.delete("selected");
    this.#updateAccessibility();
  }

  setAriaControls(elements: HTMLElement[]): void {
    const ids = elements.map(element => element.id).filter(Boolean);
    if (ids.length > 0) this.setAttribute("aria-controls", ids.join(" "));
    else this.removeAttribute("aria-controls");
  }

  select(): void {
    if (this.disabled) return;
    const event: JBTabSelectEvent = new CustomEvent("select", {
      detail: { value: this.value, trigger: this },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  #registerEventListener(): void {
    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeyDown);
  }

  #onAttributeChange(name: string, value: string | null): void {
    if (name === "value") this.#value = value ?? "";
    if (name === "color") {
      this.#updateIndicatorColor(value);
      this.#refreshListIndicator();
    }
    this.#updateAccessibility();
  }

  #updateIndicatorColor(value: string | null): void {
    const isVariant = value !== null && colorVariants.includes(value as JBTabTriggerColorVariant);
    const isCSSColor = value !== null && typeof globalThis.CSS !== "undefined" && globalThis.CSS.supports("color", value);
    if (!isVariant && isCSSColor) this.style.setProperty("--indicator-color-from-attribute", value);
    else this.style.removeProperty("--indicator-color-from-attribute");
    this.#updateSelectedTextColor();
  }

  #updateSelectedTextColor(): void {
    const triggerStyle = getComputedStyle(this);
    const explicitIndicatorColor = triggerStyle.getPropertyValue("--jb-tab-trigger-indicator-color").trim();
    const color = this.color;
    const isVariant = color !== null && colorVariants.includes(color as JBTabTriggerColorVariant);
    if (!explicitIndicatorColor && isVariant) {
      this.style.removeProperty("--selected-color-from-indicator");
      return;
    }
    const indicatorColor = explicitIndicatorColor || triggerStyle.getPropertyValue("--indicator-color-from-attribute").trim();
    if (!indicatorColor) {
      this.style.removeProperty("--selected-color-from-indicator");
      return;
    }
    const context = this.#colorCanvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = "white";
    context.fillRect(0, 0, 1, 1);
    context.fillStyle = indicatorColor;
    context.fillRect(0, 0, 1, 1);
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    const toLinear = (channel: number): number => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    const luminance = 0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue);
    const selectedColor = luminance > 0.179 ? "var(--jb-content-primary)" : "var(--jb-content-inverse)";
    this.style.setProperty("--selected-color-from-indicator", selectedColor);
  }

  #refreshListIndicator(): void {
    const list = this.parentElement;
    if (list?.localName !== "jb-tab-list") return;
    (list as HTMLElement & { refreshIndicator?: () => void }).refreshIndicator?.();
  }

  #onClick = (): void => {
    this.select();
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.select();
  };

  #updateAccessibility(): void {
    const ariaSelected = String(this.#selected);
    const ariaDisabled = String(this.disabled);
    this.setAttribute("aria-selected", ariaSelected);
    this.setAttribute("aria-disabled", ariaDisabled);
    if (this.#internals) {
      this.#internals.ariaSelected = ariaSelected;
      this.#internals.ariaDisabled = ariaDisabled;
    }
    this.tabIndex = !this.disabled && this.#selected ? 0 : -1;
  }
}

defineWebComponent("jb-tab-trigger", JBTabTriggerWebComponent);

declare global {
  interface HTMLElementTagNameMap {
    "jb-tab-trigger": JBTabTriggerWebComponent;
  }
}
