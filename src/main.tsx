import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import { ModalProvider } from "./context/ModalContext";
import App from "./app/App.tsx";
import "./styles/index.css";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 600,
  once: true,
  offset: 80,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ModalProvider>
          <App />
        </ModalProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);
