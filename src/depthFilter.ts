class DepthFilter extends TextureFilter {
    constructor() {
        super({
            uniforms: {
                'float cameray': 0
            },
            code: `
                float depth = y + cameray;

                float transition = 64.0;

                float digitalDepth = 3200.0;
                float castleDepth = 1700.0;
                float waterDepth = 1100.0;
                float cavesDepth = 400.0;
                float topDepth = 180.0;

                vec3 digitalColor = vec3(0.0, 1.0, 0.0);
                vec3 castleColor = vec3(0.7, 0.7, 0.7);
                vec3 waterColor = vec3(0.0, 0.0, 1.0);
                vec3 cavesColor = vec3(0.89, 0.61, 0.45);
                vec3 topColor = vec3(1.0, 1.0, 1.0);
                vec3 blackColor = vec3(0.0, 0.0, 0.0);

                vec3 multcolor;
                if (depth > digitalDepth + transition) {
                    multcolor = digitalColor;
                } else if (depth > digitalDepth) {
                    float t = (depth - digitalDepth) / transition;
                    multcolor = castleColor * (1.0-t) + digitalColor * t;
                } else if (depth > castleDepth + transition) {
                    multcolor = castleColor;
                } else if (depth > castleDepth) {
                    float t = (depth - castleDepth) / transition;
                    multcolor = waterColor * (1.0-t) + castleColor * t;
                } else if (depth > waterDepth + transition) {
                    multcolor = waterColor;
                } else if (depth > waterDepth) {
                    float t = (depth - waterDepth) / transition;
                    multcolor = cavesColor * (1.0-t) + waterColor * t;
                } else if (depth > cavesDepth + transition) {
                    multcolor = cavesColor;
                } else if (depth > cavesDepth) {
                    float t = (depth - cavesDepth) / transition;
                    multcolor = topColor * (1.0-t) + cavesColor * t;
                } else if (depth > topDepth + transition) {
                    multcolor = topColor;
                } else if (depth > topDepth) {
                    float t = (depth - topDepth) / transition;
                    multcolor = blackColor * (1.0-t) + topColor * t;
                } else {
                    multcolor = blackColor;
                }
                outp.rgb *= multcolor;
            `,
        });
    }

    update() {
        this.setUniform('cameray', global.world.camera.y);
    }
}