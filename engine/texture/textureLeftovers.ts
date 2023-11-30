// TODO PIXI texture leftovers

//     export function setFilterProperties(filter: TextureFilter, posx: number, posy: number, dimx: number, dimy: number) {
//         filter.setTexturePosition(posx, posy);
//         filter.setTextureDimensions(dimx, dimy);
//     }

// TODO: find the true texture bounds across devices
// if (width > 2048 || height > 2048) {
//     console.error(`Texture dimensions exceed bounds: (${width}, ${height}), limiting to bounds`);
//     width = Math.min(width, 2048);
//     height = Math.min(height, 2048);
// }

// crop(x: number, y: number, width: number, height: number, source: string) {
//     let texture = new BasicTexture(width, height, source, false);
//     this.renderTo(texture, {
//         x: -x,
//         y: -y,
//     });
//     return texture;
// }

// getPixelAbsoluteARGB(x: number, y: number, extendMode: Texture.ExtendMode = 'transparent') {
//     if (this.width === 0 || this.height === 0) return 0x00000000

//     let pixels = this.getPixelsARGB();

//     x = Math.round(x);
//     y = Math.round(y);

//     if (extendMode === 'transparent') {
//         if (x < 0 || x >= pixels[0].length || y < 0 || y >= pixels.length) return 0x00000000;
//     } else if (extendMode === 'clamp') {
//         x = M.clamp(x, 0, pixels[0].length);
//         y = M.clamp(y, 0, pixels.length);
//     }

//     return pixels[y][x];
// }

// getPixelRelativeARGB(x: number, y: number, extendMode: Texture.ExtendMode = 'transparent') {
//     return this.getPixelAbsoluteARGB(x, y, extendMode);
// }

// private cachedPixelsARGB: number[][] | undefined;
// getPixelsARGB() {
//     if (this.immutable && this.cachedPixelsARGB) return this.cachedPixelsARGB;

//     let pixels = Main.renderer.plugins.extract.pixels(this.renderTextureSprite.renderTexture);

//     let result: number[][] = [];
//     for (let y = 0; y < this.height; y++) {
//         let line: number[] = [];
//         for (let x = 0; x < this.width; x++) {
//             let i = x + y * this.width;
//             let r = pixels[4*i + 0];
//             let g = pixels[4*i + 1];
//             let b = pixels[4*i + 2];
//             let a = pixels[4*i + 3];

//             let color = (a << 24 >>> 0) + (r << 16) + (g << 8) + b;
//             line.push(color);
//         }
//         result.push(line);
//     }

//     this.cachedPixelsARGB = result;
//     return result;
// }

// subdivide(h: number, v: number, source: string): Texture.Subdivision[] {
//     if (h <= 0 || v <= 0) return [];

//     let result: Texture.Subdivision[] = [];

//     let framew = Math.floor(this.width/h);
//     let frameh = Math.floor(this.height/v);
//     let lastframew = this.width - (h-1)*framew;
//     let lastframeh = this.height - (v-1)*frameh;

//     for (let y = 0; y < v; y++) {
//         for (let x = 0; x < h; x++) {
//             let tx = x * framew;
//             let ty = y * frameh;
//             let tw = x === h-1 ? lastframew : framew;
//             let th = y === v-1 ? lastframeh : frameh;
//             result.push({
//                 x: tx, y: ty,
//                 texture: this.crop(tx, ty, tw, th, source),
//             });
//         }
//     }
//     return result;
// }

// toCanvas() {
//     return Main.renderer.plugins.extract.canvas(this.renderTextureSprite.renderTexture);
// }

// toMask() {
//     return {
//         renderTexture: this.renderTextureSprite.renderTexture,
//         offsetx: 0, offsety: 0,
//     };
// }

// /**
//  * Returns a NEW texture which is transformed from the original.
//  */
// transform(_properties: Texture.TransformProperties, source: string) {
//     let properties = O.defaults(_properties, {
//         scaleX: 1,
//         scaleY: 1,
//         tint: 0xFFFFFF,
//         alpha: 1,
//         filters: [],
//     });

//     let result = new BasicTexture(this.width * Math.abs(properties.scaleX), this.height * Math.abs(properties.scaleY), source, false);
//     this.renderTo(result, {
//         x: this.width/2 * (Math.abs(properties.scaleX) - properties.scaleX),
//         y: this.height/2 * (Math.abs(properties.scaleY) - properties.scaleY),
//         scaleX: properties.scaleX,
//         scaleY: properties.scaleY,
//         tint: properties.tint,
//         alpha: properties.alpha,
//         filters: properties.filters,
//     });
//     return result;
// }

// private getAllTextureFilters(properties: BasicTexture._RequiredPropertiesForFilter) {
//     let allFilters: TextureFilter[] = [];

//     if (properties.slice) {
//         let sliceFilter = TextureFilter.SLICE_FILTER(properties.slice);
//         let sliceRect = this.getSliceRect(properties);
//         // Subtract sliceRect.xy because slice requires the shifted xy of the texture after slice
//         Texture.setFilterProperties(sliceFilter, properties.x - sliceRect.x, properties.y - sliceRect.y, sliceRect.width, sliceRect.height);
//         allFilters.push(sliceFilter);
//     }

//     if (properties.mask && properties.mask.texture) {
//         let maskFilter = Mask.SHARED(properties.mask.texture, 'global', properties.mask.x, properties.mask.y, properties.mask.invert);
//         Texture.setFilterProperties(maskFilter, properties.x, properties.y, this.width, this.height);
//         allFilters.push(maskFilter);
//     }

//     properties.filters.forEach(filter => filter && Texture.setFilterProperties(filter,
//                                 properties.x, properties.y, this.width * properties.scaleX, this.height * properties.scaleY));
//     allFilters.push(...properties.filters);

//     return allFilters.filter(filter => filter && filter.enabled);
// }

// private getFilterArea(destTexture: Texture, properties: BasicTexture._RequiredPropertiesForFilter) {
//     let boundaries = Boundaries.fromRect(this.getLocalBounds$(properties));

//     if (!A.isEmpty(properties.filters)) {
//         for (let filter of properties.filters) {
//             let visualPadding = filter.getVisualPadding();
//             boundaries.left -= visualPadding;
//             boundaries.right += visualPadding;
//             boundaries.top -= visualPadding;
//             boundaries.bottom += visualPadding;
//         }
//     }

//     if (!boundaries.isFinite()) {
//         return new PIXI.Rectangle(0, 0, destTexture.width, destTexture.height);
//     }

//     return new PIXI.Rectangle(
//         M.clamp(boundaries.left, 0, destTexture.width),
//         M.clamp(boundaries.top, 0, destTexture.height),
//         boundaries.left < 0 ? boundaries.right : M.clamp(boundaries.width, 0, destTexture.width - boundaries.left),
//         boundaries.top < 0 ? boundaries.bottom : M.clamp(boundaries.height, 0, destTexture.height - boundaries.top),
//     );
// }
