import { Injectable } from '@angular/core';
import * as nsfwjs from 'nsfwjs';

@Injectable({
  providedIn: 'root'
})
export class NsfwService {
  async checkNsfw(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = async () => {
          const model = await nsfwjs.load('InceptionV3');
          const predictions = await model.classify(image);
          const nsfwResult = predictions.find(
            (p) => p.className === 'Porn' || p.className === 'Hentai'
          );
          resolve(!(nsfwResult && nsfwResult.probability > 0.3));
        };
      };
      reader.readAsDataURL(file);
    });
  }
}
