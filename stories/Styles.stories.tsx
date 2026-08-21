import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { JBTab } from "jb-tab/react";
import { JBTabContent } from "jb-tab/content/react";
import { JBTabList } from "jb-tab/list/react";
import { JBTabTrigger } from "jb-tab/trigger/react";
import "./jb-tab.css";
import "../../../docs/styles/ant-design.css";
import "../../../docs/styles/aurora.css";
import "../../../docs/styles/bootstrap.css";
import "../../../docs/styles/candy.css";
import "../../../docs/styles/carbon.css";
import "../../../docs/styles/cupertino.css";
import "../../../docs/styles/fluent.css";
import "../../../docs/styles/forest.css";
import "../../../docs/styles/material.css";
import "../../../docs/styles/porcelain.css";
import "../../../docs/styles/sunset.css";
import "../../../docs/styles/terminal.css";
import "./styles/style-ant-design.css";
import "./styles/style-aurora.css";
import "./styles/style-bootstrap.css";
import "./styles/style-candy.css";
import "./styles/style-carbon.css";
import "./styles/style-cupertino.css";
import "./styles/style-fluent.css";
import "./styles/style-forest.css";
import "./styles/style-material.css";
import "./styles/style-porcelain.css";
import "./styles/style-sunset.css";
import "./styles/style-terminal.css";

const meta = {
  title: "Components/JBTab/Style",
  component: JBTab,
} satisfies Meta<typeof JBTab>;

export default meta;
type Story = StoryObj<typeof meta>;

const styleSamples = [
  { name: "Carbon", className: "carbon-style" },
  { name: "Aurora", className: "aurora-style" },
  { name: "Forest", className: "forest-style" },
  { name: "Sunset", className: "sunset-style" },
  { name: "Porcelain", className: "porcelain-style" },
  { name: "Candy", className: "candy-style" },
  { name: "Terminal", className: "terminal-style" },
  { name: "Material", className: "material-style" },
  { name: "Fluent", className: "fluent-style" },
  { name: "Bootstrap", className: "bootstrap-style" },
  { name: "Cupertino", className: "cupertino-style" },
  { name: "Ant Design", className: "ant-design-style" },
];

function TabStyleSample({ className }: { className: string }) {
  return (
    <div className={className} style={{ display: "grid", gap: "1rem", width: "100%" }}>
      <JBTab className={className} defaultValue="overview">
        <JBTabList aria-label="Project sections">
          <JBTabTrigger value="overview">Overview</JBTabTrigger>
          <JBTabTrigger value="activity">Activity</JBTabTrigger>
          <JBTabTrigger value="settings">Settings</JBTabTrigger>
          <JBTabTrigger value="disabled" disabled>Disabled</JBTabTrigger>
        </JBTabList>
        <div className="jb-tab-style-panel">
          <JBTabContent value="overview">Project health and recent progress.</JBTabContent>
          <JBTabContent value="activity">The latest project activity appears here.</JBTabContent>
          <JBTabContent value="settings">Manage project settings and access.</JBTabContent>
        </div>
      </JBTab>

      <JBTab className={className} defaultValue="details">
        <JBTabList size="sm" orientation="vertical" aria-label="View options">
          <JBTabTrigger value="summary">Summary</JBTabTrigger>
          <JBTabTrigger value="details">Details</JBTabTrigger>
          <JBTabTrigger value="history">History</JBTabTrigger>
        </JBTabList>
      </JBTab>
    </div>
  );
}

export const Gallery: Story = {
  name: "Gallery",
  render: () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))",
      gap: "1.25rem",
      alignItems: "start",
      width: "min(100%, 88rem)",
    }}>
      {styleSamples.map(sample => (
        <section
          key={sample.className}
          className={sample.className}
          style={{
            display: "grid",
            gap: "0.75rem",
            minWidth: 0,
            padding: "1rem",
            background: "var(--jb-surface-primary, #ffffff)",
            border: "1px solid var(--jb-border-color, #e5e7eb)",
            borderRadius: "var(--jb-radius-lg, 0.75rem)",
            boxShadow: "0 0.75rem 1.75rem oklch(0% 0 0 / 0.08)",
          }}
        >
          <div style={{
            color: "var(--jb-content-primary, #334155)",
            fontSize: "0.875rem",
            fontWeight: 700,
            lineHeight: 1.4,
            textAlign: "center",
          }}>
            {sample.name}
          </div>
          <TabStyleSample className={sample.className} />
        </section>
      ))}
    </div>
  ),
};

export const Default: Story = { name: "Default", render: () => <TabStyleSample className="" /> };
export const Carbon: Story = { name: "Carbon", render: () => <TabStyleSample className="carbon-style" /> };
export const Aurora: Story = { name: "Aurora", render: () => <TabStyleSample className="aurora-style" /> };
export const Forest: Story = { name: "Forest", render: () => <TabStyleSample className="forest-style" /> };
export const Sunset: Story = { name: "Sunset", render: () => <TabStyleSample className="sunset-style" /> };
export const Porcelain: Story = { name: "Porcelain", render: () => <TabStyleSample className="porcelain-style" /> };
export const Candy: Story = { name: "Candy", render: () => <TabStyleSample className="candy-style" /> };
export const Terminal: Story = { name: "Terminal", render: () => <TabStyleSample className="terminal-style" /> };
export const Material: Story = { name: "Material", render: () => <TabStyleSample className="material-style" /> };
export const Fluent: Story = { name: "Fluent", render: () => <TabStyleSample className="fluent-style" /> };
export const Bootstrap: Story = { name: "Bootstrap", render: () => <TabStyleSample className="bootstrap-style" /> };
export const Cupertino: Story = { name: "Cupertino", render: () => <TabStyleSample className="cupertino-style" /> };
export const AntDesign: Story = { name: "Ant Design", render: () => <TabStyleSample className="ant-design-style" /> };
