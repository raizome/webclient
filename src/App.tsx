import { Toaster as Sonner } from "@src/components/ui/sonner";
import { TooltipProvider } from "@src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@src/pages/Dashboard";
import TagDetail from "@src/pages/TagDetail";
import Login from "@src/pages/Login";
import ArticlePage from "@src/pages/ArticlePage";
import NotFound from "@src/pages/NotFound";
import Register from "@src/pages/Register";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                        path="/dashboard/tags/:tagName"
                        element={<TagDetail />}
                    />
                    <Route
                        path="/dashboard/article/:itemId"
                        element={<ArticlePage />}
                    />
                    {/* ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
