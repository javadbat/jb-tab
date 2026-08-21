import { defineWebComponent, JBBaseComponent } from "jb-core";
import { registerDefaultVariables } from "jb-core/theme";
import type { JBTabTriggerWebComponent } from "jb-tab/trigger";
import CSS from "./jb-tab-list.css";
import VariablesCSS from "./variables.css";
import { renderHTML } from "./render.js";
import type { JBTabListElements, JBTabListSize, JBTabOrientation } from "./types.js";

const sizeVariants: readonly JBTabListSize[] = ["xs", "sm", "md", "lg", "xl"];

export class JBTabListWebComponent extends JBBaseComponent {
  static get observedAttributes(): string[] {
    return ["orientation", "size"];
  }

  elements: JBTabListElements;
  #selectedTrigger: JBTabTriggerWebComponent | null = null;
  #resizeObserver?: ResizeObserver;
  #indicatorFrame = 0;
  #internals?: ElementInternals;

  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      this.#internals = this.attachInternals();
      this.#internals.role = "tablist";
    } else {
      this.setAttribute("role", "tablist");
    }
    const shadowRoot = this.attachShadow({ mode: "open", clonable: true, serializable: true });
    registerDefaultVariables();
    const template = document.createElement("template");
    template.innerHTML = `<style>${VariablesCSS}\n${CSS}</style>${renderHTML()}`;
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.elements = {
      list: shadowRoot.querySelector(".tab-list")!,
      indicator: shadowRoot.querySelector(".selection-indicator")!,
      slot: shadowRoot.querySelector("slot")!,
    };
    this.#registerEventListener();
  }

  connectedCallback(): void {
    this.#updateOrientation(this.orientation, false);
    this.#observeSizeChanges();
    this.refreshIndicator();
  }

  disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();
    if (this.#indicatorFrame) cancelAnimationFrame(this.#indicatorFrame);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this.#onAttributeChange(name);
  }

  get orientation(): JBTabOrientation {
    return this.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
  }

  set orientation(value: JBTabOrientation) {
    const orientation = value === "vertical" ? "vertical" : "horizontal";
    this.#updateOrientation(orientation, true);
  }

  get size(): JBTabListSize {
    const size = this.getAttribute("size") as JBTabListSize | null;
    return size && sizeVariants.includes(size) ? size : "md";
  }

  set size(value: JBTabListSize | null) {
    if (value === null) this.removeAttribute("size");
    else this.setAttribute("size", value);
  }

  get selectedTrigger(): JBTabTriggerWebComponent | null {
    return this.#selectedTrigger;
  }

  get triggers(): JBTabTriggerWebComponent[] {
    return Array.from(this.children).filter(element => element.localName === "jb-tab-trigger") as JBTabTriggerWebComponent[];
  }

  setActiveTrigger(trigger: JBTabTriggerWebComponent | null): void {
    this.#selectedTrigger = trigger && trigger.parentElement === this ? trigger : null;
    this.#observeSizeChanges();
    this.refreshIndicator();
  }

  refreshIndicator(): void {
    if (!this.isConnected) return;
    if (this.#indicatorFrame) cancelAnimationFrame(this.#indicatorFrame);
    this.#indicatorFrame = requestAnimationFrame(() => {
      this.#indicatorFrame = 0;
      this.#updateIndicator();
    });
  }

  #registerEventListener(): void {
    this.addEventListener("keydown", this.#onKeyDown);
    this.elements.slot.addEventListener("slotchange", this.#onSlotChange);
    this.elements.list.addEventListener("scroll", this.#onScroll, { passive: true });
  }

  #onAttributeChange(name: string): void {
    if (name === "orientation") this.#updateOrientation(this.orientation, false);
    this.refreshIndicator();
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    const trigger = event.composedPath().find(node => node instanceof HTMLElement && node.localName === "jb-tab-trigger" && node.parentElement === this) as
      | JBTabTriggerWebComponent
      | undefined;
    if (!trigger) return;
    const enabledTriggers = this.triggers.filter(item => !item.disabled);
    if (enabledTriggers.length === 0) return;
    const currentIndex = enabledTriggers.indexOf(trigger);
    if (currentIndex < 0) return;

    const previousKey = this.orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    const nextKey = this.orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    let nextTrigger: JBTabTriggerWebComponent | undefined;
    if (event.key === previousKey) nextTrigger = enabledTriggers[(currentIndex - 1 + enabledTriggers.length) % enabledTriggers.length];
    else if (event.key === nextKey) nextTrigger = enabledTriggers[(currentIndex + 1) % enabledTriggers.length];
    else if (event.key === "Home") nextTrigger = enabledTriggers[0];
    else if (event.key === "End") nextTrigger = enabledTriggers[enabledTriggers.length - 1];
    if (!nextTrigger) return;

    event.preventDefault();
    nextTrigger.focus();
    nextTrigger.select();
  };

  #onSlotChange = (): void => {
    this.#observeSizeChanges();
    this.refreshIndicator();
  };

  #onScroll = (): void => {
    this.refreshIndicator();
  };

  #observeSizeChanges(): void {
    this.#resizeObserver?.disconnect();
    if (typeof ResizeObserver === "undefined") return;
    this.#resizeObserver = new ResizeObserver(() => this.refreshIndicator());
    this.#resizeObserver.observe(this.elements.list);
    for (const trigger of this.triggers) this.#resizeObserver.observe(trigger);
  }

  #updateOrientation(orientation: JBTabOrientation, reflect: boolean): void {
    if (reflect && this.getAttribute("orientation") !== orientation) {
      this.setAttribute("orientation", orientation);
      return;
    }
    this.setAttribute("aria-orientation", orientation);
    if (this.#internals) this.#internals.ariaOrientation = orientation;
  }
/**
 * will update indicator background position base on selected trigger
 */
  #updateIndicator(): void {
    const trigger = this.#selectedTrigger;
    if (!trigger?.isConnected || trigger.parentElement !== this) {
      this.elements.indicator.dataset.visible = "false";
      return;
    }
    const listRect = this.elements.list.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const x = triggerRect.left - listRect.left + this.elements.list.scrollLeft;
    const y = triggerRect.top - listRect.top + this.elements.list.scrollTop;
    const indicatorColor = this.#getIndicatorColor(trigger);
    this.elements.indicator.style.width = `${triggerRect.width}px`;
    this.elements.indicator.style.height = `${triggerRect.height}px`;
    this.elements.indicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (indicatorColor) this.elements.indicator.style.setProperty("--indicator-color-from-trigger", indicatorColor);
    else this.elements.indicator.style.removeProperty("--indicator-color-from-trigger");
    this.elements.indicator.dataset.visible = "true";
  }

  #getIndicatorColor(trigger: JBTabTriggerWebComponent): string {
    const triggerStyle = getComputedStyle(trigger);
    return triggerStyle.getPropertyValue("--jb-tab-trigger-indicator-color").trim() || triggerStyle.getPropertyValue("--indicator-color-from-attribute").trim();
  }
}

defineWebComponent("jb-tab-list", JBTabListWebComponent);

declare global {
  interface HTMLElementTagNameMap {
    "jb-tab-list": JBTabListWebComponent;
  }
}
