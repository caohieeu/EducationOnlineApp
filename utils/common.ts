export const customTabsStyle = `
.non-interactive-tabs .nextui-tabs-tab:hover {
  cursor: default;
  background: transparent;
}
.non-interactive-tabs .nextui-tabs-tab:active {
  transform: none;
}
`;

type Color =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export const getRandomColor = (): Color => {
  const colors: Color[] = [
    "default",
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};
