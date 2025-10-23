# 🚀 Portfolio Personal - Gianluca Ferreyra

[![Astro](https://img.shields.io/badge/Astro-4.0-FF5D01.svg)](https://astro.build)
[![React](https://img.shields.io/badge/React-18.0-61DAFB.svg)](https://reactjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-r158-000000.svg)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-06B6D4.svg)](https://tailwindcss.com)

## 🌌 Descripción

Portfolio personal con temática espacial desarrollado con Astro + React islands para máxima performance y SEO. Incluye fondo galaxy animado con Three.js, proyectos como planetas interactivos y diseño con paleta neón cyan/violeta.

## ✨ Características

- 🌌 **Fondo Galaxy Animado**: Three.js para efectos visuales espaciales
- ⚡ **Performance**: Astro + React islands para carga optimizada
- 🎨 **Diseño Neón**: Paleta de colores cyan/violeta con efectos de brillo
- 🪐 **Proyectos Interactivos**: Planetas en Three.js con hover y click
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos
- 🔍 **SEO Optimizado**: Meta tags, structured data y performance
- 🌙 **Modo Toggle**: Cambio entre temas claro/oscuro

## 🛠️ Tecnologías

- **Framework**: [Astro](https://astro.build)
- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS
- **3D Graphics**: Three.js
- **Animaciones**: Framer Motion
- **Fuentes**: Orbitron (space font) + Inter

## 📦 Instalación

### Requisitos previos

- Node.js 18+ 
- npm o yarn

### Clonar y ejecutar

```bash
# Clonar el repositorio
git clone https://github.com/GianProgrammer/gianluca-portfolio.git

# Entrar al directorio
cd gianluca-portfolio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## 🚀 Deploy en Vercel

### Opción 1: Conectar repositorio

1. Ve a [Vercel](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `gianluca-portfolio`
4. Deploy automático en cada push

### Opción 2: Deploy manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📁 Estructura del Proyecto

```
gianluca-portfolio/
├── src/
│   ├── components/          # Componentes Astro y React
│   │   ├── Hero.astro
│   │   ├── Projects.tsx
│   │   └── SpaceBackground.tsx
│   ├── layouts/
│   │   └── Layout.astro    # Layout principal
│   ├── pages/
│   │   ├── index.astro     # Página principal
│   │   └── proyectos/      # Páginas de proyectos
│   └── styles/
│       └── global.css      # Estilos globales
├── public/                 # Assets estáticos
├── astro.config.mjs        # Configuración de Astro
├── tailwind.config.mjs     # Configuración de Tailwind
└── package.json
```

## 🎯 Componentes Principales

### SpaceBackground.tsx
Fondo galaxy animado con Three.js:
- 2000 estrellas con colores cian/púrpura
- Sistema de partículas
- Cámara en movimiento
- Efectos de nebulosa

### Projects.tsx
Proyectos como planetas interactivos:
- Sistema solar 3D
- Planetas orbitando
- Hover effects con información
- Click para abrir GitHub

### Stack.astro
Tecnologías con animaciones:
- Grid responsivo
- Hover effects
- Gradientes animados
- Transiciones suaves


## 📊 Performance

El portfolio está optimizado para:
- **Lighthouse Score**: 95+
- **Core Web Vitals**: Excelente
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🐛 Solución de Problemas

### Problemas comunes

1. **Three.js no carga**:
```bash
npm install three @types/three
```

2. **Tailwind no funciona**:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Build falla en Vercel**:
- Verificar `astro.config.mjs` tiene `output: 'static'`
- Asegurar que todas las dependencias están instaladas

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Gianluca Ferreyra - [Gianferreyra2014@gmail.com](mailto:Gianferreyra2014@gmail.com)

Project Link: [https://github.com/GianProgrammer/gianluca-portfolio](https://github.com/GianProgrammer/gianluca-portfolio)

---

<div align="center">
  <p>
    <b>⭐ Si te gusta este proyecto, dale una estrella!</b>
  </p>
  <p>
    <a href="https://github.com/GianProgrammer/gianluca-portfolio">
      <img src="https://img.shields.io/github/stars/GianProgrammer/gianluca-portfolio?style=social" alt="GitHub stars">
    </a>
  </p>
</div>
