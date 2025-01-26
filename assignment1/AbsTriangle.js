class AbsTriangle{
    constructor(){
        this.type='absTriangle';
        this.position= [0.0, 0.0,   0.0, 0.0,   0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
    }
    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the size of a point to a_Size variable
        gl.uniform1f(u_Size, size);

        // Draw
        drawTriangle(xy);
    }
}
