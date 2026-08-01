import React, { useState, useEffect, useRef } from "react";
import {
  ComposedChart, Scatter, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from "recharts";

/* ---------------------------------------------------------------------
   TOKENS — "die Ohm" Corporate Design
--------------------------------------------------------------------- */
const OHM_RED = "#C72426";
const OHM_BLUE = "#16283D";
const INK = OHM_BLUE;
const BG = "#F4F4F3";
const PANEL = "#FFFFFF";
const PANEL_BORDER = "#E0DEDC";
const GRAY = "#6B6B6B";
const CHART_BG = "#FFFFFF";
const CHART_GRID = "#E5E3E1";
const MANOMETER_FLUID = "#C72426";
const SANS = "'Inter', 'IBM Plex Sans', ui-sans-serif, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const R_GAS = 8.314, P_ATM = 101325, M_AIR = 0.02896;
const RHO_MANOMETER = 1000; // kg/m3, gefärbtes Wasser im Manometer
const G = 9.81;
const H_MAX_MM = 150; // mm, maximaler Ausschlag je Schenkel
const OHM_LOGO = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJFYmVuZV8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjkuNDMgNDAuODQiPjxnIGlkPSJMb2dvIj48Zz48Zz48cGF0aCBkPSJtMTE2LjI2LDE4LjI4di02LjVoLTIuMzh2LS44N2g1LjU4di44N2gtMi4yNXY2LjVoLS45NVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTIyLDE4LjM5Yy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMjcuNjcsMTguMzljLS40OCwwLS45LS4xLTEuMjYtLjMxcy0uNjUtLjUxLS44Ni0uOTJjLS4yMS0uNC0uMzEtLjktLjMxLTEuNDksMC0uNTUuMDktMS4wMy4yOC0xLjQ0LjE5LS40MS40Ni0uNzQuODMtLjk3LjM2LS4yMy44LS4zNSwxLjMyLS4zNS4zOCwwLC43Mi4wNywxLjAyLjIycy41NS4zNS43NC42MWMuMTkuMjcuMzEuNTguMzYuOTRoLS44NGMtLjAzLS4xOS0uMS0uMzYtLjIxLS41MS0uMTEtLjE1LS4yNS0uMjgtLjQzLS4zN3MtLjM5LS4xNC0uNjMtLjE0Yy0uNDUsMC0uODIuMTYtMS4xLjQ5LS4yOC4zMy0uNDMuODMtLjQzLDEuNSwwLC42MS4xMywxLjA5LjM5LDEuNDYuMjYuMzcuNjQuNTUsMS4xNS41NS4yNCwwLC40NS0uMDUuNjMtLjE0LjE4LS4wOS4zMi0uMjIuNDMtLjM3cy4xOC0uMzIuMjEtLjVoLjgyYy0uMDQuMzUtLjE2LjY2LS4zNi45Mi0uMi4yNi0uNDQuNDYtLjc0LjYtLjMuMTQtLjY0LjIxLTEuMDEuMjFaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzMS4wMSwxOC4yOHYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzNi44OSwxOC4yOHYtNS4yN2guOTJ2Ljc2Yy4wOC0uMTUuMi0uMjguMzUtLjQxLjE1LS4xMy4zMy0uMjMuNTUtLjMxcy40Ni0uMTIuNzUtLjEyYy4zMywwLC42NC4wNy45Mi4ycy41LjM0LjY3LjYyYy4xNy4yOC4yNS42NC4yNSwxLjA4djMuNDVoLS45NHYtMy4zNWMwLS40MS0uMTEtLjcyLS4zMi0uOTItLjIyLS4yLS41LS4zLS44NC0uMy0uMjQsMC0uNDYuMDQtLjY3LjEyLS4yMS4wOC0uMzguMTktLjUuMzUtLjEzLjE1LS4xOS4zNS0uMTkuNTh2My41MmgtLjk0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNDIuNzcsMTEuOXYtLjk4aC45N3YuOThoLS45N1ptLjAzLDYuMzl2LTUuMjdoLjkxdjUuMjdoLS45MVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTQ3LjIsMTguMzljLS4zNywwLS43MS0uMDYtMS4wMi0uMTctLjMxLS4xMS0uNTgtLjI5LS43OC0uNTQtLjIxLS4yNC0uMzQtLjU1LS4zOS0uOTNoLjg2Yy4wNC4yMS4xMy4zOC4yNS41Mi4xMi4xNC4yOC4yNC40Ny4zMS4xOS4wNy4zOS4xLjYxLjEuMzYsMCwuNjQtLjA3Ljg2LS4yLjIyLS4xMy4zMy0uMzQuMzMtLjYxLDAtLjE5LS4wNi0uMzUtLjE3LS40Ny0uMTEtLjEyLS4yOS0uMi0uNTMtLjI2bC0xLjA5LS4yN2MtLjQyLS4xLS43Ni0uMjYtMS4wMi0uNDgtLjI1LS4yMi0uMzgtLjUyLS4zOC0uOTEsMC0uMzEuMDctLjU4LjIyLS44MnMuMzctLjQyLjY3LS41NmMuMy0uMTQuNjctLjIsMS4xMS0uMi41NywwLDEuMDQuMTMsMS4zOS4zOS4zNS4yNi41My42My41NSwxLjEzaC0uODRjLS4wMy0uMjUtLjE1LS40NS0uMzQtLjYtLjE5LS4xNS0uNDUtLjIyLS43Ny0uMjJzLS42MS4wNy0uODIuMmMtLjIxLjEzLS4zMi4zNC0uMzIuNjIsMCwuMTkuMDguMzMuMjMuNDQuMTUuMTEuMzcuMi42Ni4yN2wxLjA2LjI3Yy4yNC4wNi40NC4xNS42LjI1LjE2LjExLjI5LjIyLjM4LjM1cy4xNi4yNi4yLjQxLjA2LjI4LjA2LjQxYzAsLjMyLS4wOC42LS4yNC44My0uMTYuMjMtLjM5LjQxLS42OS41NC0uMy4xMy0uNjcuMTktMS4xLjE5WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNTIuNTgsMTguMzljLS40OCwwLS45LS4xLTEuMjYtLjMxcy0uNjUtLjUxLS44Ni0uOTJjLS4yMS0uNC0uMzEtLjktLjMxLTEuNDksMC0uNTUuMDktMS4wMy4yOC0xLjQ0LjE5LS40MS40Ni0uNzQuODMtLjk3LjM2LS4yMy44LS4zNSwxLjMyLS4zNS4zOCwwLC43Mi4wNywxLjAyLjIycy41NS4zNS43NC42MWMuMTkuMjcuMzEuNTguMzYuOTRoLS44NGMtLjAzLS4xOS0uMS0uMzYtLjIxLS41MS0uMTEtLjE1LS4yNS0uMjgtLjQzLS4zN3MtLjM5LS4xNC0uNjMtLjE0Yy0uNDUsMC0uODIuMTYtMS4xLjQ5LS4yOC4zMy0uNDMuODMtLjQzLDEuNSwwLC42MS4xMywxLjA5LjM5LDEuNDYuMjYuMzcuNjQuNTUsMS4xNS41NS4yNCwwLC40NS0uMDUuNjMtLjE0LjE4LS4wOS4zMi0uMjIuNDMtLjM3cy4xOC0uMzIuMjEtLjVoLjgyYy0uMDQuMzUtLjE2LjY2LS4zNi45Mi0uMi4yNi0uNDQuNDYtLjc0LjYtLjMuMTQtLjY0LjIxLTEuMDEuMjFaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE1NS45MywxOC4yOHYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE2NC4wNCwxOC4zOWMtLjQ5LDAtLjkyLS4xMS0xLjI5LS4zMi0uMzctLjIxLS42Ny0uNTItLjg4LS45Mi0uMjEtLjQtLjMyLS44OC0uMzItMS40NHMuMS0xLjA0LjI5LTEuNDYuNDctLjc0LjgzLS45OGMuMzYtLjI0LjgtLjM1LDEuMzEtLjM1cy45Mi4xMSwxLjI2LjMyYy4zNC4yMS42LjUyLjc4LjkxLjE4LjM5LjI3Ljg1LjI3LDEuMzh2LjM1aC0zLjc4YzAsLjMzLjA1LjYzLjE3LjkuMTEuMjcuMjguNDkuNS42NS4yMi4xNi41MS4yNC44NS4yNHMuNjMtLjA4Ljg3LS4yMy40LS4zOC40Ny0uNjhoLjg5Yy0uMDYuMzYtLjIuNjYtLjQzLjktLjIyLjI0LS40OS40My0uOC41NS0uMzEuMTItLjY0LjE5LS45OC4xOVptLTEuNTMtMy4xNmgyLjg2YzAtLjMtLjA1LS41OC0uMTUtLjgyLS4xLS4yNC0uMjYtLjQ0LS40Ny0uNTgtLjIxLS4xNC0uNDctLjIxLS43OS0uMjFzLS42LjA4LS44Mi4yNC0uMzguMzYtLjQ4LjYxLS4xNi41LS4xNS43NloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTE1LjAyLDI4LjY5di03LjM3aC45NHYzLjE0aDMuOTh2LTMuMTRoLjk0djcuMzdoLS45NHYtMy40aC0zLjk4djMuNGgtLjk0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMjQuNjcsMjguNzljLS40OSwwLS45MS0uMS0xLjI3LS4zMS0uMzYtLjIxLS42NC0uNTItLjg0LS45Mi0uMi0uNC0uMy0uOS0uMy0xLjQ4LDAtLjU1LjA5LTEuMDMuMjgtMS40NS4xOS0uNDIuNDYtLjc0LjgyLS45N3MuOC0uMzQsMS4zMi0uMzRjLjQ5LDAsLjkxLjExLDEuMjYuMzIuMzYuMjEuNjMuNTIuODMuOTMuMi40MS4zLjkxLjMsMS41LDAsLjU0LS4wOSwxLjAxLS4yOCwxLjQyLS4xOC40MS0uNDUuNzMtLjgxLjk2LS4zNi4yMy0uNzkuMzQtMS4zMi4zNFptMC0uNzRjLjMxLDAsLjU4LS4wOC43OS0uMjRzLjM4LS4zOS41LS42OWMuMTEtLjMuMTctLjY1LjE3LTEuMDcsMC0uMzgtLjA1LS43Mi0uMTUtMS4wMnMtLjI2LS41NC0uNDctLjcyLS40OS0uMjctLjg0LS4yN2MtLjMyLDAtLjU5LjA4LS44MS4yNHMtLjM5LjM5LS41LjY5Yy0uMTEuMy0uMTcuNjYtLjE3LDEuMDgsMCwuMzcuMDUuNzEuMTUsMS4wMS4xLjMuMjYuNTQuNDguNzIuMjIuMTguNS4yNi44NS4yNloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTMwLjQ1LDI4Ljc5Yy0uNDgsMC0uOS0uMS0xLjI2LS4zMXMtLjY1LS41MS0uODYtLjkyYy0uMjEtLjQtLjMxLS45LS4zMS0xLjQ5LDAtLjU1LjA5LTEuMDMuMjgtMS40NC4xOS0uNDEuNDYtLjc0LjgzLS45Ny4zNi0uMjMuOC0uMzUsMS4zMi0uMzUuMzgsMCwuNzIuMDcsMS4wMi4yMnMuNTUuMzUuNzQuNjFjLjE5LjI3LjMxLjU4LjM2Ljk0aC0uODRjLS4wMy0uMTktLjEtLjM2LS4yMS0uNTEtLjExLS4xNS0uMjUtLjI4LS40My0uMzdzLS4zOS0uMTQtLjYzLS4xNGMtLjQ1LDAtLjgyLjE2LTEuMS40OS0uMjguMzMtLjQzLjgzLS40MywxLjUsMCwuNjEuMTMsMS4wOS4zOSwxLjQ2LjI2LjM3LjY0LjU1LDEuMTUuNTUuMjQsMCwuNDUtLjA1LjYzLS4xNC4xOC0uMDkuMzItLjIyLjQzLS4zN3MuMTgtLjMyLjIxLS41aC44MmMtLjA0LjM1LS4xNi42Ni0uMzYuOTItLjIuMjYtLjQ0LjQ2LS43NC42LS4zLjE0LS42NC4yMS0xLjAxLjIxWiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMzMuOCwyOC42OXYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0MS41MiwyOC43OWMtLjM3LDAtLjcxLS4wNi0xLjAyLS4xNy0uMzEtLjExLS41OC0uMjktLjc4LS41NC0uMjEtLjI0LS4zNC0uNTUtLjM5LS45M2guODZjLjA0LjIxLjEzLjM4LjI1LjUyLjEyLjE0LjI4LjI0LjQ3LjMxLjE5LjA3LjM5LjEuNjEuMS4zNiwwLC42NC0uMDcuODYtLjIuMjItLjEzLjMzLS4zNC4zMy0uNjEsMC0uMTktLjA2LS4zNS0uMTctLjQ3LS4xMS0uMTItLjI5LS4yLS41My0uMjZsLTEuMDktLjI3Yy0uNDItLjEtLjc2LS4yNi0xLjAyLS40OC0uMjUtLjIyLS4zOC0uNTItLjM4LS45MSwwLS4zMS4wNy0uNTguMjItLjgycy4zNy0uNDIuNjctLjU2Yy4zLS4xNC42Ny0uMiwxLjExLS4yLjU3LDAsMS4wNC4xMywxLjM5LjM5LjM1LjI2LjUzLjYzLjU1LDEuMTNoLS44NGMtLjAzLS4yNS0uMTUtLjQ1LS4zNC0uNi0uMTktLjE1LS40NS0uMjItLjc3LS4yMnMtLjYxLjA3LS44Mi4yYy0uMjEuMTMtLjMyLjM0LS4zMi42MiwwLC4xOS4wOC4zMy4yMy40NC4xNS4xMS4zNy4yLjY2LjI3bDEuMDYuMjdjLjI0LjA2LjQ0LjE1LjYuMjUuMTYuMTEuMjkuMjIuMzguMzVzLjE2LjI2LjIuNDEuMDYuMjguMDYuNDFjMCwuMzItLjA4LjYtLjI0LjgzLS4xNi4yMy0uMzkuNDEtLjY5LjU0LS4zLjEzLS42Ny4xOS0xLjEuMTlaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0Ni45MSwyOC43OWMtLjQ4LDAtLjktLjEtMS4yNi0uMzFzLS42NS0uNTEtLjg2LS45MmMtLjIxLS40LS4zMS0uOS0uMzEtMS40OSwwLS41NS4wOS0xLjAzLjI4LTEuNDQuMTktLjQxLjQ2LS43NC44My0uOTcuMzYtLjIzLjgtLjM1LDEuMzItLjM1LjM4LDAsLjcyLjA3LDEuMDIuMjJzLjU1LjM1Ljc0LjYxYy4xOS4yNy4zMS41OC4zNi45NGgtLjg0Yy0uMDMtLjE5LS4xLS4zNi0uMjEtLjUxLS4xMS0uMTUtLjI1LS4yOC0uNDMtLjM3cy0uMzktLjE0LS42My0uMTRjLS40NSwwLS44Mi4xNi0xLjEuNDktLjI4LjMzLS40My44My0uNDMsMS41LDAsLjYxLjEzLDEuMDkuMzksMS40Ni4yNi4zNy42NC41NSwxLjE1LjU1LjI0LDAsLjQ1LS4wNS42My0uMTQuMTgtLjA5LjMyLS4yMi40My0uMzdzLjE4LS4zMi4yMS0uNWguODJjLS4wNC4zNS0uMTYuNjYtLjM2LjkyLS4yLjI2LS40NC40Ni0uNzQuNi0uMy4xNC0uNjQuMjEtMS4wMS4yMVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTUwLjI2LDI4LjY5di03LjU3aC45MnYzLjA4Yy4wOS0uMTUuMjEtLjI4LjM2LS40MS4xNS0uMTMuMzMtLjIzLjU0LS4zMS4yMS0uMDguNDYtLjEyLjc0LS4xMi4zNCwwLC42NS4wNi45My4xOS4yOC4xMy41LjMxLjY2LjU0cy4yNC41MS4yNC44NHYzLjc3aC0uOTR2LTMuNThjMC0uMzItLjExLS41Ni0uMzItLjczLS4yMi0uMTctLjUtLjI2LS44NC0uMjYtLjI0LDAtLjQ2LjA0LS42Ni4xMi0uMjEuMDgtLjM4LjE5LS41LjM1LS4xMy4xNS0uMTkuMzUtLjE5LjU5djMuNTJoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTU4LjA4LDI4Ljc5Yy0uMjgsMC0uNTMtLjA0LS43OC0uMTItLjI0LS4wOC0uNDYtLjE5LS42NC0uMzQtLjE5LS4xNS0uMzMtLjM0LS40NC0uNTYtLjExLS4yMi0uMTYtLjQ4LS4xNi0uNzh2LTMuNThoLjk0djMuNDhjMCwuMzQuMTEuNjIuMzIuODQuMjEuMjEuNTMuMzIuOTYuMzIuMzksMCwuNy0uMS45NC0uMy4yNC0uMi4zNS0uNS4zNS0uOXYtMy40M2guOTR2NS4yN2gtLjc1bC0uMS0xLjAxYy0uMDYuMjctLjE3LjQ4LS4zMy42NC0uMTYuMTYtLjM0LjI4LS41Ni4zNnMtLjQ1LjExLS43LjExWiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNjMuNDUsMjguNzZjLS4yOSwwLS41Mi0uMDQtLjY5LS4xMi0uMTgtLjA4LS4zMS0uMTgtLjQtLjMyLS4wOS0uMTMtLjE2LS4yOC0uMTktLjQ2LS4wMy0uMTctLjA1LS4zNS0uMDUtLjUzdi02LjIyaC45M3Y2LjEzYzAsLjI2LjA1LjQ2LjE2LjYuMS4xMy4yNS4yMS40NC4yMmguMjl2LjYyYy0uMDguMDItLjE2LjA0LS4yNC4wNi0uMDguMDItLjE2LjAyLS4yMy4wMloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTY3LjE5LDI4Ljc5Yy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMTUuMDIsMzkuMXYtNy4zN2guOWwzLjg5LDUuNzN2LTUuNzNoLjk0djcuMzdoLS44NGwtMy45Ni01LjgxdjUuODFoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTI0LjQ1LDM5LjJjLS4yOCwwLS41My0uMDQtLjc4LS4xMi0uMjQtLjA4LS40Ni0uMTktLjY0LS4zNC0uMTktLjE1LS4zMy0uMzQtLjQ0LS41Ni0uMTEtLjIyLS4xNi0uNDgtLjE2LS43OHYtMy41OGguOTR2My40OGMwLC4zNC4xMS42Mi4zMi44NC4yMS4yMS41My4zMi45Ni4zMi4zOSwwLC43LS4xLjk0LS4zLjI0LS4yLjM1LS41LjM1LS45di0zLjQzaC45NHY1LjI3aC0uNzVsLS4xLTEuMDFjLS4wNi4yNy0uMTcuNDgtLjMzLjY0LS4xNi4xNi0uMzQuMjgtLjU2LjM2cy0uNDUuMTEtLjcuMTFabS0xLjI0LTYuNTZ2LS45MWguOTN2LjkxaC0uOTNabTEuOTgsMHYtLjkxaC45M3YuOTFoLS45M1oiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTI4LjQ5LDM5LjF2LTUuMjdoLjl2MS4wMWMuMDktLjI1LjIxLS40Ni4zNy0uNjIuMTYtLjE3LjM0LS4yOS41NS0uMzcuMjEtLjA4LjQyLS4xMi42NC0uMTIuMDgsMCwuMTUsMCwuMjMuMDIuMDguMDEuMTMuMDMuMTcuMDV2LjkxYy0uMDUtLjAyLS4xMi0uMDQtLjItLjA1cy0uMTUtLjAxLS4yLS4wMWMtLjIxLS4wMS0uNDEsMC0uNTkuMDRzLS4zNC4xMS0uNDguMmMtLjE0LjEtLjI1LjIyLS4zMy4zOC0uMDguMTUtLjEyLjM0LS4xMi41NnYzLjI4aC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzMi40OCwzOS4xdi01LjI3aC45MnYuNzZjLjA4LS4xNS4yLS4yOC4zNS0uNDEuMTUtLjEzLjMzLS4yMy41NS0uMzFzLjQ2LS4xMi43NS0uMTJjLjMzLDAsLjY0LjA3LjkyLjJzLjUuMzQuNjcuNjJjLjE3LjI4LjI1LjY0LjI1LDEuMDh2My40NWgtLjk0di0zLjM1YzAtLjQxLS4xMS0uNzItLjMyLS45Mi0uMjItLjItLjUtLjMtLjg0LS4zLS4yNCwwLS40Ni4wNC0uNjcuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OHYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0MC45NywzOS4yYy0uMzEsMC0uNTctLjA0LS43OC0uMTItLjIxLS4wOC0uMzktLjE5LS41Mi0uMzEtLjE0LS4xMy0uMjQtLjI2LS4zMi0uMzktLjA4LS4xMy0uMTMtLjI1LS4xNi0uMzVsLS4xLDEuMDhoLS43MnYtNy41N2guOTV2My4xNGMuMDQtLjA5LjExLS4xOS4yLS4yOS4wOS0uMS4yMS0uMjEuMzUtLjMxcy4zMS0uMTguNTEtLjI0Yy4yLS4wNi40Mi0uMS42Ny0uMS42NiwwLDEuMTguMjMsMS41Ny42OS4zOS40Ni41OCwxLjEzLjU4LDIuMDMsMCwuNTUtLjA4LDEuMDQtLjI1LDEuNDUtLjE3LjQxLS40MS43My0uNzQuOTYtLjMzLjIzLS43NC4zNC0xLjIzLjM0Wm0tLjE3LS43MmMuNDMsMCwuNzgtLjE3LDEuMDQtLjUuMjctLjMzLjQtLjg2LjQtMS41OCwwLS42Mi0uMTItMS4wOS0uMzgtMS40My0uMjUtLjM0LS42MS0uNTEtMS4wOS0uNTEtLjM1LDAtLjYzLjA4LS44NC4yMy0uMjEuMTUtLjM3LjM3LS40Ny42Ni0uMS4yOS0uMTUuNjQtLjE2LDEuMDUsMCwuNzQuMTIsMS4yNy4zNCwxLjU5LjIzLjMyLjYxLjQ5LDEuMTQuNDlaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0Ni42NywzOS4yYy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNTAuMjEsMzkuMXYtNS4yN2guOXYxLjAxYy4wOS0uMjUuMjEtLjQ2LjM3LS42Mi4xNi0uMTcuMzQtLjI5LjU1LS4zNy4yMS0uMDguNDItLjEyLjY0LS4xMi4wOCwwLC4xNSwwLC4yMy4wMi4wOC4wMS4xMy4wMy4xNy4wNXYuOTFjLS4wNS0uMDItLjEyLS4wNC0uMi0uMDVzLS4xNS0uMDEtLjItLjAxYy0uMjEtLjAxLS40MSwwLS41OS4wNHMtLjM0LjExLS40OC4yYy0uMTQuMS0uMjUuMjItLjMzLjM4LS4wOC4xNS0uMTIuMzQtLjEyLjU2djMuMjhoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTU2LjI3LDQwLjg0Yy0uODMsMC0xLjQ3LS4xMi0xLjkzLS4zNi0uNDYtLjI0LS42OS0uNTgtLjY5LTEuMDMsMC0uMTkuMDQtLjM1LjEzLS40OS4wOS0uMTMuMTktLjI1LjMyLS4zMy4xMi0uMDkuMjQtLjE2LjM0LS4yMS4xLS4wNS4xNy0uMDkuMi0uMTEtLjA2LS4wMy0uMTMtLjA4LS4yMS0uMTMtLjA4LS4wNS0uMTYtLjEyLS4yMy0uMnMtLjEtLjItLjEtLjMzYzAtLjE3LjA4LS4zMi4yMy0uNDYuMTYtLjE0LjM5LS4yNC43LS4zMS0uMzEtLjE2LS41NS0uMzYtLjcyLS42Mi0uMTctLjI2LS4yNi0uNTQtLjI2LS44NCwwLS4zNC4wOS0uNjQuMjgtLjg5LjE4LS4yNS40NS0uNDQuNzktLjU4LjM0LS4xMy43NS0uMiwxLjIzLS4yLjM0LDAsLjYzLjA0Ljg2LjEyLjIzLjA4LjQ1LjE5LjY1LjM0LjA1LS4wMi4xNC0uMDYuMjYtLjExLjEyLS4wNS4yNS0uMS4zOS0uMTYuMTQtLjA2LjI3LS4xMS40LS4xN3MuMjItLjA5LjMtLjEydi44N3MtLjkzLjE3LS45My4xN2MuMDUuMTEuMS4yMy4xMy4zNi4wMy4xMy4wNC4yNS4wNC4zNiwwLC4zMS0uMDguNTktLjI0Ljg0LS4xNi4yNS0uNDEuNDUtLjczLjYtLjMzLjE1LS43My4yMi0xLjIyLjIyLS4wNCwwLS4wOSwwLS4xNiwwLS4wNiwwLS4xMiwwLS4xNiwwLS4zNiwwLS42MS4wNS0uNzQuMTItLjEzLjA3LS4yLjE1LS4yLjIzLDAsLjEuMDguMTcuMjMuMi4xNS4wNC40MS4wNy43OC4xLjEzLDAsLjMuMDEuNDkuMDMuMiwwLC40MS4wMi42Ni4wNC41NS4wMy45OC4xNywxLjI3LjQycy40NS41OC40NSwxYzAsLjQ4LS4yMS44Ny0uNjQsMS4xNy0uNDMuMy0xLjA4LjQ1LTEuOTUuNDVabS4xNy0uNjFjLjQ5LDAsLjg2LS4wNywxLjEyLS4yMi4yNi0uMTUuMzktLjM3LjM5LS42NiwwLS4yMS0uMDgtLjM4LS4yNC0uNTEtLjE2LS4xNC0uNC0uMjEtLjcyLS4yM2wtMS40OC0uMWMtLjEzLDAtLjI3LjAzLS40MS4xLS4xNC4wNy0uMjYuMTctLjM2LjNzLS4xNS4yOC0uMTUuNDRjMCwuMjguMTUuNS40NS42NS4zLjE2Ljc3LjIzLDEuNC4yM1ptLS4xNi0zLjc2Yy4zOCwwLC42OC0uMDkuOTItLjI3LjIzLS4xOC4zNS0uNDQuMzUtLjc4cy0uMTItLjYyLS4zNS0uODEtLjU0LS4yOC0uOTItLjI4LS43LjA5LS45NC4yOC0uMzUuNDYtLjM1LjgxYzAsLjMzLjExLjU5LjM0Ljc3LjIzLjE4LjU0LjI4Ljk1LjI4WiIgZmlsbD0iI2M3MjQyNiIvPjwvZz48Zz48cGF0aCBkPSJtNTcuODMsMjEuODZjLjEzLTUuNS0zLjExLTEwLjQ4LTguODctMTEuMTQtMi43NC0uMjQtNS42My43NS03Ljc5LDIuNSwwLS4yOSwwLS41Ny4wMy0uODYuMDctMy4wOC4xMi05LjI4LjEtMTIuMzZoLTYuMDJ2MzkuMWg2LjAyczAtMTAuOTgsMC0xNC4zN2gwczAtMS4zNSwwLTIuNjRjLjA2LTEuNzQuMzktMy41NiwxLjcxLTQuNTcsMS41Ni0xLjE4LDQuMzktMS4zOCw2LjE4LS41OCwxLjUyLjcyLDIuMDksMS44MSwyLjQ4LDMuNDguMS42NS4xNywyLjI3LjE3LDQuMzIsMCw0LjY5LS4wOCwxMy4wOS0uMDIsMTQuMzYsMCwwLDYuMDIsMCw2LjAyLDAtLjAxLTEuMi4wMi0xNi40MywwLTE3LjI0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMDEuNjYsMzMuNDJzLS4wNSwwLS4wOC4wMWMwLTQuODQuMDEtMTEuMDYsMC0xMS41Ny4xNy01LjI5LTMuMTctMTAuNzctOC44Ni0xMS4xOC0zLjU1LS4yOC03LjYxLjk4LTkuODEsMy45MS0xLjUyLTIuMTEtMy44LTMuNjEtNi43Mi0zLjkyLS45Mi0uMDUtMS44NS4wMi0yLjc3LjIxLTEuODMuMzUtMy41OSwxLjE4LTUuMDMsMi4zNC0uMDItLjgzLS4wMi0xLjY1LDAtMi40OGgtNS45djI4LjM2aDYuMDJsLjAyLTcuMDl2LTcuMDljMC0uMzksMC0yLjgyLDAtMywwLS42Mi4wNy0xLjA4LjE0LTEuNDcuMTMtLjcuMzQtMS4zNy42OC0xLjk0LjE2LS4yNi4zNC0uNS41Ni0uNzIuMDEtLjAxLjIyLS4xOS4zMS0uMjcsMS4yLS44OCwyLjgzLTEuMTUsNC4zMS0xLjAzLjY4LjA2LDEuMzIuMjEsMS44Ny40NS43Ni4zNiwxLjI4LjgxLDEuNjcsMS4zOC4xMi4xOS4yMy4zOS4zMy42LjIuNDQuMzYuOTMuNDksMS41LjAzLjE2LjA1LjM4LjA3LjY0LDAsLjA5LjAxLjE4LjAyLjI4LjAxLjI2LjAzLjU1LjA0Ljg3LDAsLjAxLDAsLjAyLDAsLjAzLDAsLjI3LjAyLDEuMzEuMDIsMS40OS4wMywzLjQ0LDAsNi44NywwLDEwLjMxLDAsLjI0LDAsNS4wNSwwLDUuMDUsMCwwLDEuNywwLDMuMjksMCwuMzcsMCwuNzQsMCwxLjA4LDBzLjY1LDAsLjkxLDBoLjc0czAtLjAzLDAtLjA0aDBzMC0zLjIyLDAtNi43YzAtMS4xNiwwLTIuMzcsMC0zLjU0LDAtLjI1LDAtMy41OCwwLTQuNjYsMC0uMTgsMC0uNTEsMC0uNTEsMCwwLDAtMS40NCwwLTEuNDgsMC0xLjMzLjI4LTMsMS4wMy0zLjk1LDEuMDItMS4zMiwyLjUzLTEuNjgsNC4yNi0xLjczLDEuNjktLjA2LDMuMzEuNDIsNC4yLDEuNzUuNjQuODgsMS4wMiwyLjM3LDEuMDMsMy42MnYxLjkyczAsMTUuMzIsMCwxNS4zMmMwLDAsNi4wMiwwLDYuMDIsMGgwczYuMSwwLDYuMSwwdi02LjAyYy0xLjc0LS4wMi0zLjg5LS4wNy02LjAzLjM0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNy4yNSwxMC4zN2gwYy02LjAzLjA4LTExLjQ3LDIuODYtMTMuMzYsOC45LTEuNDEsNC40NC0uOTcsOS4xMywxLjUzLDEzLjExLjIzLjM1LjQ5LjY4Ljc3Ljk5LTIuMDUtLjM2LTQuMTEtLjMyLTYuMTgtLjN2Ni4wMmgxNS4yN3YtNS44MmMtNC4zMS0uNTgtNS45OC0zLjUtNi4wMy04LjY4LS4xNS01LjcxLDIuNDktOC44LDguMDItOC45MmgwYzMuNTUuMDQsNi43MSwxLjY3LDcuNTksNS4yNi42LDIuMjMuNTYsNS4yMi4wMyw3LjQ1LS43LDMuMTEtMi44Nyw0LjUyLTUuNjQsNC44OXY1LjY4YzEuMS0uMTIsMi4yMy0uMzIsMy4zOC0uNjcsOC4xLTIuMzcsMTAuMi0xMS43MSw3Ljk3LTE4Ljk5LTEuOTEtNi03LjMyLTguODMtMTMuMzMtOC45MloiIGZpbGw9IiNjNzI0MjYiLz48L2c+PC9nPjwvZz48L3N2Zz4=";

function de(v, d = 2) { return (isFinite(v) ? v.toFixed(d) : "—").replace(".", ","); }
function airDensity(tC) { const T = tC + 273.15; return (P_ATM * M_AIR) / (R_GAS * T); }
function airViscosity(tC) {
  const T = tC + 273.15, mu0 = 1.716e-5, T0 = 273.15, C = 110.4;
  return mu0 * ((T0 + C) / (T + C)) * Math.pow(T / T0, 1.5);
}
function waterDensity(tC) { return 1000 - 0.35 * (tC - 10); } // vereinfachte lineare Näherung
function waterViscosity(tC) {
  const T = tC + 273.15;
  return 2.414e-5 * Math.pow(10, 247.8 / (T - 140)); // Vogel-Gleichung
}
function fluidProps(medium, tC) {
  return medium === "luft"
    ? { rho: airDensity(tC), mu: airViscosity(tC) }
    : { rho: waterDensity(tC), mu: waterViscosity(tC) };
}
function ergun(u0, rho, mu, eps, dp) {
  const term1 = (150 * mu * u0 * Math.pow(1 - eps, 2)) / (Math.pow(eps, 3) * dp * dp);
  const term2 = (1.75 * rho * u0 * u0 * (1 - eps)) / (Math.pow(eps, 3) * dp);
  return { term1, term2, total: term1 + term2 };
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeGaussian(rng) {
  return function () {
    let u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}
const logToPos = (val, min, max) => (100 * Math.log(val / min)) / Math.log(max / min);
const posToLog = (pos, min, max) => min * Math.pow(max / min, pos / 100);

/* ---------------------------------------------------------------------
   CONTROL WIDGETS
--------------------------------------------------------------------- */
function Field({ label, value, locked, children }) {
  return (
    <div className="mb-3" style={{ opacity: locked ? 0.5 : 1 }}>
      <div className="flex items-baseline justify-between mb-1">
        <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.02em", color: GRAY, fontWeight: 500 }}>
          {label}{locked ? " 🔒" : ""}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: INK, fontWeight: 700 }}>{value}</span>
      </div>
      {children}
    </div>
  );
}
function LinearSlider({ min, max, step, value, onChange, disabled, onCommit }) {
  return <input className="ohm-slider" type="range" min={min} max={max} step={step} value={value} disabled={disabled}
    onChange={(e) => onChange(parseFloat(e.target.value))}
    onMouseUp={onCommit} onTouchEnd={onCommit} onKeyUp={onCommit} />;
}
function LogSlider({ min, max, value, onChange, disabled, onCommit }) {
  const pos = logToPos(value, min, max);
  return <input className="ohm-slider" type="range" min={0} max={100} step={0.1} value={pos} disabled={disabled}
    onChange={(e) => onChange(posToLog(parseFloat(e.target.value), min, max))}
    onMouseUp={onCommit} onTouchEnd={onCommit} onKeyUp={onCommit} />;
}
function PanelBox({ title, children }) {
  return (
    <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 12.5, letterSpacing: "0.03em", color: INK, textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `2px solid ${OHM_RED}` }}>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------
   AUFBAU-GRAFIK — Schüttung + U-Rohrmanometer
--------------------------------------------------------------------- */
function SetupGraphic({ eps, h_mm, overflow, Dpipe, dp, Lbed }) {
  const seedRng = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

  // Rohrdurchmesser -> Schüttungshöhe im Bild; Länge -> Schüttungsbreite; beides bleibt zentriert
  const bedH = Math.max(18, Math.min(92, Dpipe * 7));
  const bedW = Math.max(90, Math.min(270, Lbed * 6.5));
  const bedCenterY = 221, bedCenterX = 150;
  const bedX = bedCenterX - bedW / 2, bedY = bedCenterY - bedH / 2;

  // Kugeldurchmesser relativ zum Rohrdurchmesser bestimmt die Kugelgröße im Bild (Wandeffekt sichtbar)
  const ballDiaPx = Math.max(2.4, Math.min(bedH * 0.85, (dp / (Dpipe * 10)) * bedH));
  const rBase = ballDiaPx / 2;
  const spacingFactor = 1 + ((eps - 0.3) / 0.3) * 0.55; // höhere Porosität = größere Abstände
  const rowSpacing = rBase * 1.85 * spacingFactor;
  const colSpacing = rBase * 2.1 * spacingFactor;
  const rows = Math.max(1, Math.round((bedH - rBase * 2) / rowSpacing) || 1);
  const balls = [];
  let ri = 0;
  for (let row = 0; row < rows; row++) {
    const y0 = rows > 1 ? bedY + rBase + 2 + row * ((bedH - 2 * rBase - 4) / (rows - 1)) : bedY + bedH / 2;
    const offset = row % 2 === 0 ? 0 : colSpacing / 2;
    const cols = Math.max(1, Math.floor((bedW - 2 * rBase - offset) / colSpacing));
    for (let c = 0; c < cols; c++) {
      const jitterX = (seedRng(ri * 3.1) - 0.5) * rBase * 0.5;
      const jitterY = (seedRng(ri * 7.7 + 2) - 0.5) * rBase * 0.5;
      const x = bedX + rBase + 2 + offset + c * colSpacing + jitterX;
      const y = y0 + jitterY;
      const r = rBase * (0.82 + seedRng(ri * 5.3) * 0.36);
      if (x < bedX + bedW - rBase && y < bedY + bedH - 2) balls.push({ x, y, r, shade: seedRng(ri * 9.1) });
      ri++;
    }
  }
  const thinnedBalls = balls.length > 500 ? balls.filter((_, i) => i % Math.ceil(balls.length / 500) === 0) : balls;

  // Manometer (oben), Skala in mm — offene Enden oben, Bogen unten
  const legLeftX = 115, legRightX = 183, halfW = 6;
  const tubeTop = 42, tubeBottom = 148, bendY = 162;
  const baseY = 97; // Nulllinie (h = 0)
  const mmToPx = 0.3;
  const hClamped = Math.max(-H_MAX_MM, Math.min(H_MAX_MM, h_mm));
  const leftY = Math.min(tubeBottom - 4, Math.max(tubeTop + 4, baseY + (hClamped / 2) * mmToPx));
  const rightY = Math.min(tubeBottom - 4, Math.max(tubeTop + 4, baseY - (hClamped / 2) * mmToPx));

  const ticks = [-100, -50, 0, 50, 100];

  // Messstellen an der Schüttung + Leitungen, die außen am Manometer vorbei nach oben
  // und dann in die offenen Rohrenden führen
  const tapInset = Math.min(16, bedW * 0.18);
  const tapLeftX = bedX + tapInset, tapRightX = bedX + bedW - tapInset;
  const routeY = 30;

  return (
    <svg viewBox="0 0 300 260" style={{ width: "100%", height: "100%" }}>
      {/* Skala */}
      <g>
        {ticks.map((tv) => {
          const ty = baseY - tv * mmToPx;
          return (
            <g key={tv}>
              <line x1={legLeftX - 22} y1={ty} x2={legLeftX - 14} y2={ty} stroke={GRAY} strokeWidth={1.2} />
              <text x={legLeftX - 25} y={ty + 3} textAnchor="end" fontFamily={MONO} fontSize="7" fill={GRAY}>{tv}</text>
            </g>
          );
        })}
        <line x1={legLeftX - 14} y1={baseY} x2={legRightX + 14} y2={baseY} stroke={GRAY} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
      </g>

      {/* U-Rohr Kontur */}
      <path d={`M${legLeftX},${tubeTop} L${legLeftX},${bendY - 12} Q${legLeftX},${bendY} ${legLeftX + 12},${bendY} L${legRightX - 12},${bendY} Q${legRightX},${bendY} ${legRightX},${bendY - 12} L${legRightX},${tubeTop}`}
        fill="none" stroke="#B9B7B4" strokeWidth={7} />

      {/* Flüssigkeit — ein durchgehendes U statt zweier getrennter Blöcke */}
      <rect x={legLeftX - halfW} y={leftY} width={halfW * 2} height={Math.max(0, bendY + halfW - leftY)} fill={MANOMETER_FLUID} opacity={0.85} />
      <rect x={legRightX - halfW} y={rightY} width={halfW * 2} height={Math.max(0, bendY + halfW - rightY)} fill={MANOMETER_FLUID} opacity={0.85} />
      <rect x={legLeftX - halfW} y={bendY - halfW} width={legRightX - legLeftX + halfW * 2} height={halfW * 2} rx={halfW} fill={MANOMETER_FLUID} opacity={0.85} />

      {/* Δh-Anzeige direkt am Manometer */}
      <text x={(legLeftX + legRightX) / 2} y={12} textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="12" fill={overflow ? OHM_RED : INK}>
        Δh = {(Math.round(hClamped * 10) / 10).toFixed(1).replace(".", ",")} mm
      </text>
      {overflow && (
        <text x={(legLeftX + legRightX) / 2} y={24} textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="8" fill={OHM_RED}>
          ⚠ außerhalb Messbereich
        </text>
      )}

      {/* Leitungen: von den Messstellen außen am Manometer vorbei nach oben, dann in die offenen Rohrenden */}
      <path d={`M${tapLeftX},${bedY} L${tapLeftX},${routeY} L${legLeftX},${routeY} L${legLeftX},${tubeTop}`}
        fill="none" stroke="#B9B7B4" strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${tapRightX},${bedY} L${tapRightX},${routeY} L${legRightX},${routeY} L${legRightX},${tubeTop}`}
        fill="none" stroke="#B9B7B4" strokeWidth={4} strokeLinejoin="round" />
      <circle cx={tapLeftX} cy={bedY} r={2.6} fill={GRAY} />
      <circle cx={tapRightX} cy={bedY} r={2.6} fill={GRAY} />
      <text x={tapLeftX} y={bedY + 12} textAnchor="middle" fontFamily={MONO} fontSize="8" fill={GRAY}>p₁</text>
      <text x={tapRightX} y={bedY + 12} textAnchor="middle" fontFamily={MONO} fontSize="8" fill={GRAY}>p₂</text>

      {/* Zulauf (links) */}
      <line x1={0} y1={bedY + bedH / 2} x2={bedX} y2={bedY + bedH / 2} stroke="#B9B7B4" strokeWidth={7} />
      <polygon points={`${bedX - 4},${bedY + bedH / 2 - 5} ${bedX - 4},${bedY + bedH / 2 + 5} ${bedX + 5},${bedY + bedH / 2}`} fill={OHM_RED} />

      {/* Schüttung (liegend) */}
      <defs>
        <clipPath id="bedClip"><rect x={bedX} y={bedY} width={bedW} height={bedH} rx="3" /></clipPath>
      </defs>
      <rect x={bedX} y={bedY} width={bedW} height={bedH} fill="#FAFAF9" stroke="#B9B7B4" strokeWidth={2.5} rx="3" />
      <g clipPath="url(#bedClip)">
        {thinnedBalls.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={OHM_BLUE} opacity={0.35 + b.shade * 0.35}
            stroke="#0d1a28" strokeWidth={0.4} strokeOpacity={0.3} />
        ))}
      </g>

      {/* Ablauf (rechts) */}
      <line x1={bedX + bedW} y1={bedY + bedH / 2} x2={300} y2={bedY + bedH / 2} stroke="#B9B7B4" strokeWidth={7} />
    </svg>
  );
}

/* ---------------------------------------------------------------------
   BERECHNUNG + HAUPT-APP
--------------------------------------------------------------------- */
function computeLive({ medium, Q, tempC, eps, Dpipe, dp, Lbed }) {
  const { rho, mu } = fluidProps(medium, tempC);
  const A = (Math.PI / 4) * Math.pow(Dpipe / 100, 2); // m2
  const Qm3s = Q / 60000; // L/min -> m3/s
  const u0 = Qm3s / A;
  const dpM = dp / 1000, LbedM = Lbed / 100;
  const e = ergun(u0, rho, mu, eps, dpM);
  const dPPa = e.total * LbedM;
  const h_mm = (dPPa / (RHO_MANOMETER * G)) * 1000;
  const Re = (rho * u0 * dpM) / mu;
  return { rho, mu, u0, dPPa, h_mm, Re, term1: e.term1 * LbedM, term2: e.term2 * LbedM };
}

/* ---------------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------------- */
export default function ErgunMonitor() {
  const [Dpipe, setDpipe] = useState(5);   // cm
  const [dp, setDp] = useState(5);         // mm
  const [Lbed, setLbed] = useState(30);    // cm
  const [medium, setMedium] = useState("luft");
  const [Qair, setQair] = useState(40);     // L/min
  const [Qwater, setQwater] = useState(1);  // L/min
  const [tempC, setTempC] = useState(20);
  const [eps, setEps] = useState(0.4);
  const [noiseSigma, setNoiseSigma] = useState(1.0); // mm, Messfehler (Ablesegenauigkeit)
  const [locked, setLocked] = useState(false); // Rohr-/Kugeldurchmesser, Schütthöhe gesperrt, sobald gesammelt wird
  const [collected, setCollected] = useState([]);
  const [zoomDomain, setZoomDomain] = useState(null); // [xMin,xMax,yMin,yMax] oder null

  const Q = medium === "luft" ? Qair : Qwater;
  const setQ = medium === "luft" ? setQair : setQwater;

  const gaussRef = useRef(makeGaussian(mulberry32(Date.now() % 1e6)));

  const live = computeLive({ medium, Q, tempC, eps, Dpipe, dp, Lbed });

  // Ein Punkt wird nur aufgenommen, wenn ein Regler losgelassen (bzw. Medium gewechselt) wird —
  // nicht bei jeder Zwischenposition während des Ziehens. Dabei wird ein Messfehler aufaddiert.
  const commitPoint = (params) => {
    const trueVal = computeLive(params);
    const noise = gaussRef.current() * noiseSigma;
    const measured = Math.max(0, trueVal.h_mm + noise);
    setCollected((prev) => {
      const next = [...prev, { Q: params.Q, h: measured, hTrue: trueVal.h_mm, dP: trueVal.dPPa, medium: params.medium }];
      return next.length > 2000 ? next.slice(next.length - 2000) : next;
    });
    setLocked(true);
  };
  const handleQCommit = () => commitPoint({ medium, Q, tempC, eps, Dpipe, dp, Lbed });
  const handleMediumSwitch = (newMedium) => {
    if (newMedium === medium) return;
    const newQ = newMedium === "luft" ? Qair : Qwater;
    commitPoint({ medium: newMedium, Q: newQ, tempC, eps, Dpipe, dp, Lbed });
    setMedium(newMedium);
  };

  const handleClear = () => { setCollected([]); setLocked(false); setZoomDomain(null); };

  const exportCSV = () => {
    const csvNum = (x) => (x === null || x === undefined || Number.isNaN(x) ? "" : x.toFixed(5).replace(".", ","));
    const meta = [
      `# Ergun-Monitor Messexport`,
      `# D_Rohr=${Dpipe} cm; d_Kugel=${dp} mm; L_Schuettung=${Lbed} cm; T=${tempC} C; Porosität=${eps}; Messfehler_sigma=${noiseSigma} mm`,
      `# Zeitpunkt: ${new Date().toLocaleString("de-DE")}`,
      ``,
      `Medium;Volumenstrom_L_min;Manometer_gemessen_mm;Manometer_theoretisch_mm;Druckverlust_Pa`,
      ...collected.map((pt) => `${pt.medium};${csvNum(pt.Q)};${csvNum(pt.h)};${csvNum(pt.hTrue)};${csvNum(pt.dP)}`),
    ];
    const csvContent = "\uFEFF" + meta.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ergun_kennlinie_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const airPoints = collected.filter((p) => p.medium === "luft");
  const waterPoints = collected.filter((p) => p.medium === "wasser");

  const allQ = [...collected.map((p) => p.Q), Q];
  const allH = [...collected.map((p) => p.h), live.h_mm];
  const qMin = Math.min(...allQ), qMax = Math.max(...allQ);
  const hMin = Math.min(0, ...allH), hMax = Math.max(...allH);
  const qPad = (qMax - qMin) * 0.12 || qMax * 0.2 || 1;
  const hPad = (hMax - hMin) * 0.12 || hMax * 0.2 || 1;
  const xDomainBase = [Math.max(0, qMin - qPad), qMax + qPad];
  const yDomainBase = [0, hMax + hPad];
  const displayDomain = zoomDomain || [...xDomainBase, ...yDomainBase];
  const xDomain = [displayDomain[0], displayDomain[1]];
  const yDomain = [displayDomain[2], displayDomain[3]];

  const resetZoom = () => setZoomDomain(null);
  const handleWheelZoom = (e) => {
    e.preventDefault();
    const cur = zoomDomain || [...xDomainBase, ...yDomainBase];
    const rect = e.currentTarget.getBoundingClientRect();
    const fracX = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const fracY = 1 - Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const anchorX = cur[0] + fracX * (cur[1] - cur[0]);
    const anchorY = cur[2] + fracY * (cur[3] - cur[2]);
    const factor = e.deltaY > 0 ? 1.25 : 0.8;
    const newXMin = anchorX - (anchorX - cur[0]) * factor;
    const newXMax = anchorX + (cur[1] - anchorX) * factor;
    const newYMin = Math.max(0, anchorY - (anchorY - cur[2]) * factor);
    const newYMax = anchorY + (cur[3] - anchorY) * factor;
    const fullXSpan = xDomainBase[1] - xDomainBase[0];
    if (newXMax - newXMin >= fullXSpan * 0.999) { setZoomDomain(null); return; }
    if (newXMax - newXMin < fullXSpan * 0.01) return;
    setZoomDomain([newXMin, newXMax, newYMin, newYMax]);
  };

  const overflow = Math.abs(live.h_mm) > H_MAX_MM;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const p = payload[0].payload;
    return (
      <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 4, padding: "6px 10px", fontFamily: MONO, fontSize: 11, color: INK, boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
        <div style={{ opacity: 0.6, marginBottom: 4 }}>{p.medium === "luft" ? "Luft" : "Wasser"}</div>
        <div style={{ color: p.medium === "luft" ? OHM_BLUE : OHM_RED, fontWeight: 700 }}>Q = {de(p.Q, 2)} L/min</div>
        <div style={{ color: p.medium === "luft" ? OHM_BLUE : OHM_RED, fontWeight: 700 }}>Δh = {de(p.h, 2)} mm (gemessen)</div>
        <div style={{ opacity: 0.7 }}>Δh_theor. = {de(p.hTrue, 2)} mm</div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex justify-center p-3 md:p-6" style={{ background: BG }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        input.ohm-slider { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:2px; background-color:#DEDCDA; cursor:pointer; }
        input.ohm-slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
          background: ${OHM_RED}; border:2px solid #fff; box-shadow:0 0 0 1px ${PANEL_BORDER}, 0 1px 3px rgba(0,0,0,.25); cursor:pointer; }
        input.ohm-slider::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background: ${OHM_RED}; border:2px solid #fff; cursor:pointer; }
        input.ohm-slider::-moz-range-track { background:#DEDCDA; height:4px; border-radius:2px; }
        input.ohm-slider:disabled::-webkit-slider-thumb { background: #B9B7B4; }
        input.ohm-slider:disabled::-moz-range-thumb { background: #B9B7B4; }
        input.ohm-slider:disabled { cursor: not-allowed; }
        .ohm-btn:active { transform: translateY(1px); }
        .medium-btn { font-family: ${SANS}; font-size: 12px; font-weight: 700; padding: 8px 14px; border-radius: 5px; cursor: pointer; }
      `}</style>

      <div className="w-full flex flex-col gap-4" style={{ maxWidth: 1360, fontFamily: SANS }}>
        {/* HEADER */}
        <div className="flex items-end justify-between flex-wrap gap-3 pb-3" style={{ borderBottom: `3px solid ${OHM_RED}` }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src={OHM_LOGO} alt="Ohm Angewandte Chemie" style={{ height: 34, width: "auto", display: "block" }} />
              <h1 style={{ fontFamily: SANS, fontWeight: 800, fontSize: "clamp(24px,3.2vw,32px)", color: INK, letterSpacing: "-0.01em", lineHeight: 1 }}>
                ERGUN·MONITOR
              </h1>
            </div>
            <p style={{ fontFamily: SANS, fontSize: 12, color: GRAY, marginTop: 6 }}>
              Fakultät Angewandte Chemie · Druckverlust in Schüttschichten · Kennlinie Q vs. Δh
            </p>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: GRAY }}>{collected.length} Punkte gesammelt</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT CONTROLS */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <PanelBox title="Aufbau (nur vor der Sammlung änderbar)">
              <Field label="Rohrdurchmesser D" value={`${de(Dpipe, 1)} cm`} locked={locked}>
                <LinearSlider min={2} max={15} step={0.5} value={Dpipe} onChange={setDpipe} disabled={locked} />
              </Field>
              <Field label="Kugeldurchmesser d_K" value={`${de(dp, 1)} mm`} locked={locked}>
                <LinearSlider min={1} max={20} step={0.5} value={dp} onChange={setDp} disabled={locked} />
              </Field>
              <Field label="Schütthöhe L" value={`${de(Lbed, 0)} cm`} locked={locked}>
                <LinearSlider min={10} max={100} step={1} value={Lbed} onChange={setLbed} disabled={locked} />
              </Field>
              <div style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>
                {locked ? "Für diese Kennlinie gesperrt — 'Punkte löschen' zum Ändern." : "Nur änderbar, solange noch keine Punkte gesammelt wurden."}
              </div>
            </PanelBox>

            <PanelBox title="Medium &amp; Betrieb (nur Q live änderbar)">
              <div className="flex gap-2 mb-3">
                <button onClick={() => handleMediumSwitch("luft")} className="medium-btn" style={{
                  flex: 1, background: medium === "luft" ? OHM_BLUE : "#fff", color: medium === "luft" ? "#fff" : INK,
                  border: `2px solid ${OHM_BLUE}` }}>Luft</button>
                <button onClick={() => handleMediumSwitch("wasser")} className="medium-btn" style={{
                  flex: 1, background: medium === "wasser" ? OHM_RED : "#fff", color: medium === "wasser" ? "#fff" : INK,
                  border: `2px solid ${OHM_RED}` }}>Wasser</button>
              </div>
              <Field label="Volumenstrom Q" value={`${de(Q, 2)} L/min`}>
                <LogSlider min={medium === "luft" ? 5 : 0.2} max={medium === "luft" ? 150 : 3} value={Q} onChange={setQ} onCommit={handleQCommit} />
              </Field>
              <Field label="Temperatur T" value={`${de(tempC, 0)} °C`} locked={locked}>
                <LinearSlider min={0} max={100} step={1} value={tempC} onChange={setTempC} disabled={locked} />
              </Field>
              <Field label="Porosität ε" value={de(eps, 2)} locked={locked}>
                <LinearSlider min={0.3} max={0.6} step={0.01} value={eps} onChange={setEps} disabled={locked} />
              </Field>
              <Field label="Messfehler σ (Ablesegenauigkeit)" value={`± ${de(noiseSigma, 1)} mm`} locked={locked}>
                <LinearSlider min={0} max={5} step={0.1} value={noiseSigma} onChange={setNoiseSigma} disabled={locked} />
              </Field>
              <div style={{ fontFamily: SANS, fontSize: 10.5, color: GRAY }}>
                {locked
                  ? "Nur Q bleibt während der Sammlung änderbar — Temperatur, Porosität und Messfehler sind für diese Kennlinie gesperrt."
                  : "Ein Punkt wird erst aufgenommen, wenn der Q-Regler losgelassen wird (oder beim Mediumwechsel) — nicht bei jeder Zwischenposition. Auf die Ablesung wird ein zufälliger Messfehler aufaddiert."}
              </div>
            </PanelBox>

            <div className="flex gap-3">
              <button onClick={handleClear} className="ohm-btn" style={{ flex: 1, fontFamily: SANS, fontSize: 12, fontWeight: 600, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 5, padding: "9px 0", color: INK }}>
                ↺ Punkte löschen
              </button>
              <button onClick={exportCSV} className="ohm-btn" style={{ flex: 1, fontFamily: SANS, fontSize: 12, fontWeight: 600, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 5, padding: "9px 0", color: INK }}>
                ⤓ CSV
              </button>
            </div>
          </div>

          {/* CENTER: SETUP GRAPHIC */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div style={{ position: "relative", background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 8, height: 300 }}>
              <SetupGraphic eps={eps} h_mm={live.h_mm} overflow={overflow} Dpipe={Dpipe} dp={dp} Lbed={Lbed} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PanelBox title="Δh Manometer (aktuell)">
                <div style={{ fontFamily: MONO, fontSize: 18, color: OHM_RED, fontWeight: 700 }}>{de(live.h_mm, 1)} mm</div>
              </PanelBox>
              <PanelBox title="Druckverlust ΔP">
                <div style={{ fontFamily: MONO, fontSize: 18, color: INK, fontWeight: 700 }}>{de(live.dPPa, 1)} Pa</div>
                <div style={{ fontFamily: MONO, fontSize: 10.5, color: GRAY }}>über {de(Lbed, 0)} cm</div>
              </PanelBox>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <PanelBox title="u₀">
                <div style={{ fontFamily: MONO, fontSize: 13, color: INK }}>{de(live.u0, 3)} m/s</div>
              </PanelBox>
              <PanelBox title="Re_p">
                <div style={{ fontFamily: MONO, fontSize: 13, color: INK }}>{de(live.Re, 1)}</div>
              </PanelBox>
              <PanelBox title="viskos">
                <div style={{ fontFamily: MONO, fontSize: 13, color: INK }}>{de(live.term1, 1)} Pa</div>
              </PanelBox>
              <PanelBox title="turbulent">
                <div style={{ fontFamily: MONO, fontSize: 13, color: INK }}>{de(live.term2, 1)} Pa</div>
              </PanelBox>
            </div>
          </div>

          {/* RIGHT: KENNLINIE */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div style={{ position: "relative", background: CHART_BG, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "10px 8px 4px 0" }}>
              <div className="flex items-center justify-between" style={{ padding: "0 10px", marginBottom: 2 }}>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 11.5, color: INK, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Kennlinie: Volumenstrom vs. Δh
                </span>
                {zoomDomain && (
                  <button onClick={resetZoom} className="ohm-btn" style={{ fontFamily: MONO, fontSize: 10.5, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 4, padding: "3px 8px", color: OHM_RED }}>
                    ⤾ Zoom zurücksetzen
                  </button>
                )}
              </div>
              <div style={{ width: "100%", height: 420 }} onWheel={handleWheelZoom}>
                <ResponsiveContainer>
                  <ComposedChart margin={{ top: 10, right: 18, bottom: 22, left: 30 }}>
                    <CartesianGrid stroke={CHART_GRID} strokeDasharray="2 4" />
                    <XAxis dataKey="Q" type="number" domain={xDomain} allowDataOverflow stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      tickFormatter={(v) => de(v, 1)}
                      label={{ value: "Q / L·min⁻¹", position: "insideBottom", offset: -14, fill: GRAY, fontSize: 12, fontFamily: SANS, fontWeight: 600 }} />
                    <YAxis dataKey="h" type="number" domain={yDomain} allowDataOverflow stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      tickFormatter={(v) => de(v, 1)} width={54}
                      label={{ value: "Δh / mm", angle: -90, position: "insideLeft", offset: 8, fill: INK, fontSize: 12.5, fontFamily: SANS, fontWeight: 600, style: { textAnchor: "middle" } }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={airPoints} dataKey="h" fill={OHM_BLUE} fillOpacity={0.8} isAnimationActive={false} shape="circle" r={3.5} name="Luft" />
                    <Scatter data={waterPoints} dataKey="h" fill={OHM_RED} fillOpacity={0.8} isAnimationActive={false} shape="circle" r={3.5} name="Wasser" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 10, color: GRAY, padding: "2px 10px 6px" }}>
                Blau = Luft, Rot = Wasser. Mausrad zum Zoomen (rein/raus). Jeder eingestellte Volumenstrom wird als Punkt festgehalten — Regler bewegen, um die Kennlinie aufzunehmen.
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${PANEL_BORDER}`, paddingTop: 10, display: "flex", flexWrap: "wrap", gap: "6px 22px" }}>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Ergun: ΔP/L = 150·μ·u₀·(1−ε)²/(ε³·d_K²) + 1,75·ρ·u₀²·(1−ε)/(ε³·d_K)</span>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Luft: ideales Gas + Sutherland-Viskosität · Wasser: Vogel-Gleichung (Viskosität), lineare Näherung (Dichte)</span>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Manometer: gefärbtes Wasser, ρ = 1000 kg/m³ — zeigt den stationären Ergun-Wert direkt, keine künstliche Trägheit</span>
        </div>
      </div>
    </div>
  );
}
