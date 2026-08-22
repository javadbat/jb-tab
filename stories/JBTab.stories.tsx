import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import type { JBTabContentWebComponent } from "jb-tab/content";
import type { JBTabListWebComponent } from "jb-tab/list";
import type { JBTabTriggerWebComponent } from "jb-tab/trigger";
import type { JBTabWebComponent } from "jb-tab";
import { JBTab } from "jb-tab/react";
import { JBTabContent } from "jb-tab/content/react";
import { JBTabList } from "jb-tab/list/react";
import { JBTabTrigger } from "jb-tab/trigger/react";
import "./jb-tab.css";

const meta = {
  title: "Components/JBTab",
  component: JBTab,
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof JBTab>;

export default meta;
type Story = StoryObj<typeof meta>;

function StandardTabs({ nullable = false }: { nullable?: boolean }) {
  return (
    <JBTab nullable={nullable}>
      <JBTabList aria-label="Account sections">
        <JBTabTrigger value="home">Home</JBTabTrigger>
        <JBTabTrigger value="about">About</JBTabTrigger>
        <JBTabTrigger value="user">User</JBTabTrigger>
      </JBTabList>
      <JBTabContent value="home">Home content</JBTabContent>
      <JBTabContent value="about">About content</JBTabContent>
      <JBTabContent value="user">User content</JBTabContent>
    </JBTab>
  );
}

export const Basic: Story = {
  render: args => (
    <JBTab onChange={args.onChange}>
      <JBTabList aria-label="Account sections">
        <JBTabTrigger value="home">Home</JBTabTrigger>
        <JBTabTrigger value="about">About</JBTabTrigger>
        <JBTabTrigger value="user">User</JBTabTrigger>
      </JBTabList>
      <JBTabContent value="home">Home content</JBTabContent>
      <JBTabContent value="about">About content</JBTabContent>
      <JBTabContent value="user">User content</JBTabContent>
    </JBTab>
  ),
  play: async ({ canvasElement, args }) => {
    const tab = canvasElement.querySelector<JBTabWebComponent>("jb-tab")!;
    const triggers = Array.from(tab.querySelectorAll<JBTabTriggerWebComponent>("jb-tab-trigger"));
    const contents = Array.from(tab.querySelectorAll<JBTabContentWebComponent>("jb-tab-content"));
    await waitFor(() => expect(tab.value).toBe("home"));
    expect(triggers[0].selected).toBe(true);
    expect(contents[0].hidden).toBe(false);
    expect(getComputedStyle(contents[1]).display).toBe("none");
    expect(triggers[0].getAttribute("aria-controls")).toContain(contents[0].id);
    expect(contents[0].getAttribute("aria-labelledby")).toBe(triggers[0].id);

    await userEvent.click(triggers[1]);
    expect(tab.value).toBe("about");
    expect(contents[0].hidden).toBe(true);
    expect(contents[1].hidden).toBe(false);
    expect(args.onChange).toHaveBeenCalledOnce();

    triggers[2].selected = true;
    expect(tab.value).toBe("user");
    expect(triggers.filter(trigger => trigger.selected)).toEqual([triggers[2]]);
    expect(contents[2].hidden).toBe(false);
    expect(args.onChange).toHaveBeenCalledOnce();

    contents[0].hidden = false;
    expect(contents[0].hidden).toBe(false);
    expect(triggers.filter(trigger => trigger.selected)).toEqual([triggers[2]]);
  },
};

export const RTL: Story = {
  globals: {
    locale: "fa",
    dir: "rtl",
  },
  render: () => (
    <JBTab defaultValue="profile">
      <JBTabList aria-label="بخش‌های حساب کاربری">
        <JBTabTrigger value="profile">پروفایل</JBTabTrigger>
        <JBTabTrigger value="security">امنیت</JBTabTrigger>
        <JBTabTrigger value="notifications">اعلان‌ها</JBTabTrigger>
      </JBTabList>
      <JBTabContent value="profile">اطلاعات پروفایل شما</JBTabContent>
      <JBTabContent value="security">تنظیمات امنیت حساب کاربری</JBTabContent>
      <JBTabContent value="notifications">تنظیمات اعلان‌ها</JBTabContent>
    </JBTab>
  ),
  play: async ({ canvasElement }) => {
    const tab = canvasElement.querySelector<JBTabWebComponent>("jb-tab")!;
    const list = tab.querySelector<JBTabListWebComponent>("jb-tab-list")!;
    const security = tab.querySelector<JBTabTriggerWebComponent>('jb-tab-trigger[value="security"]')!;
    await waitFor(() => expect(getComputedStyle(list).direction).toBe("rtl"));
    expect(tab.value).toBe("profile");
    await userEvent.click(security);
    expect(tab.value).toBe("security");
  },
};

export const ColoredIndicators: Story = {
  render: () => (
    <JBTab>
      <JBTabList className="jb-tab-story-colors" aria-label="Colored sections">
        <JBTabTrigger value="primary" color="primary">
          Primary
        </JBTabTrigger>
        <JBTabTrigger value="secondary" color="secondary">
          Secondary
        </JBTabTrigger>
        <JBTabTrigger value="positive" color="positive">
          Positive
        </JBTabTrigger>
        <JBTabTrigger value="danger" color="danger">
          Danger
        </JBTabTrigger>
        <JBTabTrigger value="warning" color="warning">
          Warning
        </JBTabTrigger>
        <JBTabTrigger value="light" color="light">
          Light
        </JBTabTrigger>
        <JBTabTrigger value="dark" color="dark">
          Dark
        </JBTabTrigger>
        <JBTabTrigger value="primary-subtle" color="primary-subtle">
          Primary subtle
        </JBTabTrigger>
        <JBTabTrigger value="secondary-subtle" color="secondary-subtle">
          Secondary subtle
        </JBTabTrigger>
        <JBTabTrigger value="positive-subtle" color="positive-subtle">
          Positive subtle
        </JBTabTrigger>
        <JBTabTrigger value="danger-subtle" color="danger-subtle">
          Danger subtle
        </JBTabTrigger>
        <JBTabTrigger value="warning-subtle" color="warning-subtle">
          Warning subtle
        </JBTabTrigger>
        <JBTabTrigger value="custom-pink" color="#ec4899">
          Custom pink
        </JBTabTrigger>
        <JBTabTrigger value="custom-light-green" color="#bbf7d0">
          Custom light green
        </JBTabTrigger>
      </JBTabList>
      <JBTabContent value="primary">Primary content</JBTabContent>
      <JBTabContent value="secondary">Secondary content</JBTabContent>
      <JBTabContent value="positive">Positive content</JBTabContent>
      <JBTabContent value="danger">Danger content</JBTabContent>
      <JBTabContent value="warning">Warning content</JBTabContent>
      <JBTabContent value="light">Light content</JBTabContent>
      <JBTabContent value="dark">Dark content</JBTabContent>
      <JBTabContent value="primary-subtle">Primary subtle content</JBTabContent>
      <JBTabContent value="secondary-subtle">Secondary subtle content</JBTabContent>
      <JBTabContent value="positive-subtle">Positive subtle content</JBTabContent>
      <JBTabContent value="danger-subtle">Danger subtle content</JBTabContent>
      <JBTabContent value="warning-subtle">Warning subtle content</JBTabContent>
      <JBTabContent value="custom-pink">Custom pink content</JBTabContent>
      <JBTabContent value="custom-light-green">Custom light green content</JBTabContent>
    </JBTab>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector<JBTabListWebComponent>("jb-tab-list")!;
    const primary = canvasElement.querySelector<JBTabTriggerWebComponent>('jb-tab-trigger[value="primary"]')!;
    const danger = canvasElement.querySelector<JBTabTriggerWebComponent>('jb-tab-trigger[value="danger"]')!;
    const dark = canvasElement.querySelector<JBTabTriggerWebComponent>('jb-tab-trigger[value="dark"]')!;
    const primarySubtle = canvasElement.querySelector<JBTabTriggerWebComponent>('jb-tab-trigger[value="primary-subtle"]')!;
    const customPink = canvasElement.querySelector<JBTabTriggerWebComponent>('jb-tab-trigger[value="custom-pink"]')!;
    const customLightGreen = canvasElement.querySelector<JBTabTriggerWebComponent>('jb-tab-trigger[value="custom-light-green"]')!;
    const indicator = list.shadowRoot!.querySelector<HTMLElement>(".selection-indicator")!;
    const indicatorColor = () => indicator.style.getPropertyValue("--indicator-color-from-trigger");
    const selectedTextColor = (trigger: JBTabTriggerWebComponent) => getComputedStyle(trigger).color;

    await waitFor(() => expect(primary.selected).toBe(true));
    const lightTextColor = selectedTextColor(primary);
    await userEvent.click(danger);
    expect(selectedTextColor(danger)).toBe(lightTextColor);

    await userEvent.click(dark);
    await waitFor(() => expect(indicatorColor()).not.toBe(""));
    const darkColor = indicatorColor();
    expect(selectedTextColor(dark)).toBe(lightTextColor);

    await userEvent.click(primarySubtle);
    expect(selectedTextColor(primarySubtle)).not.toBe(lightTextColor);

    await userEvent.click(customPink);
    await waitFor(() => expect(indicatorColor()).toBe("#ec4899"));
    expect(indicatorColor()).not.toBe(darkColor);
    expect(selectedTextColor(customPink)).not.toBe(lightTextColor);

    await userEvent.click(customLightGreen);
    await waitFor(() => expect(indicatorColor()).toBe("#bbf7d0"));
    expect(selectedTextColor(customLightGreen)).not.toBe(lightTextColor);
  },
};

export const SizeVariants: Story = {
  render: () => (
    <div className="jb-tab-story-sizes">
      {(["xs", "sm", "md", "lg", "xl"] as const).map(size => (
        <JBTab key={size}>
          <JBTabList size={size} aria-label={`${size} tabs`}>
            <JBTabTrigger value="first" color="primary">
              {size.toUpperCase()} first
            </JBTabTrigger>
            <JBTabTrigger value="second" color="primary-subtle">
              {size.toUpperCase()} second
            </JBTabTrigger>
          </JBTabList>
          <JBTabContent value="first">{size.toUpperCase()} first content</JBTabContent>
          <JBTabContent value="second">{size.toUpperCase()} second content</JBTabContent>
        </JBTab>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const lists = Array.from(canvasElement.querySelectorAll<JBTabListWebComponent>("jb-tab-list"));
    expect(lists).toHaveLength(5);

    for (const list of lists) {
      const triggers = list.triggers;
      const triggerStyles = triggers.map(trigger => getComputedStyle(trigger));
      expect(new Set(triggerStyles.map(style => style.height)).size).toBe(1);
      expect(new Set(triggerStyles.map(style => style.fontSize)).size).toBe(1);
      expect(new Set(triggerStyles.map(style => style.borderTopLeftRadius)).size).toBe(1);

      const listPart = list.shadowRoot!.querySelector<HTMLElement>(".tab-list")!;
      const listStyle = getComputedStyle(listPart);
      const outerRadius = Number.parseFloat(listStyle.borderTopLeftRadius);
      const triggerRadius = Number.parseFloat(triggerStyles[0].borderTopLeftRadius);
      const listPadding = Number.parseFloat(listStyle.paddingTop);
      expect(outerRadius).toBeCloseTo(triggerRadius + listPadding, 3);
    }
  },
};

export const NestedLayout: Story = {
  render: () => (
    <JBTab defaultValue="about" className="jb-tab-story-layout">
      <nav>
        <JBTabList orientation="vertical" aria-label="Profile sections">
          <JBTabTrigger value="home">Home</JBTabTrigger>
          <JBTabTrigger value="about">About</JBTabTrigger>
          <JBTabTrigger value="user">User</JBTabTrigger>
        </JBTabList>
      </nav>
      <main>
        <section className="jb-tab-story-panel-wrapper">
          <JBTabContent className="jb-tab-story-panel" value="home">
            Home content
          </JBTabContent>
          <JBTabContent className="jb-tab-story-panel" value="about">
            About content
          </JBTabContent>
          <JBTabContent className="jb-tab-story-panel" value="user">
            User content
          </JBTabContent>
        </section>
      </main>
    </JBTab>
  ),
  play: async ({ canvasElement }) => {
    const tab = canvasElement.querySelector<JBTabWebComponent>("jb-tab")!;
    const list = tab.querySelector<JBTabListWebComponent>("jb-tab-list")!;
    await waitFor(() => expect(tab.value).toBe("about"));
    expect(list.orientation).toBe("vertical");
    expect(list.selectedTrigger?.value).toBe("about");
  },
};

export const Nullable: Story = {
  render: () => <StandardTabs nullable />,
  play: async ({ canvasElement }) => {
    const tab = canvasElement.querySelector<JBTabWebComponent>("jb-tab")!;
    const triggers = Array.from(tab.querySelectorAll<JBTabTriggerWebComponent>("jb-tab-trigger"));
    const contents = Array.from(tab.querySelectorAll<JBTabContentWebComponent>("jb-tab-content"));
    await waitFor(() => expect(tab.value).toBeNull());
    expect(contents.every(content => content.hidden)).toBe(true);
    expect(triggers[0].tabIndex).toBe(0);
    await userEvent.click(triggers[2]);
    expect(tab.value).toBe("user");
    triggers[2].selected = false;
    expect(tab.value).toBeNull();
    expect(triggers.every(trigger => !trigger.selected)).toBe(true);
  },
};

export const DuplicatePanels: Story = {
  render: () => (
    <JBTab defaultValue="summary">
      <JBTabList aria-label="Report sections">
        <JBTabTrigger value="summary">Summary</JBTabTrigger>
        <JBTabTrigger value="details">Details</JBTabTrigger>
      </JBTabList>
      <div className="jb-tab-story-duplicate-panels">
        <JBTabContent value="summary">Summary chart</JBTabContent>
        <JBTabContent value="summary">Summary table</JBTabContent>
        <JBTabContent value="details">Detailed report</JBTabContent>
      </div>
    </JBTab>
  ),
  play: async ({ canvasElement }) => {
    const visiblePanels = () => canvasElement.querySelectorAll<JBTabContentWebComponent>('jb-tab-content[value="summary"]:not([hidden])');
    await waitFor(() => expect(visiblePanels()).toHaveLength(2));
    const trigger = canvasElement.querySelector<JBTabTriggerWebComponent>('jb-tab-trigger[value="summary"]')!;
    expect(trigger.getAttribute("aria-controls")?.split(" ")).toHaveLength(2);
  },
};

export const DisabledAndKeyboard: Story = {
  render: () => (
    <JBTab>
      <JBTabList aria-label="Keyboard sections">
        <JBTabTrigger value="first">First</JBTabTrigger>
        <JBTabTrigger value="disabled" disabled>
          Disabled
        </JBTabTrigger>
        <JBTabTrigger value="last">Last</JBTabTrigger>
      </JBTabList>
      <JBTabContent value="first">First content</JBTabContent>
      <JBTabContent value="disabled">Disabled content</JBTabContent>
      <JBTabContent value="last">Last content</JBTabContent>
    </JBTab>
  ),
  play: async ({ canvasElement }) => {
    const tab = canvasElement.querySelector<JBTabWebComponent>("jb-tab")!;
    const triggers = Array.from(tab.querySelectorAll<JBTabTriggerWebComponent>("jb-tab-trigger"));
    await waitFor(() => expect(tab.value).toBe("first"));
    triggers[0].focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(tab.value).toBe("last");
    expect(document.activeElement).toBe(triggers[2]);
    await userEvent.keyboard("{Home}");
    expect(tab.value).toBe("first");
    await userEvent.click(triggers[1]);
    expect(tab.value).toBe("first");
  },
};

export const ControlledReact: Story = {
  render: args => {
    const [value, setValue] = useState("home");
    return (
      <div>
        <output data-testid="value">{value}</output>
        <JBTab
          value={value}
          onChange={event => {
            args.onChange?.(event);
            setValue(event.detail.value);
          }}
        >
          <JBTabList aria-label="Controlled sections">
            <JBTabTrigger value="home">Home</JBTabTrigger>
            <JBTabTrigger value="about">About</JBTabTrigger>
          </JBTabList>
          <JBTabContent value="home">Home content</JBTabContent>
          <JBTabContent value="about">About content</JBTabContent>
        </JBTab>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const about = canvasElement.querySelector<JBTabTriggerWebComponent>('jb-tab-trigger[value="about"]')!;
    await userEvent.click(about);
    await waitFor(() => expect(canvas.getByTestId("value")).toHaveTextContent("about"));
  },
};
