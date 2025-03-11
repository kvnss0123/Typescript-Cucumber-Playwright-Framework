export class PolicyNumberGenerator {
    private static prefixes = {
      businessowners: 'BOP',
      commercialAuto: 'CA'
    };

    static generate(businessLine: 'businessowners' | 'commercialAuto') {
      const prefix = this.prefixes[businessLine];
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

      return `${prefix}-${timestamp}-${random}`;
    }
  }
