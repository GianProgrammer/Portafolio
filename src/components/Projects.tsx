import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap'; // Para animaciones suaves (zoom)

interface Project {
  id: string;
  name: string;
  tech: string;
  description: string;
  githubUrl: string;
  color: string;
  size: number;
  orbitRadius: number;
  icon: string; // Icono de tecnología
  iconColor: string; // Color del icono
}

const projects: Project[] = [
  {
    id: 'sistema-turnos',
    name: 'Sistema de Turnos',
    tech: 'Node + React + MongoDB',
    description: 'Sistema completo de gestión de turnos con autenticación y panel administrativo',
    githubUrl: 'https://github.com/GianProgrammer/sistema-turnos',
    color: '#00ffff',
    size: 3,
    orbitRadius: 20,
    icon: '⚛️', // React icon
    iconColor: '#61DAFB'
  },
  {
    id: 'buscaminas-c',
    name: 'Buscaminas en C',
    tech: 'CLI - C Programming',
    description: 'Juego de buscaminas implementado en C con interfaz de línea de comandos',
    githubUrl: 'https://github.com/GianProgrammer/buscaminas-c',
    color: '#ff00ff',
    size: 2.5,
    orbitRadius: 35,
    icon: '💻', // Terminal/CLI icon
    iconColor: '#A8B9CC'
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    tech: 'HTML/CSS/JS Vanilla',
    description: 'Landing page responsiva con animaciones y efectos modernos',
    githubUrl: 'https://github.com/GianProgrammer/landing-page',
    color: '#8a2be2',
    size: 2,
    orbitRadius: 42,
    icon: '🌐', // Web icon
    iconColor: '#FF6B35'
  }
];

// Función para crear canvas con icono que se vera dentro del planeta
const createIconCanvas = (icon: string, color: string, size: number = 128) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  // Fondo circular semi-transparente
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 4, 0, 2 * Math.PI);
  ctx.fill();
  
  // Icono
  ctx.font = `${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(icon, size/2, size/2);
  
  return canvas;
};

const Projects: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [zoomedProject, setZoomedProject] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Función para calcular dimensiones responsivas
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerWidth < 768 ? 400 : 600;
      setDimensions({ width, height });
      return { width, height };
    };

    const { width, height } = updateDimensions();

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(65, width / height, 1, 1000);
    camera.position.set(0, 20, 60);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 200);
    pointLight.position.set(10, 20, 30);
    scene.add(pointLight);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.3
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Crear planetas estáticos con sprites mejorados DENTRO del planeta
    const planetMeshes: THREE.Mesh[] = [];

    projects.forEach((project, index) => {
      const mobileScale = width < 768 ? 0.7 : 1;
      const scaledSize = project.size * mobileScale;
      const scaledOrbitRadius = project.orbitRadius * mobileScale;

      const planetGeometry = new THREE.SphereGeometry(scaledSize, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.3,
        shininess: 80
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.userData = { projectId: project.id };

      const angle = (index * 2 * Math.PI) / projects.length;
      planet.position.set(
        Math.cos(angle) * scaledOrbitRadius,
        0,
        Math.sin(angle) * scaledOrbitRadius
      );

      planetMeshes.push(planet);
      scene.add(planet);

      // Crear sprite con icono que se vera como una especie de "ventana" en el planeta
      const iconCanvas = createIconCanvas(project.icon, project.iconColor, 128);
      const iconTexture = new THREE.CanvasTexture(iconCanvas);
      
      // Crear material del sprite con la textura del icono
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: iconTexture,
        transparent: true,
        alphaTest: 0.1
      });
      
      const sprite = new THREE.Sprite(spriteMaterial);
      
      // Ajustar tamaño del sprite para que sea una "ventana" en el planeta
      const spriteSize = scaledSize * 1.2;
      sprite.scale.set(spriteSize, spriteSize, 1);
      
      // Posicionar el sprite en la superficie del planeta (no encima)
      sprite.position.set(
        planet.position.x + scaledSize*0.1, // Un poco desplazado para que se vea mejor
        planet.position.y + scaledSize*0.3,
        planet.position.z + scaledSize*0.96
      );
      
      scene.add(sprite);

      // Órbita visual
      const orbitGeometry = new THREE.RingGeometry(scaledOrbitRadius - 0.3, scaledOrbitRadius + 0.05, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: project.color, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.2 
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    });

    // Mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    // Click para zoom
    const handleClick = () => {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(planetMeshes);
      if (intersects.length > 0) {
        const planet = intersects[0].object;
        const projectId = planet.userData.projectId;
        setZoomedProject(projectId);

        gsap.to(camera.position, {
          x: planet.position.x,
          y: planet.position.y + 5,
          z: planet.position.z + 10,
          duration: 1.2,
          onUpdate: () => camera.lookAt(planet.position)
        });
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animar el sol
      sun.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const { width, height } = updateDimensions();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.domElement.style.width = `${width}px`;
      renderer.domElement.style.height = `${height}px`;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const hoveredProjectData = hoveredProject ? projects.find(p => p.id === hoveredProject) : null;
  const zoomedProjectData = zoomedProject ? projects.find(p => p.id === zoomedProject) : null;

  const handleZoomOut = () => {
    setZoomedProject(null);

    gsap.to(cameraRef.current!.position, {
      x: 0,
      y: 20,
      z: 60,
      duration: 1.2,
      onUpdate: () => cameraRef.current!.lookAt(0, 0, 0)
    });
  };

// Función para obtener el tamaño del modal según el dispositivo
const getModalSize = () => {
  if (dimensions.width < 768) {
    return {
      maxWidth: '80%',        // más angosto en mobile
      padding: '0.75rem',     // menos padding
      iconSize: 'text-3xl',   // más chico
      titleSize: '1rem',
      techSize: '0.75rem',
      descSize: '0.7rem',
      linkSize: '0.7rem',
      buttonSize: '0.8rem'
    };
  } else if (dimensions.width < 1024) {
    return {
      maxWidth: '350px',
      padding: '1.25rem',
      iconSize: 'text-5xl',
      titleSize: '1.25rem',
      techSize: '0.9rem',
      descSize: '0.85rem',
      linkSize: '0.85rem',
      buttonSize: '0.9rem'
    };
  } else {
    return {
      maxWidth: '400px',
      padding: '2rem',
      iconSize: 'text-6xl',
      titleSize: '1.5rem',
      techSize: '1rem',
      descSize: '0.9rem',
      linkSize: '0.9rem',
      buttonSize: '1rem'
    };
  }
};

const modalSize = getModalSize();

  return (
    <div className="relative w-full" style={{ height: `${dimensions.height}px` }}>
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Tooltip hover */}
      {hoveredProjectData && !zoomedProject && (
        <div
          className="fixed z-50 bg-space-dark/90 backdrop-blur-sm border border-neon-cyan rounded-lg p-4 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ 
            left: tooltipPosition.x, 
            top: tooltipPosition.y - 10, 
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            maxWidth: dimensions.width < 768 ? '200px' : '300px'
          }}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{hoveredProjectData.icon}</span>
            <h3 className="text-neon-cyan font-bold text-lg">{hoveredProjectData.name}</h3>
          </div>
          <p className="text-gray-300 text-sm mb-2">{hoveredProjectData.tech}</p>
          <p className="text-gray-400 text-xs max-w-xs">{hoveredProjectData.description}</p>
          <div className="mt-2 text-neon-purple text-xs">Click para hacer zoom →</div>
        </div>
      )}

      {/* Modal proyecto zoom con tamaño adaptativo */}
      {zoomedProjectData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="bg-space-dark/95 backdrop-blur-md border border-neon-cyan rounded-lg 
                    text-center overflow-y-auto max-h-[70vh] w-[90%] sm:w-auto"
          style={{ 
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.5)',
            padding: modalSize.padding,
            maxWidth: modalSize.maxWidth // se respeta solo en pantallas sm+
          }}
          >
            <div className={`mb-3 ${modalSize.iconSize}`}>{zoomedProjectData.icon}</div>
            <h2 className="text-neon-cyan font-bold mb-2" style={{ fontSize: modalSize.titleSize }}>
              {zoomedProjectData.name}
            </h2>
            <p className="text-gray-300 mb-2" style={{ fontSize: modalSize.techSize }}>
              {zoomedProjectData.tech}
            </p>
            <p className="text-gray-400 mb-3 leading-snug" style={{ fontSize: modalSize.descSize }}>
              {zoomedProjectData.description}
            </p>
            <div 
              className="text-neon-purple cursor-pointer mb-3" 
              style={{ fontSize: modalSize.linkSize }}
              onClick={() => window.location.href = `/projects/${zoomedProjectData.id}`}
            >
              Click para ver el proyecto completo →
            </div>
            <button
              className="px-3 py-2 bg-neon-cyan text-space-dark rounded-lg hover:bg-neon-cyan-dark w-full"
              style={{ fontSize: modalSize.buttonSize }}
              onClick={handleZoomOut}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 text-gray-400 text-sm">
        <p className={dimensions.width < 768 ? 'text-xs' : ''}>🖱️ Pasa el mouse sobre los planetas</p>
        <p className={dimensions.width < 768 ? 'text-xs' : ''}>🖱️ Click para hacer zoom y ver el proyecto</p>
      </div>

      {/* Indicador de touch para móviles */}
      {dimensions.width < 768 && (
        <div className="mt-3 text-center bg-neon-cyan/20 text-neon-cyan px-3 py-2 rounded-lg text-xs">
          👆 Toca los planetas
        </div>
      )}
    </div>
  )
};

export default Projects;