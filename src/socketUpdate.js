import { io } from "socket.io-client";

let socket;

export const initSocket = (url = "http://localhost:5000") => {
  if (!socket) {
    socket = io(url);
  }
  return socket;
};

/**
 * Register a listener to automatically update TanStack Query cache
 * @param {QueryClient} queryClient - tanstack query client
 * @param {string} event - socket event name
 * @param {function} updater - function(oldData, payload) => newData
 */
export const registerSocketListener = (queryClient, event, updater) => {
  if (!socket) throw new Error("Socket not initialized. Call initSocket() first.");

  const handler = (payload) => {
    queryClient.setQueryData(updater.queryKey, (oldData) => {
      if (!oldData) return oldData;
      return updater.fn(oldData, payload);
    });
  };

  socket.on(event, handler);

  return () => socket.off(event, handler);
};
