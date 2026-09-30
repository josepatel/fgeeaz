import CryptoJS from 'crypto-js';

interface BotCheckResult {
  isBot: boolean;
  reason?: string;
}

export class AntiBotProtection {
  private static instance: AntiBotProtection;
  private fingerprint: string = '';
  private lastActionTime: number = 0;
  private mouseMovements: number = 0;
  private keyPresses: number = 0;
  private scrollEvents: number = 0;
  private touchEvents: number = 0;
  private lastMousePositions: Array<[number, number]> = [];
  private deviceMotionEvents: number = 0;

  private constructor() {
    this.initializeFingerprint();
    this.setupEventListeners();
  }

  public static getInstance(): AntiBotProtection {
    if (!AntiBotProtection.instance) {
      AntiBotProtection.instance = new AntiBotProtection();
    }
    return AntiBotProtection.instance;
  }

  private async initializeFingerprint(): Promise<void> {
    try {
      const components = await this.getDeviceComponents();
      const rawFingerprint = Object.values(components).join('|');
      this.fingerprint = CryptoJS.SHA256(rawFingerprint).toString();
    } catch (error) {
      console.error('Fingerprint error:', error);
    }
  }

  private async getDeviceComponents(): Promise<Record<string, any>> {
    const components: Record<string, any> = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      colorDepth: screen.colorDepth,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      screenResolution: `${screen.width},${screen.height}`,
      availableScreenResolution: `${screen.availWidth},${screen.availHeight}`,
      timezoneOffset: new Date().getTimezoneOffset(),
      sessionStorage: !!window.sessionStorage,
      localStorage: !!window.localStorage,
      indexedDb: !!window.indexedDB,
      cpuClass: (navigator as any).cpuClass,
      platform: navigator.platform,
      plugins: this.getPlugins(),
      canvas: this.getCanvasFingerprint(),
      webgl: await this.getWebglFingerprint(),
      webglVendor: this.getWebglVendor(),
      adBlock: await this.checkAdBlock(),
      touchSupport: this.getTouchSupport(),
      fonts: await this.getFonts(),
      audio: await this.getAudioFingerprint()
    };

    return components;
  }

  private setupEventListeners(): void {
    let lastMouseEvent: MouseEvent;
    
    document.addEventListener('mousemove', (e) => {
      this.mouseMovements++;
      if (lastMouseEvent) {
        const speed = Math.sqrt(
          Math.pow(e.clientX - lastMouseEvent.clientX, 2) +
          Math.pow(e.clientY - lastMouseEvent.clientY, 2)
        );
        if (speed > 0) {
          this.lastMousePositions.push([e.clientX, e.clientY]);
          if (this.lastMousePositions.length > 10) {
            this.lastMousePositions.shift();
          }
        }
      }
      lastMouseEvent = e;
    });

    document.addEventListener('keydown', (e) => {
      const timeSinceLastKey = Date.now() - this.lastActionTime;
      if (timeSinceLastKey > 10) { // Human-like typing speed
        this.keyPresses++;
        this.lastActionTime = Date.now();
      }
    });

    document.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - this.lastActionTime > 50) { // Natural scroll speed
        this.scrollEvents++;
        this.lastActionTime = now;
      }
    });

    document.addEventListener('touchstart', () => this.touchEvents++);
    document.addEventListener('touchmove', () => this.touchEvents++);
    document.addEventListener('touchend', () => this.touchEvents++);

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', () => this.deviceMotionEvents++);
    }

    setInterval(() => this.resetCounters(), 30000);
  }

  private async getAudioFingerprint(): Promise<string> {
    try {
      const ctx = new OfflineAudioContext(1, 44100, 44100);
      const osc = ctx.createOscillator();
      const comp = ctx.createDynamicsCompressor();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(10000, ctx.currentTime);
      comp.threshold.setValueAtTime(-50, ctx.currentTime);
      comp.knee.setValueAtTime(40, ctx.currentTime);
      comp.ratio.setValueAtTime(12, ctx.currentTime);
      comp.attack.setValueAtTime(0, ctx.currentTime);
      comp.release.setValueAtTime(0.25, ctx.currentTime);
      osc.connect(comp);
      comp.connect(ctx.destination);
      osc.start(0);

      const rendered = await Promise.race([
        ctx.startRendering(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
      ]);

      if (!rendered) return 'audio-timeout';
      const data = rendered.getChannelData(0);
      let sum = 0;
      for (let i = 4500; i < 5000; i++) sum += Math.abs(data[i]);
      return sum.toString(36);
    } catch {
      return 'audio-failed';
    }
  }

  private async getFonts(): Promise<string> {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const fontList = [
      'Arial', 'Courier', 'Georgia', 'Times New Roman', 'Verdana'
    ];

    const h = document.getElementsByTagName('body')[0];
    const s = document.createElement('span');
    s.style.fontSize = '72px';
    s.innerHTML = 'mmmmmmmmmmlli';

    const defaultWidth: { [key: string]: number } = {};
    const defaultHeight: { [key: string]: number } = {};

    for (const baseFont of baseFonts) {
      s.style.fontFamily = baseFont;
      h.appendChild(s);
      defaultWidth[baseFont] = s.offsetWidth;
      defaultHeight[baseFont] = s.offsetHeight;
      h.removeChild(s);
    }

    const detected: string[] = [];
    for (const font of fontList) {
      let fontDetected = false;
      for (const baseFont of baseFonts) {
        s.style.fontFamily = `${font},${baseFont}`;
        h.appendChild(s);
        const matched = (s.offsetWidth !== defaultWidth[baseFont] ||
                        s.offsetHeight !== defaultHeight[baseFont]);
        h.removeChild(s);
        if (matched) {
          fontDetected = true;
          break;
        }
      }
      if (fontDetected) {
        detected.push(font);
      }
    }

    return detected.join(',');
  }

  private getPlugins(): string {
    if (navigator.plugins) {
      return Array.from(navigator.plugins)
        .map(p => [p.name, p.description, Array.from(p).map(mt => [mt.type, mt.suffixes].join('~')).join(',')].join('::'))
        .join(';');
    }
    return '';
  }

  private getCanvasFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = 240;
    canvas.height = 140;

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(100, 1, 62, 20);

    ctx.fillStyle = '#069';
    ctx.font = '11pt "Times New Roman"';
    ctx.fillText('Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.font = '18pt Arial';
    ctx.fillText('Canvas', 4, 45);

    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgb(0,255,255)';
    ctx.beginPath();
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgb(255,255,0)';
    ctx.beginPath();
    ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgb(255,0,255)';

    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
    ctx.arc(75, 75, 25, 0, Math.PI * 2, true);

    ctx.fill('evenodd');

    return canvas.toDataURL();
  }

  private async getWebglFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return '';

    const vertices = new Float32Array([
      -0.5, -0.5, 0.5, -0.5, 0.0, 0.5
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const vertCode = `
      attribute vec2 coordinates;
      void main(void) {
        gl_Position = vec4(coordinates, 0.0, 1.0);
      }
    `;

    const fragCode = `
      void main(void) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);
      }
    `;

    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const coordinates = gl.getAttribLocation(program, "coordinates");
    gl.vertexAttribPointer(coordinates, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinates);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    return canvas.toDataURL();
  }

  private getWebglVendor(): string {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return '';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return '';

    return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) + '~' +
           gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  }

  private async checkAdBlock(): Promise<boolean> {
    const test = document.createElement('div');
    test.innerHTML = '&nbsp;';
    test.className = 'adsbox';
    document.body.appendChild(test);
    const isAdBlocked = test.offsetHeight === 0;
    document.body.removeChild(test);
    return isAdBlocked;
  }

  private getTouchSupport(): string {
    let maxTouchPoints = 0;
    let touchEvent = false;
    let touchStart = false;

    if (navigator.maxTouchPoints !== undefined) {
      maxTouchPoints = navigator.maxTouchPoints;
    }

    touchEvent = 'ontouchstart' in window;
    touchStart = 'touchstart' in window;

    return `${maxTouchPoints}-${touchEvent}-${touchStart}`;
  }

  private resetCounters(): void {
    this.mouseMovements = 0;
    this.keyPresses = 0;
    this.scrollEvents = 0;
    this.touchEvents = 0;
    this.deviceMotionEvents = 0;
    this.lastMousePositions = [];
  }

  private checkUserBehavior(): boolean {
    const totalInteractions = this.mouseMovements + this.keyPresses +
      this.scrollEvents + this.touchEvents + this.deviceMotionEvents;

    if (totalInteractions === 0) {
      return true;
    }

    if (this.lastMousePositions.length > 3) {
      let straightLineCount = 0;
      for (let i = 2; i < this.lastMousePositions.length; i++) {
        const [x1, y1] = this.lastMousePositions[i-2];
        const [x2, y2] = this.lastMousePositions[i-1];
        const [x3, y3] = this.lastMousePositions[i];

        const dx1 = x2 - x1;
        const dy1 = y2 - y1;
        const dx2 = x3 - x2;
        const dy2 = y3 - y2;

        // Cross product to avoid division by zero
        const cross = Math.abs(dx1 * dy2 - dy1 * dx2);
        if (cross < 1) {
          straightLineCount++;
        }
      }

      if (straightLineCount > 3) {
        return false;
      }
    }

    return true;
  }

  private checkHeaders(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      'bot', 'crawler', 'spider', 'headless', 'selenium', 'puppeteer',
      'chrome-lighthouse', 'pagespeed', 'ptst', 'lighthouse', 'slurp',
      'phantom', 'zombie', 'nightmare', 'electron', 'cypress'
    ];

    if (botPatterns.some(pattern => userAgent.includes(pattern))) {
      return false;
    }

    // Check for common bot headers
    if (!navigator.languages || navigator.languages.length === 0) {
      return false;
    }

    // Check for WebDriver
    if ((navigator as any).webdriver) {
      return false;
    }

    return true;
  }

  public async checkForBot(): Promise<BotCheckResult> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    if (!this.checkHeaders()) {
      return { isBot: true, reason: 'Invalid user agent or headers' };
    }

    if (!this.checkUserBehavior()) {
      return { isBot: true, reason: 'Suspicious behavior patterns' };
    }

    if (!this.fingerprint) {
      return { isBot: true, reason: 'Failed to generate fingerprint' };
    }

    return { isBot: false };
  }

  public getToken(): string {
    const timestamp = Date.now().toString();
    const noise = Math.random().toString(36).substring(2);
    const data = `${this.fingerprint}:${timestamp}:${noise}`;
    return CryptoJS.AES.encrypt(data, CryptoJS.SHA3(navigator.userAgent)).toString();
  }
}