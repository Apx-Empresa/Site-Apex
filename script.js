const loader = document.querySelector('.site-loader');
const loaderProgress = document.querySelector('.loader-status strong');

const magicRingsCanvas = document.querySelector('#magic-rings-canvas');
if (magicRingsCanvas && window.THREE) {
  const THREE = window.THREE;
  const mount = magicRingsCanvas.parentElement;
  const renderer = new THREE.WebGLRenderer({ canvas: magicRingsCanvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
  camera.position.z = 1;

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uColor: { value: new THREE.Color('#A855F7') },
    uColorTwo: { value: new THREE.Color('#6366F1') },
  };
  const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor;
    uniform vec3 uColorTwo;
    void main() {
      vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
      float radius = length(p);
      float angle = atan(p.y, p.x);
      float rings = 0.0;
      for (int i = 0; i < 6; i++) {
        float ringRadius = 0.18 + float(i) * 0.095 + mod(uTime * 0.045 + float(i) * 0.13, 0.08);
        float width = 0.003 + 0.006 * (1.0 - float(i) / 6.0);
        rings += smoothstep(width, 0.0, abs(radius - ringRadius));
      }
      float sweep = 0.55 + 0.45 * sin(angle * 3.0 - uTime * 0.8);
      float glow = rings * (0.65 + sweep * 0.35);
      vec3 color = mix(uColor, uColorTwo, clamp(radius * 1.4, 0.0, 1.0));
      float edge = smoothstep(0.82, 0.15, radius);
      gl_FragColor = vec4(color * glow * edge, glow * edge * 0.9);
    }
  `;
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material));

  const resize = () => {
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
  };
  const animate = (time) => {
    uniforms.uTime.value = time * 0.001;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  resize();
  window.requestAnimationFrame(animate);
}

if (loader) {
  let progress = 0;
  const progressTimer = window.setInterval(() => {
    progress = Math.min(progress + Math.floor(Math.random() * 14) + 7, 100);
    loaderProgress.textContent = `${progress}%`;
    if (progress === 100) {
      window.clearInterval(progressTimer);
      window.setTimeout(() => {
        loader.classList.add('is-complete');
        document.body.classList.add('site-ready');
      }, 350);
    }
  }, 90);
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
revealItems.forEach((item) => revealObserver.observe(item));
