import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Project {
  id: string;
  name: string;
  tech: string;
  description: string;
  githubUrl: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
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
    orbitSpeed: 0.002
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
    orbitSpeed: 0.001
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
    orbitSpeed: 0.001
  }
];

interface PlanetState {
  group: THREE.Group;
  project: Project;
  angle: number;
  targetSpeed: number; // velocidad deseada
  currentSpeed: number; // velocidad actual para suavizar
}

const Projects: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planetsRef = useRef<PlanetState[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / 600, 20, 1000);
    camera.position.set(0, 20, 60);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, 600);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
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

    // Create planets
    projects.forEach((project, index) => {
      const planetGroup = new THREE.Group();
      const planetGeometry = new THREE.SphereGeometry(project.size, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.2,
        shininess: 80
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.userData = { projectId: project.id };
      planetGroup.add(planet);

      // Orbit ring
      const orbitGeometry = new THREE.RingGeometry(project.orbitRadius - 0.05, project.orbitRadius + 0.05, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: project.color, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);

      // Initial position
      const initialAngle = (index * 2 * Math.PI) / projects.length;
      planetGroup.position.x = Math.cos(initialAngle) * project.orbitRadius;
      planetGroup.position.z = Math.sin(initialAngle) * project.orbitRadius;

      planetsRef.current.push({
        group: planetGroup,
        project,
        angle: initialAngle,
        targetSpeed: project.orbitSpeed,
        currentSpeed: project.orbitSpeed
      });

      scene.add(planetGroup);
    });

    // Mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    // Click
    const handleClick = () => {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(planetsRef.current.map(p => p.group.children[0]));
      if (intersects.length > 0) {
        const projectId = intersects[0].object.userData.projectId;
        window.location.href = `/projects/${projectId}`;
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);

      sun.rotation.y += 0.003;

      // Detect hover
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(planetsRef.current.map(p => p.group.children[0]));

      planetsRef.current.forEach(planet => {
        // Suavizar velocidad
        const isHovered = intersects.some(i => i.object.userData.projectId === planet.project.id);
        planet.targetSpeed = isHovered ? 0 : planet.project.orbitSpeed;
        planet.currentSpeed += (planet.targetSpeed - planet.currentSpeed) * 0.05; // suavizado

        // Actualizar posición
        planet.angle += planet.currentSpeed;
        planet.group.position.x = Math.cos(planet.angle) * planet.project.orbitRadius;
        planet.group.position.z = Math.sin(planet.angle) * planet.project.orbitRadius;
        planet.group.rotation.y += 0.005; // rotación lenta
      });

      // Cursor y tooltip
      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        setHoveredProject(intersects[0].object.userData.projectId);
      } else {
        renderer.domElement.style.cursor = 'default';
        setHoveredProject(null);
      }

      // Cámara orbitando
      const time = Date.now() * 0.0002;
      camera.position.x = Math.sin(time) * 60;
      camera.position.z = Math.cos(time) * 60;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / 600;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 600);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const hoveredProjectData = hoveredProject ? projects.find(p => p.id === hoveredProject) : null;

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mountRef} className="w-full h-full" />
      {hoveredProjectData && (
        <div 
          className="fixed z-50 bg-space-dark/90 backdrop-blur-sm border border-neon-cyan rounded-lg p-4 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y - 10, boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
        >
          <h3 className="text-neon-cyan font-bold text-lg mb-1">{hoveredProjectData.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{hoveredProjectData.tech}</p>
          <p className="text-gray-400 text-xs max-w-xs">{hoveredProjectData.description}</p>
          <div className="mt-2 text-neon-purple text-xs">Click para ver más →</div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-gray-400 text-sm">
        <p>🖱️ Pasa el mouse sobre los planetas</p>
        <p>🖱️ Click en un planeta para ver el proyecto</p>
      </div>
    </div>
  );
};

export default Projects;
