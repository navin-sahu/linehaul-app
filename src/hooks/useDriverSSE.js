import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useDriverSSE = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const evtSource = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/sse/subscribe`);

    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("SSE event recieved:",data)
      // Invalidate only the specific query
      queryClient.invalidateQueries();
    };

    return () => evtSource.close();
  }, [queryClient]);
};
