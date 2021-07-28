// Unused for now
let shaderMatrixMethods = `
    float determinant(float m) {
        return m;
    }

    float determinant(mat2 m) {
        return m[0][0] * m[1][1] - m[0][1] * m[1][0]; 
    }

    float determinant(mat3 m) {
        return m[0][0] * (m[2][2]*m[1][1] - m[1][2]*m[2][1])
            + m[0][1] * (m[1][2]*m[2][0] - m[2][2]*m[1][0])
            + m[0][2] * (m[2][1]*m[1][0] - m[1][1]*m[2][0]);
    }

    float determinant(mat4 m) {
        float
            b00 = m[0][0] * m[1][1] - m[0][1] * m[1][0],
            b01 = m[0][0] * m[1][2] - m[0][2] * m[1][0],
            b02 = m[0][0] * m[1][3] - m[0][3] * m[1][0],
            b03 = m[0][1] * m[1][2] - m[0][2] * m[1][1],
            b04 = m[0][1] * m[1][3] - m[0][3] * m[1][1],
            b05 = m[0][2] * m[1][3] - m[0][3] * m[1][2],
            b06 = m[2][0] * m[3][1] - m[2][1] * m[3][0],
            b07 = m[2][0] * m[3][2] - m[2][2] * m[3][0],
            b08 = m[2][0] * m[3][3] - m[2][3] * m[3][0],
            b09 = m[2][1] * m[3][2] - m[2][2] * m[3][1],
            b10 = m[2][1] * m[3][3] - m[2][3] * m[3][1],
            b11 = m[2][2] * m[3][3] - m[2][3] * m[3][2];
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    mat4 transpose(mat4 m) {
        return mat4(
            m[0][0], m[1][0], m[2][0], m[3][0],
            m[0][1], m[1][1], m[2][1], m[3][1],
            m[0][2], m[1][2], m[2][2], m[3][2],
            m[0][3], m[1][3], m[2][3], m[3][3]
        );
    }

    mat4 inverse(mat4 inp) {
        mat4 cofactors = mat4(
            determinant(mat3( inp[1].yzw, inp[2].yzw, inp[3].yzw)), 
            -determinant(mat3(inp[1].xzw, inp[2].xzw, inp[3].xzw)),
            determinant(mat3( inp[1].xyw, inp[2].xyw, inp[3].xyw)),
            -determinant(mat3(inp[1].xyz, inp[2].xyz, inp[3].xyz)),
            
            -determinant(mat3(inp[0].yzw, inp[2].yzw, inp[3].yzw)),
            determinant(mat3( inp[0].xzw, inp[2].xzw, inp[3].xzw)),
            -determinant(mat3(inp[0].xyw, inp[2].xyw, inp[3].xyw)),
            determinant(mat3( inp[0].xyz, inp[2].xyz, inp[3].xyz)),
            
            determinant(mat3( inp[0].yzw, inp[1].yzw, inp[3].yzw)),
            -determinant(mat3(inp[0].xzw, inp[1].xzw, inp[3].xzw)),
            determinant(mat3( inp[0].xyw, inp[1].xyw, inp[3].xyw)),
            -determinant(mat3(inp[0].xyz, inp[1].xyz, inp[3].xyz)),

            -determinant(mat3(inp[0].yzw, inp[1].yzw, inp[2].yzw)),
            determinant(mat3( inp[0].xzw, inp[1].xzw, inp[2].xzw)),
            -determinant(mat3(inp[0].xyw, inp[1].xyw, inp[2].xyw)),
            determinant(mat3( inp[0].xyz, inp[1].xyz, inp[2].xyz))
        );
        return transpose(cofactors) / determinant(inp);
    }
`;