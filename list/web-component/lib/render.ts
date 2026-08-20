export function renderHTML(): string {
  return /* html */ `
    <div class="tab-list" part="list">
      <span class="selection-indicator" part="indicator" aria-hidden="true"></span>
      <slot></slot>
    </div>
  `;
}
