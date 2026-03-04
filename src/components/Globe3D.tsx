import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Pause, ArrowsClockwise, Warning, Target, Crosshair } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface ThreatLocation {
  id: string
  name: string
  region: string
  lat: number
  lng: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'escalating' | 'monitoring'
  description: string
  lastUpdate: string
  threatType: string
}

const threatLocations: ThreatLocation[] = [
  {
    id: 'gcc-iran',
    name: 'GCC-Iran Tensions',
    region: 'Persian Gulf',
    lat: 27.5,
    lng: 51.5,
    severity: 'high',
    status: 'monitoring',
    description: 'Heightened military presence in Strait of Hormuz. Naval assets monitoring shipping lanes.',
    lastUpdate: 'Updated 3 mins ago',
    threatType: 'Naval Conflict'
  },
  {
    id: 'israel-iran',
    name: 'Israel-Iran Conflict',
    region: 'Middle East',
    lat: 32.0,
    lng: 35.0,
    severity: 'critical',
    status: 'active',
    description: 'Active missile defense operations. Hypersonic missile threats detected. Iron Dome engaged.',
    lastUpdate: 'Updated 1 min ago',
    threatType: 'Missile Defense'
  },
  {
    id: 'ukraine',
    name: 'Ukraine Theater',
    region: 'Eastern Europe',
    lat: 49.0,
    lng: 32.0,
    severity: 'critical',
    status: 'active',
    description: 'Ground operations continue. Drone swarms detected. Artillery exchanges ongoing.',
    lastUpdate: 'Updated 2 mins ago',
    threatType: 'Combined Arms'
  },
  {
    id: 'cuba-surveillance',
    name: 'Cuba Strategic Watch',
    region: 'Caribbean',
    lat: 21.5,
    lng: -80.0,
    severity: 'medium',
    status: 'monitoring',
    description: 'Monitoring military installations. Electronic intelligence gathering. Naval patrol routes active.',
    lastUpdate: 'Updated 15 mins ago',
    threatType: 'Surveillance'
  },
  {
    id: 'south-china-sea',
    name: 'South China Sea',
    region: 'Indo-Pacific',
    lat: 12.0,
    lng: 115.0,
    severity: 'high',
    status: 'escalating',
    description: 'Increased naval activity. Fighter jet incursions. Freedom of navigation challenged.',
    lastUpdate: 'Updated 5 mins ago',
    threatType: 'Aerospace & Naval'
  },
  {
    id: 'taiwan-strait',
    name: 'Taiwan Strait',
    region: 'East Asia',
    lat: 24.0,
    lng: 120.0,
    severity: 'high',
    status: 'monitoring',
    description: 'Military exercises observed. Hypersonic missile tests detected. Enhanced readiness posture.',
    lastUpdate: 'Updated 8 mins ago',
    threatType: 'Aerospace Defense'
  }
]

interface Globe3DProps {
  onThreatSelect?: (threat: ThreatLocation) => void
}

export function Globe3D({ onThreatSelect }: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const markersRef = useRef<THREE.Group | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  const [isRotating, setIsRotating] = useState(true)
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null)
  const [hoveredThreat, setHoveredThreat] = useState<ThreatLocation | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x4488ff, 1, 100)
    pointLight.position.set(-5, 0, 3)
    scene.add(pointLight)

    const sphereGeometry = new THREE.SphereGeometry(2, 64, 64)
    
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a2e,
      emissive: 0x0f0f18,
      specular: 0x2244ff,
      shininess: 25,
      transparent: true,
      opacity: 0.95
    })
    
    const globe = new THREE.Mesh(sphereGeometry, globeMaterial)
    scene.add(globe)
    globeRef.current = globe

    const latLongGeometry = new THREE.EdgesGeometry(sphereGeometry)
    const latLongMaterial = new THREE.LineBasicMaterial({ 
      color: 0x2244ff, 
      transparent: true, 
      opacity: 0.15 
    })
    const latLongLines = new THREE.LineSegments(latLongGeometry, latLongMaterial)
    globe.add(latLongLines)

    const markersGroup = new THREE.Group()
    scene.add(markersGroup)
    markersRef.current = markersGroup

    threatLocations.forEach((threat) => {
      const phi = (90 - threat.lat) * (Math.PI / 180)
      const theta = (threat.lng + 180) * (Math.PI / 180)
      
      const x = -(2.02 * Math.sin(phi) * Math.cos(theta))
      const y = 2.02 * Math.cos(phi)
      const z = 2.02 * Math.sin(phi) * Math.sin(theta)

      let color: number
      switch (threat.severity) {
        case 'critical':
          color = 0xff3333
          break
        case 'high':
          color = 0xffaa33
          break
        case 'medium':
          color = 0x4488ff
          break
        default:
          color = 0x33ff88
      }

      const markerGeometry = new THREE.SphereGeometry(0.03, 16, 16)
      const markerMaterial = new THREE.MeshBasicMaterial({ 
        color,
        transparent: true,
        opacity: 0.9
      })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(x, y, z)
      marker.userData = { threat }
      markersGroup.add(marker)

      if (threat.severity === 'critical' || threat.severity === 'high') {
        const ringGeometry = new THREE.RingGeometry(0.05, 0.08, 32)
        const ringMaterial = new THREE.MeshBasicMaterial({ 
          color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.position.set(x, y, z)
        ring.lookAt(0, 0, 0)
        markersGroup.add(ring)

        const pulseScale = { value: 1 }
        const animatePulse = () => {
          pulseScale.value = 1 + Math.sin(Date.now() * 0.003) * 0.3
          ring.scale.set(pulseScale.value, pulseScale.value, 1)
        }
        ring.userData.animate = animatePulse
      }

      const spireGeometry = new THREE.CylinderGeometry(0.005, 0.015, 0.2, 8)
      const spireMaterial = new THREE.MeshBasicMaterial({ 
        color,
        transparent: true,
        opacity: 0.6
      })
      const spire = new THREE.Mesh(spireGeometry, spireMaterial)
      const spireHeight = 0.1
      const dirX = x / 2.02
      const dirY = y / 2.02
      const dirZ = z / 2.02
      spire.position.set(
        x + dirX * spireHeight,
        y + dirY * spireHeight,
        z + dirZ * spireHeight
      )
      spire.lookAt(x * 2, y * 2, z * 2)
      markersGroup.add(spire)
    })

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      setMousePos({ x: event.clientX, y: event.clientY })

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(markersGroup.children.filter((child: THREE.Object3D) => child.userData.threat))

      if (intersects.length > 0) {
        const threat = intersects[0].object.userData.threat as ThreatLocation
        setHoveredThreat(threat)
        document.body.style.cursor = 'pointer'
      } else {
        setHoveredThreat(null)
        document.body.style.cursor = 'default'
      }
    }

    const onClick = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(markersGroup.children.filter((child: THREE.Object3D) => child.userData.threat))

      if (intersects.length > 0) {
        const threat = intersects[0].object.userData.threat as ThreatLocation
        setSelectedThreat(threat.id)
        if (onThreatSelect) {
          onThreatSelect(threat)
        }
      }
    }

    containerRef.current.addEventListener('mousemove', onMouseMove)
    containerRef.current.addEventListener('click', onClick)

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      if (isRotating && globe) {
        globe.rotation.y += 0.001
        if (markersGroup) {
          markersGroup.rotation.y += 0.001
        }
      }

      markersGroup.children.forEach((child: THREE.Object3D) => {
        if (child.userData.animate) {
          child.userData.animate()
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', onMouseMove)
        containerRef.current.removeEventListener('click', onClick)
        if (rendererRef.current?.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      document.body.style.cursor = 'default'
      renderer.dispose()
      globeMaterial.dispose()
      sphereGeometry.dispose()
    }
  }, [isRotating, onThreatSelect])

  const handleReset = () => {
    if (globeRef.current && markersRef.current) {
      globeRef.current.rotation.y = 0
      markersRef.current.rotation.y = 0
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive'
      case 'high': return 'text-warning'
      case 'medium': return 'text-primary'
      case 'low': return 'text-success'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Warning weight="fill" size={14} />
      case 'escalating': return <Target weight="fill" size={14} />
      case 'monitoring': return <Crosshair weight="fill" size={14} />
      default: return null
    }
  }

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-mono text-xs uppercase">
            3D Threat Globe - Live
          </Badge>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsRotating(!isRotating)}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isRotating ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowsClockwise size={16} />
          </Button>
        </div>

        <div 
          ref={containerRef} 
          className="w-full h-[600px] relative"
          style={{ touchAction: 'none' }}
        />

        <AnimatePresence>
          {hoveredThreat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-20 bg-card/95 backdrop-blur-md border border-border rounded-lg p-3 shadow-lg"
              style={{
                left: mousePos.x + 15,
                top: mousePos.y - 60,
                maxWidth: '280px'
              }}
            >
              <div className="flex items-start gap-2 mb-1">
                <div className={getSeverityColor(hoveredThreat.severity)}>
                  {getStatusIcon(hoveredThreat.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs uppercase tracking-wide mb-0.5">
                    {hoveredThreat.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-mono mb-1">
                    {hoveredThreat.threatType}
                  </p>
                </div>
                <Badge className={`${getSeverityColor(hoveredThreat.severity)} text-[10px] font-mono uppercase px-1.5 py-0`}>
                  {hoveredThreat.severity}
                </Badge>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {hoveredThreat.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {threatLocations.map((threat) => (
          <motion.div
            key={threat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selectedThreat === threat.id ? 'border-primary bg-primary/5' : ''
              } ${
                threat.severity === 'critical' ? 'border-l-4 border-l-destructive' :
                threat.severity === 'high' ? 'border-l-4 border-l-warning' : ''
              }`}
              onClick={() => {
                setSelectedThreat(threat.id)
                if (onThreatSelect) {
                  onThreatSelect(threat)
                }
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={getSeverityColor(threat.severity)}>
                    {getStatusIcon(threat.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wide">{threat.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{threat.threatType}</p>
                  </div>
                </div>
                <Badge className={`${getSeverityColor(threat.severity)} text-xs font-mono uppercase`}>
                  {threat.severity}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {threat.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">{threat.region}</span>
                <span className="text-muted-foreground font-mono">{threat.lastUpdate}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
