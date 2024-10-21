import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryExample } from "./QueryExample";

const queryClient = new QueryClient();

import { Toaster } from "@/components/ui/toaster";

export function Spa_test_1() {
  return (
    <div>
      {/* everything that interacts with Tankstack query will go inside the provider */}
      <QueryClientProvider client={queryClient}>
        <div>
          <QueryExample />
          <Toaster />
          <ReactQueryDevtools initialIsOpen />
        </div>
      </QueryClientProvider>
    </div>
  );
}
