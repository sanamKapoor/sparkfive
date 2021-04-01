import { useState, useEffect } from 'react'
import { SocketContext } from '../context'
import io from 'socket.io-client'

import cookiesUtils from '../utils/cookies'

export default ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null)
  const [connected, setConnected] = useState(false)

  const connectSocket = async () => {
    // If socket has already connected
    if (connected) return

    const jwt = cookiesUtils.get('jwt')

    if (jwt){
      // Init client
      const client = io(process.env.SOCKET_BASE_URL,
          {query: { token: jwt}});

      // Connect success
      client.on('connect', function (){
        console.log(`Socket init successfully`)
        setSocketInstance(client)
      })

      client.on('error', function(e){
        console.log(`Error`)
        console.log(e)
      })

      client.on('close', function(e){
        console.log(`Socket closed`)
      })
    }
  }

  useEffect(()=>{
    connectSocket();
  },[])

  const socketValue = {
    socket: socketInstance,
  }
  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  )
}
