import { Injectable } from '@angular/core';
import * as toxicity from '@tensorflow-models/toxicity';

@Injectable({
  providedIn: 'root',
})
export class ToxicityService {
  model: toxicity.ToxicityClassifier | null = null;
  THRESHOLD = 0.9;

  async checkToxicText(text: string): Promise<boolean> {
    if (!this.model) {
      this.model = await toxicity.load(this.THRESHOLD, []);
    }

    const predictions = await this.model.classify([text]);

    return predictions.some(
      (predictions) => predictions.results[0].match === true
    );
  }
}
