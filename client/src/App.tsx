import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Glossary from "./pages/Glossary";
import AiQA from "./pages/AiQA";
import Documents from "./pages/Documents";
import News from "./pages/News";
import Templates from "./pages/Templates";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/ai-qa" component={AiQA} />
      <Route path="/documents" component={Documents} />
      <Route path="/news" component={News} />
      <Route path="/templates" component={Templates} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <Router />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
