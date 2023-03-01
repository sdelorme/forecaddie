import Home from "./Pages/Home";
import IndividualPlayerInfo from "./Pages/IndividualPlayer";
import PgaEvents from "./Pages/PgaEvents";

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
