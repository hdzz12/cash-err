import React from "react";
import StyleSideBar from "@/components/styleSideBar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <StyleSideBar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
