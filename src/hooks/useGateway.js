import { useState, useEffect, useCallback, useRef } from 'react'
import GatewayClient from '@/lib/gateway'

const DEFAULT_URL = 'ws://127.0.0.1:18789'

export function useGateway() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const gatewayRef = useRef(null)
  const chatHandlerRef = useRef(null)

  // Initialize gateway client
  useEffect(() => {
    if (!gatewayRef.current) {
      const gateway = new GatewayClient()
      
      gateway.on('onConnect', () => {
        setIsConnected(true)
        setIsConnecting(false)
        setError(null)
      })
      
      gateway.on('onDisconnect', () => {
        setIsConnected(false)
        setIsConnecting(false)
      })
      
      gateway.on('onError', (errorMsg) => {
        setError(errorMsg)
        setIsConnecting(false)
      })
      
      gateway.on('onMessage', (msg) => {
        // Handle chat events
        if (msg.type === 'event' && msg.event === 'chat') {
          if (chatHandlerRef.current) {
            chatHandlerRef.current(msg.payload)
          }
        }
      })
      
      gatewayRef.current = gateway
    }
    
    return () => {
      if (gatewayRef.current) {
        gatewayRef.current.disconnect()
      }
    }
  }, [])

  const connect = useCallback(async (url = DEFAULT_URL, token = null) => {
    if (!gatewayRef.current) return
    
    if (gatewayRef.current.isConnected) {
      console.log('Already connected')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      await gatewayRef.current.connect(url, token)
    } catch (e) {
      setError(e.message)
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    if (gatewayRef.current) {
      gatewayRef.current.disconnect()
    }
    setIsConnected(false)
  }, [])

  const send = useCallback((method, params = {}) => {
    if (!gatewayRef.current || !gatewayRef.current.isConnected) {
      return Promise.reject(new Error('Not connected'))
    }

    const req = { type: 'req', id: `req-${Date.now()}`, method, params }
    gatewayRef.current.send(req)
    return Promise.resolve() // Basic implementation
  }, [])

  const sendChat = useCallback((sessionKey, message, options = {}) => {
    if (!gatewayRef.current) {
      return Promise.reject(new Error('Gateway not initialized'))
    }
    return gatewayRef.current.sendChat(sessionKey, message, options)
  }, [])

  const onChat = useCallback((handler) => {
    chatHandlerRef.current = handler
    return () => { chatHandlerRef.current = null }
  }, [])

  const getStatus = useCallback(() => {
    return gatewayRef.current ? gatewayRef.current.getStatus() : { 
      connected: false, 
      hasDeviceKeys: false, 
      deviceId: null 
    }
  }, [])

  const resetDeviceIdentity = useCallback(() => {
    if (gatewayRef.current) {
      gatewayRef.current.resetDeviceIdentity()
    }
  }, [])

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    send,
    sendChat,
    onChat,
    getStatus,
    resetDeviceIdentity
  }
}

export default useGateway
