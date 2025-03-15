import { useMeQuery } from "@/store/api/apiSlice";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { refetch } = useMeQuery()

  /// TODO i think switch to this https://redux-toolkit.js.org/rtk-query/usage/streaming-updates
  // basically move the websocket connection to user.user onCacheenrtyAdded?????
  // not sure, bc I still need the 'socket' object itself either in state/context OR redux state
  console.log('SOCKET CONTEXTN')
  useEffect(() => {
    // const socket = io('/socket.io'); // does not work, it confuses this with namespace
    const s = io({
      path: "/socket.io",
      // autoConnect: !!user,
    });
    setSocket(s);

    // https://socket.io/docs/v3/emit-cheatsheet/
    //const socket = io();  // also works
    // const socket = io('http://127.0.0.1:3000'); // works, but w need proxy, not direct connect

    s.on("connect", () => {
      console.log(`Socket connected ${s.id}`);
    });

    s.on("connect_error", (err) => {
      console.log('CONNECT ERROR', err.message, {...err}); // prints the message associated with the error
    });
    
    s.on("join-room", (room) => {
      console.log(`Joined room ${room}`);
      s.emit('message', 'JOIENEDDDD')
    })

    s.on("user", (user) => {
      console.log('WEBSSOCKET USER UDPATE: ', user)
      // dispatch(setUser(user))
      refetch();
    })
    
    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket}}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext);
