let gl = null;

function initWebGl(canvas) {
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function loadTexture(url) {
    let texture = gl.createTexture();
    let image = new Image();
    
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }

    image.src = url;
    return texture
}

function parseObj(fileContent) {
    const lines = fileContent.trim().split("\n");

    //v
    const vertices = [];
    //vt
    const texCoords = [];
    //vn
    const normals = [];
    //f
    const faces = [];
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split(" ");
  
      if (parts[0] === "v") {
        const vertex = parts.slice(1).map(Number);
        vertices.push(...vertex);
      } else if (parts[0] === "vt") {
        const texCoord = parts.slice(1).map(Number);
        texCoord.shift();
        texCoords.push(...texCoord);
      } else if (parts[0] === "vn") {
        const normal = parts.slice(1).map(Number);
        normal.shift();
        normals.push(...normal);
      } else if (parts[0] === "f") {
        const faceVertices = [];
        const faceTexCoords = [];
        const faceNormals = [];

        for (let j = 1; j < parts.length; j++) {
          const indices = parts[j].split("/");

          const vertexIndex = parseInt(indices[0]) - 1;
          faceVertices.push(vertexIndex);

          const texCoordIndex = parseInt(indices[1]) - 1;
          faceTexCoords.push(texCoordIndex);

          const normalIndex = parseInt(indices[2]) - 1;
          faceNormals.push(normalIndex);
        }
  
        faces.push({
          vertices: faceVertices,
          texCoords: faceTexCoords,
          normals: faceNormals,
        });
      }
    }
  
    const facesVertices = [];
    const facesTexCoords = [];
    const facesNormales = [];

    for (let i = 0; i < faces.length; i++) {
      const face = faces[i];
  
      for (let j = 0; j < face.vertices.length; j++) {
        const vertexIndex = face.vertices[j];
        facesVertices.push(vertices[vertexIndex * 3], vertices[vertexIndex * 3 + 1], vertices[vertexIndex * 3 + 2]);

        const texCoordIndex = face.texCoords[j];
        facesTexCoords.push(texCoords[texCoordIndex * 3], texCoords[texCoordIndex * 3 + 1]);

        const normalIndex = face.normals[j];
        facesNormales.push(normals[normalIndex * 3], normals[normalIndex * 3 + 1], normals[normalIndex * 3 + 2]);
      }
    }

    return {
      position: facesVertices,
      texcoord: facesTexCoords,
      normal: facesNormales,
    };
}