# jb-tab

[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-tab/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-tab)](https://www.npmjs.com/package/jb-tab)
![GitHub Created At](https://img.shields.io/github/created-at/javadbat/jb-tab)

Accessible, composable tabs for the JB Design System. The package contains four independently importable custom elements and matching React wrappers.

- Supports horizontal and vertical tab lists.
- Supports keyboard navigation and disabled triggers.
- Supports controlled, default, and nullable selection.
- Supports multiple panels for one trigger value.
- Provides size and color variants with CSS customization.
- Supports both RTL and LTR pages.

## When to use

Use `jb-tab` to organize related content into views where one view is active at a time. It is a good fit for settings sections, dashboards, profile pages, and compact content switchers. See the [basic tabs demo](https://javadbat.github.io/design-system/?path=/story/components-jbtab--basic) for the default interaction.

Use another navigation pattern when each item should open a separate page or URL. Tabs represent views within the current context rather than application-level navigation.

## Demo

- Explore the [basic tabs](https://javadbat.github.io/design-system/?path=/story/components-jbtab--basic), [colored indicators](https://javadbat.github.io/design-system/?path=/story/components-jbtab--colored-indicators), [size variants](https://javadbat.github.io/design-system/?path=/story/components-jbtab--size-variants), and [vertical nested layout](https://javadbat.github.io/design-system/?path=/story/components-jbtab--nested-layout) demos.
- See [nullable selection](https://javadbat.github.io/design-system/?path=/story/components-jbtab--nullable), [duplicate panels](https://javadbat.github.io/design-system/?path=/story/components-jbtab--duplicate-panels), and [disabled keyboard navigation](https://javadbat.github.io/design-system/?path=/story/components-jbtab--disabled-and-keyboard) for advanced behavior.
- Compare all component recipes in the [style gallery](https://javadbat.github.io/design-system/?path=/story/components-jbtab-style--gallery).

## Using with JS frameworks

<a href="https://github.com/javadbat/jb-tab/tree/main/react" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/React.js-jb--tab%2Freact-000.svg?logo=react&logoColor=%2361DAFB" height="30" /></a>

Other integrations: <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#angular" target="_blank" rel="noopener noreferrer">Angular</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#vue" target="_blank" rel="noopener noreferrer">Vue</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#nuxt" target="_blank" rel="noopener noreferrer">Nuxt</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#svelte" target="_blank" rel="noopener noreferrer">Svelte</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#nextjs" target="_blank" rel="noopener noreferrer">Next.js</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#lit" target="_blank" rel="noopener noreferrer">Lit</a>

## Installation

```sh
npm install jb-tab
```

Importing the root package registers all four custom elements:

```js
import "jb-tab";
```

## Web component usage

```html
<jb-tab value="home">
  <aside>
    <jb-tab-list aria-label="Account sections">
      <jb-tab-trigger value="home">Home</jb-tab-trigger>
      <jb-tab-trigger value="about">About</jb-tab-trigger>
      <jb-tab-trigger value="user">User</jb-tab-trigger>
    </jb-tab-list>
  </aside>

  <main>
    <jb-tab-content value="home">Home content</jb-tab-content>
    <jb-tab-content value="about">About content</jb-tab-content>
    <jb-tab-content value="user">User content</jb-tab-content>
  </main>
</jb-tab>
```

The list and panels may be nested in ordinary light-DOM elements. Triggers must be direct children of `jb-tab-list`. Nested `jb-tab` instances manage only their own nearest descendants.

## Selection

`jb-tab` is the only selection owner. Its public properties are:

| Property | Attribute | Type | Behavior |
| --- | --- | --- | --- |
| `value` | `value` | `string \| null` | Current selected value. |
| `defaultValue` | `default-value` | `string \| null` | Initial value used when `value` is absent. |
| `nullable` | `nullable` | `boolean` | Keeps the initial value null instead of selecting the first enabled trigger. |

### Child element API

| Element | Property/attribute | Type | Description |
| --- | --- | --- | --- |
| `jb-tab-list` | `orientation` | `'horizontal' \| 'vertical'` | Controls layout and arrow-key direction. Defaults to `horizontal`. |
| `jb-tab-list` | `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Applies one size to the list's direct triggers. Defaults to `md`. |
| `jb-tab-trigger` | `value` | `string` | Required value used to select matching panels. |
| `jb-tab-trigger` | `disabled` | `boolean` | Prevents selection and removes the trigger from keyboard navigation. |
| `jb-tab-trigger` | `color` | variant or CSS color | Sets the moving indicator color for this trigger. |
| `jb-tab-trigger` | `selected` | `boolean` | Writable native-style selection state; synchronizes the owning tab value. |
| `jb-tab-content` | `value` | `string` | Shows the panel when its value matches the owning tab. |
| `jb-tab-content` | `hidden` | `boolean` | Exposes and optionally overrides panel visibility. |

When `nullable` is absent and neither value is supplied, the first enabled trigger is selected. Setting `value` to `null` on a nullable tab hides every panel. Trigger values must be unique. Multiple panels may use the same value; every matching panel is shown.

Selecting a trigger dispatches a bubbling, composed `select` event from `jb-tab-trigger`. When the value changes, `jb-tab` dispatches a bubbling, composed `change` event.

```js
tab.addEventListener("change", event => {
  console.log(event.detail.value);
  console.log(event.detail.previousValue);
  console.log(event.detail.trigger);
});
```

## React

```tsx
import { useState } from "react";
import { JBTab } from "jb-tab/react";
import { JBTabList } from "jb-tab/list/react";
import { JBTabTrigger } from "jb-tab/trigger/react";
import { JBTabContent } from "jb-tab/content/react";

export function AccountTabs() {
  const [value, setValue] = useState("home");

  return (
    <JBTab value={value} onChange={event => setValue(event.detail.value)}>
      <JBTabList aria-label="Account sections">
        <JBTabTrigger value="home">Home</JBTabTrigger>
        <JBTabTrigger value="about">About</JBTabTrigger>
      </JBTabList>
      <JBTabContent value="home">Home content</JBTabContent>
      <JBTabContent value="about">About content</JBTabContent>
    </JBTab>
  );
}
```

The React event props are `onSelect` on `JBTabTrigger` and `onChange` on `JBTab`.

## Keyboard behavior

- `ArrowLeft` and `ArrowRight` navigate horizontal lists.
- `ArrowUp` and `ArrowDown` navigate vertical lists.
- `Home` and `End` move to the first and last enabled trigger.
- `Enter` and `Space` select a focused trigger.
- Disabled triggers are skipped.

Arrow navigation automatically activates the newly focused trigger.

## Panel display and animation

Inactive `jb-tab-content` hosts have `hidden` set to `true` and use `display: none`; visible hosts have `hidden` set to `false` and use `display: block`. Visibility is exposed through the standard `hidden` property and attribute and through `:state(hidden)`. Changing a panel's `hidden` property does not change the selected trigger, so a consumer may explicitly show an additional panel when needed.

```css
jb-tab-content {
  opacity: 0;
  transition: opacity 200ms ease, display 200ms allow-discrete;
}

jb-tab-content:not([hidden]) {
  display: grid;
  opacity: 1;
}

@starting-style {
  jb-tab-content:not([hidden]) {
    opacity: 0;
  }
}
```

`display: none` removes inactive panels from layout and painting. It does not defer custom-element construction or JavaScript execution inside a panel.

## List styling

`jb-tab-list` exposes `list` and `indicator` CSS parts. Each trigger exposes a `content` part.

| CSS variable | Purpose |
| --- | --- |
| `--jb-tab-list-background` | List background. |
| `--jb-tab-list-padding` | Uniform space between the list background and its triggers. |
| `--jb-tab-trigger-border-radius` | Shared trigger and indicator radius; also used to derive the outer background radius. |
| `--jb-tab-list-indicator-color` | Default indicator color. |
| `--jb-tab-list-indicator-duration` | Indicator transition duration. |
| `--jb-tab-list-indicator-easing` | Indicator transition easing. |
| `--jb-tab-list-indicator-shadow` | Indicator shadow. |
| `--jb-tab-trigger-indicator-color` | Per-trigger indicator color override. |
| `--jb-tab-trigger-color` | Trigger text color. |
| `--jb-tab-trigger-color-selected` | Selected trigger text color. |
| `--jb-tab-trigger-padding` | Trigger padding. |

Each trigger can set the indicator color with a design-system variant or any valid CSS color:

```html
<jb-tab-trigger value="home" color="primary">Home</jb-tab-trigger>
<jb-tab-trigger value="about" color="#efefef">About</jb-tab-trigger>
```

Supported base variants are `primary`, `secondary`, `positive`, `danger`, `warning`, `light`, and `dark`. Accent colors
also provide `primary-subtle`, `secondary-subtle`, `positive-subtle`, `danger-subtle`, and `warning-subtle`. Base colors
use inverse selected text while subtle and light colors use primary selected text, with no delayed color update. Arbitrary
CSS colors automatically choose primary or inverse text. `--jb-tab-trigger-indicator-color` and
`--jb-tab-trigger-color-selected` remain available as explicit per-trigger overrides.

Set `size` once on `jb-tab-list` so every direct trigger uses the same `xs`, `sm`, `md`, `lg`, or `xl` preset. The default is `md`:

```html
<jb-tab-list size="xl">
  <jb-tab-trigger value="first">First</jb-tab-trigger>
  <jb-tab-trigger value="second">Second</jb-tab-trigger>
</jb-tab-list>
```

The outer list radius is derived as `calc(var(--tab-trigger-border-radius) + var(--padding))`, keeping the background
curve concentric with the shared trigger and indicator curve at every size.

Use `orientation="vertical"` on `jb-tab-list` for a vertical list. The default orientation is horizontal.

## Accessibility notes

Give each `jb-tab-list` an accessible name with `aria-label` or `aria-labelledby`. The components provide the `tablist`, `tab`, and `tabpanel` roles, connect triggers and panels through ARIA attributes, manage roving focus, and skip disabled triggers. The [keyboard demo](https://javadbat.github.io/design-system/?path=/story/components-jbtab--disabled-and-keyboard) exercises the supported navigation.

## Related docs

- See the [React README](react/README.md) for JSX usage and React prop names.
- See the [JB Design System component list](https://javadbat.github.io/design-system/) for more components.
- Use the [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) to contribute to this component.

## AI agent notes

- Import `jb-tab` once to register all four custom elements, or import the individual `jb-tab/list`, `jb-tab/trigger`, and `jb-tab/content` entry points.
- Keep `jb-tab-trigger` elements as direct children of `jb-tab-list`; panels may be nested elsewhere inside the owning `jb-tab`.
- Treat `jb-tab.value` as the selection source of truth. Trigger `selected` state and panel visibility are synchronized from it.
- Use unique trigger values. Multiple `jb-tab-content` elements may intentionally share one value.
- Listen for `change` on `jb-tab` for selection changes and `select` on `jb-tab-trigger` for the initiating interaction.
- Use `aria-label` or `aria-labelledby` on every `jb-tab-list`.
