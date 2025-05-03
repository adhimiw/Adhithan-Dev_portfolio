import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

// Conditionally import Three.js related modules
let Canvas: any;
let useFrame: any;
let PresentationControls: any;
let Environment: any;
let ContactShadows: any;
let Float: any;

// Flag to track if Three.js is available
const isThreeAvailable = typeof window !== 'undefined';

interface Scene3DProps {
  className?: string;
}

const Scene3D: React.FC<Scene3DProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Try to dynamically import Three.js modules
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set hasError to true by default to use the fallback scene
    // This is a temporary fix until we properly install Three.js dependencies
    setHasError(true);
    return;

    // The code below is commented out until Three.js dependencies are properly installed
    /*
    const loadModules = async () => {
      try {
        // Dynamically import Three.js related modules
        const fiberModule = await import('@react-three/fiber');
        const dreiModule = await import('@react-three/drei');

        Canvas = fiberModule.Canvas;
        useFrame = fiberModule.useFrame;
        PresentationControls = dreiModule.PresentationControls;
        Environment = dreiModule.Environment;
        ContactShadows = dreiModule.ContactShadows;
        Float = dreiModule.Float;

        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Three.js modules:', error);
        setHasError(true);
      }
    };

    loadModules();
    */
  }, []);

  // Fallback component when Three.js is not available
  if (hasError || !isThreeAvailable) {
    return <FallbackScene theme={theme} className={className} />;
  }

  // Show loading state while modules are being loaded
  if (!isLoaded) {
    return (
      <div className={`w-full h-[400px] ${className} flex items-center justify-center bg-muted/30`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render the 3D scene when everything is loaded
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ErrorBoundary fallback={<FallbackScene theme={theme} className="" />}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 4], fov: 50 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

          <PresentationControls
            global
            rotation={[0.13, 0.1, 0]}
            polar={[-0.4, 0.2]}
            azimuth={[-1, 0.75]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <Float rotationIntensity={0.4}>
              <Laptop theme={theme} />
            </Float>
          </PresentationControls>

          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.75}
            scale={5}
            blur={2.5}
            far={4}
          />

          <Environment preset="city" />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in 3D component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Fallback 2D Scene Component
const FallbackScene: React.FC<{ theme: string; className?: string }> = ({ theme, className = '' }) => {
  return (
    <div className={`w-full h-[400px] ${className} relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-64 h-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
          animate={{
            rotateY: [0, 5, 0, -5, 0],
            rotateX: [0, -5, 0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Laptop Screen */}
          <div className="absolute inset-2 rounded bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
            <div className="w-full h-full p-3 flex flex-col">
              {/* Code Lines */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-2 bg-white/30 rounded mb-2"
                  style={{ width: `${50 + Math.random() * 40}%` }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>

          {/* Laptop Base */}
          <motion.div
            className="absolute -bottom-6 left-0 right-0 h-6 bg-gray-300 dark:bg-gray-700 rounded-b-lg"
            animate={{
              scaleX: [1, 1.02, 1],
              scaleY: [1, 0.98, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Keyboard */}
          <div className="absolute bottom-1 left-0 right-0 h-8 px-3 flex flex-wrap gap-1">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-sm"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  y: [0, -0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-blue-500/10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-purple-500/10 animate-pulse" />

      <motion.div
        className="absolute bottom-4 right-4 text-sm text-gray-500 dark:text-gray-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Modern Development Skills
      </motion.div>
    </div>
  );
};

// Laptop component (only used when Three.js is available)
function Laptop({ theme }: { theme: string }) {
  // No need to check isLoaded here as this component is only rendered when Three.js is loaded

  const ref = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  // Rotate the laptop slightly on hover
  useFrame((state: any) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.03;
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  // Create a simple laptop model
  return (
    <group
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={1.5}
    >
      {/* Base */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.05, 1]} />
        <meshStandardMaterial
          color={theme === 'dark' ? '#333' : '#eee'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Screen */}
      <group position={[0, 0.3, -0.45]} rotation={[Math.PI / 6, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1, 0.05]} />
          <meshStandardMaterial
            color={theme === 'dark' ? '#222' : '#ddd'}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Screen Display */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshBasicMaterial
            color={theme === 'dark' ? '#0066ff' : '#3b82f6'}
            opacity={0.8}
            transparent
          />
        </mesh>

        {/* Code Lines */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-0.5 + Math.random() * 0.3, 0.3 - i * 0.15, 0.04]}>
            <planeGeometry args={[0.8 + Math.random() * 0.4, 0.02]} />
            <meshBasicMaterial
              color={theme === 'dark' ? '#ffffff' : '#ffffff'}
              opacity={0.6}
              transparent
            />
          </mesh>
        ))}
      </group>

      {/* Keyboard */}
      <mesh position={[0, 0, 0.2]} castShadow receiveShadow>
        <planeGeometry args={[1.4, 0.8]} />
        <meshStandardMaterial
          color={theme === 'dark' ? '#444' : '#f5f5f5'}
          metalness={0.5}
          roughness={0.8}
        />
      </mesh>

      {/* Keys */}
      <group position={[0, 0, 0.21]}>
        {[...Array(30)].map((_, i) => {
          const row = Math.floor(i / 10);
          const col = i % 10;
          return (
            <mesh
              key={i}
              position={[-0.6 + col * 0.12, -0.1 - row * 0.12, 0]}
              castShadow
            >
              <boxGeometry args={[0.08, 0.08, 0.01]} />
              <meshStandardMaterial
                color={theme === 'dark' ? '#333' : '#e0e0e0'}
                metalness={0.5}
                roughness={0.6}
              />
            </mesh>
          );
        })}
      </group>

      {/* Touchpad */}
      <mesh position={[0, -0.3, 0.21]} castShadow>
        <planeGeometry args={[0.5, 0.3]} />
        <meshStandardMaterial
          color={theme === 'dark' ? '#555' : '#f0f0f0'}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

export default Scene3D;
