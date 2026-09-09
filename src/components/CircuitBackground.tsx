import { useEffect, useRef } from 'react';

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Node {
      x: number;
      y: number;
      radius: number;
      brightness: number;
    }
    interface Trace {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
    }
    interface Chip {
      x: number;
      y: number;
      width: number;
      height: number;
      glow: number;
      glowTarget: number;
    }
    interface Pulse {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      progress: number;
    }

    let nodes: Node[] = [];
    let traces: Trace[] = [];
    let chips: Chip[] = [];
    let pulses: Pulse[] = [];

    function initCircuit() {
      nodes = [];
      traces = [];
      chips = [];
      pulses = [];

      for (let i = 0; i < 60; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          brightness: Math.random()
        });
      }

      for (let i = 0; i < 45; i++) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        const endNode = nodes[Math.floor(Math.random() * nodes.length)];
        if (startNode && endNode && startNode !== endNode) {
          traces.push({
            x1: startNode.x,
            y1: startNode.y,
            x2: endNode.x,
            y2: endNode.y,
            width: Math.random() * 1.2 + 0.5
          });
        }
      }

      for (let i = 0; i < 4; i++) {
        chips.push({
          x: Math.random() * width,
          y: Math.random() * height,
          width: Math.random() * 35 + 25,
          height: Math.random() * 25 + 18,
          glow: 0,
          glowTarget: 0
        });
      }
    }

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initCircuit();
    }

    window.addEventListener('resize', handleResize);
    initCircuit();

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Traces
      ctx.strokeStyle = 'rgba(79, 189, 180, 0.08)';
      traces.forEach(trace => {
        ctx.lineWidth = trace.width;
        ctx.beginPath();
        ctx.moveTo(trace.x1, trace.y1);
        ctx.lineTo(trace.x2, trace.y2);
        ctx.stroke();
      });

      // Nodes
      nodes.forEach(node => {
        const alpha = 0.15 + node.brightness * 0.25;
        ctx.fillStyle = `rgba(201, 162, 39, ${alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Microchips
      chips.forEach(chip => {
        chip.glow += (chip.glowTarget - chip.glow) * 0.05;
        if (Math.random() < 0.003) {
          chip.glowTarget = Math.random() > 0.5 ? 1 : 0;
        }

        ctx.fillStyle = 'rgba(25, 28, 33, 0.5)';
        ctx.fillRect(chip.x - chip.width / 2, chip.y - chip.height / 2, chip.width, chip.height);

        ctx.strokeStyle = 'rgba(201, 162, 39, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(chip.x - chip.width / 2, chip.y - chip.height / 2, chip.width, chip.height);

        if (chip.glow > 0.1) {
          ctx.fillStyle = `rgba(245, 197, 24, ${chip.glow * 0.4})`;
          ctx.beginPath();
          ctx.arc(chip.x + chip.width / 2 - 4, chip.y - chip.height / 2 + 4, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Pulses
      pulses = pulses.filter(pulse => pulse.progress < 1);
      pulses.forEach(pulse => {
        pulse.progress += 0.007;
        const x = pulse.x1 + (pulse.x2 - pulse.x1) * pulse.progress;
        const y = pulse.y1 + (pulse.y2 - pulse.y1) * pulse.progress;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
        gradient.addColorStop(0, 'rgba(79, 189, 180, 0.7)');
        gradient.addColorStop(1, 'rgba(79, 189, 180, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      if (Math.random() < 0.025 && traces.length > 0) {
        const trace = traces[Math.floor(Math.random() * traces.length)];
        pulses.push({
          x1: trace.x1,
          y1: trace.y1,
          x2: trace.x2,
          y2: trace.y2,
          progress: 0
        });
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="circuitCanvas"
      className="fixed inset-0 pointer-events-none z-0 opacity-45"
      aria-hidden="true"
    />
  );
}
