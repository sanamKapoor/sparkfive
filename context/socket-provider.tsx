import {useState, useEffect, useContext} from 'react'
import { SocketContext, UserContext } from '../context'
import io from 'socket.io-client'

import cookiesUtils from '../utils/cookies'

export default ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null)
  const [connected, setConnected] = useState(false)

  const { user } = useContext(UserContext)

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
        setConnected(true)
      })

      client.on('disconnect', function (){
        setConnected(false)
        // Destroy event
        client.off('uploadFilesProgress');

        setSocketInstance(null)
      })

      client.on('error', function(e){
        console.log(`Error`)
        console.log(e)

        setConnected(false)
        // Destroy event
        client.off('uploadFilesProgress');
        setSocketInstance(null)
      })

      client.on('close', function(e){
        console.log(`Socket closed`)
        setConnected(false)
        // Destroy event
        client.off('uploadFilesProgress');
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
    socket: socketInstance,
    socketLogout: logout,
    connected
  }
  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  )
}
