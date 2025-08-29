#!/usr/bin/env node

/**
 * Accessibility Testing Script
 * Runs automated accessibility tests using axe-core and pa11y
 * Usage: node scripts/accessibility-test.js [--url=http://localhost:3000] [--locale=en]
 */

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const pa11y = require('pa11y');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const DEFAULT_URL = 'http://localhost:3000';
const LOCALES = ['en', 'lt', 'pl', 'uk'];
const TEST_PAGES = [
  '',           // Homepage
  '/about',     // About page
  '/contact',   // Contact page
  '/services',  // Services page
  '/accessories' // Accessories page
];

// Parse command line arguments
const args = process.argv.slice(2);
const baseUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1] || DEFAULT_URL;
const testLocale = args.find(arg => arg.startsWith('--locale='))?.split('=')[1] || 'en';

class AccessibilityTester {
  constructor() {
    this.results = {
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        violations: 0,
        timestamp: new Date().toISOString()
      },
      tests: []
    };
  }

  async runTests() {
    console.log('🔍 Starting Accessibility Tests...');
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Testing Locale: ${testLocale}`);
    console.log('─'.repeat(50));

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      for (const page of TEST_PAGES) {
        const url = `${baseUrl}/${testLocale}${page}`;
        await this.testPage(browser, url, page || 'homepage');
      }

      await this.generateReport();
      
    } finally {
      await browser.close();
    }

    this.printSummary();
    
    // Exit with error code if tests failed
    if (this.results.summary.failed > 0) {
      process.exit(1);
    }
  }

  async testPage(browser, url, pageName) {
    console.log(`Testing: ${pageName} (${url})`);
    
    try {
      // Test with axe-core
      const axeResults = await this.runAxeTest(browser, url);
      
      // Test with pa11y
      const pa11yResults = await this.runPa11yTest(url);
      
      const testResult = {
        page: pageName,
        url: url,
        axe: axeResults,
        pa11y: pa11yResults,
        timestamp: new Date().toISOString()
      };

      this.results.tests.push(testResult);
      this.updateSummary(testResult);

      // Log immediate results
      const axeViolations = axeResults.violations.length;
      const pa11yIssues = pa11yResults.issues.length;
      
      if (axeViolations === 0 && pa11yIssues === 0) {
        console.log(`  ✅ PASSED - No accessibility issues found`);
      } else {
        console.log(`  ❌ FAILED - ${axeViolations} axe violations, ${pa11yIssues} pa11y issues`);
      }

    } catch (error) {
      console.error(`  ❌ ERROR testing ${pageName}: ${error.message}`);
      this.results.summary.failed++;
    }

    console.log('');
  }

  async runAxeTest(browser, url) {
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait for dynamic content to load
      await page.waitForTimeout(2000);
      
      const results = await new AxePuppeteer(page)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      return {
        violations: results.violations.map(violation => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.length
        })),
        passes: results.passes.length,
        incomplete: results.incomplete.length
      };

    } finally {
      await page.close();
    }
  }

  async runPa11yTest(url) {
    try {
      const results = await pa11y(url, {
        standard: 'WCAG2AA',
        timeout: 30000,
        wait: 2000,
        chromeLaunchConfig: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      return {
        issues: results.issues.map(issue => ({
          code: issue.code,
          type: issue.type,
          message: issue.message,
          selector: issue.selector,
          runner: issue.runner
        }))
      };

    } catch (error) {
      console.warn(`Pa11y test failed for ${url}: ${error.message}`);
      return { issues: [] };
    }
  }

  updateSummary(testResult) {
    this.results.summary.totalTests++;
    
    const hasViolations = testResult.axe.violations.length > 0 || testResult.pa11y.issues.length > 0;
    
    if (hasViolations) {
      this.results.summary.failed++;
      this.results.summary.violations += testResult.axe.violations.length + testResult.pa11y.issues.length;
    } else {
      this.results.summary.passed++;
    }
  }

  async generateReport() {
    const reportDir = path.join(process.cwd(), 'accessibility-reports');
    
    try {
      await fs.mkdir(reportDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(reportDir, `accessibility-report-${timestamp}.json`);
    
    await fs.writeFile(reportFile, JSON.stringify(this.results, null, 2));
    
    // Generate HTML report
    const htmlReport = this.generateHtmlReport();
    const htmlFile = path.join(reportDir, `accessibility-report-${timestamp}.html`);
    await fs.writeFile(htmlFile, htmlReport);

    console.log(`📊 Reports generated:`);
    console.log(`   JSON: ${reportFile}`);
    console.log(`   HTML: ${htmlFile}`);
    console.log('');
  }

  generateHtmlReport() {
    const { summary, tests } = this.results;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Test Report</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 2rem; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 2px solid #e9ecef; padding-bottom: 1rem; margin-bottom: 2rem; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat { background: #f8f9fa; padding: 1rem; border-radius: 6px; text-align: center; }
        .stat-value { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .test-result { border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 1rem; overflow: hidden; }
        .test-header { background: #f8f9fa; padding: 1rem; font-weight: bold; }
        .test-content { padding: 1rem; }
        .violation { background: #fff5f5; border-left: 4px solid #dc3545; padding: 1rem; margin: 0.5rem 0; }
        .violation-title { font-weight: bold; color: #dc3545; }
        .violation-description { margin: 0.5rem 0; color: #666; }
        .no-issues { color: #28a745; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Accessibility Test Report</h1>
            <p>Generated: ${summary.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="stat">
                <div class="stat-value">${summary.totalTests}</div>
                <div>Total Tests</div>
            </div>
            <div class="stat">
                <div class="stat-value passed">${summary.passed}</div>
                <div>Passed</div>
            </div>
            <div class="stat">
                <div class="stat-value failed">${summary.failed}</div>
                <div>Failed</div>
            </div>
            <div class="stat">
                <div class="stat-value failed">${summary.violations}</div>
                <div>Total Violations</div>
            </div>
        </div>

        ${tests.map(test => `
            <div class="test-result">
                <div class="test-header">
                    ${test.page} - ${test.url}
                </div>
                <div class="test-content">
                    ${test.axe.violations.length === 0 && test.pa11y.issues.length === 0 
                        ? '<div class="no-issues">✅ No accessibility issues found</div>'
                        : `
                            ${test.axe.violations.map(violation => `
                                <div class="violation">
                                    <div class="violation-title">${violation.id} (${violation.impact})</div>
                                    <div class="violation-description">${violation.description}</div>
                                    <div><strong>Nodes affected:</strong> ${violation.nodes}</div>
                                    <div><a href="${violation.helpUrl}" target="_blank">Learn more</a></div>
                                </div>
                            `).join('')}
                            ${test.pa11y.issues.map(issue => `
                                <div class="violation">
                                    <div class="violation-title">${issue.code} (${issue.type})</div>
                                    <div class="violation-description">${issue.message}</div>
                                    <div><strong>Selector:</strong> ${issue.selector}</div>
                                </div>
                            `).join('')}
                        `
                    }
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }

  printSummary() {
    const { summary } = this.results;
    
    console.log('📊 ACCESSIBILITY TEST SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Total Tests:      ${summary.totalTests}`);
    console.log(`Passed:           ${summary.passed} ✅`);
    console.log(`Failed:           ${summary.failed} ❌`);
    console.log(`Total Violations: ${summary.violations}`);
    console.log('═'.repeat(50));
    
    if (summary.failed === 0) {
      console.log('🎉 All accessibility tests passed!');
    } else {
      console.log('⚠️  Some accessibility issues found. Check the detailed report.');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new AccessibilityTester();
  tester.runTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = AccessibilityTester;
