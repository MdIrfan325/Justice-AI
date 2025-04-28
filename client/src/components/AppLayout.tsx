import { ReactNode } from "react";
import Header from "./Header";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NavigationBar />
      <main className="flex-grow py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
