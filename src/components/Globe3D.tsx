import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Pause, ArrowsClockwise, Warning, Target, Crosshair, Globe, MagnifyingGlassMinus, MagnifyingGlassPlus } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3'

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

interface ThreatTrajectory {
  id: string
  type: 'missile' | 'aircraft' | 'drone'
  origin: { lat: number; lng: number }
  target: { lat: number; lng: number }
  severity: 'critical' | 'high' | 'medium'
  color: number
  speed: number
  progress: number
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

const trajectories: ThreatTrajectory[] = [
  {
    id: 'traj-001',
    type: 'missile',
    origin: { lat: 35.7, lng: 51.4 },
    target: { lat: 32.0, lng: 35.0 },
    severity: 'critical',
    color: 0xff3333,
    speed: 0.008,
    progress: 0
  },
  {
    id: 'traj-002',
    type: 'aircraft',
    origin: { lat: 55.0, lng: 37.6 },
    target: { lat: 49.0, lng: 32.0 },
    severity: 'high',
    color: 0xffaa33,
    speed: 0.004,
    progress: 0
  },
  {
    id: 'traj-003',
    type: 'drone',
    origin: { lat: 31.0, lng: 34.0 },
    target: { lat: 32.5, lng: 35.5 },
    severity: 'medium',
    color: 0xffaa33,
    speed: 0.003,
    progress: 0
  },
  {
    id: 'traj-004',
    type: 'missile',
    origin: { lat: 40.0, lng: 44.5 },
    target: { lat: 49.5, lng: 31.5 },
    severity: 'critical',
    color: 0xff3333,
    speed: 0.007,
    progress: 0
  },
  {
    id: 'traj-005',
    type: 'aircraft',
    origin: { lat: 18.0, lng: 109.0 },
    target: { lat: 24.0, lng: 120.0 },
    severity: 'high',
    color: 0xffaa33,
    speed: 0.005,
    progress: 0
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
  const trajectoriesRef = useRef<THREE.Group | null>(null)
  const trajectoryStatesRef = useRef<Map<string, { progress: number }>>(new Map())
  const animationFrameRef = useRef<number | null>(null)
  
  const [isRotating, setIsRotating] = useState(true)
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null)
  const [hoveredThreat, setHoveredThreat] = useState<ThreatLocation | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showCountries, setShowCountries] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const labelsGroupRef = useRef<THREE.Group | null>(null)
  
  const isDraggingRef = useRef(false)
  const previousMousePositionRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(5)

  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)
    return new THREE.Vector3(x, y, z)
  }

  const createCountryBoundaries = async (scene: THREE.Scene, globe: THREE.Mesh) => {
    const boundariesGroup = new THREE.Group()
    
    try {
      const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json') as any
      const countries = (d3 as any).feature(world, world.objects.countries)
      
      countries.features.forEach((country: any) => {
        if (country.geometry.type === 'Polygon') {
          country.geometry.coordinates.forEach((polygon: any) => {
            drawBoundary(polygon, boundariesGroup)
          })
        } else if (country.geometry.type === 'MultiPolygon') {
          country.geometry.coordinates.forEach((multiPolygon: any) => {
            multiPolygon.forEach((polygon: any) => {
              drawBoundary(polygon, boundariesGroup)
            })
          })
        }
      })
      
      globe.add(boundariesGroup)
    } catch (error) {
      console.error('Error loading country boundaries:', error)
    }
  }

  const drawBoundary = (coordinates: number[][], group: THREE.Group) => {
    const points: THREE.Vector3[] = []
    
    coordinates.forEach((coord: number[]) => {
      const [lng, lat] = coord
      const vector = latLngToVector3(lat, lng, 2.013)
      points.push(vector)
    })
    
    if (points.length > 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: 0x88bbff,
        transparent: true,
        opacity: 0.5,
        linewidth: 1.5
      })
      const line = new THREE.Line(geometry, material)
      group.add(line)
    }
  }

  const addCountryLabels = (scene: THREE.Scene) => {
    const majorCountries = [
      { name: 'USA', lat: 37.0, lng: -95.0 },
      { name: 'CANADA', lat: 56.0, lng: -106.0 },
      { name: 'BRAZIL', lat: -14.0, lng: -51.0 },
      { name: 'RUSSIA', lat: 61.0, lng: 105.0 },
      { name: 'CHINA', lat: 35.0, lng: 105.0 },
      { name: 'INDIA', lat: 20.0, lng: 77.0 },
      { name: 'AUSTRALIA', lat: -25.0, lng: 133.0 },
      { name: 'SOUTH AFRICA', lat: -30.0, lng: 22.0 },
      { name: 'EGYPT', lat: 26.0, lng: 30.0 },
      { name: 'SAUDI ARABIA', lat: 24.0, lng: 45.0 },
      { name: 'IRAN', lat: 32.0, lng: 53.0 },
      { name: 'UKRAINE', lat: 48.0, lng: 31.0 },
      { name: 'FRANCE', lat: 46.0, lng: 2.0 },
      { name: 'GERMANY', lat: 51.0, lng: 10.0 },
      { name: 'UK', lat: 54.0, lng: -2.0 },
      { name: 'SPAIN', lat: 40.0, lng: -4.0 },
      { name: 'JAPAN', lat: 36.0, lng: 138.0 },
      { name: 'S. KOREA', lat: 36.0, lng: 128.0 },
      { name: 'MEXICO', lat: 23.0, lng: -102.0 },
      { name: 'ARGENTINA', lat: -38.0, lng: -63.0 },
      { name: 'TURKEY', lat: 39.0, lng: 35.0 },
      { name: 'INDONESIA', lat: -0.5, lng: 117.0 },
      { name: 'VIETNAM', lat: 16.0, lng: 108.0 },
      { name: 'THAILAND', lat: 15.0, lng: 100.0 },
      { name: 'NIGERIA', lat: 9.0, lng: 8.0 },
      { name: 'KENYA', lat: -1.0, lng: 38.0 },
      { name: 'POLAND', lat: 52.0, lng: 20.0 },
      { name: 'ITALY', lat: 42.0, lng: 12.0 },
      { name: 'N. KOREA', lat: 40.0, lng: 127.0 }
    ]

    const labelsGroup = new THREE.Group()
    
    majorCountries.forEach((country) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return
      
      canvas.width = 256
      canvas.height = 64
      
      context.fillStyle = 'rgba(68, 136, 255, 0.8)'
      context.font = 'bold 24px "Space Grotesk", sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(country.name, 128, 32)
      
      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true,
        opacity: 0.7,
        depthTest: false
      })
      const sprite = new THREE.Sprite(material)
      
      const position = latLngToVector3(country.lat, country.lng, 2.15)
      sprite.position.copy(position)
      sprite.scale.set(0.3, 0.075, 1)
      
      labelsGroup.add(sprite)
    })
    
    scene.add(labelsGroup)
    return labelsGroup
  }

  const addLatitudeLongitudeGrid = (globe: THREE.Mesh) => {
    const gridGroup = new THREE.Group()
    const radius = 2.005
    
    for (let lat = -80; lat <= 80; lat += 20) {
      const points: THREE.Vector3[] = []
      for (let lng = -180; lng <= 180; lng += 5) {
        points.push(latLngToVector3(lat, lng, radius))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: 0x2244ff,
        transparent: true,
        opacity: 0.25
      })
      const line = new THREE.Line(geometry, material)
      gridGroup.add(line)
    }
    
    for (let lng = -180; lng <= 180; lng += 20) {
      const points: THREE.Vector3[] = []
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(latLngToVector3(lat, lng, radius))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: 0x2244ff,
        transparent: true,
        opacity: 0.25
      })
      const line = new THREE.Line(geometry, material)
      gridGroup.add(line)
    }
    
    globe.add(gridGroup)
  }

  const addMajorCities = (scene: THREE.Scene) => {
    const cities = [
      { name: 'Washington DC', lat: 38.9, lng: -77.0 },
      { name: 'London', lat: 51.5, lng: -0.1 },
      { name: 'Paris', lat: 48.9, lng: 2.4 },
      { name: 'Berlin', lat: 52.5, lng: 13.4 },
      { name: 'Moscow', lat: 55.8, lng: 37.6 },
      { name: 'Beijing', lat: 39.9, lng: 116.4 },
      { name: 'Tokyo', lat: 35.7, lng: 139.7 },
      { name: 'Seoul', lat: 37.6, lng: 127.0 },
      { name: 'Delhi', lat: 28.6, lng: 77.2 },
      { name: 'Mumbai', lat: 19.1, lng: 72.9 },
      { name: 'Dubai', lat: 25.3, lng: 55.3 },
      { name: 'Tel Aviv', lat: 32.1, lng: 34.8 },
      { name: 'Cairo', lat: 30.0, lng: 31.2 },
      { name: 'Sydney', lat: -33.9, lng: 151.2 },
      { name: 'Singapore', lat: 1.4, lng: 103.8 }
    ]
    
    const citiesGroup = new THREE.Group()
    
    cities.forEach((city) => {
      const position = latLngToVector3(city.lat, city.lng, 2.02)
      
      const dotGeometry = new THREE.SphereGeometry(0.015, 8, 8)
      const dotMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaccff,
        transparent: true,
        opacity: 0.8
      })
      const dot = new THREE.Mesh(dotGeometry, dotMaterial)
      dot.position.copy(position)
      citiesGroup.add(dot)
    })
    
    scene.add(citiesGroup)
  }

  const createLandmasses = async (globe: THREE.Mesh) => {
    const landmassGroup = new THREE.Group()
    
    try {
      const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json') as any
      const land = (d3 as any).feature(world, world.objects.land)
      
      if (land.geometry.type === 'MultiPolygon') {
        land.geometry.coordinates.forEach((multiPolygon: any) => {
          multiPolygon.forEach((polygon: any) => {
            drawLandmass(polygon, landmassGroup)
          })
        })
      } else if (land.geometry.type === 'Polygon') {
        land.geometry.coordinates.forEach((polygon: any) => {
          drawLandmass(polygon, landmassGroup)
        })
      }
      
      globe.add(landmassGroup)
    } catch (error) {
      console.error('Error loading landmasses:', error)
    }
  }

  const drawLandmass = (coordinates: number[][], group: THREE.Group) => {
    const points: THREE.Vector3[] = []
    
    coordinates.forEach((coord: number[]) => {
      const [lng, lat] = coord
      const vector = latLngToVector3(lat, lng, 2.012)
      points.push(vector)
    })
    
    if (points.length > 2) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: 0x4d8f3e,
        transparent: true,
        opacity: 0.8,
        linewidth: 2
      })
      const line = new THREE.LineLoop(geometry, material)
      group.add(line)
      
      const fillGeometry = new THREE.BufferGeometry()
      const vertices: number[] = []
      const colors: number[] = []
      
      for (let i = 0; i < points.length - 2; i++) {
        vertices.push(points[0].x, points[0].y, points[0].z)
        vertices.push(points[i + 1].x, points[i + 1].y, points[i + 1].z)
        vertices.push(points[i + 2].x, points[i + 2].y, points[i + 2].z)
        
        const brightness = 0.3 + Math.random() * 0.2
        for (let j = 0; j < 3; j++) {
          colors.push(brightness * 0.2, brightness * 0.6, brightness * 0.3)
        }
      }
      
      fillGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      fillGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      fillGeometry.computeVertexNormals()
      
      const fillMaterial = new THREE.MeshPhongMaterial({
        vertexColors: true,
        emissive: new THREE.Color(0x1a3d1f),
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        flatShading: false,
        shininess: 5
      })
      const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial)
      group.add(fillMesh)
    }
  }

  const createCurvedPath = (start: THREE.Vector3, end: THREE.Vector3): THREE.CatmullRomCurve3 => {
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const distance = start.distanceTo(end)
    const altitude = Math.min(distance * 0.4, 1.2)
    midpoint.normalize().multiplyScalar(2.0 + altitude)
    
    const quarterPoint1 = new THREE.Vector3().addVectors(start, midpoint).multiplyScalar(0.5)
    quarterPoint1.normalize().multiplyScalar(2.0 + altitude * 0.5)
    
    const quarterPoint2 = new THREE.Vector3().addVectors(midpoint, end).multiplyScalar(0.5)
    quarterPoint2.normalize().multiplyScalar(2.0 + altitude * 0.5)
    
    return new THREE.CatmullRomCurve3([start, quarterPoint1, midpoint, quarterPoint2, end])
  }

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

    const ambientLight = new THREE.AmbientLight(0x404060, 1.5)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffee, 2.5)
    sunLight.position.set(5, 2, 5)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.8)
    fillLight.position.set(-5, 1, -3)
    scene.add(fillLight)

    const backLight = new THREE.PointLight(0x6699ff, 1.2, 100)
    backLight.position.set(-5, 0, -5)
    scene.add(backLight)
    
    const rimLight = new THREE.PointLight(0x88bbff, 0.8, 100)
    rimLight.position.set(0, 5, -5)
    scene.add(rimLight)

    const sphereGeometry = new THREE.SphereGeometry(2, 128, 128)
    
    const textureLoader = new THREE.TextureLoader()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    canvas.width = 4096
    canvas.height = 2048
    
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#1a3d5c')
      gradient.addColorStop(0.5, '#0d2a47')
      gradient.addColorStop(1, '#1a3d5c')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.globalAlpha = 0.15
      for (let i = 0; i < 8000; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 2
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(x, y, size, size)
      }
      ctx.globalAlpha = 1.0
      
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.15)'
      ctx.lineWidth = 1
      for (let lat = -80; lat <= 80; lat += 20) {
        const y = ((90 - lat) / 180) * canvas.height
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      
      for (let lng = -180; lng <= 180; lng += 20) {
        const x = ((lng + 180) / 360) * canvas.width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
    }
    
    const earthTexture = new THREE.CanvasTexture(canvas)
    earthTexture.needsUpdate = true
    
    const bumpCanvas = document.createElement('canvas')
    const bumpCtx = bumpCanvas.getContext('2d')
    bumpCanvas.width = 2048
    bumpCanvas.height = 1024
    
    if (bumpCtx) {
      bumpCtx.fillStyle = '#808080'
      bumpCtx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height)
      
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * bumpCanvas.width
        const y = Math.random() * bumpCanvas.height
        const radius = Math.random() * 15 + 5
        const brightness = Math.floor(Math.random() * 100 + 100)
        
        const gradient = bumpCtx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgb(${brightness}, ${brightness}, ${brightness})`)
        gradient.addColorStop(1, 'rgba(128, 128, 128, 0)')
        
        bumpCtx.fillStyle = gradient
        bumpCtx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
      }
    }
    
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas)
    bumpTexture.needsUpdate = true
    
    const specularCanvas = document.createElement('canvas')
    const specularCtx = specularCanvas.getContext('2d')
    specularCanvas.width = 2048
    specularCanvas.height = 1024
    
    if (specularCtx) {
      const gradient = specularCtx.createLinearGradient(0, 0, 0, specularCanvas.height)
      gradient.addColorStop(0, '#1a4d8f')
      gradient.addColorStop(0.5, '#0d3366')
      gradient.addColorStop(1, '#1a4d8f')
      specularCtx.fillStyle = gradient
      specularCtx.fillRect(0, 0, specularCanvas.width, specularCanvas.height)
      
      specularCtx.globalAlpha = 0.3
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * specularCanvas.width
        const y = Math.random() * specularCanvas.height
        const radius = Math.random() * 20 + 10
        
        const shimmer = specularCtx.createRadialGradient(x, y, 0, x, y, radius)
        shimmer.addColorStop(0, '#ffffff')
        shimmer.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        specularCtx.fillStyle = shimmer
        specularCtx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
      }
    }
    
    const specularTexture = new THREE.CanvasTexture(specularCanvas)
    specularTexture.needsUpdate = true
    
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.02,
      specularMap: specularTexture,
      specular: new THREE.Color(0x4488ff),
      shininess: 25,
      emissive: new THREE.Color(0x0a1520),
      emissiveIntensity: 0.2
    })
    
    const globe = new THREE.Mesh(sphereGeometry, earthMaterial)
    scene.add(globe)
    globeRef.current = globe
    
    const atmosphereGeometry = new THREE.SphereGeometry(2.08, 64, 64)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    globe.add(atmosphere)
    
    const cloudCanvas = document.createElement('canvas')
    const cloudCtx = cloudCanvas.getContext('2d')
    cloudCanvas.width = 2048
    cloudCanvas.height = 1024
    
    if (cloudCtx) {
      cloudCtx.fillStyle = 'rgba(0, 0, 0, 0)'
      cloudCtx.fillRect(0, 0, cloudCanvas.width, cloudCanvas.height)
      
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * cloudCanvas.width
        const y = Math.random() * cloudCanvas.height
        const radius = Math.random() * 40 + 20
        const opacity = Math.random() * 0.3 + 0.1
        
        const gradient = cloudCtx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        cloudCtx.fillStyle = gradient
        cloudCtx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
      }
    }
    
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas)
    cloudTexture.needsUpdate = true
    
    const cloudGeometry = new THREE.SphereGeometry(2.02, 64, 64)
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      side: THREE.FrontSide
    })
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
    globe.add(clouds)
    
    globe.userData.clouds = clouds

    addLatitudeLongitudeGrid(globe)

    createLandmasses(globe)
    createCountryBoundaries(scene, globe)
    
    const labelsGroup = addCountryLabels(scene)
    labelsGroupRef.current = labelsGroup
    
    addMajorCities(scene)

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

    const trajectoriesGroup = new THREE.Group()
    scene.add(trajectoriesGroup)
    trajectoriesRef.current = trajectoriesGroup

    trajectories.forEach((trajectory) => {
      const startPos = latLngToVector3(trajectory.origin.lat, trajectory.origin.lng, 2.02)
      const endPos = latLngToVector3(trajectory.target.lat, trajectory.target.lng, 2.02)
      const curve = createCurvedPath(startPos, endPos)
      
      const points = curve.getPoints(100)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      
      const material = new THREE.LineBasicMaterial({
        color: trajectory.color,
        transparent: true,
        opacity: 0.4,
        linewidth: 2
      })
      
      const line = new THREE.Line(geometry, material)
      line.userData = { trajectoryId: trajectory.id }
      trajectoriesGroup.add(line)

      const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8)
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: trajectory.color,
        transparent: true,
        opacity: 1
      })
      const particle = new THREE.Mesh(particleGeometry, particleMaterial)
      particle.userData = { trajectoryId: trajectory.id, curve, type: trajectory.type }
      trajectoriesGroup.add(particle)

      const glowGeometry = new THREE.SphereGeometry(0.04, 8, 8)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: trajectory.color,
        transparent: true,
        opacity: 0.3
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.userData = { parentParticle: particle }
      trajectoriesGroup.add(glow)

      trajectoryStatesRef.current.set(trajectory.id, { progress: 0 })
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
      if (isDraggingRef.current) return
      
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

    const onMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true
      previousMousePositionRef.current = { x: event.clientX, y: event.clientY }
      setIsRotating(false)
    }

    const onMouseUp = () => {
      isDraggingRef.current = false
    }

    const onMouseDrag = (event: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = event.clientX - previousMousePositionRef.current.x
      const deltaY = event.clientY - previousMousePositionRef.current.y

      previousMousePositionRef.current = { x: event.clientX, y: event.clientY }

      rotationRef.current.y += deltaX * 0.005
      rotationRef.current.x += deltaY * 0.005

      rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x))

      if (globe) {
        globe.rotation.y = rotationRef.current.y
        globe.rotation.x = rotationRef.current.x
      }
      if (markersGroup) {
        markersGroup.rotation.y = rotationRef.current.y
        markersGroup.rotation.x = rotationRef.current.x
      }
      if (trajectoriesGroup) {
        trajectoriesGroup.rotation.y = rotationRef.current.y
        trajectoriesGroup.rotation.x = rotationRef.current.x
      }
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      
      const zoomSpeed = 0.001
      const delta = event.deltaY * zoomSpeed
      
      zoomRef.current += delta
      zoomRef.current = Math.max(3, Math.min(10, zoomRef.current))
      
      camera.position.z = zoomRef.current
    }

    containerRef.current.addEventListener('mousemove', onMouseMove)
    containerRef.current.addEventListener('click', onClick)
    containerRef.current.addEventListener('mousedown', onMouseDown)
    containerRef.current.addEventListener('mouseup', onMouseUp)
    containerRef.current.addEventListener('mousemove', onMouseDrag)
    containerRef.current.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('mouseup', onMouseUp)

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      if (isRotating && globe && !isDraggingRef.current) {
        rotationRef.current.y += 0.001
        globe.rotation.y = rotationRef.current.y
        globe.rotation.x = rotationRef.current.x
        
        if (globe.userData.clouds) {
          globe.userData.clouds.rotation.y = rotationRef.current.y * 1.02
        }
        
        if (markersGroup) {
          markersGroup.rotation.y = rotationRef.current.y
          markersGroup.rotation.x = rotationRef.current.x
        }
        if (trajectoriesGroup) {
          trajectoriesGroup.rotation.y = rotationRef.current.y
          trajectoriesGroup.rotation.x = rotationRef.current.x
        }
      }

      markersGroup.children.forEach((child: THREE.Object3D) => {
        if (child.userData.animate) {
          child.userData.animate()
        }
      })

      if (trajectoriesGroup) {
        trajectoriesGroup.children.forEach((child: THREE.Object3D) => {
          if (child.userData.curve && child.userData.trajectoryId) {
            const state = trajectoryStatesRef.current.get(child.userData.trajectoryId)
            if (state) {
              const trajectory = trajectories.find(t => t.id === child.userData.trajectoryId)
              if (trajectory) {
                state.progress += trajectory.speed
                if (state.progress > 1) {
                  state.progress = 0
                }
                
                const position = child.userData.curve.getPoint(state.progress)
                child.position.copy(position)
              }
            }
          }
          
          if (child.userData.parentParticle) {
            const parent = child.userData.parentParticle
            child.position.copy(parent.position)
          }
        })
      }

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
      document.removeEventListener('mouseup', onMouseUp)
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', onMouseMove)
        containerRef.current.removeEventListener('click', onClick)
        containerRef.current.removeEventListener('mousedown', onMouseDown)
        containerRef.current.removeEventListener('mouseup', onMouseUp)
        containerRef.current.removeEventListener('mousemove', onMouseDrag)
        containerRef.current.removeEventListener('wheel', onWheel)
        if (rendererRef.current?.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      document.body.style.cursor = 'default'
      renderer.dispose()
      if (globe) {
        globe.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose()
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose())
              } else {
                child.material.dispose()
              }
            }
          }
        })
      }
      sphereGeometry.dispose()
    }
  }, [isRotating, onThreatSelect])

  const handleReset = () => {
    rotationRef.current = { x: 0, y: 0 }
    zoomRef.current = 5
    
    if (globeRef.current && markersRef.current) {
      globeRef.current.rotation.x = 0
      globeRef.current.rotation.y = 0
      markersRef.current.rotation.x = 0
      markersRef.current.rotation.y = 0
    }
    if (trajectoriesRef.current) {
      trajectoriesRef.current.rotation.x = 0
      trajectoriesRef.current.rotation.y = 0
    }
    if (cameraRef.current) {
      cameraRef.current.position.z = 5
    }
    trajectoryStatesRef.current.forEach((state) => {
      state.progress = 0
    })
  }

  const handleZoomIn = () => {
    zoomRef.current = Math.max(3, zoomRef.current - 0.5)
    if (cameraRef.current) {
      cameraRef.current.position.z = zoomRef.current
    }
  }

  const handleZoomOut = () => {
    zoomRef.current = Math.min(10, zoomRef.current + 0.5)
    if (cameraRef.current) {
      cameraRef.current.position.z = zoomRef.current
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

  useEffect(() => {
    if (labelsGroupRef.current) {
      labelsGroupRef.current.visible = showLabels
    }
  }, [showLabels])

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap max-w-md">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-mono text-xs uppercase">
            3D Globe - Geographic Data
          </Badge>
          <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/50 font-mono text-xs uppercase">
            {trajectories.length} Active Paths
          </Badge>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50 font-mono text-xs uppercase">
            {threatLocations.length} Threats
          </Badge>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowLabels(!showLabels)}
            className={`bg-background/80 backdrop-blur-sm ${!showLabels ? 'opacity-50' : ''}`}
            title="Toggle Country Labels"
          >
            <Globe size={16} weight={showLabels ? "fill" : "regular"} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomIn}
            className="bg-background/80 backdrop-blur-sm"
            title="Zoom In"
          >
            <MagnifyingGlassPlus size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomOut}
            className="bg-background/80 backdrop-blur-sm"
            title="Zoom Out"
          >
            <MagnifyingGlassMinus size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsRotating(!isRotating)}
            className="bg-background/80 backdrop-blur-sm"
            title={isRotating ? "Pause Rotation" : "Start Rotation"}
          >
            {isRotating ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="bg-background/80 backdrop-blur-sm"
            title="Reset View"
          >
            <ArrowsClockwise size={16} />
          </Button>
        </div>

        <div 
          ref={containerRef} 
          className="w-full h-[600px] relative cursor-grab active:cursor-grabbing"
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
