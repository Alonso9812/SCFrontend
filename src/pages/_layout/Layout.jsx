import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Sidebar from "./components/Sidebar";

export const Layout = () => {
  const queryConfig = {
    suspense: true,
    staleTime: 5 * 60 * 1000,
  };

  const queryClient = new QueryClient({ suspense: true });
  
  return (
    <>
    <Sidebar/>
      <main>
        <QueryClientProvider client={queryClient} config={queryConfig}>
          <Outlet />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </main>
    </>
  );
};

export default Layout;
