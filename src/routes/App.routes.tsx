import { Route, Routes } from "react-router-dom";
import { Header } from "@/components/Header";
import { App } from "@/App";

export function AppRoutes() {
  return (
    <>
      <div className="flex w-full min-h-screen">
        <div>
          <Header />
        </div>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </div>
    </>
  );
}
