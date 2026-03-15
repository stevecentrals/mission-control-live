/**
 * Gateway WebSocket Client with Device Identity Support
 */

class GatewayClient {
  constructor() {
    this.ws = null
    this.isConnected = false
    this.deviceKeys = null
    this.callbacks = {
      onConnect: () => {},
      onDisconnect: () => {},
      onMessage: () => {},
      onError: () => {}
    }
    this.pendingRequests = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
  }

  // Generate device identity keypair
  async generateDeviceKeys() {
    try {
      // Generate ECDSA keypair for device identity
      const keyPair = await crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: 'P-256' },
        true, // extractable
        ['sign', 'verify']
      )
      
      // Export public key
      const publicKeyRaw = await crypto.subtle.exportKey('raw', keyPair.publicKey)
      const publicKeyHex = Array.from(new Uint8Array(publicKeyRaw))
        .map(b => b.toString(16).padStart(2, '0')).join('')
      
      // Generate device ID from public key hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', publicKeyRaw)
      const deviceId = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)
      
      this.deviceKeys = { keyPair, publicKey: publicKeyHex, deviceId }
      
      // Store device keys in localStorage for persistence
      const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
      const exportedPublicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey)
      
      localStorage.setItem('device-keys', JSON.stringify({
        privateKey: Array.from(new Uint8Array(exportedPrivateKey)),
        publicKey: Array.from(new Uint8Array(exportedPublicKey)),
        publicKeyHex,
        deviceId
      }))
      
      return this.deviceKeys
    } catch (error) {
      console.warn('Device key generation failed (insecure context?):', error)
      return null
    }
  }

  // Load existing device keys from storage
  async loadDeviceKeys() {
    try {
      const stored = localStorage.getItem('device-keys')
      if (!stored) return null

      const data = JSON.parse(stored)
      
      // Import the keys back
      const privateKeyBuffer = new Uint8Array(data.privateKey).buffer
      const publicKeyBuffer = new Uint8Array(data.publicKey).buffer
      
      const privateKey = await crypto.subtle.importKey(
        'pkcs8',
        privateKeyBuffer,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['sign']
      )
      
      const publicKey = await crypto.subtle.importKey(
        'spki',
        publicKeyBuffer,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      )

      this.deviceKeys = {
        keyPair: { privateKey, publicKey },
        publicKey: data.publicKeyHex,
        deviceId: data.deviceId
      }
      
      return this.deviceKeys
    } catch (error) {
      console.warn('Failed to load stored device keys:', error)
      return null
    }
  }

  // Sign challenge with device private key
  async signChallenge(nonce, timestamp) {
    if (!this.deviceKeys) return null
    
    try {
      const message = `${nonce}:${timestamp}`
      const encoder = new TextEncoder()
      const data = encoder.encode(message)
      
      const signature = await crypto.subtle.sign(
        { name: 'ECDSA', hash: 'SHA-256' },
        this.deviceKeys.keyPair.privateKey,
        data
      )
      
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      console.error('Challenge signing failed:', error)
      return null
    }
  }

  // Set event callbacks
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = callback
    }
  }

  // Connect to gateway
  async connect(url, token) {
    if (this.ws) {
      this.disconnect()
    }

    // Ensure we have device keys
    if (!this.deviceKeys) {
      await this.loadDeviceKeys() || await this.generateDeviceKeys()
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url)
        let connectResolved = false

        this.ws.onopen = () => {
          console.log('WebSocket connected, waiting for challenge...')
        }

        this.ws.onmessage = async (event) => {
          try {
            const msg = JSON.parse(event.data)
            
            // Handle challenge
            if (msg.type === 'event' && msg.event === 'connect.challenge') {
              const nonce = msg.payload?.nonce
              const ts = msg.payload?.ts || Date.now()
              
              // Build connect request with device identity
              const connectReq = {
                type: 'req',
                id: 'connect-' + Date.now(),
                method: 'connect',
                params: {
                  minProtocol: 3,
                  maxProtocol: 3,
                  client: {
                    id: 'openclaw-control-ui',
                    version: '1.0.0',
                    platform: 'web',
                    mode: 'ui'
                  },
                  role: 'operator',
                  scopes: ['operator.read', 'operator.write'],
                  caps: [],
                  commands: [],
                  permissions: {},
                  auth: {},
                  locale: navigator.language,
                  userAgent: 'MissionControl/1.0.0'
                }
              }
              
              // Add token auth
              if (token) {
                connectReq.params.auth.token = token
              }
              
              // Add device identity
              if (this.deviceKeys && nonce) {
                const signature = await this.signChallenge(nonce, ts)
                if (signature) {
                  connectReq.params.device = {
                    id: this.deviceKeys.deviceId,
                    publicKey: this.deviceKeys.publicKey,
                    signature: signature,
                    signedAt: ts,
                    nonce: nonce
                  }
                }
              }
              
              this.ws.send(JSON.stringify(connectReq))
              return
            }
            
            // Handle connect response
            if (msg.type === 'res' && msg.id?.startsWith('connect-')) {
              if (!connectResolved) {
                connectResolved = true
                if (msg.ok) {
                  this.isConnected = true
                  this.reconnectAttempts = 0
                  this.callbacks.onConnect()
                  resolve(true)
                } else {
                  const errorMsg = msg.error?.message || 'Connection rejected'
                  this.callbacks.onError(errorMsg)
                  reject(new Error(errorMsg))
                }
              }
              return
            }
            
            // Handle other messages
            this.callbacks.onMessage(msg)
            
          } catch (e) {
            console.error('Error parsing message:', e)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          if (!connectResolved) {
            connectResolved = true
            reject(new Error('Connection failed'))
          }
          this.callbacks.onError('Connection error')
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason)
          this.isConnected = false
          this.callbacks.onDisconnect()
          
          // Auto-reconnect
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            setTimeout(() => this.connect(url, token), 2000 * this.reconnectAttempts)
          }
        }

      } catch (e) {
        reject(e)
      }
    })
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
  }

  // Send message
  send(message) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(message))
    }
  }

  // Send chat message
  async sendChat(sessionKey, message, options = {}) {
    return new Promise((resolve, reject) => {
      const reqId = `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const idempotencyKey = `mc-${Date.now()}-${Math.random().toString(36).slice(2)}`
      
      const req = {
        type: 'req',
        id: reqId,
        method: 'chat.send',
        params: {
          sessionKey: sessionKey || 'main',
          message,
          idempotencyKey,
          ...options
        }
      }
      
      // Store pending request
      this.pendingRequests.set(reqId, { resolve, reject, timestamp: Date.now() })
      
      // Clean up old requests (older than 30 seconds)
      setTimeout(() => {
        if (this.pendingRequests.has(reqId)) {
          this.pendingRequests.delete(reqId)
          reject(new Error('Request timeout'))
        }
      }, 30000)
      
      this.send(req)
    })
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      hasDeviceKeys: !!this.deviceKeys,
      deviceId: this.deviceKeys?.deviceId || null
    }
  }

  // Reset device identity (for troubleshooting)
  resetDeviceIdentity() {
    localStorage.removeItem('device-keys')
    this.deviceKeys = null
  }
}

export default GatewayClient