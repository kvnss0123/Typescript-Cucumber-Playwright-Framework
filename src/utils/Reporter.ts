// File: src/utils/Reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

class CustomReporter implements Reporter {
  private results: Array<{
    title: string;
    status: string;
    duration: number;
    error?: string;
  }> = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message
    });
  }

  async onEnd() {
    const reportDir = path.resolve(process.cwd(), 'test-results');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, 'custom-report.json');
    await fs.promises.writeFile(
      reportPath,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        results: this.results,
        summary: {
          total: this.results.length,
          passed: this.results.filter(r => r.status === 'passed').length,
          failed: this.results.filter(r => r.status === 'failed').length,
          skipped: this.results.filter(r => r.status === 'skipped').length,
        }
      }, null, 2)
    );

    console.log(`Custom report written to ${reportPath}`);
  }
}

export default CustomReporter;
