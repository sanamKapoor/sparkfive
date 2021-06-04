import {useState, useEffect, useContext} from 'react'
import { SocketContext, UserContext } from '../context'
import io from 'socket.io-client'

import cookiesUtils from '../utils/cookies'

export default ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null)
  const [connected, setConnected] = useState(false)
  const [globalListener, setGlobalListener] = useState(true) // listener will be initialized in any context's child

  const { user } = useContext(UserContext)

  // Unregister socket events
  const unregisterEvents = (client) => {
    client.off('uploadFilesProgress');
    client.off('downloadFilesProgress');
  }

  const connectSocket = async (token?: string) => {
    // If socket has already connected
    if (connected) return

    // If any component connect to socket manually (like gust upload), global listener is disable to prevent duplicate listner
    if(token){
      setGlobalListener(false)
    }

    const jwt = token ? token : cookiesUtils.get('jwt')

    if (jwt){
      // Init client
      const client = io(process.env.SOCKET_BASE_URL,
          {query: { token: jwt}});

      // Connect success
      client.on('connect', function (){
        console.log(`Socket init successfully`)

        setSocketInstance(client)
        setConnected(true)
      })

      client.on('disconnect', function (){
        setConnected(false)
        // Destroy event
        unregisterEvents(client)

        setSocketInstance(null)
      })

      client.on('error', function(e){
        console.log(`Error`)
        console.log(e)

        setConnected(false)
        // Destroy event
        unregisterEvents(client)
        setSocketInstance(null)
      })

      client.on('close', function(e){
        console.log(`Socket closed`)
        setConnected(false)
        // Destroy event
        unregisterEvents(client)
        setSocketInstance(null)
      })
    }
  }

  const logout = () => {
    if(socketInstance){
      // Destroy event
      socketInstance.off('uploadFilesProgress')

      setConnected(false)

      // Dis connect
      socketInstance.disconnect()

      setSocketInstance(null)
    }
  }

  useEffect(()=>{
    if(user){
      // Connect to socket if user has just logged in
      connectSocket()
    }else{
      logout()
    }
  },[user])

  const socketValue = {
    globalListener: globalListener,
    socket: socketInstance,
    socketLogout: logout,
    connectSocket: connectSocket,
    connected
  }
  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  )
}
