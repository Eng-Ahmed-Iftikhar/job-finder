export enum CONNECTIONS_TABS {
  CONNECTIONS = "CONNECTIONS",
  FOLLOWING = "FOLLOWING",
  PENDING = "PENDING",
}
// list of keys of CONNECTIONS_TABS
export type TabKeys = Array<keyof typeof CONNECTIONS_TABS>;

export type ConnectionsTab = {
  key: CONNECTIONS_TABS;
  label: string;
  path: string;
};
