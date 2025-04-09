import * as React from "react";
import { extendTheme, styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // Using react-router for navigation
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";

// Mock: Get role from authentication context (Replace with actual auth logic)
const userRole = ["admin", "user"]; // Change this based on user role (e.g., "admin" or "user")

// Define navigation with role-based access and children
const NAVIGATION = [
  {
    kind: "header",
    title: "Main",
  },
  {
    segment: "/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    roles: ["admin", "user"],
  },
  {
    segment: "admin/user-management",
    title: "User Management",
    icon: <DescriptionIcon />,
    roles: ["admin"],
  },
  {
    segment: "client/category-management",
    title: "Category Management",
    icon: <DescriptionIcon />,
    roles: ["user"],
  },
  {
    segment: "admin/role-management",
    title: "Role Management",
    icon: <DescriptionIcon />,
    roles: ["admin"],
  },
  {
    segment: "business-management",
    title: "Business Management",
    icon: <LayersIcon />,
    roles: ["admin"],
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Subscription",
  },
  {
    segment: "admin/subscription-plan-management",
    title: "Subscription Plan Management",
    icon: <ShoppingCartIcon />,
    roles: ["admin"],
  },
  {
    segment: "user-subscription-plan-management",
    title: "User-Subscription Plan Management",
    icon: <BarChartIcon />,
    roles: ["admin"],
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Reports & Analysis",
  },
  {
    segment: "/reports",
    title: "Reports",
    icon: <DescriptionIcon />,
    roles: ["admin"],
  },
  {
    segment: "/analysis",
    title: "Analysis",
    icon: <BarChartIcon />,
    roles: ["admin"],
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
});

const filterNavigation = (nav, roles) =>
  nav
    .filter((item) => !item.roles || item.roles.some((role) => roles.includes(role)))
    .map((item) =>
      item.children
        ? {
            ...item,
            children: item.children.filter((child) =>
              child.roles.some((role) => roles.includes(role))
            ),
          }
        : item
    );

const filteredNavigation = filterNavigation(NAVIGATION, userRole);

const MainLayout = ({ children }) => {
  const navigate = useNavigate(); // Using React Router for navigation

  return (
    <AppProvider navigation={filteredNavigation} theme={demoTheme}>
      <DashboardLayout>
        <PageContainer>{children}</PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
};

export default MainLayout;
