varying vec3 vColor;
uniform vec3 upColor;
uniform vec3 downColor;
uniform vec3 transColor;
uniform float timer;
uniform float speed;
uniform float height;
uniform vec3 forceColor;

void main() {
  vec3 transformed = position;
  vec3 dissUpColor = transColor - upColor;
  vec3 realUpColor = upColor + dissUpColor * abs(cos(timer));
  vec3 dissColor = realUpColor - downColor;

  float percent = (transformed.y - height / -2.0) / height;
    // vColor = percent * dissColor + downColor;
  vColor = forceColor;

  if(transformed.y > height / -2.0) {
    transformed.y -= cos(timer) * speed;
  }
  transformed.y = max(transformed.y, height / -2.0);
  vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * viewPosition;
}