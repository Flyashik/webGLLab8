const vs = `
  attribute vec3 a_position;
  attribute vec2 a_texcoord;
  attribute vec3 a_normal;

  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_world;

  varying vec3 v_normal;
  varying vec2 v_texcoord;
  varying vec3 v_vertPos;

  void main() {
    gl_Position = u_projection * u_view * u_world * vec4(a_position, 1.0);
    
    v_normal = normalize(mat3(u_world) * a_normal);
    v_texcoord = a_texcoord;

    vec4 vertPos = u_view * vec4(a_position, 1.0);
    v_vertPos = vec3(vertPos) / vertPos.w;
  }
`;

const fs = `
  precision mediump float;

  varying vec3 v_normal;
  varying vec2 v_texcoord;
  varying vec3 v_vertPos;  

  uniform vec3 u_lightDirection;
  uniform sampler2D sampler;

  void main () {
    float shininessVal = 20.0;
    float Kd = 1.0;
    float Ks = 1.0;
    float Ka = 0.4;

    vec3 ambientColor = vec3(1.0, 0.0, 0.0);
    vec3 diffuseColor = vec3(1.0, 0.5, 0.0);
    vec3 specularColor = vec3(1.0, 1.0, 1.0);

    vec3 normalMap = v_normal + vec3(texture2D(sampler, v_texcoord));
    
    vec3 N = normalize(normalMap * 2.0 - 1.0);
    vec3 L = normalize(u_lightDirection);
    float lambertian = max(dot(N, L), 0.0);

    vec3 R = normalize(reflect(-L, N));
    vec3 V = normalize(-v_vertPos);
    float specularAngle = max(dot(R, V), 0.0);
    float specular = pow(specularAngle, shininessVal);

    vec3 diffuse = Kd * lambertian * diffuseColor;
    vec3 specularVector = Ks * specular * specularColor;
    vec3 ambient = Ka * ambientColor;

    gl_FragColor = vec4(ambient + diffuse + specularVector, 1.0);
  }
`;