import * as utils from "./webgl-utils.js";

const canvas = document.getElementById("orange");
initWebGl(canvas)

let programInfo = utils.createProgramInfo(gl, [vs, fs]);

async function main() {
    const response = await fetch('src/sphere.obj');
    const obj = await response.text();

    const buffer = parseObj(obj);

    const optMapping = { a_position: "position", a_texcoord: "texcoord", a_normal: "normal" };

    const bufferInfo = utils.createBufferInfoFromArrays(gl, buffer, optMapping);

    let mapTexture = loadTexture("src/res/orange.jpg")
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, mapTexture);

    let lightDir = [1.5, 1.5, 1.5];
    let u_world = new Float32Array(16);
    glMatrix.mat4.identity(u_world);


    let view = new Float32Array(16);
    glMatrix.mat4.lookAt(view, [0, 0, 1.5], [0, 0, 1], [0, 1, 0]);

    let projection = new Float32Array(16);
    glMatrix.mat4.perspective(projection, Math.PI / 1.6, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.0, 1);
    
    let animate = function render() {
        gl.enable(gl.CULL_FACE);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programInfo.program);

        utils.setBuffersAndAttributes(gl, programInfo, bufferInfo);

        let rotateAngle = 0.002;
        glMatrix.mat4.rotate(u_world, u_world, rotateAngle, [0, 1, 0]);

        utils.setUniforms(programInfo, {
            u_lightDirection: lightDir,
            u_view: view,
            u_projection: projection,
            u_world: u_world,
        });

        utils.drawBufferInfo(gl, bufferInfo);

        window.requestAnimationFrame(animate);
    }

    animate(0);
}

main();