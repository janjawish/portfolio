/**
 * Pré-compile un programme WebGL 2 dans un contexte jetable avec KHR_parallel_shader_compile.
 * La compilation se fait hors du fil principal (sous Windows / ANGLE elle peut bloquer la page
 * plusieurs centaines de millisecondes) ; le cache de programmes du navigateur rend ensuite la
 * compilation du vrai composant quasi immédiate. Se résout tout de suite si l'extension manque.
 */
const done = new Map<string, Promise<void>>();

export function prewarmShader(vertexSource: string, fragmentSource: string, timeoutMs = 4000): Promise<void> {
  const key = vertexSource.length + ':' + fragmentSource.length + ':' + fragmentSource.slice(-200);
  const cached = done.get(key);
  if (cached) return cached;
  const promise = new Promise<void>((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const gl = canvas.getContext('webgl2');
    const ext = gl?.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null | undefined;
    const vs = gl?.createShader(gl.VERTEX_SHADER);
    const fs = gl?.createShader(gl.FRAGMENT_SHADER);
    const program = gl?.createProgram();
    if (!gl || !ext || !vs || !fs || !program) {
      resolve();
      return;
    }
    gl.shaderSource(vs, vertexSource);
    gl.shaderSource(fs, fragmentSource);
    gl.compileShader(vs);
    gl.compileShader(fs);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    const start = performance.now();
    const poll = () => {
      if (gl.getProgramParameter(program, ext.COMPLETION_STATUS_KHR) || performance.now() - start > timeoutMs) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        resolve();
      } else requestAnimationFrame(poll);
    };
    requestAnimationFrame(poll);
  });
  done.set(key, promise);
  return promise;
}
