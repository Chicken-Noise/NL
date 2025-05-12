"use client";

import React, { useRef, useEffect, useCallback } from 'react';

// --- 3D Math Helpers ---
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

interface Vector2D {
  x: number;
  y: number;
}

// Rotation functions (keep for potential camera rotation later)
function rotateX(point: Vector3D, angle: number): Vector3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

function rotateY(point: Vector3D, angle: number): Vector3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos,
  };
}
// No Z rotation needed for typical terrain view

// --- Configuration ---
const FOCAL_LENGTH = 400;
const GRID_SIZE_X = 40;
const GRID_SIZE_Z = 30;
const CELL_SIZE = 40;
const BASE_HEIGHT_SCALE = 150; // Back to previous value
const EVOLUTION_SPEED = 0.0001;
const EVOLUTION_AMPLITUDE = 50;
const EVOLUTION_FREQUENCY_X = 0.03;
const EVOLUTION_FREQUENCY_Z = 0.02;
const WIREFRAME_COLOR = 'rgba(180, 180, 180, 0.7)';
const WIREFRAME_WIDTH = 0.75;
const CAMERA_Y_ROTATION = 0;
const CAMERA_X_ROTATION = Math.PI / 5; // Back to previous angle
const CAMERA_POSITION: Vector3D = { x: 0, y: 80, z: -180 }; // Back to previous position
// --------------------

// Perspective projection (keep)
function project(point: Vector3D, canvasWidth: number, canvasHeight: number): Vector2D {
  const perspectiveFactor = FOCAL_LENGTH / (FOCAL_LENGTH + point.z);
  const projectedX = point.x * perspectiveFactor;
  const projectedY = point.y * perspectiveFactor;
  return {
    x: projectedX + canvasWidth / 2,
    y: projectedY + canvasHeight / 2,
  };
}

// --- Terrain Data Structure ---
interface TerrainMesh {
    vertices: Vector3D[];      // Current vertex positions
    baseHeights: number[];   // Base random height for each vertex
    triangles: [number, number, number][]; // Indices forming triangles
}

// --- Component ---
const GeometricBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const terrain = useRef<TerrainMesh | null>(null);
  const time = useRef<number>(0);
  const cameraRotationY = useRef<number>(CAMERA_Y_ROTATION);

  // Function to generate the terrain mesh structure
  const initializeTerrain = useCallback(() => {
    const numVerticesX = GRID_SIZE_X + 1;
    const numVerticesZ = GRID_SIZE_Z + 1;
    const vertices: Vector3D[] = [];
    const baseHeights: number[] = [];
    const triangles: [number, number, number][] = [];

    const offsetX = - (GRID_SIZE_X * CELL_SIZE) / 2;
    const offsetZ = - (GRID_SIZE_Z * CELL_SIZE) / 2;

    for (let z = 0; z < numVerticesZ; z++) {
      for (let x = 0; x < numVerticesX; x++) {
        // Allow terrain below baseline again
        const baseHeight = (Math.random() - 0.5) * BASE_HEIGHT_SCALE;
        vertices.push({
          x: x * CELL_SIZE + offsetX,
          y: baseHeight,
          z: z * CELL_SIZE + offsetZ,
        });
        baseHeights.push(baseHeight);
      }
    }

    // Keep triangle generation
    for (let z = 0; z < GRID_SIZE_Z; z++) {
      for (let x = 0; x < GRID_SIZE_X; x++) {
        const topLeft = z * numVerticesX + x;
        const topRight = topLeft + 1;
        const bottomLeft = (z + 1) * numVerticesX + x;
        const bottomRight = bottomLeft + 1;
        triangles.push([topLeft, bottomLeft, topRight]);
        triangles.push([topRight, bottomLeft, bottomRight]);
      }
    }
    terrain.current = { vertices, baseHeights, triangles };
  }, []);

  // The main drawing loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const mesh = terrain.current;
    if (!canvas || !mesh) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    time.current += EVOLUTION_SPEED;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = WIREFRAME_COLOR;
    ctx.lineWidth = WIREFRAME_WIDTH;

    // Update vertex heights based on time and position
    for (let i = 0; i < mesh.vertices.length; i++) {
        const baseH = mesh.baseHeights[i];
        const v = mesh.vertices[i];
        const evolutionOffset = EVOLUTION_AMPLITUDE *
            Math.sin(v.x * EVOLUTION_FREQUENCY_X + time.current) *
            Math.sin(v.z * EVOLUTION_FREQUENCY_Z + time.current);
        mesh.vertices[i].y = baseH + evolutionOffset;
    }

    // Project vertices
    const projectedVertices = mesh.vertices.map(vertex => {
        let p = { ...vertex };
        p.x -= CAMERA_POSITION.x;
        p.y -= CAMERA_POSITION.y;
        p.z -= CAMERA_POSITION.z;
        p = rotateX(p, CAMERA_X_ROTATION);
        p = rotateY(p, cameraRotationY.current);
        return project(p, width, height);
    });

    // Draw Triangles again
    ctx.beginPath();
    mesh.triangles.forEach(tri => {
      const p1 = projectedVertices[tri[0]];
      const p2 = projectedVertices[tri[1]];
      const p3 = projectedVertices[tri[2]];
      if (p1 && p2 && p3) {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p1.x, p1.y); // Close the triangle
      }
    });
    ctx.stroke();

    animationFrameId.current = requestAnimationFrame(draw);

  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (canvas && container) {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
  }, []);

  useEffect(() => {
    initializeTerrain();
    resizeCanvas();
    animationFrameId.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeTerrain, resizeCanvas]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default GeometricBackground; 