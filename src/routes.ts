import Home from "./pages/Home";
import IndividualPlayerInfo from "./pages/IndividualPlayer";
import PgaEvents from "./pages/PgaEvents";

// other
import { FC } from "react";

// interface
interface Route {
  key: string;
  title: string;
  path: string;
  enabled: boolean;
  component: FC<{}>;
}

export const routes: Array<Route> = [
  {
    key: "home-route",
    title: "Home",
    path: "/",
    enabled: true,
    component: Home,
  },
  {
    key: "pga-events-route",
    title: "PGA Events",
    path: "/events",
    enabled: true,
    component: PgaEvents,
  },
  {
    key: "player-info-route",
    title: "Individual Player Info",
    path: "/player/:id",
    enabled: true,
    component: IndividualPlayerInfo,
  },
];
